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

/**
 * Einstiegspreise der Staffel. Sie stehen hier und nicht nur am Dopamin-Strauß,
 * weil auch Weg A sie braucht: Dort wählt man Größe und Budget getrennt, und
 * ohne diese Zahlen ließe sich ein XL-Strauß für 85 € anfragen — ein Betrag,
 * für den es ihn nicht gibt. Was ein Strauß am Ende kostet, hängt an den
 * Blumen; günstiger als der Einstieg wird er in dieser Größe aber nie.
 */
export const SIZE_ENTRY_PRICES: Record<SizeKey, Cents> = {
  m: 8500,
  l: 15000,
  xl: 22000,
};

export type PresentationKey = 'bouquet' | 'premium' | 'basket' | 'box' | 'vase';

export interface Category {
  slug: string;
  name: I18nText;
  blurb: I18nText;
  /**
   * Bild in public/images/categories/. Ohne Angabe wird `<slug>.jpg` versucht
   * und bis dahin greift die Platzhalterkachel. Endung immer mitschreiben —
   * eine falsche lässt das Bild stillschweigend verschwinden.
   */
  image?: string;
  /** Vorläufige Aufnahme: blendet die sichtbare Platzhalter-Marke ein. */
  imagePlaceholder?: boolean;
  /** Es gibt noch gar kein Foto — siehe `imagePending` beim Strauß. */
  imagePending?: boolean;
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
  /**
   * Es gibt noch **gar kein** Foto — nicht zu verwechseln mit
   * `imagePlaceholder`, wo eines da ist, nur zu klein. Dann bleibt `images`
   * leer, es wird kein `<img>` erzeugt (sonst holte der Browser bei jedem
   * Aufruf eine 404), und auf der Kachel steht sichtbar „Bild folgt“.
   *
   * Absichtlich sichtbar statt still: Ein leerer Kasten sieht nach Fehler aus,
   * eine Marke nach Zusage. Und niemand vergisst, das Foto nachzuliefern.
   */
  imagePending?: boolean;
  featured?: boolean;
  /** Nur in bestimmten Monaten (1–12) verfügbar; leer = ganzjährig. */
  season?: number[];
}

/**
 * Aufpreis je Präsentationsform **und Größe**. Ein Korb für einen XL-Strauß
 * ist ein anderer Korb als für einen M-Strauß — ein Einheitsaufpreis war
 * darum falsch.
 *
 * `null` bedeutet: für diese Größe nicht im Angebot. Eine Vase zum XL-Strauß
 * ergibt keinen Sinn, und ein Gefäß zu versprechen, das es nicht gibt, ist
 * schlimmer als eine Option weniger.
 *
 * `fixed` gilt für Sträuße ohne Größenstaffel (101 Rosen, 35 Päonienrosen);
 * dort zählt die M-Staffel, weil es die einzige Ausführung ist.
 */
export const PRESENTATION_SURCHARGE: Record<
  PresentationKey,
  Record<SizeKey | 'fixed', Cents | null>
> = {
  bouquet: { m: 0, l: 1500, xl: 2000, fixed: 0 },
  premium: { m: 1500, l: 2500, xl: 3500, fixed: 1500 },
  basket: { m: 1500, l: 2000, xl: 3000, fixed: 1500 },
  // Am 13.08.2026 um je 10 € angehoben: Die Hutschachtel ist im Einkauf
  // teurer als der Korb und liegt jetzt durchgehend 10 € darüber, statt
  // sich seinen Preis zu teilen.
  box: { m: 2500, l: 3000, xl: 4000, fixed: 2500 },
  vase: { m: 2000, l: 4000, xl: null, fixed: 2000 },
};

/**
 * Beispielfoto je Präsentationsform, freigestellt wie die Produktbilder.
 *
 * Bisher standen die fünf Formen nur als Text da — „Hutschachtel, mit
 * Wasserquelle“ lässt jede sich etwas anderes vorstellen, und die Form kostet
 * bis zu 40 € Aufpreis. Ein Bild beantwortet das, ein Satz nicht.
 *
 * Wo nichts steht, bleibt die Kachel leer und trägt sichtbar „Bild folgt“;
 * wählbar ist die Form trotzdem. Nichts hier zu erfinden ist wichtiger als
 * eine vollständige Reihe: Wer eine Vase abgebildet sieht, die er dann nicht
 * bekommt, hat ein Versprechen bezahlt.
 */
