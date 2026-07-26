import type { I18nText } from '../i18n/config';

/**
 * Inhalt der Erklärung zur Barrierefreiheit.
 *
 * Aufbau nach dem Muster der Novum Analytica (BARRIEREFREIHEIT-STANDARD.md,
 * Teil A.1): Anspruch, Stand der Vereinbarkeit, umgesetzte Maßnahmen, bekannte
 * Lücken, Rückmeldung, Durchsetzungsverfahren.
 *
 * Wird die Website verändert, muss diese Erklärung mitgepflegt werden —
 * insbesondere `LAST_REVIEW` und der Abschnitt „Bekannte Lücken“.
 */

/** Datum der letzten Selbstbewertung. Bei jeder wesentlichen Änderung anheben. */
export const LAST_REVIEW = '2026-07-27';

export const REVIEW_DATE_TEXT: I18nText = {
  de: '27. Juli 2026',
  uk: '27 липня 2026 року',
  en: '27 July 2026',
  ru: '27 июля 2026 года',
};

export interface StatementSection {
  heading: I18nText;
  /** Absätze vor der Liste. */
  paragraphs?: I18nText[];
  /** Aufzählung; darf HTML-frei bleiben. */
  items?: I18nText[];
  /** Absätze nach der Liste. */
  after?: I18nText[];
}

