import type { I18nText } from '../i18n/config';

/**
 * Blumen, mit denen Gala regelmäßig arbeitet — die Auswahlliste für Weg A
 * („Strauß zusammenstellen“).
 *
 * Bewusst KEINE Bestandsliste: was heute tatsächlich da ist, entscheidet der
 * Markt am Morgen. Diese Liste sagt nur, womit sie überhaupt arbeitet. Die
 * Verfügbarkeit klärt der Kundenservice — genau deshalb führt Weg A nicht in
 * den Warenkorb.
 */
export interface Flower {
  id: string;
  name: I18nText;
  /** Nur in diesen Monaten (1–12) sinnvoll; leer = ganzjährig. */
  season?: number[];
}

export const FLOWERS: Flower[] = [
  {
    id: 'rosen',
    name: { de: 'Rosen', uk: 'Троянди', en: 'Roses', ru: 'Розы' },
  },
  {
    id: 'paeonienrosen',
    name: {
      de: 'Päonienrosen',
      uk: 'Піоновидні троянди',
      en: 'Peony roses',
      ru: 'Пионовидные розы',
    },
  },
  {
    id: 'pfingstrosen',
    season: [5, 6, 7],
    name: { de: 'Pfingstrosen', uk: 'Півонії', en: 'Peonies', ru: 'Пионы' },
  },
  {
    id: 'hortensien',
    name: { de: 'Hortensien', uk: 'Гортензії', en: 'Hydrangeas', ru: 'Гортензии' },
  },
  {
    id: 'rittersporn',
    name: { de: 'Rittersporn', uk: 'Дельфініум', en: 'Delphinium', ru: 'Дельфиниум' },
  },
  {
    id: 'ranunkeln',
    name: { de: 'Ranunkeln', uk: 'Ранункулюси', en: 'Ranunculus', ru: 'Ранункулюсы' },
  },
  {
    id: 'eustoma',
    name: { de: 'Eustoma', uk: 'Еустома', en: 'Lisianthus', ru: 'Эустома' },
  },
  {
    id: 'nelken',
    name: { de: 'Nelken', uk: 'Гвоздики', en: 'Carnations', ru: 'Гвоздики' },
  },
  {
    id: 'tulpen',
    season: [1, 2, 3, 4, 5],
    name: { de: 'Tulpen', uk: 'Тюльпани', en: 'Tulips', ru: 'Тюльпаны' },
  },
  {
    id: 'gerbera',
    name: { de: 'Gerbera', uk: 'Гербери', en: 'Gerbera', ru: 'Герберы' },
  },
  {
    id: 'calla',
    name: { de: 'Calla', uk: 'Кали', en: 'Calla lilies', ru: 'Каллы' },
  },
  {
    id: 'astilbe',
    name: { de: 'Astilbe', uk: 'Астільба', en: 'Astilbe', ru: 'Астильба' },
  },
  {
    id: 'dahlien',
    season: [7, 8, 9, 10],
    name: { de: 'Dahlien', uk: 'Жоржини', en: 'Dahlias', ru: 'Георгины' },
  },
  {
    id: 'eukalyptus',
    name: { de: 'Eukalyptus & Grün', uk: 'Евкаліпт і зелень', en: 'Eucalyptus & greenery', ru: 'Эвкалипт и зелень' },
  },
];

/** Blumen, die im angegebenen Monat Saison haben. */
export function flowersInSeason(month: number): Flower[] {
  return FLOWERS.filter((f) => !f.season || f.season.includes(month));
}