export const PRESENTATION_IMAGE: Partial<Record<PresentationKey, string>> = {
  basket: '/images/presentations/korb.webp',
  box: '/images/presentations/hutschachtel.webp',
};

/**
 * Formen, deren Aufpreis ein **Ab-Preis** ist: Korb, Schachtel und Vase gibt
 * es in mehreren Ausführungen, das Gefäß wird vor der Lieferung abgestimmt.
 * Strauß und Designerverpackung haben dagegen einen festen Aufpreis.
 */
export const PRESENTATION_FROM: PresentationKey[] = ['basket', 'box', 'vase'];

/** Aufpreis für eine Form in einer Größe — `null`, wenn nicht angeboten. */
export function surchargeFor(
  presentation: PresentationKey,
  size: SizeKey | 'fixed',
): Cents | null {
  return PRESENTATION_SURCHARGE[presentation][size];
}

/** Nur die Formen, die es in dieser Größe wirklich gibt. */
export function presentationsFor(bouquet: Bouquet, size: SizeKey | 'fixed'): PresentationKey[] {
  return bouquet.presentations.filter((p) => surchargeFor(p, size) !== null);
}

/** Mindestbestellwert für Lieferung — steht so auch im Instagram-Profil. */
export const MIN_ORDER_DELIVERY: Cents = 8500;

export interface DeliveryZone {
  id: string;
  name: I18nText;
  fee: Cents;
  /** Beispielbezirke, als Hilfe bei der Auswahl. */
  hint: I18nText;
}

/**
 * A und B sind die VBB-Tarifbereiche vom BVG-Ticket.
 *
 * Die Grenze ist der S-Bahn-Ring, nicht die Bezirksgrenze — Neukölln,
 * Prenzlauer Berg, Schöneberg, Wedding und Alt-Treptow liegen teils in A,
 * teils in B, die Ringbahnhöfe noch in A. Deshalb nennen die Hinweise
 * Grenzbahnhöfe statt Bezirksnamen.
 *
 * Tarifbereich C ist kein Berliner Gebiet, sondern das Brandenburger Umland
 * mit Potsdam und BER; ganz Berlin ist AB. Lichtenberg liegt in B, steht hier
 * aber günstiger, weil das Atelier dort ist.
 */
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
      de: 'Nur nach Absprache — die Abholung wird separat gebucht, nicht hier',
      uk: 'Лише за домовленістю — самовивіз бронюють окремо, не тут',
      en: 'By arrangement only — pickup is booked separately, not here',
      ru: 'Только по договорённости — самовывоз бронируют отдельно, не здесь',
    },
  },
  {
    id: 'lichtenberg',
    fee: 1500,
    name: {
      de: 'Lichtenberg',
      uk: 'Ліхтенберг',
      en: 'Lichtenberg',
      ru: 'Лихтенберг',
    },
    hint: {
      de: 'Der Bezirk rund ums Atelier — liegt im Tarifbereich B, ist bei mir aber günstiger',
      uk: 'Район навколо ательє — це тарифна зона B, але в мене дешевше',
      en: 'The district around the atelier — fare zone B, but cheaper with me',
      ru: 'Район вокруг ателье — тарифная зона B, но у меня дешевле',
    },
  },
  {
    id: 'a',
    fee: 2000,
    name: {
      de: 'Berlin — Tarifbereich A',
      uk: 'Берлін — тарифна зона A',
      en: 'Berlin — fare zone A',
      ru: 'Берлин — тарифная зона A',
    },
    hint: {
      de: 'Innerhalb des S-Bahn-Rings: Mitte, Friedrichshain, Kreuzberg, Prenzlauer Berg bis Schönhauser Allee, Schöneberg bis Südkreuz, Nord-Neukölln bis Hermannstraße',
      uk: 'У межах кільця S-Bahn: Мітте, Фрідріхсхайн, Кройцберг, Пренцлауер-Берг до Шенгаузер-Алеє, Шенеберг до Зюдкройц, північний Нойкельн до Германштрасе',
      en: 'Inside the S-Bahn Ring: Mitte, Friedrichshain, Kreuzberg, Prenzlauer Berg up to Schönhauser Allee, Schöneberg up to Südkreuz, northern Neukölln up to Hermannstraße',
      ru: 'Внутри кольца S-Bahn: Митте, Фридрихсхайн, Кройцберг, Пренцлауэр-Берг до Шёнхаузер-Аллее, Шёнеберг до Зюдкройц, северный Нойкёльн до Германштрассе',
    },
  },
  {
    id: 'b',
    fee: 2500,
    name: {
      de: 'Berlin — Tarifbereich B',
      uk: 'Берлін — тарифна зона B',
      en: 'Berlin — fare zone B',
      ru: 'Берлин — тарифная зона B',
    },
    hint: {
      de: 'Außerhalb des Rings bis zur Stadtgrenze: Pankow, Spandau, Steglitz-Zehlendorf, Reinickendorf, Marzahn-Hellersdorf, Köpenick, Tempelhof — außer Lichtenberg, siehe oben zweite Zeile',
      uk: 'Поза кільцем до межі міста: Панков, Шпандау, Штегліц-Целендорф, Райнікендорф, Марцан-Гелерсдорф, Кьопенік, Темпельгоф — окрім Ліхтенберга, див. другий рядок вище',
      en: 'Outside the Ring up to the city boundary: Pankow, Spandau, Steglitz-Zehlendorf, Reinickendorf, Marzahn-Hellersdorf, Köpenick, Tempelhof — except Lichtenberg, see the second line above',
      ru: 'За кольцом до границы города: Панков, Шпандау, Штеглиц-Целендорф, Райниккендорф, Марцан-Хеллерсдорф, Кёпеник, Темпельхоф — кроме Лихтенберга, см. вторую строку выше',
    },
  },
];