export const STATEMENT: StatementSection[] = [
  {
    heading: {
      de: 'Unser Anspruch',
      uk: 'Наша мета',
      en: 'What we aim for',
      ru: 'Наша цель',
    },
    paragraphs: [
      {
        de: 'Blumen sind für alle da. Diese Website soll deshalb von allen benutzbar sein — unabhängig von Sehvermögen, Motorik, Lesefähigkeit oder technischer Ausstattung. Als Maßstab nehmen wir die Web Content Accessibility Guidelines (WCAG) 2.1 in der Konformitätsstufe AA sowie die europäische Norm EN 301 549.',
        uk: 'Квіти — для всіх. Тому цей сайт має бути доступним кожному — незалежно від зору, моторики, навичок читання чи технічного обладнання. За орієнтир ми беремо Web Content Accessibility Guidelines (WCAG) 2.1 рівня AA та європейський стандарт EN 301 549.',
        en: 'Flowers are for everyone. This website should therefore be usable by everyone — regardless of eyesight, motor ability, reading skills or technical equipment. We take the Web Content Accessibility Guidelines (WCAG) 2.1 at conformance level AA and the European standard EN 301 549 as our benchmark.',
        ru: 'Цветы — для всех. Поэтому этот сайт должен быть доступен каждому — независимо от зрения, моторики, навыков чтения или технического оснащения. За ориентир мы берём Web Content Accessibility Guidelines (WCAG) 2.1 уровня AA и европейский стандарт EN 301 549.',
      },
      {
        de: 'Als Kleinstunternehmen im Sinne des Barrierefreiheitsstärkungsgesetzes (BFSG) sind wir zu alldem rechtlich nicht verpflichtet. Wir halten uns trotzdem daran, weil eine Website, die man nicht bedienen kann, ihren Zweck verfehlt.',
        uk: 'Як мікропідприємство в розумінні німецького закону про посилення доступності (BFSG) ми юридично до цього не зобовʼязані. Ми все одно це робимо, бо сайт, яким неможливо користуватися, не виконує свого призначення.',
        en: 'As a micro-enterprise under the German Accessibility Reinforcement Act (BFSG), none of this is legally required of us. We do it anyway, because a website nobody can operate misses its purpose.',
        ru: 'Как микропредприятие в смысле немецкого закона об усилении доступности (BFSG) мы юридически к этому не обязаны. Мы всё равно это делаем, потому что сайт, которым невозможно пользоваться, не выполняет своего назначения.',
      },
    ],
  },
  {
    heading: {
      de: 'Stand der Vereinbarkeit',
      uk: 'Стан відповідності',
      en: 'State of conformance',
      ru: 'Состояние соответствия',
    },
    paragraphs: [
      {
        de: 'Diese Website ist mit den genannten Anforderungen teilweise vereinbar. Grundlage ist eine Selbstbewertung; eine formale Prüfung durch eine unabhängige Stelle hat nicht stattgefunden. Die Erklärung wird nach jeder wesentlichen Überarbeitung der Website aktualisiert.',
        uk: 'Цей сайт частково відповідає зазначеним вимогам. Підставою є самооцінка; формальної перевірки незалежною установою не було. Декларація оновлюється після кожної суттєвої переробки сайту.',
        en: 'This website is partially conformant with the requirements above. The basis is a self-assessment; no formal audit by an independent body has taken place. This statement is updated after every substantial revision of the site.',
        ru: 'Этот сайт частично соответствует указанным требованиям. Основанием является самооценка; формальной проверки независимой организацией не проводилось. Декларация обновляется после каждой существенной переработки сайта.',
      },
    ],
  },
  {
    heading: {
      de: 'Was umgesetzt ist',
      uk: 'Що вже зроблено',
      en: 'What is in place',
      ru: 'Что уже сделано',
    },
    items: [
      {
        de: 'Ein Barrierefreiheits-Menü hinter dem runden Knopf mit dem Rollstuhl-Symbol am rechten Bildschirmrand. Alle Einstellungen darin bleiben auf diesem Gerät gespeichert und werden beim nächsten Besuch sofort wieder angewendet.',
        uk: 'Меню доступності за круглою кнопкою зі знаком візка біля правого краю екрана. Усі налаштування зберігаються на цьому пристрої та застосовуються одразу під час наступного відвідування.',
        en: 'An accessibility menu behind the round wheelchair button at the right edge of the screen. Every setting there stays on this device and is applied again immediately on your next visit.',
        ru: 'Меню доступности за круглой кнопкой со знаком коляски у правого края экрана. Все настройки сохраняются на этом устройстве и применяются сразу при следующем посещении.',
      },
      {
        de: 'Textgröße bis 150 Prozent, ohne dass Inhalte oder Bedienelemente verloren gehen.',
        uk: 'Розмір тексту до 150 відсотків без втрати вмісту чи елементів керування.',
        en: 'Text size up to 150 per cent, without losing content or controls.',
        ru: 'Размер текста до 150 процентов без потери содержимого или элементов управления.',
      },
      {
        de: 'Hochkontrast-Modus, Graustufen und eine farbfehlsichtigkeits-sichere Palette. Informationen werden nie allein über Farbe vermittelt.',
        uk: 'Режим високого контрасту, відтінки сірого та палітра, безпечна для дальтонізму. Інформація ніколи не передається лише кольором.',
        en: 'A high-contrast mode, greyscale, and a colour-blind safe palette. Information is never conveyed by colour alone.',
        ru: 'Режим высокого контраста, оттенки серого и палитра, безопасная для дальтонизма. Информация никогда не передаётся только цветом.',
      },
      {
        de: 'Dyslexie-freundliche Darstellung mit der eigens dafür entwickelten Schriftart OpenDyslexic (lokal eingebunden, SIL Open Font License) und großzügigeren Abständen.',
        uk: 'Режим для дислексії зі спеціально розробленим шрифтом OpenDyslexic (розміщений локально, ліцензія SIL Open Font License) та збільшеними відстанями.',
        en: 'A dyslexia-friendly display using the purpose-built OpenDyslexic typeface (served locally, SIL Open Font License) and more generous spacing.',
        ru: 'Режим для дислексии со специально разработанным шрифтом OpenDyslexic (размещён локально, лицензия SIL Open Font License) и увеличенными интервалами.',
      },
      {
        de: 'Vorlesefunktion: Ist sie aktiv, wird ein Textabschnitt vorgelesen, sobald Sie ihn anklicken. Genutzt wird die Sprachausgabe Ihres Geräts — es werden keine Daten an fremde Dienste geschickt.',
        uk: 'Озвучення: коли увімкнено, фрагмент тексту зачитується після кліку. Використовується синтез мовлення вашого пристрою — жодні дані не надсилаються стороннім сервісам.',
        en: 'Read-aloud: when active, clicking a passage reads it out. It uses your own device speech output — no data is sent to third-party services.',
        ru: 'Озвучивание: когда включено, фрагмент текста зачитывается по клику. Используется синтез речи вашего устройства — никакие данные не отправляются сторонним сервисам.',
      },
      {
        de: 'Option „Animationen reduzieren“; zusätzlich wird die Systemeinstellung prefers-reduced-motion automatisch respektiert. Nichts blinkt, nichts startet von selbst.',
        uk: 'Опція «Зменшити анімацію»; окрім того, автоматично враховується системне налаштування prefers-reduced-motion. Ніщо не блимає й не запускається саме.',
        en: 'A “reduce motion” option; on top of that, the system setting prefers-reduced-motion is respected automatically. Nothing blinks, nothing starts on its own.',
        ru: 'Опция «Уменьшить анимацию»; кроме того, автоматически учитывается системная настройка prefers-reduced-motion. Ничто не мигает и не запускается само.',
      },
      {
        de: 'Vollständige Tastaturbedienung mit sichtbarem Fokus und einem Sprunglink zum Inhalt als erstem Element. Die Esc-Taste schließt geöffnete Bereiche.',
        uk: 'Повне керування з клавіатури з видимим фокусом і посиланням переходу до вмісту як першим елементом. Клавіша Esc закриває відкриті блоки.',
        en: 'Full keyboard operation with a visible focus indicator and a skip link to the content as the first element. Esc closes anything that is open.',
        ru: 'Полное управление с клавиатуры с видимым фокусом и ссылкой перехода к содержимому в качестве первого элемента. Клавиша Esc закрывает открытые блоки.',
      },
      {
        de: 'Semantisches HTML mit Landmarken, beschrifteten Bedienelementen und einer sauberen Überschriftenhierarchie; Zustände von Schaltern werden Screenreadern mitgeteilt.',
        uk: 'Семантичний HTML з орієнтирами, підписаними елементами керування та чіткою ієрархією заголовків; стани перемикачів передаються програмам читання з екрана.',
        en: 'Semantic HTML with landmarks, labelled controls and a clean heading hierarchy; the state of switches is communicated to screen readers.',
        ru: 'Семантический HTML с ориентирами, подписанными элементами управления и чёткой иерархией заголовков; состояния переключателей передаются программам чтения с экрана.',
      },
      {
        de: 'Alle Textfarben erreichen mindestens das WCAG-AA-Kontrastverhältnis von 4,5:1; im Hochkontrast-Modus liegt der Fließtext bei 21:1 und erfüllt damit auch AAA.',
        uk: 'Усі кольори тексту досягають щонайменше співвідношення контрасту WCAG AA 4,5:1; у режимі високого контрасту основний текст має 21:1, що відповідає й рівню AAA.',
        en: 'All text colours reach at least the WCAG AA contrast ratio of 4.5:1; in high-contrast mode body text sits at 21:1, which also satisfies AAA.',
        ru: 'Все цвета текста достигают минимум контраста WCAG AA 4,5:1; в режиме высокого контраста основной текст имеет 21:1, что соответствует и уровню AAA.',
      },
      {
        de: 'Die Website setzt keine Cookies, lädt nichts von fremden Servern und verfolgt niemanden. Schriften und Skripte liegen auf unserem eigenen Server. Deshalb gibt es hier auch kein Cookie-Banner, das erst weggeklickt werden muss.',
        uk: 'Сайт не встановлює файлів cookie, нічого не завантажує зі сторонніх серверів і нікого не відстежує. Шрифти та скрипти розміщені на нашому власному сервері. Тому тут немає й банера про cookie, який доводиться закривати.',
        en: 'The site sets no cookies, loads nothing from third-party servers and tracks nobody. Fonts and scripts live on our own server. That is also why there is no cookie banner to click away first.',
        ru: 'Сайт не устанавливает файлы cookie, ничего не загружает со сторонних серверов и никого не отслеживает. Шрифты и скрипты размещены на нашем собственном сервере. Поэтому здесь нет и баннера о cookie, который приходится закрывать.',
      },
      {
        de: 'Die Website gibt es auf Deutsch, Ukrainisch, Englisch und Russisch. Die Sprache lässt sich auf jeder Seite oben rechts wechseln, ohne dass Sie die Seite verlassen.',
        uk: 'Сайт доступний німецькою, українською, англійською та російською. Мову можна змінити на кожній сторінці вгорі праворуч, не залишаючи цієї сторінки.',
        en: 'The site is available in German, Ukrainian, English and Russian. You can switch language at the top right of every page without leaving the page you are on.',
        ru: 'Сайт доступен на немецком, украинском, английском и русском. Язык можно переключить в правом верхнем углу каждой страницы, не покидая её.',
      },
    ],
  },
  {
    heading: {
      de: 'Bekannte Lücken',
      uk: 'Відомі прогалини',
      en: 'Known gaps',
      ru: 'Известные пробелы',
    },
    items: [
      {
        de: 'Eine formale WCAG-Prüfung durch eine unabhängige Stelle steht aus. Ebenso Tests mit Menschen, die Screenreader oder alternative Eingabegeräte benutzen. Einzelne Bedienprobleme können deshalb unentdeckt sein.',
        uk: 'Формальної перевірки WCAG незалежною установою ще не було. Так само як і тестів із людьми, які користуються програмами читання з екрана чи альтернативними пристроями введення. Тому окремі проблеми можуть залишатися невиявленими.',
        en: 'A formal WCAG audit by an independent body is still outstanding, as are tests with people who use screen readers or alternative input devices. Individual problems may therefore remain undetected.',
        ru: 'Формальной проверки WCAG независимой организацией пока не было, как и тестов с людьми, использующими программы чтения с экрана или альтернативные устройства ввода. Поэтому отдельные проблемы могут оставаться необнаруженными.',
      },
      {
        de: 'Die Vorlesefunktion nutzt die Sprachausgabe Ihres Geräts. Stimmenqualität und verfügbare Sprachen hängen deshalb vom Gerät ab; auf manchen Systemen fehlt eine ukrainische Stimme ganz.',
        uk: 'Функція озвучення використовує синтез мовлення вашого пристрою. Тому якість голосу та доступні мови залежать від пристрою; на деяких системах українського голосу немає взагалі.',
        en: 'Read-aloud uses your device’s speech output. Voice quality and available languages therefore depend on the device; on some systems a Ukrainian voice is missing entirely.',
        ru: 'Функция озвучивания использует синтез речи вашего устройства. Поэтому качество голоса и доступные языки зависят от устройства; на некоторых системах украинского голоса нет вовсе.',
      },
      {
        de: 'Die Bezahlung läuft über die Seiten des Zahlungsdienstleisters Stripe. Auf deren Barrierefreiheit haben wir keinen Einfluss. Wenn die Bezahlseite für Sie nicht bedienbar ist, schreiben Sie uns — wir nehmen die Bestellung dann per E-Mail oder telefonisch auf und schicken eine Rechnung.',
        uk: 'Оплата відбувається на сторінках платіжного сервісу Stripe. На їхню доступність ми не впливаємо. Якщо сторінка оплати для вас незручна, напишіть нам — ми приймемо замовлення поштою чи телефоном і виставимо рахунок.',
        en: 'Payment runs through the pages of our payment provider Stripe. We have no influence on their accessibility. If the payment page does not work for you, write to us — we will take the order by email or phone and send an invoice instead.',
        ru: 'Оплата проходит на страницах платёжного сервиса Stripe. На их доступность мы не влияем. Если страница оплаты вам неудобна, напишите нам — мы примем заказ по почте или телефону и выставим счёт.',
      },
      {
        de: 'Die Rechtstexte — Impressum, Datenschutz, AGB und Widerrufsbelehrung — liegen nur auf Deutsch vor, weil in Deutschland ohnehin die deutsche Fassung verbindlich ist. Wenn Ihnen etwas darin unklar ist, erklären wir es Ihnen gern in Ihrer Sprache.',
        uk: 'Юридичні тексти — вихідні дані, конфіденційність, умови та право на відмову — доступні лише німецькою, оскільки в Німеччині обовʼязковою є саме німецька редакція. Якщо щось незрозуміло, ми охоче пояснимо вашою мовою.',
        en: 'The legal texts — imprint, privacy, terms and right of withdrawal — exist in German only, because in Germany the German version is the binding one anyway. If anything in them is unclear, we are happy to explain it in your language.',
        ru: 'Юридические тексты — выходные данные, конфиденциальность, условия и право на отказ — доступны только на немецком, поскольку в Германии обязательной является именно немецкая редакция. Если что-то непонятно, мы с радостью объясним на вашем языке.',
      },
    ],
  },
  {
    heading: {
      de: 'Ist Ihnen eine Barriere aufgefallen?',
      uk: 'Помітили перешкоду?',
      en: 'Did you run into a barrier?',
      ru: 'Заметили преграду?',
    },
    paragraphs: [
      {
        de: 'Dann schreiben Sie uns bitte — auch wenn es Ihnen kleinlich vorkommt. Wir antworten in der Regel innerhalb von zwei Wochen und sagen Ihnen ehrlich, ob und wann wir es beheben können. Wenn Sie Inhalte dieser Website in einem anderen Format brauchen, bekommen Sie sie.',
        uk: 'Тоді, будь ласка, напишіть нам — навіть якщо це здається дрібницею. Зазвичай ми відповідаємо протягом двох тижнів і чесно кажемо, чи та коли зможемо це виправити. Якщо вам потрібен вміст цього сайту в іншому форматі, ви його отримаєте.',
        en: 'Then please write to us — even if it feels like a small thing. We usually reply within two weeks and will tell you honestly whether and when we can fix it. If you need content from this site in another format, you will get it.',
        ru: 'Тогда, пожалуйста, напишите нам — даже если это кажется мелочью. Обычно мы отвечаем в течение двух недель и честно скажем, сможем ли и когда это исправить. Если вам нужно содержимое этого сайта в другом формате, вы его получите.',
      },
    ],
  },
  {
    heading: {
      de: 'Durchsetzungsverfahren',
      uk: 'Процедура оскарження',
      en: 'Enforcement procedure',
      ru: 'Процедура обжалования',
    },
    paragraphs: [
      {
        de: 'Sollten Sie auf eine Mitteilung an uns keine zufriedenstellende Antwort erhalten, können Sie sich an die Marktüberwachungsstelle der Länder für die Barrierefreiheit von Produkten und Dienstleistungen (MLBF) wenden.',
        uk: 'Якщо ви не отримаєте задовільної відповіді на своє звернення, ви можете звернутися до наглядового органу федеральних земель з питань доступності продуктів і послуг (MLBF).',
        en: 'If you do not receive a satisfactory reply to a message sent to us, you may contact the German market surveillance authority for the accessibility of products and services (MLBF).',
        ru: 'Если вы не получите удовлетворительного ответа на своё обращение, вы можете обратиться в надзорный орган федеральных земель по вопросам доступности продуктов и услуг (MLBF).',
      },
    ],
  },
];
