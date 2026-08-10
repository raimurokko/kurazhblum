import type { I18nText } from '../i18n/config';

/**
 * Stammdaten des Betriebs.
 *
 * ⚠️ Alles mit TODO muss vor dem Livegang durch echte Angaben ersetzt werden —
 * Impressum und Datenschutzerklärung sind in Deutschland Pflicht und
 * abmahnfähig, wenn sie fehlen oder falsch sind.
 */
export const site = {
  name: 'KURAZHBLUM',
  nameFull: 'KURAZHBLUM Berlin',
  domain: 'kurazhblum.de', // TODO: echte Domain
  instagram: 'kurazhblum_berlin',
  instagramUrl: 'https://www.instagram.com/kurazhblum_berlin/',

  email: 'hallo@kurazhblum.de', // TODO
  phone: '+49 000 0000000', // TODO
  phoneHref: '+490000000000', // TODO

  /**
   * WhatsApp-Nummer im internationalen Format ohne Plus und ohne Leerzeichen,
   * z. B. '4915112345678'. Leer lassen, wenn kein WhatsApp genutzt wird —
   * dann verschwindet die Schaltfläche überall von selbst.
   */
  whatsapp: '490000000000', // TODO

  address: {
    street: 'Straße Hausnummer', // TODO
    zip: '10999', // TODO
    city: 'Berlin',
    country: 'DE',
  },

  /** Für Impressum §5 TMG. */
  legal: {
    owner: 'Galyna N.', // TODO: vollständiger Name der Inhaberin
    vatId: '', // TODO: USt-IdNr. oder Hinweis auf Kleinunternehmerregelung §19 UStG
    register: '', // TODO: falls eingetragen
  },

  /** Öffnungszeiten — Atelierbesuch nach Vereinbarung. */
  hours: [
    { days: { de: 'Mo – Fr', uk: 'Пн – Пт', en: 'Mon – Fri', ru: 'Пн – Пт' }, time: '10:00 – 19:00' },
    { days: { de: 'Samstag', uk: 'Субота', en: 'Saturday', ru: 'Суббота' }, time: '10:00 – 16:00' },
    {
      days: { de: 'Sonntag', uk: 'Неділя', en: 'Sunday', ru: 'Воскресенье' },
      time: '', // leer = geschlossen
    },
  ] satisfies { days: I18nText; time: string }[],

  closedLabel: {
    de: 'geschlossen',
    uk: 'зачинено',
    en: 'closed',
    ru: 'закрыто',
  } satisfies I18nText,

  /** Bestellschluss für Lieferung am selben Tag. */
  sameDayCutoff: '14:00',
} as const;

/** Zeitfenster für die Lieferung. */
export const DELIVERY_SLOTS: { id: string; label: I18nText }[] = [
  {
    id: 'morning',
    label: { de: '10 – 13 Uhr', uk: '10 – 13 год', en: '10 am – 1 pm', ru: '10 – 13 ч' },
  },
  {
    id: 'afternoon',
    label: { de: '13 – 17 Uhr', uk: '13 – 17 год', en: '1 – 5 pm', ru: '13 – 17 ч' },
  },
  {
    id: 'evening',
    label: { de: '17 – 20 Uhr', uk: '17 – 20 год', en: '5 – 8 pm', ru: '17 – 20 ч' },
  },
];
