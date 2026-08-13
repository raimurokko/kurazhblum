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
  /**
   * Gesamtpreis nach Personenzahl, wo die Stunde geteilt werden kann. Der
   * Betrag ist die **Summe für die ganze Gruppe**, nicht der Anteil je Person —
   * beim Einzelunterricht steigt er degressiv, weil Gala dieselbe Stunde hält.
   *
   * Die Stufenbezeichnung steht als Text daneben, statt zur Laufzeit gebildet
   * zu werden: Ukrainisch und Russisch beugen das Zählwort nach der Zahl
   * („1 человек“, „2 человека“), und eine Pluralregel im Code wäre für drei
   * feste Stufen viel Apparat für wenig Nutzen.
   *
   * Wo eine Staffel steht, zeigt die Seite sie statt des Einzelpreises.
   */
  priceScale?: { label: I18nText; price: Cents }[];
  /** Nur-Anfrage-Formate (Firmen, mobile Workshops) haben keinen Festpreis. */
  inquiryOnly?: boolean;
  image?: string;
  /**
   * Stumme Videoschleife statt Standbild. Wo sie steht, tritt sie an die
   * Stelle des Fotos — bei einem Kurs beantwortet Bewegung die eigentliche
   * Frage („was mache ich da?“) besser als jedes Standbild.
   */
  video?: { src: string; poster: string; duration: string };
  /**
   * Es gibt noch kein Foto. Dann bleibt `image` leer, es wird kein `<img>`
   * erzeugt, und auf der Kachel steht sichtbar „Bild folgt“. Vorher standen
   * hier vier `.jpg`-Verweise auf Dateien, die es nie gab — vier stille 404
   * je Seitenaufruf.
   */
  imagePending?: boolean;
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
    price: 8500,
    video: { src: '/videos/grundkurs.mp4', poster: '/videos/grundkurs.jpg', duration: 'PT8S' },
    name: {
      de: 'Grundkurs: Strauß binden',
      uk: 'Базовий курс: збирання букета',
      en: 'Basics: tying a bouquet',
      ru: 'Базовый курс: сборка букета',
    },
    blurb: {
      de: 'Der Einstieg. Technik, Farbe, Kombinationen, Struktur.',
      uk: 'Початок. Техніка, колір, поєднання, фактура.',
      en: 'The entry point. Technique, colour, combinations, texture.',
      ru: 'Начало. Техника, цвет, сочетания, фактура.',
    },
    description: {
      de: 'Wir beginnen mit der Technik, danach arbeiten wir an Farbe, Kombinationen und der Struktur des Straußes. Am Ende der Stunde binden Sie Ihren eigenen Strauß und nehmen ihn mit nach Hause. Unterwegs gebe ich Ihnen Hinweise, helfe, wo es nötig ist, und erzähle, wie die einzelnen Blumenarten richtig gepflegt werden. Das Thema des Kurses wechselt mit der Jahreszeit.',
      uk: 'Починаємо з вивчення техніки, далі працюємо над кольором, поєднаннями та фактурою букета. Наприкінці заняття ви збираєте власний букет і забираєте його додому. Дорогою я даю підказки, за потреби допомагаю й розповідаю про правильний догляд за окремими видами квітів. Тематика курсу може змінюватися залежно від сезону.',
      en: 'We begin with the technique, then work on colour, combinations and the texture of the bouquet. By the end of the session you tie your own bouquet and take it home. Along the way I give you pointers, help where it is needed, and explain how the individual kinds of flowers are cared for. The theme of the course changes with the season.',
      ru: 'Начинаем с изучения техники, затем работаем над цветом, сочетаниями и фактурой букета. В результате занятия вы собираете свой букет и забираете его домой. В процессе я даю вам подсказки, при необходимости помогаю и рассказываю о правильном уходе за отдельными видами цветов. Тематика курса может меняться в зависимости от сезона.',
    },
    included: [
      {
        de: 'Blumen und floristisches Material',
        uk: 'Квіти та флористичні матеріали',
        en: 'Flowers and floristry materials',
        ru: 'Цветы и флористические материалы',
      },
      {
        de: 'Werkzeug zum Ausleihen',
        uk: 'Інструмент напрокат',
        en: 'Tools to borrow',
        ru: 'Инструменты напрокат',
      },
      {
        de: 'Ihr fertiger Strauß zum Mitnehmen',
        uk: 'Ваш готовий букет із собою',
        en: 'Your finished bouquet to take home',
        ru: 'Ваш готовый букет с собой',
      },
      // Kein Wein: Alkohol auszuschenken braucht in Deutschland eine
      // Schankerlaubnis. Gala hat das selbst angemerkt.
      {
        de: 'Alkoholfreie Getränke und kleine Snacks',
        uk: 'Безалкогольні напої та легкі закуски',
        en: 'Soft drinks and light snacks',
        ru: 'Безалкогольные напитки и лёгкие закуски',
      },
    ],
    duration: { de: '2,5 Stunden', uk: '2,5 години', en: '2.5 hours', ru: '2,5 часа' },
    location: { de: 'Atelier, Berlin', uk: 'Ательє, Берлін', en: 'Atelier, Berlin', ru: 'Ателье, Берлин' },
  },
  {
    // Ersetzt den früheren Saisonkurs. Galas Wort dafür ist „девичник“ — das
    // deckt Junggesellinnenabschied und Freundinnenrunde gleichermaßen ab,
    // wofür es im Deutschen kein einzelnes Wort gibt. Der Titel nennt deshalb
    // den Anlass, der Beschreibungstext den Junggesellinnenabschied.
    slug: 'freundinnen',
    price: 8500,
    imagePending: true,
    name: {
      de: 'Blumenabend für Freundinnen',
      uk: 'Квітковий вечір для подруг',
      en: 'Flower evening for friends',
      ru: 'Креативный девичник',
    },
    blurb: {
      de: 'Wie der Grundkurs, nur mit mehr Atmosphäre und guter Gesellschaft.',
      uk: 'Як базовий курс, лише з більшою атмосферою і гарним товариством.',
      en: 'Like the basics class, only with more atmosphere and good company.',
      ru: 'Как базовый курс, только с атмосферой и приятной компанией.',
    },
    description: {
      de: 'Das Format ähnelt dem Grundkurs, legt den Schwerpunkt aber auf die kreative Atmosphäre und die angenehme Runde. Frische Blumen, neue Bekanntschaften, ein schöner Strauß für zu Hause — und nichts Überflüssiges. Auch als Junggesellinnenabschied buchbar.',
      uk: 'Формат схожий на базовий курс, але з акцентом на творчу атмосферу і приємне жіноче товариство. Свіжі квіти, нові знайомства, затишна атмосфера, гарний букет із собою — і нічого зайвого. Можна замовити і як дівич-вечір.',
      en: 'The format resembles the basics class, but the emphasis is on the creative atmosphere and the good company. Fresh flowers, new acquaintances, a beautiful bouquet to take home — and nothing superfluous. Also bookable as a hen party.',
      ru: 'Формат похож на базовый курс по флористике, но с акцентом на творческую атмосферу и приятную женскую компанию. Свежие цветы, новые знакомства, уютная атмосфера, прекрасный букет с собой и ничего лишнего. Можно заказать и как девичник.',
    },
    included: [
      {
        de: 'Blumen und floristisches Material',
        uk: 'Квіти та флористичні матеріали',
        en: 'Flowers and floristry materials',
        ru: 'Цветы и флористические материалы',
      },
      {
        de: 'Werkzeug zum Ausleihen',
        uk: 'Інструмент напрокат',
        en: 'Tools to borrow',
        ru: 'Инструменты напрокат',
      },
      {
        de: 'Ihr fertiger Strauß zum Mitnehmen',
        uk: 'Ваш готовий букет із собою',
        en: 'Your finished bouquet to take home',
        ru: 'Ваш готовый букет с собой',
      },
      {
        de: 'Alkoholfreie Getränke und kleine Snacks',
        uk: 'Безалкогольні напої та легкі закуски',
        en: 'Soft drinks and light snacks',
        ru: 'Безалкогольные напитки и лёгкие закуски',
      },
    ],
    duration: { de: '2,5 Stunden', uk: '2,5 години', en: '2.5 hours', ru: '2,5 часа' },
    location: { de: 'Atelier, Berlin', uk: 'Ательє, Берлін', en: 'Atelier, Berlin', ru: 'Ателье, Берлин' },
  },
  {
    slug: 'privat',
    /*
      Am 13.08.2026 entschieden: 249 € gelten für eine Person, jede weitere
      kostet weniger. Damit ist die Frage beantwortet, die Galas Satz
      „цена указана за человека“ aufgeworfen hatte — pro Person genommen hätte
      dieselbe Stunde zu zweit das Doppelte gekostet.

      Die 249 € sind Galas Zahl. Die beiden Stufen darüber (429 € / 579 €) sind
      im Projekt festgelegt und bei ihr noch gegenzuzeichnen.
    */
    price: 24900,
    priceScale: [
      {
        label: { de: '1 Person', uk: '1 особа', en: '1 person', ru: '1 человек' },
        price: 24900,
      },
      {
        label: { de: '2 Personen', uk: '2 особи', en: '2 people', ru: '2 человека' },
        price: 42900,
      },
      {
        label: { de: '3 Personen', uk: '3 особи', en: '3 people', ru: '3 человека' },
        price: 57900,
      },
    ],
    imagePending: true,
    name: {
      de: 'Einzelunterricht',
      uk: 'Індивідуальне заняття',
      en: 'One-to-one session',
      ru: 'Индивидуальное занятие',
    },
    blurb: {
      de: 'Zwei Stunden nur für Sie, Thema nach Ihrem Wunsch.',
      uk: 'Дві години лише для вас, тема на ваш вибір.',
      en: 'Two hours for you alone, on the topic you choose.',
      ru: 'Два часа только для вас, тема на ваш выбор.',
    },
    description: {
      de: 'Zwei Stunden nur für Sie — wenn Ihnen Unterricht unter vier Augen mehr liegt als eine Gruppe. Ein Einzelkurs für Anfängerinnen und Anfänger, auf eine bestimmte Technik zugeschnitten, nach Ihrer Anfrage und Ihrem Ziel. Auf Wunsch halte ich die Stunde zu zweit oder zu dritt; jede weitere Person kostet dann weniger.',
      uk: 'Дві години лише для вас — якщо формат навчання один на один підходить вам більше, ніж група. Індивідуальний курс для початківців на конкретну техніку, під ваш запит і вашу мету. За бажанням проведу заняття для двох або трьох; кожна наступна особа коштує дешевше.',
      en: 'Two hours for you alone — if one-to-one teaching suits you better than a group. An individual course for beginners, built around a specific technique, your request and your goal. On request I hold the session for two or three; each further person costs less.',
      ru: 'Два часа только для вас — если вам больше подходит формат обучения один на один, чем в группе. Индивидуальный курс для новичков на конкретную технику, под индивидуальный запрос и цель. По желанию проведу занятие для двоих или троих; каждый следующий участник стоит дешевле.',
    },
    included: [
      {
        de: 'Thema und Blumen nach Absprache',
        uk: 'Тема та квіти за домовленістю',
        en: 'Topic and flowers by arrangement',
        ru: 'Тема и цветы по договорённости',
      },
      {
        de: 'Auch zu zweit oder zu dritt — jede weitere Person günstiger',
        uk: 'Можна вдвох або втрьох — кожна наступна особа дешевше',
        en: 'Also for two or three — each further person costs less',
        ru: 'Можно вдвоём или втроём — каждый следующий дешевле',
      },
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
    imagePending: true,
    // „Bei Ihnen“ klang, als käme Gala zu jemandem nach Hause. Sie kommt zur
    // Veranstaltung — der Titel sagt das jetzt.
    name: {
      de: 'Workshop auf Ihrer Veranstaltung',
      uk: 'Майстер-клас на вашому заході',
      en: 'Workshop at your event',
      ru: 'Мастер-класс на вашем мероприятии',
    },
    blurb: {
      de: 'Geburtstag, Junggesellinnenabschied, Firmenfeier — ich komme mit Blumen, Werkzeug und Material zu Ihnen.',
      uk: 'День народження, дівич-вечір, корпоратив — приїжджаю до вас із квітами, інструментом і матеріалами.',
      en: 'Birthday, hen party, company party — I come to you with flowers, tools and materials.',
      ru: 'День рождения, девичник, корпоратив: приезжаю с цветами, инструментами и материалами в ваше пространство.',
    },
    description: {
      de: 'Ich bringe Blumen, Werkzeug und alles nötige floristische Material mit — von Ihnen brauche ich nur Tische und Wasser. Ab 4 Personen, innerhalb Berlins.',
      uk: 'Привожу квіти, інструмент і всі потрібні флористичні матеріали — від вас потрібні лише столи й вода. Від 4 осіб, у межах Берліна.',
      en: 'I bring flowers, tools and every floristry material needed — all I need from you is tables and water. From 4 people, within Berlin.',
      ru: 'Привожу цветы, инструменты, все необходимые флористические материалы — от вас нужны только столы и вода. От 4 человек, в пределах Берлина.',
    },
    included: [
      {
        de: 'Logistik: Anfahrt, Aufbau und Abbau',
        uk: 'Логістика: приїзд, монтаж і демонтаж',
        en: 'Logistics: travel, set-up and take-down',
        ru: 'Логистика (приезд, монтаж, демонтаж)',
      },
      {
        de: 'Blumen und alle nötigen Materialien für die Teilnehmenden',
        uk: 'Квіти та всі потрібні матеріали для учасників',
        en: 'Flowers and all the materials the participants need',
        ru: 'Цветы и все необходимые материалы для участников',
      },
      {
        de: 'Rechnung für Firmen — auf Anfrage',
        uk: 'Рахунок для компаній — на запит',
        en: 'Invoice for companies — on request',
        ru: 'Счёт для компаний — пришлю по запросу',
      },
    ],
    duration: {
      de: '2 – 3 Stunden, nach Absprache',
      uk: '2 – 3 години, за домовленістю',
      en: '2 – 3 hours, by arrangement',
      ru: '2 – 3 часа, по договорённости',
    },
    location: {
      de: 'Bei Ihnen, in Berlin',
      uk: 'У вас, у Берліні',
      en: 'At your place, in Berlin',
      ru: 'У вас, в Берлине',
    },
  },
];

