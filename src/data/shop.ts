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
  /**
   * Markiert den Überraschungsstrauß. Hieß früher `discountPercent` und trug
   * die Zahl 10 — der Nachlass wird seit dem 14.08.2026 nicht mehr beworben:
   * Er steckt bereits in der Preisstaffel, und „zehn Prozent günstiger“ ohne
   * genannten Vergleichspreis warf mehr Fragen auf, als es beantwortete.
   */
  surprise?: boolean;

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
   * Es gibt noch **gar kein** Foto. Dann bleibt `images` leer, es wird kein
   * `<img>` erzeugt (sonst holte der Browser bei jedem Aufruf eine 404), und
   * auf der Kachel steht sichtbar „Bild folgt“.
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
  {
    slug: 'hortensien',
    image: '/images/categories/hortensien.webp',
    name: { de: 'Hortensien', uk: 'Гортензії', en: 'Hydrangeas', ru: 'Гортензии' },
    blurb: {
      de: 'Große Hortensienköpfe im Mono-Strauß oder im Mix. Saisonblume — Verfügbarkeit klären wir vorher.',
      uk: 'Великі голівки гортензії в моно-букеті або в міксі. Сезонна квітка — наявність уточнюємо заздалегідь.',
      en: 'Big hydrangea heads in a mono bouquet or in a mix. A seasonal flower — we check availability in advance.',
      ru: 'Большие шапочки гортензии в моно-букете или в микс букетах. Сезонный цветок, наличие уточняется заранее.',
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
    surprise: true,
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
      de: 'Ich wähle, Sie lassen sich überraschen.',
      uk: 'Обираю я — а ви дозволяєте себе здивувати.',
      en: 'I choose, you let yourself be surprised.',
      ru: 'Выбираю я — а вы позволяете себя удивить.',
    },
    description: {
      de: 'Sie überlassen mir die Auswahl, und ich binde aus den frischesten Blumen, die am Bestelltag da sind. Ich kaufe nach Qualität ein statt nach Liste — was an diesem Morgen am schönsten ist, kommt hinein. Sie sagen mir nur die Stimmung — hell, dunkel, warm, kühl — und können vor der Lieferung ein Foto anfordern.',
      uk: 'Ви лишаєте вибір мені, а я збираю з найсвіжіших квітів, які є в день замовлення. Я купую за якістю, а не за списком — усередину потрапляє те, що того ранку найгарніше. Ви кажете лише настрій — світлий, темний, теплий, холодний — і можете попросити фото перед доставкою.',
      en: 'You leave the choice to me, and I tie the bouquet from the freshest flowers available on the day of your order. I buy by quality rather than by list — whatever is at its best that morning goes in. You only tell me the mood — light, dark, warm, cool — and can ask for a photo before delivery.',
      ru: 'Вы оставляете выбор мне, а я собираю из самых свежих цветов, которые есть в день заказа. Я покупаю по качеству, а не по списку — внутрь попадает то, что в это утро красивее всего. Вы говорите только настроение — светлое, тёмное, тёплое, холодное — и можете запросить фото перед доставкой.',
    },
    composition: {
      de: 'Wechselnd nach Markt und Jahreszeit — die Auswahl liegt bei der Floristin',
      uk: 'Змінюється залежно від ринку та сезону — вибір за флористкою',
      en: 'Changes with the market and the season — the florist chooses',
      ru: 'Меняется в зависимости от рынка и сезона — выбор за флористкой',
    },
  },
  {
    /*
      ⚠️ TODO: Entwurf vom 14.08.2026. Name, Beschreibung und Zusammensetzung
      beschreiben, was auf dem Foto zu sehen ist — sie stammen nicht von Gala.
      Vor dem Livegang bestätigen oder ersetzen lassen. Bewusst ohne Preis:
      Als Saisonbeispiel führt der Weg zum Kundenservice, damit hier nichts
      zugesagt wird, was nicht abgestimmt ist.
    */
    slug: 'hutschachtel-blumen',
    category: 'dopamin',
    priceOnRequest: true,
    presentations: ['box'],
    images: ['/images/products/hutschachtel-blumen.webp'],
    name: {
      de: 'Blumen in der Hutschachtel',
      uk: 'Квіти у капелюшній коробці',
      en: 'Flowers in a hat box',
      ru: 'Цветы в шляпной коробке',
    },
    blurb: {
      de: 'Gemischt gesteckt, mit eigener Wasserquelle.',
      uk: 'Змішана композиція з власним джерелом води.',
      en: 'A mixed arrangement with its own water source.',
      ru: 'Смешанная композиция с собственным источником воды.',
    },
    description: {
      de: 'Die Schachtel bringt ihr Wasser mit: Die Blumen stecken in einer Quelle, es muss nichts umgestellt und nichts angeschnitten werden. Welche Sorten hineinkommen, entscheidet der Markt am Morgen — sagen Sie mir die Farbstimmung, den Rest stelle ich zusammen.',
      uk: 'Коробка приносить воду із собою: квіти стоять у джерелі, нічого не треба перекладати чи підрізати. Які саме сорти туди потраплять, вирішує ранковий ринок — скажіть мені колірний настрій, решту я складу.',
      en: 'The box brings its own water: the flowers sit in a source, nothing needs to be moved or trimmed. Which varieties go in is decided by the morning market — tell me the colour mood and I will put the rest together.',
      ru: 'Коробка приносит воду с собой: цветы стоят в источнике, ничего не нужно перекладывать или подрезать. Какие именно сорта туда попадут, решает утренний рынок — скажите мне цветовое настроение, остальное я соберу.',
    },
    composition: {
      de: 'Gemischt nach Saison, gesteckt mit Wasserquelle',
      uk: 'Змішано за сезоном, з джерелом води',
      en: 'Mixed by season, arranged with a water source',
      ru: 'Смешанный состав по сезону, с источником воды',
    },
  },
  {
    /*
      ⚠️ TODO: Entwurf vom 14.08.2026. Name, Beschreibung und Zusammensetzung
      beschreiben, was auf dem Foto zu sehen ist — sie stammen nicht von Gala.
      Vor dem Livegang bestätigen oder ersetzen lassen. Bewusst ohne Preis:
      Als Saisonbeispiel führt der Weg zum Kundenservice, damit hier nichts
      zugesagt wird, was nicht abgestimmt ist.
      Auch die Kategorie ist zu prüfen: „Dopamin“ heißt „bunt, frei
      komponiert“ — dieses Gesteck ist frei komponiert, aber alles andere als
      bunt.
    */
    slug: 'callas-anthurium',
    category: 'dopamin',
    priceOnRequest: true,
    presentations: ['basket'],
    images: ['/images/products/callas-anthurium.webp'],
    name: {
      de: 'Dunkle Callas mit Anthurium',
      uk: 'Темні кали з антуріумом',
      en: 'Dark callas with anthurium',
      ru: 'Тёмные каллы с антуриумом',
    },
    blurb: {
      de: 'Grafisch und ruhig — wenn bunt zu laut ist.',
      uk: 'Графічно і спокійно — коли строкате занадто гучне.',
      en: 'Graphic and quiet — for when colourful is too loud.',
      ru: 'Графично и спокойно — когда пёстрое слишком громкое.',
    },
    description: {
      de: 'Dunkle Callas, grünes Anthurium und weiße Freesien in einem flachen Gefäß. Kein Strauß zum Mitnehmen, sondern ein Gesteck, das stehen bleibt, wo es hingestellt wird. Die Sorten wechseln mit dem Angebot.',
      uk: 'Темні кали, зелений антуріум і білі фрезії у пласкій посудині. Це не букет із собою, а композиція, яка залишається там, куди її поставили. Сорти змінюються залежно від пропозиції.',
      en: 'Dark callas, green anthurium and white freesias in a shallow vessel. Not a bouquet to carry home but an arrangement that stays where it is put. The varieties change with what is available.',
      ru: 'Тёмные каллы, зелёный антуриум и белые фрезии в плоской ёмкости. Это не букет с собой, а композиция, которая остаётся там, куда её поставили. Сорта меняются в зависимости от предложения.',
    },
    composition: {
      de: 'Callas, Anthurium, Freesien, Wasserquelle im Gefäß',
      uk: 'Кали, антуріум, фрезії, джерело води в посудині',
      en: 'Callas, anthurium, freesias, water source in the vessel',
      ru: 'Каллы, антуриум, фрезии, источник воды в ёмкости',
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
    slug: 'rosen-pur',
    category: 'rosen',
    priceOnRequest: true,
    presentations: ['bouquet', 'premium', 'box', 'vase'],
    images: [],
    imagePending: true,
    name: { de: 'Rosen pur', uk: 'Тільки троянди', en: 'Roses only', ru: 'Только розы' },
    blurb: {
      de: 'Eine Sorte, eine Farbe — zeitlose Klassik, nichts Überflüssiges.',
      uk: 'Один сорт, один колір — вічна класика і нічого зайвого.',
      en: 'One variety, one colour — timeless classic, nothing superfluous.',
      ru: 'Один сорт, один цвет – вечная классика и ничего лишнего.',
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
  {
    slug: 'hortensie-solo',
    category: 'hortensien',
    priceOnRequest: true,
    presentations: ['bouquet', 'premium', 'basket', 'vase'],
    /*
      ⚠️ TODO: Foto fehlt. Aus dem Laufwerk passt keine Aufnahme — die einzige
      Hortensie dort ist blau und mit Callas gemischt; sie steht deshalb als
      eigener Eintrag „Hortensie & Calla“ daneben. Hier gebraucht wird eine
      reine Hortensie in Weiß, Salbei oder Altrosa.
    */
    images: [],
    imagePending: true,
    name: {
      de: 'Mono-Hortensie',
      uk: 'Моно-гортензія',
      en: 'Mono hydrangea',
      ru: 'Моно гортензия',
    },
    blurb: {
      de: 'Dichte Köpfe, die unglaublich viel hermachen.',
      uk: 'Густі голівки, що справляють неймовірне враження.',
      en: 'Dense heads that make an incredible impression.',
      ru: 'Густые шапочки, производящие невероятное впечатление.',
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
    /*
      ⚠️ TODO: Entwurf vom 14.08.2026. Name, Beschreibung und Zusammensetzung
      beschreiben, was auf dem Foto zu sehen ist — sie stammen nicht von Gala.
      Vor dem Livegang bestätigen oder ersetzen lassen. Bewusst ohne Preis:
      Als Saisonbeispiel führt der Weg zum Kundenservice, damit hier nichts
      zugesagt wird, was nicht abgestimmt ist.
    */
    slug: 'hortensie-calla',
    category: 'hortensien',
    priceOnRequest: true,
    presentations: ['bouquet', 'premium', 'basket', 'vase'],
    images: ['/images/products/hortensie-calla.webp'],
    name: {
      de: 'Hortensie & Calla',
      uk: 'Гортензія та кала',
      en: 'Hydrangea & calla',
      ru: 'Гортензия и калла',
    },
    blurb: {
      de: 'Blaue Hortensie, weiße Callas, etwas Rittersporn.',
      uk: 'Блакитна гортензія, білі кали, трохи дельфінію.',
      en: 'Blue hydrangea, white callas, a little delphinium.',
      ru: 'Голубая гортензия, белые каллы, немного дельфиниума.',
    },
    description: {
      de: 'Die Hortensie gibt das Volumen, die Callas die Linie. Hortensien wollen sofort ins Wasser — die Pflegekarte liegt bei. Farben und Sorten richten sich nach der Saison.',
      uk: 'Гортензія дає обʼєм, кали — лінію. Гортензії потрібно одразу поставити у воду; картка догляду додається. Кольори й сорти залежать від сезону.',
      en: 'The hydrangea gives the volume, the callas the line. Hydrangeas need water straight away — a care card is included. Colours and varieties depend on the season.',
      ru: 'Гортензия даёт объём, каллы — линию. Гортензии нужно сразу поставить в воду; карточка ухода прилагается. Цвета и сорта зависят от сезона.',
    },
    composition: {
      de: 'Hortensien, Callas, Rittersporn, Eukalyptus',
      uk: 'Гортензії, кали, дельфіній, евкаліпт',
      en: 'Hydrangeas, callas, delphinium, eucalyptus',
      ru: 'Гортензии, каллы, дельфиниум, эвкалипт',
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
