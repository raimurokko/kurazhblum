import type { I18nText } from '../i18n/config';
import type { Cents } from './shop';

export interface WorkshopFormat {
  slug: string;
  name: I18nText;
  blurb: I18nText;
  description: I18nText;
  included: I18nText[];
  duration: I18nText;
  location: I18nText;
  /** Preis pro Person; fehlt er, ist das Format nur auf Anfrage buchbar. */
  price?: Cents;
  /** Nur-Anfrage-Formate (Firmen, mobile Workshops) haben keinen Festpreis. */
  inquiryOnly?: boolean;
  image?: string;
}

export interface WorkshopDate {
  id: string;
  formatSlug: string;
  /** ISO-Datum, lokale Berliner Zeit. */
  start: string;
  seatsTotal: number;
  seatsLeft: number;
}

export const WORKSHOP_FORMATS: WorkshopFormat[] = [
  {
    slug: 'basics',
    price: 8900,
    image: '/images/workshops/basics.jpg',
    name: {
      de: 'Grundkurs: Strauß binden',
      uk: 'Базовий курс: збирання букета',
      en: 'Basics: tying a bouquet',
      ru: 'Базовый курс: сборка букета',
    },
    blurb: {
      de: 'Der Einstieg. Spiraltechnik, Farblehre, Materialkunde.',
      uk: 'Початок. Спіральна техніка, колір, матеріали.',
      en: 'The entry point. Spiral technique, colour, materials.',
      ru: 'Начало. Спиральная техника, цвет, материалы.',
    },
    description: {
      de: 'Wir fangen bei der Spirale an — der Griff, mit dem ein Strauß von selbst steht. Danach geht es um Farbe: warum manche Kombinationen sofort funktionieren und andere nicht. Am Ende binden Sie Ihren eigenen Strauß und nehmen ihn mit.',
      uk: 'Починаємо зі спіралі — хвата, завдяки якому букет тримається сам. Далі — колір: чому одні поєднання працюють одразу, а інші ні. Наприкінці ви збираєте власний букет і забираєте його з собою.',
      en: 'We start with the spiral — the grip that makes a bouquet stand by itself. Then colour: why some combinations work instantly and others do not. At the end you tie your own bouquet and take it home.',
      ru: 'Начинаем со спирали — хвата, благодаря которому букет держится сам. Затем цвет: почему одни сочетания работают сразу, а другие нет. В конце вы собираете свой букет и забираете его.',
    },
    included: [
      {
        de: 'Alle Blumen und Materialien',
        uk: 'Усі квіти та матеріали',
        en: 'All flowers and materials',
        ru: 'Все цветы и материалы',
      },
      {
        de: 'Werkzeug zum Ausleihen',
        uk: 'Інструмент напрокат',
        en: 'Tools to borrow',
        ru: 'Инструмент напрокат',
      },
      {
        de: 'Ihr fertiger Strauß zum Mitnehmen',
        uk: 'Ваш готовий букет із собою',
        en: 'Your finished bouquet to take home',
        ru: 'Ваш готовый букет с собой',
      },
      {
        de: 'Kaffee, Wein und etwas zu essen',
        uk: 'Кава, вино та легкі закуски',
        en: 'Coffee, wine and something to eat',
        ru: 'Кофе, вино и лёгкие закуски',
      },
    ],
    duration: { de: '3 Stunden', uk: '3 години', en: '3 hours', ru: '3 часа' },
    location: { de: 'Atelier, Berlin', uk: 'Ательє, Берлін', en: 'Atelier, Berlin', ru: 'Ателье, Берлин' },
  },
  {
    slug: 'saison',
    price: 10900,
    image: '/images/workshops/saison.jpg',
    name: {
      de: 'Saisonkurs',
      uk: 'Сезонний курс',
      en: 'Seasonal class',
      ru: 'Сезонный курс',
    },
    blurb: {
      de: 'Vier Mal im Jahr, immer mit dem, was gerade blüht.',
      uk: 'Чотири рази на рік, завжди з тим, що зараз цвіте.',
      en: 'Four times a year, always with what is in bloom.',
      ru: 'Четыре раза в год, всегда с тем, что сейчас цветёт.',
    },
    description: {
      de: 'Im Frühling Tulpen und Ranunkeln, im Juni Pfingstrosen, im Herbst Dahlien und Gräser, im Advent Tanne und Trockenmaterial. Jeder Termin hat ein eigenes Thema — auch für alle, die den Grundkurs schon hatten.',
      uk: 'Навесні тюльпани й ранункулюси, у червні півонії, восени жоржини та трави, в адвент — ялина й сухоцвіти. Кожна дата має свою тему — також для тих, хто вже пройшов базовий курс.',
      en: 'Tulips and ranunculus in spring, peonies in June, dahlias and grasses in autumn, fir and dried material in Advent. Each date has its own theme — also for people who already did the basics.',
      ru: 'Весной тюльпаны и ранункулюсы, в июне пионы, осенью георгины и травы, в адвент — ель и сухоцветы. У каждой даты своя тема — в том числе для тех, кто уже прошёл базовый курс.',
    },
    included: [
      {
        de: 'Saisonblumen in Fülle',
        uk: 'Сезонні квіти вдосталь',
        en: 'Seasonal flowers in abundance',
        ru: 'Сезонные цветы в изобилии',
      },
      {
        de: 'Vase oder Gefäß passend zum Thema',
        uk: 'Ваза або посудина за темою',
        en: 'A vase or vessel to match the theme',
        ru: 'Ваза или сосуд по теме',
      },
      {
        de: 'Rezeptkarte zum Nachbauen',
        uk: 'Картка-рецепт для повторення',
        en: 'A recipe card to rebuild it at home',
        ru: 'Карточка-рецепт для повторения',
      },
    ],
    duration: { de: '3,5 Stunden', uk: '3,5 години', en: '3.5 hours', ru: '3,5 часа' },
    location: { de: 'Atelier, Berlin', uk: 'Ательє, Берлін', en: 'Atelier, Berlin', ru: 'Ателье, Берлин' },
  },
  {
    slug: 'privat',
    price: 24900,
    image: '/images/workshops/privat.jpg',
    name: {
      de: 'Private Session',
      uk: 'Приватна сесія',
      en: 'Private session',
      ru: 'Частная сессия',
    },
    blurb: {
      de: 'Zu zweit oder allein, Thema nach Ihrem Wunsch.',
      uk: 'Удвох або наодинці, тема на ваш вибір.',
      en: 'Alone or as a pair, on the topic you choose.',
      ru: 'Вдвоём или наедине, тема на ваш выбор.',
    },
    description: {
      de: 'Zwei Stunden nur für Sie — ob Sie ein bestimmtes Format lernen wollen, für die eigene Hochzeit üben oder einfach ungestört arbeiten möchten. Preis gilt für bis zu zwei Personen.',
      uk: 'Дві години лише для вас — якщо хочете опанувати конкретний формат, потренуватися до власного весілля або просто попрацювати без поспіху. Ціна за двох осіб.',
      en: 'Two hours for you alone — whether you want to learn a specific format, practise for your own wedding, or simply work undisturbed. Price covers up to two people.',
      ru: 'Два часа только для вас — если хотите освоить конкретный формат, потренироваться к собственной свадьбе или просто поработать без спешки. Цена за двоих.',
    },
    included: [
      {
        de: 'Thema und Blumen nach Absprache',
        uk: 'Тема та квіти за домовленістю',
        en: 'Topic and flowers by arrangement',
        ru: 'Тема и цветы по договорённости',
      },
      { de: 'Für bis zu 2 Personen', uk: 'До 2 осіб', en: 'For up to 2 people', ru: 'До 2 человек' },
      {
        de: 'Termin flexibel, auch abends',
        uk: 'Гнучка дата, також увечері',
        en: 'Flexible date, evenings possible',
        ru: 'Гибкая дата, в том числе вечером',
      },
    ],
    duration: { de: '2 Stunden', uk: '2 години', en: '2 hours', ru: '2 часа' },
    location: { de: 'Atelier, Berlin', uk: 'Ательє, Берлін', en: 'Atelier, Berlin', ru: 'Ателье, Берлин' },
  },
  {
    slug: 'mobil',
    inquiryOnly: true,
    image: '/images/workshops/mobil.jpg',
    name: {
      de: 'Workshop bei Ihnen',
      uk: 'Майстер-клас у вас',
      en: 'Workshop at your place',
      ru: 'Мастер-класс у вас',
    },
    blurb: {
      de: 'Geburtstag, JGA, Team-Tag, Firmenevent — ich komme zu Ihnen.',
      uk: 'День народження, дівич-вечір, тімбілдинг, корпоратив — приїжджаю до вас.',
      en: 'Birthday, hen party, team day, company event — I come to you.',
      ru: 'День рождения, девичник, тимбилдинг, корпоратив — приезжаю к вам.',
    },
    description: {
      de: 'Ich bringe Blumen, Werkzeug, Gefäße und Unterlagen mit — Sie brauchen nur Tische und Wasser. Ab 6 Personen, in Berlin und bis 40 km ins Umland. Für Firmen mit Rechnung und, wenn gewünscht, mit Ihrem Branding auf den Rezeptkarten.',
      uk: 'Привожу квіти, інструмент, посудини та підкладки — вам потрібні лише столи й вода. Від 6 осіб, у Берліні та до 40 км навколо. Для компаній — з рахунком і, за бажанням, з вашим брендингом на картках-рецептах.',
      en: 'I bring flowers, tools, vessels and table covers — you only need tables and water. From 6 people, in Berlin and up to 40 km around. For companies with an invoice and, on request, your branding on the recipe cards.',
      ru: 'Привожу цветы, инструмент, сосуды и подложки — вам нужны только столы и вода. От 6 человек, в Берлине и до 40 км вокруг. Для компаний — со счётом и, по желанию, с вашим брендингом на карточках-рецептах.',
    },
    included: [
      {
        de: 'Anfahrt, Aufbau und Abbau',
        uk: 'Приїзд, монтаж і демонтаж',
        en: 'Travel, set-up and take-down',
        ru: 'Приезд, монтаж и демонтаж',
      },
      {
        de: 'Material für alle Teilnehmenden',
        uk: 'Матеріал для всіх учасників',
        en: 'Material for every participant',
        ru: 'Материал для всех участников',
      },
      {
        de: 'Rechnung für Firmen',
        uk: 'Рахунок для компаній',
        en: 'Invoice for companies',
        ru: 'Счёт для компаний',
      },
    ],
    duration: {
      de: '2 – 3 Stunden, nach Absprache',
      uk: '2 – 3 години, за домовленістю',
      en: '2 – 3 hours, by arrangement',
      ru: '2 – 3 часа, по договорённости',
    },
    location: {
      de: 'Bei Ihnen, Berlin & Umland',
      uk: 'У вас, Берлін та околиці',
      en: 'At your place, Berlin & around',
      ru: 'У вас, Берлин и окрестности',
    },
  },
];

