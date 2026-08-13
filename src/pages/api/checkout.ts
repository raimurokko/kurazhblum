import type { APIRoute } from 'astro';
import Stripe from 'stripe';

import { DEFAULT_LOCALE, asset, isLocale, t, type Locale } from '../../i18n/config';
import {
  DELIVERY_ZONES,
  EXTRAS,
  MIN_ORDER_DELIVERY,
  bouquetBySlug,
  isOrderable,
  presentationsFor,
  priceFor,
  sizesOf,
  surchargeFor,
  type PresentationKey,
  type SizeKey,
} from '../../data/shop';
import { DELIVERY_SLOTS, SUNDAY_LAST_START, site } from '../../data/site';
import { istBerlinerPlz } from '../../data/berlin-plz';
import { WORKSHOP_DATES, formatBySlug } from '../../data/workshops';

// Zahlungen brauchen einen Server — diese Route wird nicht vorgerendert.
export const prerender = false;

const CARD_MESSAGE_MAX = 240;

/** Beschriftung des Aufschlags auf der Stripe-Rechnung. */
const FRUEH_LABEL = {
  de: 'Lieferung am Vormittag',
  uk: 'Доставка вранці',
  en: 'Morning delivery',
  ru: 'Доставка утром',
};

/** Steuerzeichen raus — die Adresse landet in Stripe-Metadaten. */
function clean(value: unknown, max: number): string {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .trim()
    .slice(0, max);
}

