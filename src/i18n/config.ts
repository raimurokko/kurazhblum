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
 * Baut einen internen Pfad für eine Sprache.
 * path("de", "shop") -> "/de/shop/"
 */
export function path(locale: Locale, ...segments: (string | number)[]): string {
  const parts = segments.flatMap((s) => String(s).split('/')).filter(Boolean);
  return `/${[locale, ...parts].join('/')}/`;
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
