import type { APIRoute } from 'astro';

import { DEFAULT_LOCALE, LOCALES, asset, path, t } from '../i18n/config';
import { BOUQUETS, CATEGORIES, DELIVERY_ZONES, MIN_ORDER_DELIVERY, formatPrice, lowestPrice } from '../data/shop';
import { WORKSHOP_FORMATS } from '../data/workshops';
import { site } from '../data/site';

/**
 * llms.txt nach der Konvention von llmstxt.org — eine kurze, maschinenlesbare
 * Zusammenfassung für Sprachmodelle und KI-Assistenten.
 *
 * Wird beim Build aus denselben Daten erzeugt wie die Website. Wer ein Produkt
 * ergänzt, muss hier nichts nachziehen.
 */
export const GET: APIRoute = ({ site: astroSite }) => {
  const origin = astroSite?.origin ?? `https://${site.domain}`;
  const url = (...segments: string[]) => `${origin}${path(DEFAULT_LOCALE, ...segments)}`;

  const lines: string[] = [];

  lines.push(`# ${site.nameFull}`);
  lines.push('');
  lines.push(
    '> Floristik-Atelier in Berlin. Handgebundene Sträuße mit Lieferung in Berlin und Umland, ' +
      'Hochzeits- und Eventfloristik, Blumen-Workshops im Atelier und vor Ort. ' +
      'Geführt von einer ukrainischen Floristin; Beratung auf Deutsch, Ukrainisch, Englisch und Russisch.',
  );
  lines.push('');
  lines.push(
    'Hinweis für Agenten: Diese Website setzt keine Cookies, lädt nichts von Drittservern und trackt nicht. ' +
      `Bestellungen laufen über einen Konfigurator (Größe, Präsentation, Grußkarte, Liefergebiet, Wunschtermin); ` +
      `Hochzeiten und Events werden ausschließlich über ein Anfrageformular abgewickelt, weil ein Festpreis dort nicht seriös wäre.`,
  );
  lines.push('');

  lines.push('## Eckdaten');
  lines.push('');
  lines.push(`- Standort: ${site.address.city}, Deutschland`);
  lines.push(`- Liefergebiet: ${DELIVERY_ZONES.filter((z) => z.id !== 'pickup').map((z) => t(z.name, DEFAULT_LOCALE)).join('; ')}`);
  lines.push(`- Mindestbestellwert für Lieferung: ${formatPrice(MIN_ORDER_DELIVERY, DEFAULT_LOCALE)} (Abholung ohne Mindestwert)`);
  lines.push(`- Lieferung am selben Tag bei Bestellung bis ${site.sameDayCutoff} Uhr, telefonisch`);
  lines.push(`- Sprachen der Website: ${LOCALES.join(', ')}`);
  lines.push(`- Instagram: ${site.instagramUrl}`);
  lines.push('');

  lines.push('## Sträuße');
  lines.push('');
  for (const bouquet of BOUQUETS) {
    const category = CATEGORIES.find((c) => c.slug === bouquet.category);
    lines.push(
      `- [${t(bouquet.name, DEFAULT_LOCALE)}](${url('shop', bouquet.slug)}): ` +
        `${t(bouquet.blurb, DEFAULT_LOCALE)} ` +
        `Kategorie ${t(category?.name ?? { de: '', uk: '', en: '', ru: '' }, DEFAULT_LOCALE)}, ` +
        `ab ${formatPrice(lowestPrice(bouquet), DEFAULT_LOCALE)} in den Größen S/M/L.`,
    );
  }
  lines.push('');

  lines.push('## Kategorien');
  lines.push('');
  for (const category of CATEGORIES) {
    lines.push(
      `- [${t(category.name, DEFAULT_LOCALE)}](${url('shop/kategorie', category.slug)}): ${t(category.blurb, DEFAULT_LOCALE)}`,
    );
  }
  lines.push('');

  lines.push('## Workshops');
  lines.push('');
  for (const format of WORKSHOP_FORMATS) {
    const price = format.price ? `${formatPrice(format.price, DEFAULT_LOCALE)} pro Person` : 'nur auf Anfrage';
    lines.push(`- ${t(format.name, DEFAULT_LOCALE)} (${price}): ${t(format.blurb, DEFAULT_LOCALE)}`);
  }
  lines.push(`- Termine und Buchung: ${url('workshops')}`);
  lines.push('');

  lines.push('## Seiten');
  lines.push('');
  lines.push(`- [Startseite](${url()})`);
  lines.push(`- [Alle Blumen](${url('shop')})`);
  lines.push(`- [Hochzeiten & Events](${url('hochzeiten')}) — Anfrage, kein Warenkorb`);
  lines.push(`- [Workshops](${url('workshops')})`);
  lines.push(`- [Über das Atelier](${url('atelier')})`);
  lines.push(`- [Kontakt](${url('kontakt')})`);
  lines.push(`- [Lieferung & Zahlung](${url('lieferung')})`);
  lines.push(`- [Erklärung zur Barrierefreiheit](${url('barrierefreiheit')})`);
  lines.push(`- Sprachversionen: ${LOCALES.map((l) => asset(`/${l}/`)).join(' ')}`);
  lines.push(`- [Sitemap](${origin}${asset('/sitemap-index.xml')})`);
  lines.push('');

  lines.push('## Kontakt');
  lines.push('');
  lines.push(`- Anfragen: ${site.email}`);
  lines.push(`- Telefon: ${site.phone}`);
  lines.push(`- Sicherheitsmeldungen: ${origin}${asset('/.well-known/security.txt')}`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
