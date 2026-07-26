import type { I18nText, Locale } from '../i18n/config';

/**
 * Alle Beträge sind Cent-Ganzzahlen. Nie mit Fließkomma rechnen —
 * Preise werden erst bei der Ausgabe über `formatPrice` formatiert.
 */
export type Cents = number;

export type SizeKey = 's' | 'm' | 'l';
export type PresentationKey = 'bouquet' | 'basket' | 'box' | 'vase';

export interface Category {
  slug: string;
  name: I18nText;
  blurb: I18nText;
  /** Bild in public/images/categories/<slug>.jpg — bis dahin greift der Platzhalter. */
  image?: string;
}

export interface Bouquet {
  slug: string;
  category: string;
  name: I18nText;
  blurb: I18nText;
  description: I18nText;
  /** Was drin ist — wird als Liste ausgegeben. */
  composition: I18nText;
  /** Preise je Größe, inkl. MwSt. */
  prices: Record<SizeKey, Cents>;
  /** Welche Präsentationsformen für diesen Strauß sinnvoll sind. */
  presentations: PresentationKey[];
  images: string[];
  featured?: boolean;
  /** Nur in bestimmten Monaten (1–12) verfügbar; leer = ganzjährig. */
  season?: number[];
}

/** Aufpreis je Präsentationsform. */
export const PRESENTATION_SURCHARGE: Record<PresentationKey, Cents> = {
  bouquet: 0,
  box: 1800,
  basket: 2500,
  vase: 3500,
};

/** Mindestbestellwert für Lieferung — steht so auch im Instagram-Profil. */
export const MIN_ORDER_DELIVERY: Cents = 8500;

export interface DeliveryZone {
  id: string;
  name: I18nText;
  fee: Cents;
  /** Beispielbezirke, als Hilfe bei der Auswahl. */
  hint: I18nText;
}

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'pickup',
    fee: 0,
    name: {
      de: 'Abholung im Atelier',
      uk: 'Самовивіз з ательє',
      en: 'Pickup at the atelier',
      ru: 'Самовывоз из ателье',
    },
    hint: {
      de: 'Nach Absprache, kein Mindestbestellwert',
      uk: 'За домовленістю, без мінімальної суми',
      en: 'By arrangement, no minimum order',
      ru: 'По договорённости, без минимальной суммы',
    },
  },
  {
    id: 'inner',
    fee: 900,
    name: {
      de: 'Berlin — innerhalb des Rings',
      uk: 'Берлін — у межах кільця',
      en: 'Berlin — inside the Ring',
      ru: 'Берлин — внутри кольца',
    },
    hint: {
      de: 'Mitte, Kreuzberg, Prenzlauer Berg, Friedrichshain, Charlottenburg',
      uk: 'Мітте, Кройцберг, Пренцлауер-Берг, Фрідріхсхайн, Шарлоттенбург',
      en: 'Mitte, Kreuzberg, Prenzlauer Berg, Friedrichshain, Charlottenburg',
      ru: 'Митте, Кройцберг, Пренцлауэр-Берг, Фридрихсхайн, Шарлоттенбург',
    },
  },
  {
    id: 'outer',
    fee: 1500,
    name: {
      de: 'Berlin — Außenbezirke',
      uk: 'Берлін — зовнішні райони',
      en: 'Berlin — outer districts',
      ru: 'Берлин — внешние районы',
    },
    hint: {
      de: 'Spandau, Köpenick, Pankow-Nord, Marzahn, Zehlendorf',
      uk: 'Шпандау, Кьопенік, Панков-Північ, Марцан, Целендорф',
      en: 'Spandau, Köpenick, north Pankow, Marzahn, Zehlendorf',
      ru: 'Шпандау, Кёпеник, Панков-Север, Марцан, Целендорф',
    },
  },
  {
    id: 'brandenburg',
    fee: 2900,
    name: {
      de: 'Potsdam & Umland',
      uk: 'Потсдам та околиці',
      en: 'Potsdam & surroundings',
      ru: 'Потсдам и окрестности',
    },
    hint: {
      de: 'Nach Absprache, bis 40 km ab Atelier',
      uk: 'За домовленістю, до 40 км від ательє',
      en: 'By arrangement, up to 40 km from the atelier',
      ru: 'По договорённости, до 40 км от ателье',
    },
  },
];

export interface Extra {
  id: string;
  name: I18nText;
  price: Cents;
}

