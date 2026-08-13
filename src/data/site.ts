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
  /**
   * Direktnachricht statt Profil. `ig.me/m/…` öffnet den Chat mit diesem
   * Konto — in der App, wenn sie installiert ist, sonst im Browser. Das
   * Profil zu öffnen hieße, noch zwei Klicks bis zum Nachrichtenfeld.
   */
  instagramDirectUrl: 'https://ig.me/m/kurazhblum_berlin',

  email: 'hallo@kurazhblum.de', // TODO: Gala legt noch eine eigene Adresse an

  /*
    Galas aktuelle Nummer. Sie schafft sich demnächst eine eigene Geschäfts-
    nummer an — dann hier, in `phoneHref` und in `whatsapp` gemeinsam ändern.
    Angerufen werden möchte sie nicht: Die Schaltfläche „Anrufen“ ist deshalb
    entfernt, die Nummer steht nur noch als Angabe auf der Kontaktseite und
    im Impressum, wo sie rechtlich hingehört.
  */
  phone: '+49 1515 7803330',
  phoneHref: '+4915157803330',

  /**
   * WhatsApp-Nummer im internationalen Format ohne Plus und ohne Leerzeichen,
   * z. B. '4915112345678'. Leer lassen, wenn kein WhatsApp genutzt wird —
   * dann verschwindet die Schaltfläche überall von selbst.
   */
  whatsapp: '4915157803330',

  /** Atelier in Lichtenberg. */
  address: {
    street: 'Storkower Straße 175',
    zip: '10369',
    city: 'Berlin',
    country: 'DE',
  },

  /** Für Impressum §5 TMG. */
  legal: {
    owner: 'Halyna Zharuk',
    /**
     * Kleinunternehmerin nach § 19 UStG. Das ist keine Formalie fürs
     * Impressum allein: Solange das gilt, darf **nirgends** „inkl. MwSt.“
     * stehen — weder am Preis im Konfigurator noch in den AGB. Ausgewiesene
     * Umsatzsteuer, die nicht abgeführt wird, schuldet man trotzdem (§ 14c
     * UStG), und der falsche Hinweis ist zusätzlich abmahnfähig.
     *
     * Fällt die Regelung später weg, sind drei Stellen zu ändern: dieser
     * Schalter, `cfg.incl_vat` in allen vier Sprachen und der Preisabsatz in
     * den AGB.
     */
    kleinunternehmer: true,
    /** Entfällt, solange § 19 UStG gilt. */
    vatId: '',
    register: '', // TODO: falls ins Handelsregister eingetragen
  },

  /** Öffnungszeiten — Atelierbesuch nach Vereinbarung. */
  hours: [
    { days: { de: 'Mo – Sa', uk: 'Пн – Сб', en: 'Mon – Sat', ru: 'Пн – Сб' }, time: '10:00 – 20:00' },
    {
      days: { de: 'Sonntag', uk: 'Неділя', en: 'Sunday', ru: 'Воскресенье' },
      time: '10:00 – 16:00',
    },
  ] satisfies { days: I18nText; time: string }[],

  closedLabel: {
    de: 'geschlossen',
    uk: 'зачинено',
    en: 'closed',
    ru: 'закрыто',
  } satisfies I18nText,

  /**
   * Zusage für die Lieferung, in Stunden ab Bestelleingang. Der frühere
   * Redaktionsschluss um 14 Uhr ist entfallen: Gala liefert innerhalb von
   * 24 Stunden und will nicht, dass für Eilfälle angerufen wird.
   */
  deliveryWithinHours: 24,
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