export interface Extra {
  id: string;
  name: I18nText;
  price: Cents;
  /**
   * Der Betrag ist ein Ab-Preis. Bei der Vase hängt er am Gefäß, genau wie
   * bei der Präsentationsform „Mit Vase“ — ein Festbetrag daneben las sich
   * widersprüchlich.
   */
  from?: boolean;
}

export const EXTRAS: Extra[] = [
  {
    id: 'vase',
    price: 2200,
    from: true,
    name: {
      de: 'Schlichte Glasvase',
      uk: 'Проста скляна ваза',
      en: 'Plain glass vase',
      ru: 'Простая стеклянная ваза',
    },
  },
  {
    id: 'chocolate',
    price: 2000,
    name: {
      de: 'Ferrero Rocher 200 g oder Raffaello 150 g',
      uk: 'Ferrero Rocher 200 г або Raffaello 150 г',
      en: 'Ferrero Rocher 200 g or Raffaello 150 g',
      ru: 'Ferrero Rocher 200 г или Raffaello 150 г',
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
    image: '/images/categories/dopamin.webp',
    imagePlaceholder: true,
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
    image: '/images/categories/rosen.webp',
    imagePlaceholder: true,
    name: { de: 'Rosen', uk: 'Троянди', en: 'Roses', ru: 'Розы' },
    blurb: {
      de: 'Klassisch oder kreativ, Mono-Rosen oder ein Mix aus Sorten und Farben.',
      uk: 'Класика або креатив, моно-троянди чи мікс сортів і кольорів.',
      en: 'Classic or creative, mono roses or a mix of varieties and colours.',
      ru: 'Классика или креатив, моно-розы или микс сортов и цвета.',
    },
  },
  {
    slug: 'pfingstrosen',
    image: '/images/categories/pfingstrosen.webp',
    name: { de: 'Pfingstrosen', uk: 'Півонії', en: 'Peonies', ru: 'Пионы' },
    blurb: {
      de: 'Nur zur Saison — von Mai bis Anfang Juni.',
      uk: 'Тільки в сезон — з травня до початку червня.',
      en: 'Only in season — from May to early June.',
      ru: 'Только в сезон – с мая до начала июня.',
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
      de: 'Kein Schema, keine strenge Symmetrie — nur Farben, die einander ergänzen und den Wow-Effekt machen. Ich binde ihn jeden Morgen aus der frischen Lieferung. Zwei Dopamin-Sträuße sehen nie gleich aus — darin liegen ihr Reiz und ihr Sinn. Die Fotos zeigen jede Größe an einem echten Beispiel.',
      uk: 'Жодної схеми й суворої симетрії — лише кольори, що доповнюють одне одного і створюють вау-ефект. Збираю щоранку зі свіжої поставки. Два дофамінові букети ніколи не виглядають однаково — у цьому їхня чарівність і сенс. На фото кожен розмір букета показано на справжньому прикладі.',
      en: 'No scheme, no strict symmetry — only colours that complement each other and create the wow effect. I compose it every morning from the fresh delivery. No two dopamine bouquets ever look alike — that is their charm and their point. The photos show each size on a real example.',
      ru: 'Никакой схемы и строгой симметрии — только цвета, которые дополняют друг друга и создают вау-эффект. Собираю каждое утро из свежей поставки. Два дофаминовых букета никогда не выглядят одинаково — в этом их очарование и смысл. На фото каждый размер букета показан на настоящем примере.',
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
      de: 'Sie überlassen mir die Auswahl, und ich binde aus den frischesten Blumen, die am Bestelltag da sind. Genau deshalb ist er günstiger: Ich kann nach Qualität einkaufen statt nach Liste, und nichts bleibt liegen. Sie sagen mir nur die Stimmung — hell, dunkel, warm, kühl — und können vor der Lieferung ein Foto anfordern.',
      uk: 'Ви лишаєте вибір мені, а я збираю з найсвіжіших квітів, які є в день замовлення. Саме тому він дешевший: я купую за якістю, а не за списком, і нічого не залишається. Ви кажете лише настрій — світлий, темний, теплий, холодний — і можете попросити фото перед доставкою.',
      en: 'You leave the choice to me, and I tie the bouquet from the freshest flowers available on the day of your order. That is exactly why it costs less: I can buy by quality rather than by list, and nothing goes to waste. You only tell me the mood — light, dark, warm, cool — and can ask for a photo before delivery.',
      ru: 'Вы оставляете выбор мне, а я собираю из самых свежих цветов, которые есть в день заказа. Именно поэтому он дешевле: я покупаю по качеству, а не по списку, и ничего не остаётся. Вы говорите только настроение — светлое, тёмное, тёплое, холодное — и можете запросить фото перед доставкой.',
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
      de: 'Gefüllte Gartenrosen, die aussehen wie Pfingstrosen — aber das ganze Jahr verfügbar.',
      uk: 'Густомахрові садові троянди, схожі на півонії — але доступні цілий рік.',
      en: 'Full garden roses that look like peonies — but available all year round.',
      ru: 'Густомахровые садовые розы, похожие на пионы — но доступные круглый год.',
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
    slug: 'pfingstrosen-wolke',
    category: 'pfingstrosen',
    season: [5, 6],
    priceOnRequest: true,
    presentations: ['bouquet', 'premium', 'box', 'vase'],
    images: ['/images/products/pfingstrosen-wolke.webp'],
    name: {
      de: 'Pfingstrosen',
      uk: 'Півонії',
      en: 'Peonies',
      ru: 'Пионы',
    },
    blurb: {
      de: 'Von Mai bis Juni verfügbar, Bestand klären wir vor der Bestellung.',
      uk: 'Доступні з травня до червня, наявність уточнюємо перед замовленням.',
      en: 'Available from May to June; we check availability before you order.',
      ru: 'Доступны с мая по июнь, наличие уточнять перед заказом.',
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
  const presentation = surchargeFor(input.presentation, input.size ?? 'fixed') ?? 0;
  const extras = input.extras.reduce((sum, id) => sum + (EXTRAS.find((e) => e.id === id)?.price ?? 0), 0);
  const subtotal = base + presentation + extras;
  const deliveryFee = DELIVERY_ZONES.find((z) => z.id === input.zoneId)?.fee ?? 0;
  return { subtotal, deliveryFee, total: subtotal + deliveryFee };
}
