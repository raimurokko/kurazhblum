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
  {
    id: 'ph-1',
    permalink: 'https://www.instagram.com/kurazhblum_berlin/',
    alt: {
      de: 'Strauß aus Pfingstrosen und Ranunkeln auf der Werkbank',
      uk: 'Букет із півоній та ранункулюсів на робочому столі',
      en: 'Bouquet of peonies and ranunculus on the workbench',
      ru: 'Букет из пионов и ранункулюсов на рабочем столе',
    },
  },
  {
    id: 'ph-2',
    permalink: 'https://www.instagram.com/kurazhblum_berlin/',
    isReel: true,
    alt: {
      de: 'Reel: ein Strauß entsteht in der Spiraltechnik',
      uk: 'Reel: букет збирається спіральною технікою',
      en: 'Reel: a bouquet coming together in spiral technique',
      ru: 'Reel: букет собирается спиральной техникой',
    },
  },
  {
    id: 'ph-3',
    permalink: 'https://www.instagram.com/kurazhblum_berlin/',
    alt: {
      de: 'Hochzeitstisch mit weißer Tischfloristik',
      uk: 'Весільний стіл із білою флористикою',
      en: 'Wedding table with white florals',
      ru: 'Свадебный стол с белой флористикой',
    },
  },
  {
    id: 'ph-4',
    permalink: 'https://www.instagram.com/kurazhblum_berlin/',
    alt: {
      de: 'Unboxing einer Hutschachtel mit Rosen',
      uk: 'Розпакування капелюшної коробки з трояндами',
      en: 'Unboxing a hat box of roses',
      ru: 'Распаковка шляпной коробки с розами',
    },
  },
  {
    id: 'ph-5',
    permalink: 'https://www.instagram.com/kurazhblum_berlin/',
    isReel: true,
    alt: {
      de: 'Reel: Workshop im Atelier, acht Teilnehmerinnen binden Sträuße',
      uk: 'Reel: майстер-клас в ательє, вісім учасниць збирають букети',
      en: 'Reel: workshop at the atelier, eight participants tying bouquets',
      ru: 'Reel: мастер-класс в ателье, восемь участниц собирают букеты',
    },
  },
  {
    id: 'ph-6',
    permalink: 'https://www.instagram.com/kurazhblum_berlin/',
    alt: {
      de: 'Dopamin-Strauß in kräftigen Farben',
      uk: 'Дофаміновий букет у яскравих кольорах',
      en: 'Dopamine bouquet in strong colours',
      ru: 'Дофаминовый букет в ярких цветах',
    },
  },
];