export const EXTRAS: Extra[] = [
  {
    id: 'vase',
    price: 2200,
    name: {
      de: 'Schlichte Glasvase',
      uk: 'Проста скляна ваза',
      en: 'Plain glass vase',
      ru: 'Простая стеклянная ваза',
    },
  },
  {
    id: 'chocolate',
    price: 1200,
    name: {
      de: 'Belgische Pralinen',
      uk: 'Бельгійські праліне',
      en: 'Belgian chocolates',
      ru: 'Бельгийские конфеты',
    },
  },
  {
    id: 'candle',
    price: 1800,
    name: {
      de: 'Duftkerze aus Berliner Manufaktur',
      uk: 'Ароматична свічка берлінської мануфактури',
      en: 'Scented candle from a Berlin maker',
      ru: 'Ароматическая свеча берлинской мануфактуры',
    },
  },
  {
    id: 'food',
    price: 400,
    name: {
      de: 'Frischhaltemittel & Pflegekarte',
      uk: 'Засіб для свіжості та картка догляду',
      en: 'Flower food & care card',
      ru: 'Средство для свежести и карточка ухода',
    },
  },
];

export const CATEGORIES: Category[] = [
  {
    slug: 'dopamin',
    name: {
      de: 'Dopamin-Sträuße',
      uk: 'Дофамінові букети',
      en: 'Dopamine bouquets',
      ru: 'Дофаминовые букеты',
    },
    blurb: {
      de: 'Bunt, frei komponiert, ohne strenge Geometrie. Für gute Laune ohne Anlass.',
      uk: 'Барвисті, вільної композиції, без суворої геометрії. Для настрою без приводу.',
      en: 'Colourful, freely composed, no strict geometry. Good mood without an occasion.',
      ru: 'Яркие, свободной композиции, без строгой геометрии. Для настроения без повода.',
    },
  },
  {
    slug: 'rosen',
    name: { de: 'Rosen', uk: 'Троянди', en: 'Roses', ru: 'Розы' },
    blurb: {
      de: 'Klassisch, monochrom, in jeder Stückzahl. Auch als reine Rosenwand im Karton.',
      uk: 'Класика, монохром, у будь-якій кількості. Також суцільна троянда в коробці.',
      en: 'Classic, monochrome, in any count. Also as a solid rose box.',
      ru: 'Классика, монохром, в любом количестве. Также сплошная роза в коробке.',
    },
  },
  {
    slug: 'pfingstrosen',
    name: { de: 'Pfingstrosen', uk: 'Півонії', en: 'Peonies', ru: 'Пионы' },
    blurb: {
      de: 'Nur zur Saison, dafür in voller Blüte. Von Mai bis Anfang Juli.',
      uk: 'Тільки в сезон, зате в повному цвіті. З травня до початку липня.',
      en: 'Only in season, but in full bloom. May to early July.',
      ru: 'Только в сезон, зато в полном цвету. С мая до начала июля.',
    },
  },
  {
    slug: 'hortensien',
    name: { de: 'Hortensien', uk: 'Гортензії', en: 'Hydrangeas', ru: 'Гортензии' },
    blurb: {
      de: 'Große, weiche Köpfe — allein oder mit Rosen kombiniert.',
      uk: 'Великі мʼякі голівки — самі або в поєднанні з трояндами.',
      en: 'Big soft heads — on their own or combined with roses.',
      ru: 'Большие мягкие головки — сами по себе или с розами.',
    },
  },
  {
    slug: 'saison',
    name: { de: 'Saisonblumen', uk: 'Сезонні квіти', en: 'Seasonal flowers', ru: 'Сезонные цветы' },
    blurb: {
      de: 'Was der Markt heute Morgen hergab. Wechselt jede Woche.',
      uk: 'Те, що ринок дав сьогодні вранці. Змінюється щотижня.',
      en: 'Whatever the market had this morning. Changes every week.',
      ru: 'То, что дал рынок сегодня утром. Меняется каждую неделю.',
    },
  },
  {
    slug: 'trocken',
    name: {
      de: 'Trockenblumen',
      uk: 'Сухоцвіти',
      en: 'Dried flowers',
      ru: 'Сухоцветы',
    },
    blurb: {
      de: 'Halten Monate statt Tage. Gut fürs Büro und für Geschenke per Post.',
      uk: 'Тримаються місяцями, а не днями. Добре для офісу та подарунків поштою.',
      en: 'Last months, not days. Good for the office and for gifts by post.',
      ru: 'Держатся месяцами, а не днями. Хороши для офиса и подарков почтой.',
    },
  },
];

