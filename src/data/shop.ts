import type { I18nText, Locale } from '../i18n/config';

/**
 * Alle Beträge sind Cent-Ganzzahlen. Nie mit Fließkomma rechnen —
 * Preise werden erst bei der Ausgabe über `formatPrice` formatiert.
 */
export type Cents = number;

/**
 * Galas eigene Staffel — sie verkauft M/L/XL, kein S. Das M ist mit 85 € der
 * Einstieg und liegt damit genau auf dem Mindestbestellwert für Lieferung.
 */
export type SizeKey = 'm' | 'l' | 'xl';
export const SIZES: SizeKey[] = ['m', 'l', 'xl'];

export type PresentationKey = 'bouquet' | 'premium' | 'basket' | 'box' | 'vase';

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

  /**
   * Ein Strauß hat entweder eine Größenstaffel oder einen Festpreis.
   * Die 101 Rosen und die 35 Päonienrosen gibt es nur in einer Ausführung —
   * für sie würde eine erfundene Größenwahl etwas versprechen, das es nicht
   * gibt. Genau eines von beiden setzen.
   */
  prices?: Record<SizeKey, Cents>;
  price?: Cents;

  /** Stiellänge, wo Gala sie angibt — z. B. „60 cm“. */
  length?: string;
  /** Blendet den Hinweis „andere Größen und Längen auf Anfrage“ ein. */
  variantsOnRequest?: boolean;
  /** Prozentualer Nachlass, z. B. 10 beim Überraschungsstrauß. */
  discountPercent?: number;

  /**
   * Beispiel für Saisonware: Zusammensetzung UND Preis richten sich nach der
   * Jahreszeit. Solche Sträuße haben bewusst keinen Preis und keine Kasse —
   * ein Festbetrag wäre eine Zusage, die sich im Juli nicht halten lässt.
   * Sie führen stattdessen zum Kundenservice.
   */
  priceOnRequest?: boolean;

  /** Welche Präsentationsformen für diesen Strauß sinnvoll sind. */
  presentations: PresentationKey[];
  images: string[];
  /** Fotos je Größe — beim Wechsel im Konfigurator tauscht das Bild mit. */
  imagesBySize?: Partial<Record<SizeKey, string[]>>;
  /**
   * Vorläufiges Foto in zu niedriger Auflösung. Wird auf der Website sichtbar
   * markiert, damit niemand vergisst, es zu ersetzen.
   */
  imagePlaceholder?: boolean;
  featured?: boolean;
  /** Nur in bestimmten Monaten (1–12) verfügbar; leer = ganzjährig. */
  season?: number[];
}

/**
 * Aufpreis je Präsentationsform. Die Standardverpackung — von Hand gebunden,
 * in Papier — steckt im Produktpreis; alles Edlere kostet extra.
 */