/**
 * Termine des Grundkurses: **jeder letzte Samstag im Monat, 17:30 Uhr**.
 * Die Daten stehen einzeln da und nicht als Regel, weil die freien Plätze
 * ohnehin von Hand gepflegt werden müssen — eine Regel würde Termine
 * erzeugen, deren Belegung niemand kennt. Vergangene Daten blendet
 * `upcomingDates()` von selbst aus; hinten anhängen genügt.
 *
 * Der Blumenabend für Freundinnen und das Einzelunterricht-Format haben
 * bewusst keine festen Termine: Beide werden individuell verabredet.
 *
 * TODO: Die Sitzplatzzahlen sind Schätzwerte und von Gala noch nicht bestätigt.
 */
export const WORKSHOP_DATES: WorkshopDate[] = [
  { id: 'b-2026-08-29', formatSlug: 'basics', start: '2026-08-29T17:30', seatsTotal: 8, seatsLeft: 8 },
  { id: 'b-2026-09-26', formatSlug: 'basics', start: '2026-09-26T17:30', seatsTotal: 8, seatsLeft: 8 },
  { id: 'b-2026-10-31', formatSlug: 'basics', start: '2026-10-31T17:30', seatsTotal: 8, seatsLeft: 8 },
  { id: 'b-2026-11-28', formatSlug: 'basics', start: '2026-11-28T17:30', seatsTotal: 8, seatsLeft: 8 },
  { id: 'b-2026-12-26', formatSlug: 'basics', start: '2026-12-26T17:30', seatsTotal: 8, seatsLeft: 8 },
  { id: 'b-2027-01-30', formatSlug: 'basics', start: '2027-01-30T17:30', seatsTotal: 8, seatsLeft: 8 },
];

export function formatBySlug(slug: string): WorkshopFormat | undefined {
  return WORKSHOP_FORMATS.find((f) => f.slug === slug);
}

/** Termine ab heute, aufsteigend sortiert. */
export function upcomingDates(now = new Date()): WorkshopDate[] {
  return WORKSHOP_DATES.filter((d) => new Date(d.start) >= now).sort((a, b) => a.start.localeCompare(b.start));
}