export const BOUQUETS: Bouquet[] = [
  {
    slug: 'dopamin-berlin',
    category: 'dopamin',
    featured: true,
    prices: { s: 8500, m: 12500, l: 21000 },
    presentations: ['bouquet', 'basket', 'box', 'vase'],
    images: ['/images/products/dopamin-berlin.jpg'],
    name: {
      de: 'Dopamin Berlin',
      uk: 'Дофамін Берлін',
      en: 'Dopamine Berlin',
      ru: 'Дофамин Берлин',
    },
    blurb: {
      de: 'Der Strauß, der am häufigsten wieder bestellt wird.',
      uk: 'Букет, який замовляють повторно найчастіше.',
      en: 'The bouquet that gets reordered the most.',
      ru: 'Букет, который заказывают повторно чаще всего.',
    },
    description: {
      de: 'Kein Schema, keine Symmetrie — nur Farben, die sich gegenseitig hochziehen. Ich stelle ihn jeden Morgen neu aus dem zusammen, was frisch hereinkommt. Zwei Dopamin-Sträuße sehen deshalb nie gleich aus, und genau das ist die Idee.',
      uk: 'Жодної схеми, жодної симетрії — лише кольори, що підсилюють одне одного. Збираю його щоранку заново з того, що приходить свіжим. Тому два дофамінові букети ніколи не однакові — і в цьому вся суть.',
      en: 'No scheme, no symmetry — only colours that lift each other. I compose it fresh each morning from whatever comes in. No two dopamine bouquets look alike, and that is exactly the point.',
      ru: 'Никакой схемы, никакой симметрии — только цвета, которые вытягивают друг друга. Собираю его каждое утро заново из того, что приходит свежим. Два дофаминовых букета никогда не выглядят одинаково — в этом и смысл.',
    },
    composition: {
      de: 'Wechselnd: Ranunkeln, Tulpen, Anemonen, Nelken, Eustoma, Beiwerk der Saison',
      uk: 'Змінно: ранункулюси, тюльпани, анемони, гвоздики, еустома, сезонна зелень',
      en: 'Changing: ranunculus, tulips, anemones, carnations, lisianthus, seasonal greenery',
      ru: 'Переменно: ранункулюсы, тюльпаны, анемоны, гвоздики, эустома, сезонная зелень',
    },
  },
  {
    slug: 'rosen-pur',
    category: 'rosen',
    featured: true,
    prices: { s: 9500, m: 14500, l: 24500 },
    presentations: ['bouquet', 'box', 'vase'],
    images: ['/images/products/rosen-pur.jpg'],
    name: { de: 'Rosen pur', uk: 'Тільки троянди', en: 'Roses only', ru: 'Только розы' },
    blurb: {
      de: 'Eine Sorte, eine Farbe, nichts dazwischen.',
      uk: 'Один сорт, один колір, нічого зайвого.',
      en: 'One variety, one colour, nothing in between.',
      ru: 'Один сорт, один цвет, ничего между.',
    },
    description: {
      de: 'Wenn es keine Erklärung braucht. Ich arbeite mit ecuadorianischen und kenianischen Rosen mit langem Stiel und fester Knospe — S sind 15 Stiele, M sind 25, L sind 51. Farbe sagen Sie mir im Bestellhinweis, sonst wähle ich nach Tagesqualität.',
      uk: 'Коли пояснення не потрібні. Працюю з еквадорськими та кенійськими трояндами з довгим стеблом і щільним бутоном — S це 15 стебел, M — 25, L — 51. Колір вкажіть у примітці до замовлення, інакше обираю за якістю дня.',
      en: 'When it needs no explanation. I work with Ecuadorian and Kenyan roses, long stems and firm buds — S is 15 stems, M is 25, L is 51. Tell me the colour in the order note, otherwise I pick by the day’s quality.',
      ru: 'Когда объяснения не нужны. Работаю с эквадорскими и кенийскими розами с длинным стеблем и плотным бутоном — S это 15 стеблей, M — 25, L — 51. Цвет укажите в примечании, иначе выберу по качеству дня.',
    },
    composition: {
      de: 'Rosen, 50–70 cm Stiel, Farbe nach Wunsch',
      uk: 'Троянди, стебло 50–70 см, колір на вибір',
      en: 'Roses, 50–70 cm stems, colour of your choice',
      ru: 'Розы, стебель 50–70 см, цвет на выбор',
    },
  },
  {
    slug: 'pfingstrosen-wolke',
    category: 'pfingstrosen',
    featured: true,
    season: [5, 6, 7],
    prices: { s: 9500, m: 15500, l: 26000 },
    presentations: ['bouquet', 'box', 'vase'],
    images: ['/images/products/pfingstrosen-wolke.jpg'],
    name: {
      de: 'Pfingstrosen-Wolke',
      uk: 'Півонієва хмарка',
      en: 'Peony cloud',
      ru: 'Пионовое облако',
    },
    blurb: {
      de: 'Sieben Wochen im Jahr, dann ist Schluss.',
      uk: 'Сім тижнів на рік — і все.',
      en: 'Seven weeks a year, then it is over.',
      ru: 'Семь недель в году, потом всё.',
    },
    description: {
      de: 'Pfingstrosen kommen halb geschlossen ins Haus und öffnen sich bei Ihnen über zwei bis drei Tage — das ist der schönste Teil. Ich binde sie fast pur, nur mit etwas Grün, damit die Köpfe Platz haben.',
      uk: 'Півонії приходять напівзакритими й розкриваються у вас протягом двох-трьох днів — це найкраща частина. Збираю їх майже чистими, лише з трохи зелені, щоб голівки мали простір.',
      en: 'Peonies arrive half closed and open at your place over two or three days — that is the best part. I tie them almost pure, with just enough greenery to give the heads room.',
      ru: 'Пионы приходят полузакрытыми и раскрываются у вас за два-три дня — это лучшая часть. Собираю их почти чистыми, лишь с небольшим количеством зелени, чтобы головкам было место.',
    },
    composition: {
      de: 'Pfingstrosen in Weiß, Blassrosa oder Koralle, etwas Pistazie',
      uk: 'Півонії білі, блідо-рожеві або коралові, трохи фісташки',
      en: 'Peonies in white, pale pink or coral, a little pistache',
      ru: 'Пионы белые, бледно-розовые или коралловые, немного фисташки',
    },
  },
  {
    slug: 'hortensie-solo',
    category: 'hortensien',
    prices: { s: 8500, m: 13500, l: 22500 },
    presentations: ['bouquet', 'basket', 'vase'],
    images: ['/images/products/hortensie-solo.jpg'],
    name: {
      de: 'Hortensie solo',
      uk: 'Гортензія соло',
      en: 'Hydrangea solo',
      ru: 'Гортензия соло',
    },
    blurb: {
      de: 'Wenige Köpfe, viel Wirkung.',
      uk: 'Кілька голівок — багато враження.',
      en: 'Few heads, a lot of presence.',
      ru: 'Немного головок — много впечатления.',
    },
    description: {
      de: 'Hortensien füllen einen Raum wie kaum eine andere Blume. Wichtig ist nur, dass sie sofort ins Wasser kommen — die Pflegekarte liegt bei, und im Korb bringe ich sie mit eigener Wasserquelle.',
      uk: 'Гортензії заповнюють простір, як мало яка інша квітка. Головне — одразу поставити у воду; картка догляду додається, а в кошику привожу з власним джерелом води.',
      en: 'Hydrangeas fill a room like almost no other flower. The one rule is water, straight away — a care card is included, and in a basket they come with their own water source.',
      ru: 'Гортензии заполняют пространство, как мало какой цветок. Главное — сразу в воду; карточка ухода прилагается, а в корзине привожу с собственным источником воды.',
    },
    composition: {
      de: 'Hortensien in Weiß, Salbei oder Altrosa, Eukalyptus',
      uk: 'Гортензії білі, шавлієві або пудрові, евкаліпт',
      en: 'Hydrangeas in white, sage or dusty pink, eucalyptus',
      ru: 'Гортензии белые, шалфейные или пудровые, эвкалипт',
    },
  },
  {
    slug: 'markt-am-morgen',
    category: 'saison',
    featured: true,
    prices: { s: 8500, m: 11500, l: 18500 },
    presentations: ['bouquet', 'basket', 'vase'],
    images: ['/images/products/markt-am-morgen.jpg'],
    name: {
      de: 'Markt am Morgen',
      uk: 'Ранковий ринок',
      en: 'Morning market',
      ru: 'Утренний рынок',
    },
    blurb: {
      de: 'Was heute schön war. Sie überlassen mir die Auswahl.',
      uk: 'Те, що сьогодні було гарним. Вибір лишаєте мені.',
      en: 'Whatever was beautiful today. You leave the choice to me.',
      ru: 'То, что сегодня было красивым. Выбор оставляете мне.',
    },
    description: {
      de: 'Der ehrlichste Strauß im Sortiment: Ich kaufe morgens ein und binde aus dem, was am besten aussieht. Sie sagen mir nur die Stimmung — hell, dunkel, warm, kühl — und bekommen vor der Lieferung ein Foto.',
      uk: 'Найчесніший букет в асортименті: закуповую вранці й збираю з того, що виглядає найкраще. Ви кажете лише настрій — світлий, темний, теплий, холодний — і отримуєте фото перед доставкою.',
      en: 'The most honest bouquet in the range: I shop in the morning and tie from whatever looks best. You only tell me the mood — light, dark, warm, cool — and get a photo before delivery.',
      ru: 'Самый честный букет в ассортименте: закупаюсь утром и собираю из того, что выглядит лучше всего. Вы говорите только настроение — светлое, тёмное, тёплое, холодное — и получаете фото перед доставкой.',
    },
    composition: {
      de: 'Wechselnd nach Markt und Jahreszeit',
      uk: 'Змінюється залежно від ринку та сезону',
      en: 'Changes with the market and the season',
      ru: 'Меняется в зависимости от рынка и сезона',
    },
  },
  {
    slug: 'trocken-atelier',
    category: 'trocken',
    prices: { s: 6500, m: 9500, l: 15500 },
    presentations: ['bouquet', 'box', 'vase'],
    images: ['/images/products/trocken-atelier.jpg'],
    name: {
      de: 'Trocken, Atelier',
      uk: 'Сухоцвіт, ательє',
      en: 'Dried, atelier',
      ru: 'Сухоцвет, ателье',
    },
    blurb: {
      de: 'Steht ein halbes Jahr und braucht kein Wasser.',
      uk: 'Стоїть пів року й не потребує води.',
      en: 'Stands for half a year and needs no water.',
      ru: 'Стоит полгода и не требует воды.',
    },
    description: {
      de: 'Gebleichte Gräser, Pampas, Lagurus und getrocknete Hortensie in gedeckten Tönen. Versandfähig — wenn der Strauß nach Hamburg oder München soll, ist das hier die richtige Wahl.',
      uk: 'Вибілені трави, пампаси, лагурус і сушена гортензія в приглушених тонах. Можна відправляти поштою — якщо букет має поїхати до Гамбурга чи Мюнхена, це правильний вибір.',
      en: 'Bleached grasses, pampas, bunny tails and dried hydrangea in muted tones. Shippable — if the bouquet has to travel to Hamburg or Munich, this is the one.',
      ru: 'Отбеленные травы, пампасы, лагурус и сушёная гортензия в приглушённых тонах. Можно отправлять почтой — если букет едет в Гамбург или Мюнхен, это верный выбор.',
    },
    composition: {
      de: 'Pampasgras, Lagurus, Hortensie, Eukalyptus — alles getrocknet',
      uk: 'Пампасна трава, лагурус, гортензія, евкаліпт — усе сушене',
      en: 'Pampas grass, bunny tails, hydrangea, eucalyptus — all dried',
      ru: 'Пампасная трава, лагурус, гортензия, эвкалипт — всё сушёное',
    },
  },
];