/** Stripe erwartet eigene Sprachcodes; unsere vier lassen sich direkt abbilden. */
const STRIPE_LOCALE: Record<Locale, Stripe.Checkout.SessionCreateParams.Locale> = {
  de: 'de',
  uk: 'en', // Stripe Checkout kennt kein Ukrainisch — Englisch ist die nächstbeste Wahl
  en: 'en',
  ru: 'ru',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getStripe(): Stripe | null {
  const key = import.meta.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export const POST: APIRoute = async ({ request, url }) => {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const lang: Locale = isLocale(payload.lang) ? payload.lang : DEFAULT_LOCALE;
  const origin = url.origin;
  const successUrl = `${origin}${asset(`/${lang}/bestellung/danke/`)}?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}${asset(`/${lang}/bestellung/abbruch/`)}`;

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const metadata: Record<string, string> = { lang };

  /* ——— Workshop-Platz ——————————————————————————————————————————— */
  if (payload.kind === 'workshop') {
    const date = WORKSHOP_DATES.find((entry) => entry.id === payload.dateId);
    if (!date) return json({ error: 'unknown_date' }, 400);
    if (date.seatsLeft <= 0) return json({ error: 'sold_out' }, 409);

    const format = formatBySlug(date.formatSlug);
    if (!format?.price) return json({ error: 'not_bookable' }, 400);

    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'eur',
        unit_amount: format.price,
        product_data: {
          name: `${t(format.name, lang)} — ${new Date(date.start).toLocaleDateString('de-DE')}`,
          description: t(format.description, lang).slice(0, 300),
        },
      },
    });

    metadata.kind = 'workshop';
    metadata.dateId = date.id;
    metadata.format = format.slug;
  } else {
    /* ——— Strauß aus dem Konfigurator ————————————————————————————— */
    const bouquet = bouquetBySlug(String(payload.slug ?? ''));
    if (!bouquet) return json({ error: 'unknown_product' }, 400);

    // Saisonbeispiele haben keinen Preis — sie dürfen gar nicht erst in die
    // Kasse gelangen, auch nicht über einen nachgebauten Aufruf.
    if (!isOrderable(bouquet)) return json({ error: 'price_on_request' }, 422);

    // Festpreis-Produkte haben keine Größe; bei Staffelprodukten nur die
    // Größen zulassen, die dieser Strauß tatsächlich anbietet.
    const verfuegbar = sizesOf(bouquet);
    const size: SizeKey | undefined = verfuegbar.includes(payload.size as SizeKey)
      ? (payload.size as SizeKey)
      : verfuegbar[0];

    // Der Aufpreis hängt an der Größe, und nicht jede Form gibt es in jeder
    // Größe — eine Vase zum XL-Strauß etwa nicht. Deshalb erst die für diese
    // Größe erlaubten Formen bilden und nur daraus wählen; sonst ließe sich
    // über einen nachgebauten Aufruf etwas bestellen, was es nicht gibt.
    const erlaubteFormen = presentationsFor(bouquet, size ?? 'fixed');
    const presentation = erlaubteFormen.includes(payload.presentation as PresentationKey)
      ? (payload.presentation as PresentationKey)
      : erlaubteFormen[0];
    if (!presentation) return json({ error: 'no_presentation' }, 400);

    const zone = DELIVERY_ZONES.find((entry) => entry.id === payload.zone);
    if (!zone) return json({ error: 'unknown_zone' }, 400);

    // Das Lieferfenster kostet vor 14 Uhr extra. Auch das wird hier noch
    // einmal aufgelöst — im Browser ließe sich der Aufschlag sonst wegnehmen.
    const slot = DELIVERY_SLOTS.find((entry) => entry.id === String(payload.slot ?? ''));
    if (!slot) return json({ error: 'unknown_slot' }, 400);

    // Sonntags schließt das Atelier um 16 Uhr; ein spätes Fenster an diesem
    // Tag ist keine Lieferung, die jemand fährt.
    const datum = String(payload.date ?? '');
    if (/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
      const [jahr, monat, tag] = datum.split('-').map(Number);
      const istSonntag = new Date(jahr, monat - 1, tag).getDay() === 0;
      if (istSonntag && slot.from > SUNDAY_LAST_START) {
        return json({ error: 'slot_closed' }, 422);
      }
    }

    const extraIds = Array.isArray(payload.extras) ? payload.extras.map(String) : [];
    const extras = EXTRAS.filter((extra) => extraIds.includes(extra.id));

    // Der Browser rechnet nur für die Anzeige. Verbindlich ist ausschließlich
    // diese Berechnung — sonst könnte man den Preis im Formular manipulieren.
    const base = priceFor(bouquet, size);
    const surcharge = surchargeFor(presentation, size ?? 'fixed') ?? 0;
    const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
    const subtotal = base + surcharge + extrasTotal;

    // Auch bei Abholung: Die frühere Ausnahme wurde nirgends mehr angezeigt.
    if (subtotal < MIN_ORDER_DELIVERY) {
      return json({ error: 'below_minimum', minimum: MIN_ORDER_DELIVERY }, 422);
    }

    const presentationLabel = presentation === 'bouquet' ? '' : ` — ${presentation}`;
    const sizeLabel = size ? ` (${size.toUpperCase()})` : '';
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'eur',
        unit_amount: subtotal - extrasTotal,
        product_data: {
          name: `${t(bouquet.name, lang)}${sizeLabel}${presentationLabel}`,
          description: t(bouquet.blurb, lang).slice(0, 300),
        },
      },
    });

    for (const extra of extras) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: extra.price,
          product_data: { name: t(extra.name, lang) },
        },
      });
    }

    if (zone.fee > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: zone.fee,
          product_data: { name: t(zone.name, lang) },
        },
      });
    }

    if (slot.fee > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: slot.fee,
          product_data: { name: `${t(slot.label, lang)} — ${t(FRUEH_LABEL, lang)}` },
        },
      });
    }

    const cardMessage = String(payload.cardMessage ?? '').slice(0, CARD_MESSAGE_MAX);

    metadata.kind = 'bouquet';
    metadata.product = bouquet.slug;
    metadata.size = size ?? '';
    metadata.presentation = presentation;
    metadata.zone = zone.id;
    metadata.extras = extras.map((extra) => extra.id).join(',');
    metadata.date = datum;
    metadata.slot = slot.id;
    // Die Adresse muss in Berlin liegen. Gala liefert nur dort; alles
    // darüber hinaus läuft nach Absprache und darf nicht durch die Kasse
    // laufen, wo ein fester Betrag berechnet wird.
    const plz = clean(payload.zip, 10);
    if (zone.id !== 'pickup' && !istBerlinerPlz(plz)) {
      return json({ error: 'zip_outside_berlin' }, 422);
    }

    // Die Lieferadresse steht jetzt im Formular und nicht mehr nur bei
    // Stripe — sonst ließe sich Zone „Lichtenberg“ wählen und an der Kasse
    // eine Adresse in Spandau eintragen.
    metadata.address = [
      `${clean(payload.street, 120)} ${clean(payload.houseNumber, 20)}`.trim(),
      `${plz} ${site.address.city}`.trim(),
      clean(payload.addressNote, 120),
    ]
      .filter(Boolean)
      .join(', ');
    metadata.cardMessage = cardMessage;
    // Nicht alle brauchen eine Rechnung — wer sie ankreuzt, bekommt sie an die
    // E-Mail-Adresse, die Stripe an der Kasse ohnehin erhebt.
    metadata.invoice = payload.invoice === true ? 'ja' : 'nein';
    // Foto vor der Lieferung — nur auf Wunsch, Gala fotografiert nicht jeden Strauß.
    metadata.photo = payload.photo === true ? 'ja' : 'nein';
  }

  // Erst prüfen, dann bezahlen: die Validierung oben läuft auch ohne
  // Stripe-Zugang, damit sich die Bestelllogik lokal testen lässt.
  const stripe = getStripe();
  if (!stripe) {
    console.warn('STRIPE_SECRET_KEY fehlt — Checkout ist deaktiviert.');
    return json({ error: 'checkout_unavailable' }, 503);
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      locale: STRIPE_LOCALE[lang],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      // Adresse fürs Lieferziel — bei Workshops nicht nötig.
      // Keine zweite Adressabfrage: Sie steht bereits im Konfigurator und
      // liegt in den Metadaten. Zweimal tippen zu lassen wäre der sicherste
      // Weg, zwei verschiedene Adressen zu bekommen.
      phone_number_collection: { enabled: true },
    });

    return json({ url: session.url });
  } catch (error) {
    console.error('Stripe-Session konnte nicht erstellt werden:', error);
    return json({ error: 'stripe_error' }, 502);
  }
};
