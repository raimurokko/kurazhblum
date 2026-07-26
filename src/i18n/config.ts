export const LOCALES = ['de', 'uk', 'en', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'de';

/** Anzeigename im Sprachumschalter — immer in der eigenen Sprache. */
export const LOCALE_LABELS: Record<Locale, string> = {
  de: 'Deutsch',
  uk: 'Українська',
  en: 'English',
  ru: 'Русский',
};

export const LOCALE_SHORT: Record<Locale, string> = {
  de: 'DE',
  uk: 'UA',
  en: 'EN',
  ru: 'RU',
};

/** BCP-47 für <html lang> und hreflang. */
export const LOCALE_TAGS: Record<Locale, string> = {
  de: 'de-DE',
  uk: 'uk-UA',
  en: 'en',
  ru: 'ru',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/**
 * Basispfad der Installation — "/" lokal, "/kurazhblum/" auf GitHub Pages.
 *
 * Astro reicht `base` aus astro.config.mjs unverändert durch: steht dort
 * "/kurazhblum" ohne Schrägstrich am Ende, fehlt er auch hier — und aus
 * BASE + "brand/logo.png" wird "/kurazhblumbrand/logo.png". Deshalb wird
 * er an dieser einen Stelle erzwungen.
 */
const BASE = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

/**
 * Baut einen internen Pfad für eine Sprache, inklusive Basispfad.
 * path("de", "shop") -> "/de/shop/"  bzw.  "/kurazhblum/de/shop/"
 *
 * Interne Links immer hierüber bauen, nie als Zeichenkette schreiben —
 * sonst brechen sie, sobald die Website in einem Unterverzeichnis liegt.
 */
export function path(locale: Locale, ...segments: (string | number)[]): string {
  const parts = segments.flatMap((s) => String(s).split('/')).filter(Boolean);
  return `${BASE}${[locale, ...parts].join('/')}/`.replace(/\/{2,}/g, '/');
}

/**
 * Verweis auf eine Datei aus `public/`, inklusive Basispfad.
 * asset("/brand/wordmark.png") -> "/brand/wordmark.png"
 *                              bzw. "/kurazhblum/brand/wordmark.png"
 */
export function asset(file: string): string {
  return `${BASE}${file.replace(/^\/+/, '')}`.replace(/\/{2,}/g, '/');
}

/** Alle Sprachen als getStaticPaths-Einträge. */
export function localePaths() {
  return LOCALES.map((lang) => ({ params: { lang } }));
}

/** Text-Feld, das in allen vier Sprachen vorliegt. */
export type I18nText = Record<Locale, string>;

/** Liest ein I18nText-Feld mit Rückfall auf Deutsch. */
export function t(field: I18nText | undefined, locale: Locale): string {
  if (!field) return '';
  return field[locale] || field[DEFAULT_LOCALE] || '';
}