/* ————————————————————————————————————————————————————————————————
   Hilfsfunktionen
   ———————————————————————————————————————————————————————————————— */

const LOCALE_TO_INTL: Record<Locale, string> = {
  de: 'de-DE',
  uk: 'uk-UA',
  en: 'en-IE', // Euro-Formatierung auch auf Englisch
  ru: 'ru-RU',
};

export function formatPrice(cents: Cents, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_TO_INTL[locale], {
    style: 'currency',
    currency: 'EUR',
    // Ohne `narrowSymbol` schreibt uk-UA „EUR“ statt „€“ aus.
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function bouquetBySlug(slug: string): Bouquet | undefined {
  return BOUQUETS.find((b) => b.slug === slug);
}

export function bouquetsByCategory(categorySlug: string): Bouquet[] {
  return BOUQUETS.filter((b) => b.category === categorySlug);
}

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function lowestPrice(bouquet: Bouquet): Cents {
  return Math.min(...Object.values(bouquet.prices));
}

/** Preis einer konkreten Zusammenstellung — die einzige Stelle, an der gerechnet wird. */
export function calculateTotal(input: {
  bouquet: Bouquet;
  size: SizeKey;
  presentation: PresentationKey;
  extras: string[];
  zoneId: string;
}): { subtotal: Cents; deliveryFee: Cents; total: Cents } {
  const base = input.bouquet.prices[input.size];
  const presentation = PRESENTATION_SURCHARGE[input.presentation] ?? 0;
  const extras = input.extras.reduce((sum, id) => sum + (EXTRAS.find((e) => e.id === id)?.price ?? 0), 0);
  const subtotal = base + presentation + extras;
  const deliveryFee = DELIVERY_ZONES.find((z) => z.id === input.zoneId)?.fee ?? 0;
  return { subtotal, deliveryFee, total: subtotal + deliveryFee };
}
