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

/**
 * Aufschlag für Lieferung vor 14 Uhr, in Cent.
 *
 * Gala kauft morgens am Großmarkt ein und bindet danach. Eine Lieferung am
 * Vormittag heißt: einkaufen, binden und ausfahren in derselben knappen
 * Spanne — eine Extrafahrt außerhalb der geplanten Route. Deshalb der
 * Aufschlag, und deshalb nur der Vormittag.
 */
export const EARLY_DELIVERY_SURCHARGE = 1500;

/** Ab dieser Stunde ist die Lieferung ohne Aufschlag. */
const REGULAER_AB = 14;

/** Erste und letzte Startstunde eines Fensters — 19 Uhr endet um 20 Uhr. */
const ERSTE_STUNDE = 10;
const LETZTE_STUNDE = 19;

/**
 * Lieferfenster im Stundentakt. Eine Stunde ist die Zusage, die sich halten
 * lässt; halbe Stunden wären genauer angeschrieben und ungenauer gefahren.
 *
 * Sonntags schließt das Atelier um 16 Uhr. Fenster, die später beginnen,
 * blendet der Konfigurator an diesem Tag aus — sie zu verkaufen hieße, eine
 * Fahrt zuzusagen, die niemand macht.
 */
export const DELIVERY_SLOTS: { id: string; from: number; fee: number; label: I18nText }[] =
  Array.from({ length: LETZTE_STUNDE - ERSTE_STUNDE + 1 }, (_, i) => ERSTE_STUNDE + i).map(
    (stunde) => ({
      id: String(stunde),
      from: stunde,
      fee: stunde < REGULAER_AB ? EARLY_DELIVERY_SURCHARGE : 0,
      label: {
        de: `${stunde} – ${stunde + 1} Uhr`,
        uk: `${stunde} – ${stunde + 1} год`,
        en: `${stunde}:00 – ${stunde + 1}:00`,
        ru: `${stunde} – ${stunde + 1} ч`,
      },
    }),
  );

/** Sonntags ist um 16 Uhr Schluss — danach beginnt kein Fenster mehr. */
export const SUNDAY_LAST_START = 15;