export const PRESENTATION_SURCHARGE: Record<PresentationKey, Cents> = {
  bouquet: 0,
  premium: 1800,
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
    prices: { m: 8500, l: 15000, xl: 22000 },
    variantsOnRequest: true,
    presentations: ['bouquet', 'premium', 'basket', 'box', 'vase'],
    images: ['/images/products/dopamin-berlin-l.webp'],
    imagesBySize: {
      m: ['/images/products/dopamin-berlin-m.webp', '/images/products/dopamin-berlin-m-2.webp'],
      l: ['/images/products/dopamin-berlin-l.webp', '/images/products/dopamin-berlin-l-2.webp'],
      xl: ['/images/products/dopamin-berlin-xl.webp'],
    },
    name: {
      de: 'Dopamin-Berlin',
      uk: 'Дофаміновий Берлін',
      en: 'Dopamine Berlin',
      ru: 'Дофаминовый Берлин',
    },
    blurb: {
      de: 'Der Strauß, der am häufigsten wieder bestellt wird.',
      uk: 'Букет, який замовляють повторно найчастіше.',
      en: 'The bouquet that gets reordered the most.',
      ru: 'Букет, который заказывают повторно чаще всего.',
    },
    description: {
      de: 'Kein Schema, keine Symmetrie — nur Farben, die sich gegenseitig hochziehen. Ich stelle ihn jeden Morgen neu aus dem zusammen, was frisch hereinkommt. Zwei Dopamin-Sträuße sehen deshalb nie gleich aus, und genau das ist die Idee. Die Fotos zeigen jede Größe an einem echten Beispiel.',
      uk: 'Жодної схеми, жодної симетрії — лише кольори, що підсилюють одне одного. Збираю його щоранку заново з того, що приходить свіжим. Тому два дофамінові букети ніколи не однакові — і в цьому вся суть. На фото кожен розмір показано на справжньому прикладі.',
      en: 'No scheme, no symmetry — only colours that lift each other. I compose it fresh each morning from whatever comes in. No two dopamine bouquets look alike, and that is exactly the point. The photos show each size on a real example.',
      ru: 'Никакой схемы, никакой симметрии — только цвета, которые вытягивают друг друга. Собираю его каждое утро заново из того, что приходит свежим. Два дофаминовых букета никогда не выглядят одинаково — в этом и смысл. На фото каждый размер показан на настоящем примере.',
    },
    composition: {
      de: 'Wechselnd: Hortensien, Ranunkeln, Rittersporn, Nelken, Eustoma, Beiwerk der Saison',
      uk: 'Змінно: гортензії, ранункулюси, дельфініум, гвоздики, еустома, сезонна зелень',
      en: 'Changing: hydrangeas, ranunculus, delphinium, carnations, lisianthus, seasonal greenery',
      ru: 'Переменно: гортензии, ранункулюсы, дельфиниум, гвоздики, эустома, сезонная зелень',
    },
  },
  {
    slug: 'ueberraschungsstrauss',
    category: 'dopamin',
    featured: true,
    prices: { m: 8500, l: 13500, xl: 19800 },
    discountPercent: 10,
    variantsOnRequest: true,
    presentations: ['bouquet', 'premium', 'basket', 'box', 'vase'],
    images: ['/images/products/ueberraschung.webp'],
    name: {
      de: 'Überraschungsstrauß',
      uk: 'Букет-сюрприз',
      en: 'Surprise bouquet',
      ru: 'Букет-сюрприз',
    },
    blurb: {
      de: 'Ich wähle, Sie sparen. Zehn Prozent günstiger.',
      uk: 'Обираю я — заощаджуєте ви. На десять відсотків дешевше.',
      en: 'I choose, you save. Ten per cent less.',
      ru: 'Выбираю я — экономите вы. На десять процентов дешевле.',
    },
    description: {
      de: 'Sie überlassen mir die Auswahl, und ich binde aus den frischesten Blumen, die am Bestelltag da sind. Genau deshalb ist er günstiger: Ich kann nach Qualität einkaufen statt nach Liste, und nichts bleibt liegen. Sie sagen mir nur die Stimmung — hell, dunkel, warm, kühl — und bekommen vor der Lieferung ein Foto.',
      uk: 'Ви лишаєте вибір мені, а я збираю з найсвіжіших квітів, які є в день замовлення. Саме тому він дешевший: я купую за якістю, а не за списком, і нічого не залишається. Ви кажете лише настрій — світлий, темний, теплий, холодний — і отримуєте фото перед доставкою.',
      en: 'You leave the choice to me, and I tie the bouquet from the freshest flowers available on the day of your order. That is exactly why it costs less: I can buy by quality rather than by list, and nothing goes to waste. You only tell me the mood — light, dark, warm, cool — and get a photo before delivery.',
      ru: 'Вы оставляете выбор мне, а я собираю из самых свежих цветов, которые есть в день заказа. Именно поэтому он дешевле: я покупаю по качеству, а не по списку, и ничего не остаётся. Вы говорите только настроение — светлое, тёмное, тёплое, холодное — и получаете фото перед доставкой.',
    },
    composition: {
      de: 'Wechselnd nach Markt und Jahreszeit — die Auswahl liegt bei der Floristin',
      uk: 'Змінюється залежно від ринку та сезону — вибір за флористкою',
      en: 'Changes with the market and the season — the florist chooses',
      ru: 'Меняется в зависимости от рынка и сезона — выбор за флористкой',
    },
  },
  {
    slug: '101-rosen-herz',
    category: 'rosen',
    featured: true,
    price: 40000,
    variantsOnRequest: true,
    presentations: ['bouquet', 'premium', 'box'],
    images: ['/images/products/101-rosen-herz.webp'],
    name: {
      de: 'Strauß aus 101 Rosen mit Herz',
      uk: 'Букет із 101 троянди з серцем',
      en: 'Bouquet of 101 roses with a heart',
      ru: 'Букет из 101 розы с сердцем',
    },
    blurb: {
      de: 'Hundertundeine. Das Herz sitzt in der Mitte.',
      uk: 'Сто одна. Серце — посередині.',
      en: 'A hundred and one. The heart sits in the middle.',
      ru: 'Сто одна. Сердце — в середине.',
    },
    description: {
      de: 'Rote Rosen als geschlossene Fläche, in die ein Herz aus weißen Rosen gesetzt ist. Er wird von Hand aufgebaut, Reihe für Reihe — das dauert, und man sieht es. Die Zahl ist Teil der Geste: 101 steht für „mehr als genug“. Andere Stückzahlen und andere Farbkombinationen mache ich gern, sprechen Sie mich an.',
      uk: 'Червоні троянди суцільним полем, у яке вписане серце з білих. Збирається вручну, ряд за рядом — це довго, і це видно. Число — частина жесту: 101 означає «більш ніж достатньо». Інші кількості та поєднання кольорів роблю залюбки, звертайтеся.',
      en: 'Red roses as a closed surface with a heart of white roses set into it. It is built by hand, row by row — that takes time, and you can see it. The number is part of the gesture: 101 stands for “more than enough”. Other counts and colour combinations are no problem, just ask.',
      ru: 'Красные розы сплошным полем, в которое вписано сердце из белых. Собирается вручную, ряд за рядом — это долго, и это видно. Число — часть жеста: 101 означает «более чем достаточно». Другие количества и сочетания цветов делаю с удовольствием, обращайтесь.',
    },
    composition: {
      de: '101 Rosen, rot mit weißem Herz',
      uk: '101 троянда, червоні з білим серцем',
      en: '101 roses, red with a white heart',
      ru: '101 роза, красные с белым сердцем',
    },
  },
  {
    slug: 'paeonienrosen-35',
    category: 'rosen',
    featured: true,
    price: 18000,
    length: '60 cm',
    variantsOnRequest: true,
    presentations: ['bouquet', 'premium', 'box', 'vase'],
    images: ['/images/products/paeonienrosen-35.webp', '/images/products/paeonienrosen-35-2.webp'],
    name: {
      de: 'Strauß aus 35 Päonienrosen',
      uk: 'Букет із 35 піоновидних троянд',
      en: 'Bouquet of 35 peony roses',
      ru: 'Букет из 35 пионовидных роз',
    },
    blurb: {
      de: 'Gefüllte Gartenrosen, die aussehen wie Pfingstrosen — aber das ganze Jahr.',
      uk: 'Густомахрові садові троянди, схожі на півонії — але цілий рік.',
      en: 'Full garden roses that look like peonies — but all year round.',
      ru: 'Густомахровые садовые розы, похожие на пионы — но круглый год.',
    },
    description: {
      de: 'Päonienrosen sind keine Pfingstrosen: Es sind stark gefüllte Gartenrosen, die deren Form nachbilden — mit dem Vorteil, dass es sie außerhalb der sieben Pfingstrosen-Wochen gibt und dass sie deutlich länger halten. Standardlänge 60 cm; jede andere Länge binde ich auf Wunsch.',
      uk: 'Піоновидні троянди — це не півонії: це густомахрові садові троянди, що повторюють їхню форму. Перевага в тому, що вони є поза сімома тижнями півоній і стоять помітно довше. Стандартна довжина 60 см; будь-яку іншу зроблю на замовлення.',
      en: 'Peony roses are not peonies: they are densely petalled garden roses that imitate the shape — with the advantage that they exist outside the seven weeks of peony season and last considerably longer. Standard length 60 cm; any other length on request.',
      ru: 'Пионовидные розы — это не пионы: это густомахровые садовые розы, повторяющие их форму. Преимущество в том, что они есть вне семи недель пионового сезона и стоят заметно дольше. Стандартная длина 60 см; любую другую сделаю на заказ.',
    },
    composition: {
      de: '35 Päonienrosen in Blassrosa, Stiellänge 60 cm',
      uk: '35 піоновидних троянд у блідо-рожевому, довжина стебла 60 см',
      en: '35 peony roses in pale pink, 60 cm stems',
      ru: '35 пионовидных роз в бледно-розовом, длина стебля 60 см',
    },
  },
  {
    slug: 'rosen-pur',
    category: 'rosen',
    priceOnRequest: true,
    presentations: ['bouquet', 'premium', 'box', 'vase'],
    images: ['/images/products/rosen-pur.jpg'],
    name: { de: 'Rosen pur', uk: 'Тільки троянди', en: 'Roses only', ru: 'Только розы' },
    blurb: {
      de: 'Eine Sorte, eine Farbe, nichts dazwischen.',
      uk: 'Один сорт, один колір, нічого зайвого.',
      en: 'One variety, one colour, nothing in between.',
      ru: 'Один сорт, один цвет, ничего между.',
    },
    description: {
      de: 'Wenn es keine Erklärung braucht. Ich arbeite mit ecuadorianischen und kenianischen Rosen mit langem Stiel und fester Knospe — M sind 25 Stiele, L sind 51, XL sind 101. Farbe sagen Sie mir im Bestellhinweis, sonst wähle ich nach Tagesqualität.',
      uk: 'Коли пояснення не потрібні. Працюю з еквадорськими та кенійськими трояндами з довгим стеблом і щільним бутоном — M це 25 стебел, L — 51, XL — 101. Колір вкажіть у примітці до замовлення, інакше обираю за якістю дня.',
      en: 'When it needs no explanation. I work with Ecuadorian and Kenyan roses, long stems and firm buds — M is 25 stems, L is 51, XL is 101. Tell me the colour in the order note, otherwise I pick by the day’s quality.',
      ru: 'Когда объяснения не нужны. Работаю с эквадорскими и кенийскими розами с длинным стеблем и плотным бутоном — M это 25 стеблей, L — 51, XL — 101. Цвет укажите в примечании, иначе выберу по качеству дня.',
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
    season: [5, 6, 7],
    priceOnRequest: true,
    presentations: ['bouquet', 'premium', 'box', 'vase'],
    images: ['/images/products/pfingstrosen-wolke.webp'],
    imagePlaceholder: true,
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
      de: 'Echte Pfingstrosen, keine Päonienrosen. Sie kommen halb geschlossen ins Haus und öffnen sich bei Ihnen über zwei bis drei Tage — das ist der schönste Teil. Ich binde sie fast pur, nur mit etwas Grün, damit die Köpfe Platz haben.',
      uk: 'Справжні півонії, не піоновидні троянди. Приходять напівзакритими й розкриваються у вас протягом двох-трьох днів — це найкраща частина. Збираю їх майже чистими, лише з трохи зелені, щоб голівки мали простір.',
      en: 'Real peonies, not peony roses. They arrive half closed and open at your place over two or three days — that is the best part. I tie them almost pure, with just enough greenery to give the heads room.',
      ru: 'Настоящие пионы, не пионовидные розы. Приходят полузакрытыми и раскрываются у вас за два-три дня — это лучшая часть. Собираю их почти чистыми, лишь с небольшим количеством зелени, чтобы головкам было место.',
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
    priceOnRequest: true,
    presentations: ['bouquet', 'premium', 'basket', 'vase'],
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
    slug: 'trocken-atelier',
    category: 'trocken',
    priceOnRequest: true,
    presentations: ['bouquet', 'premium', 'box', 'vase'],
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

/** Hat der Strauß eine Größenstaffel, oder gibt es ihn nur in einer Ausführung? */
export function hasSizes(bouquet: Bouquet): boolean {
  return bouquet.prices !== undefined;
}

/** Welche Größen dieser Strauß anbietet — leer bei Festpreis-Produkten. */
export function sizesOf(bouquet: Bouquet): SizeKey[] {
  return bouquet.prices ? SIZES.filter((size) => bouquet.prices![size] !== undefined) : [];
}

/** Grundpreis für eine Größe; bei Festpreis-Produkten immer derselbe Betrag. */
export function priceFor(bouquet: Bouquet, size?: SizeKey): Cents {
  if (bouquet.prices && size && bouquet.prices[size] !== undefined) return bouquet.prices[size];
  if (bouquet.price !== undefined) return bouquet.price;
  return lowestPrice(bouquet);
}

export function lowestPrice(bouquet: Bouquet): Cents {
  if (bouquet.prices) return Math.min(...Object.values(bouquet.prices));
  return bouquet.price ?? 0;
}

/**
 * Lässt sich dieser Strauß überhaupt an der Kasse bezahlen? Saisonbeispiele
 * haben keinen Preis — dort führt der Weg zum Kundenservice.
 */
export function isOrderable(bouquet: Bouquet): boolean {
  return !bouquet.priceOnRequest && (bouquet.prices !== undefined || bouquet.price !== undefined);
}

/** Fotos für eine Größe, mit Rückfall auf die allgemeinen Bilder. */
export function imagesFor(bouquet: Bouquet, size?: SizeKey): string[] {
  const bySize = size ? bouquet.imagesBySize?.[size] : undefined;
  return bySize?.length ? bySize : bouquet.images;
}

/** Preis einer konkreten Zusammenstellung — die einzige Stelle, an der gerechnet wird. */
export function calculateTotal(input: {
  bouquet: Bouquet;
  size?: SizeKey;
  presentation: PresentationKey;
  extras: string[];
  zoneId: string;
}): { subtotal: Cents; deliveryFee: Cents; total: Cents } {
  const base = priceFor(input.bouquet, input.size);
  const presentation = PRESENTATION_SURCHARGE[input.presentation] ?? 0;
  const extras = input.extras.reduce((sum, id) => sum + (EXTRAS.find((e) => e.id === id)?.price ?? 0), 0);
  const subtotal = base + presentation + extras;
  const deliveryFee = DELIVERY_ZONES.find((z) => z.id === input.zoneId)?.fee ?? 0;
  return { subtotal, deliveryFee, total: subtotal + deliveryFee };
}
