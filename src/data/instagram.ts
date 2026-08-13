import type { I18nText } from '../i18n/config';

/**
 * Instagram-Feed.
 *
 * Instagram-Bilder lassen sich nicht direkt einbinden: das CDN blockt fremde
 * Domains und die Links laufen nach kurzer Zeit ab. Deshalb liegen die Bilder
 * lokal unter `public/images/instagram/` und werden hier nur verlinkt.
 *
 * Ablauf zum Pflegen (siehe auch README):
 *   1. Bild/Reel-Cover aus dem Beitrag exportieren, auf 1080 px kürzeste Kante
 *      skalieren und als .jpg in public/images/instagram/ ablegen
 *   2. Hier einen Eintrag ergänzen — `permalink` ist die URL des Beitrags
 *
 * Wenn der Betrieb wächst, lässt sich das durch die Instagram Basic Display API
 * automatisieren; für ein paar Beiträge im Monat ist Handarbeit günstiger.
 */
export interface InstagramPost {
  id: string;
  permalink: string;
  /**
   * Fehlt das Bild, zeigt die Kachel „Bild folgt“ statt einen Verweis ins
   * Leere abzusetzen. Die sechs Beiträge sind bislang Beispiele — die echte
   * Auswahl exportiert Gala aus Instagram.
   */
  image?: string;
  alt: I18nText;
  isReel?: boolean;
}

export const INSTAGRAM_POSTS: InstagramPost[] = [
  /*
    Sechs Aufnahmen aus Galas Laufwerk, keine abgerufenen Beiträge: Das
    Instagram-CDN blockt fremde Domains, und selbst wenn nicht, wäre jeder
    Aufruf eine Verbindung zu Meta. Die Kacheln zeigen deshalb Arbeiten aus dem
    Atelier und verlinken auf das Profil, nicht auf einzelne Beiträge.

    ⚠️ TODO: Sobald Gala eine eigene Auswahl exportiert, diese hier ersetzen und
    `permalink` auf die echten Beiträge zeigen lassen.
  */
  {
    id: 'ig-1',
    permalink: 'https://www.instagram.com/kurazhblum_berlin/',
    image: '/images/instagram/01.webp',
    alt: {
      de: 'Brautstrauß aus weißen Pfingstrosen, Orchideen und Eukalyptus',
      uk: 'Букет нареченої з білих півоній, орхідей та евкаліпта',
      en: 'Bridal bouquet of white peonies, orchids and eucalyptus',
      ru: 'Букет невесты из белых пионов, орхидей и эвкалипта',
    },
  },
  {
    id: 'ig-2',
    permalink: 'https://www.instagram.com/kurazhblum_berlin/',
    image: '/images/instagram/02.webp',
    alt: {
      de: 'Pastellfarbenes Tischgesteck für eine Feier im Saal',
      uk: 'Пастельна композиція на стіл для святкування в залі',
      en: 'Pastel table arrangement for a celebration in a hall',
      ru: 'Пастельная композиция на стол для торжества в зале',
    },
  },
  {
    id: 'ig-3',
    permalink: 'https://www.instagram.com/kurazhblum_berlin/',
    image: '/images/instagram/03.webp',
    alt: {
      de: 'Blumenbogen mit hellem Chiffon vor blauem Himmel',
      uk: 'Квіткова арка зі світлим шифоном на тлі блакитного неба',
      en: 'Floral arch with light chiffon against a blue sky',
      ru: 'Цветочная арка со светлым шифоном на фоне голубого неба',
    },
  },
  {
    id: 'ig-4',
    permalink: 'https://www.instagram.com/kurazhblum_berlin/',
    image: '/images/instagram/04.webp',
    alt: {
      de: 'Ansteckblumen entstehen auf dem Werktisch',
      uk: 'Бутоньєрки народжуються на робочому столі',
      en: 'Buttonholes taking shape on the workbench',
      ru: 'Бутоньерки рождаются на рабочем столе',
    },
  },
  {
    id: 'ig-5',
    permalink: 'https://www.instagram.com/kurazhblum_berlin/',
    image: '/images/instagram/05.webp',
    alt: {
      de: 'Rosen und Nelken in einer weißen Hutschachtel',
      uk: 'Троянди та гвоздики у білій капелюшній коробці',
      en: 'Roses and carnations in a white hat box',
      ru: 'Розы и гвоздики в белой шляпной коробке',
    },
  },
  {
    id: 'ig-6',
    permalink: 'https://www.instagram.com/kurazhblum_berlin/',
    image: '/images/instagram/06.webp',
    alt: {
      de: 'Weiße Pfingstrosen, fast pur gebunden',
      uk: 'Білі півонії, зібрані майже чисто',
      en: 'White peonies, tied almost pure',
      ru: 'Белые пионы, собранные почти чисто',
    },
  },
];