/**
 * Termine. TODO: Vor dem Livegang durch echte Termine ersetzen und
 * regelmäßig pflegen — vergangene Daten werden automatisch ausgeblendet.
 */
export const WORKSHOP_DATES: WorkshopDate[] = [
  { id: 'b-2026-08-15', formatSlug: 'basics', start: '2026-08-15T15:00', seatsTotal: 8, seatsLeft: 3 },
  { id: 's-2026-08-29', formatSlug: 'saison', start: '2026-08-29T14:00', seatsTotal: 8, seatsLeft: 6 },
  { id: 'b-2026-09-12', formatSlug: 'basics', start: '2026-09-12T15:00', seatsTotal: 8, seatsLeft: 8 },
  { id: 's-2026-10-10', formatSlug: 'saison', start: '2026-10-10T14:00', seatsTotal: 8, seatsLeft: 8 },
  { id: 'b-2026-11-07', formatSlug: 'basics', start: '2026-11-07T15:00', seatsTotal: 8, seatsLeft: 0 },
];

export function formatBySlug(slug: string): WorkshopFormat | undefined {
  return WORKSHOP_FORMATS.find((f) => f.slug === slug);
}

/** Termine ab heute, aufsteigend sortiert. */
export function upcomingDates(now = new Date()): WorkshopDate[] {
  return WORKSHOP_DATES.filter((d) => new Date(d.start) >= now).sort((a, b) => a.start.localeCompare(b.start));
}
