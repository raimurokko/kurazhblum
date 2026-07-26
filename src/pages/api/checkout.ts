import type { APIRoute } from 'astro';
import Stripe from 'stripe';

import { DEFAULT_LOCALE, isLocale, t, type Locale } from '../../i18n/config';
import {
  DELIVERY_ZONES,
  EXTRAS,
  MIN_ORDER_DELIVERY,
  PRESENTATION_SURCHARGE,
  bouquetBySlug,
  type PresentationKey,
  type SizeKey,
} from '../../data/shop';
import { DELIVERY_SLOTS } from '../../data/site';
import { WORKSHOP_DATES, formatBySlug } from '../../data/workshops';

// Zahlungen brauchen einen Server — diese Route wird nicht vorgerendert.
export const prerender = false;

const SIZES: SizeKey[] = ['s', 'm', 'l'];
const CARD_MESSAGE_MAX = 240;

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
  const successUrl = `${origin}/${lang}/bestellung/danke/?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/${lang}/bestellung/abbruch/`;

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const metadata: Record<string, string> = { lang };
  let mode: 'bouquet' | 'workshop' = 'bouquet';

  /* ——— Workshop-Platz ——————————————————————————————————————————— */
  if (payload.kind === 'workshop') {
    mode = 'workshop';
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

    const size = SIZES.includes(payload.size as SizeKey) ? (payload.size as SizeKey) : 'm';

    const presentation = bouquet.presentations.includes(payload.presentation as PresentationKey)
      ? (payload.presentation as PresentationKey)
      : bouquet.presentations[0];

    const zone = DELIVERY_ZONES.find((entry) => entry.id === payload.zone);
    if (!zone) return json({ error: 'unknown_zone' }, 400);

    const extraIds = Array.isArray(payload.extras) ? payload.extras.map(String) : [];
    const extras = EXTRAS.filter((extra) => extraIds.includes(extra.id));

    // Der Browser rechnet nur für die Anzeige. Verbindlich ist ausschließlich
    // diese Berechnung — sonst könnte man den Preis im Formular manipulieren.
    const base = bouquet.prices[size];
    const surcharge = PRESENTATION_SURCHARGE[presentation];
    const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
    const subtotal = base + surcharge + extrasTotal;

    if (zone.id !== 'pickup' && subtotal < MIN_ORDER_DELIVERY) {
      return json({ error: 'below_minimum', minimum: MIN_ORDER_DELIVERY }, 422);
    }

    const presentationLabel = presentation === 'bouquet' ? '' : ` — ${presentation}`;
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'eur',
        unit_amount: subtotal - extrasTotal,
        product_data: {
          name: `${t(bouquet.name, lang)} (${size.toUpperCase()})${presentationLabel}`,
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

    const slot = DELIVERY_SLOTS.find((entry) => entry.id === payload.slot);
    const cardMessage = String(payload.cardMessage ?? '').slice(0, CARD_MESSAGE_MAX);

    metadata.kind = 'bouquet';
    metadata.product = bouquet.slug;
    metadata.size = size;
    metadata.presentation = presentation;
    metadata.zone = zone.id;
    metadata.extras = extras.map((extra) => extra.id).join(',');
    metadata.date = String(payload.date ?? '');
    metadata.slot = slot?.id ?? '';
    metadata.cardMessage = cardMessage;
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
      ...(mode === 'bouquet'
        ? { shipping_address_collection: { allowed_countries: ['DE'] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] } }
        : {}),
      phone_number_collection: { enabled: true },
    });

    return json({ url: session.url });
  } catch (error) {
    console.error('Stripe-Session konnte nicht erstellt werden:', error);
    return json({ error: 'stripe_error' }, 502);
  }
};
