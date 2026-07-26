# KURAZHBLUM Berlin

Website und Shop für das Floristik-Atelier KURAZHBLUM in Berlin — Sträuße mit
Konfigurator, Hochzeits- und Event-Anfragen, Workshops mit Platzbuchung.

Gebaut mit [Astro](https://astro.build) und TypeScript. Vier Sprachen:
Deutsch (Hauptsprache), Ukrainisch, Englisch, Russisch.

---

## Loslegen

```bash
npm install
cp .env.example .env   # Schlüssel eintragen, siehe unten
npm run dev
```

Die Website läuft dann auf <http://localhost:4321>. Ohne Schlüssel in `.env`
funktioniert alles außer Kasse und Formularversand — beide antworten dann
sauber mit einem Fehler statt still zu scheitern.

| Befehl            | Wirkung                                        |
| :---------------- | :--------------------------------------------- |
| `npm run dev`     | Entwicklungsserver auf Port 4321                |
| `npm run build`   | Produktions-Build nach `./dist/`                |
| `npm run preview` | Build lokal ansehen                             |
| `npx astro check` | TypeScript- und Astro-Prüfung                   |

---

## Was noch fehlt, bevor die Website online geht

In dieser Reihenfolge:

1. **Bilder.** Alle Produkt-, Kategorie- und Atelierbilder sind derzeit
   Platzhalter (dunkle Kacheln mit dem Namen darin). Siehe „Bilder pflegen“.
2. **Stammdaten.** In `src/data/site.ts` stehen überall `TODO`: echter Name der
   Inhaberin, Adresse, Telefonnummer, E-Mail, Umsatzsteuer-Status.
3. **Rechtstexte.** `src/pages/[lang]/impressum.astro`, `datenschutz.astro`,
   `agb.astro` und `widerruf.astro` sind Entwürfe mit sichtbar markierten
   Lücken. Sie müssen einmal anwaltlich geprüft werden — ein fehlerhaftes
   Impressum oder eine falsche Widerrufsbelehrung sind in Deutschland
   abmahnfähig.
4. **Preise und Sortiment.** `src/data/shop.ts` — die Preise orientieren sich an
   den Preisstufen aus dem Instagram-Profil (85–100 € / 100–150 € / 200–250 €),
   sind aber nicht bestätigt.
5. **Workshop-Termine.** `src/data/workshops.ts` enthält Beispieltermine.
6. **Die persönliche Geschichte** auf der Atelier-Seite. Die Absätze dort
   beschreiben bewusst nur die Arbeitsweise — der eigene Werdegang muss von
   Gala selbst kommen.
7. **Domain** in `astro.config.mjs` (`site`) und `src/data/site.ts` eintragen.

---

## Aufbau

```
src/
├── i18n/
│   ├── config.ts      Sprachen, Pfad-Helfer, I18nText-Typ
│   └── ui.ts          Alle Oberflächentexte in vier Sprachen
├── data/
│   ├── site.ts        Stammdaten, Öffnungszeiten, Lieferzeitfenster
│   ├── shop.ts        Kategorien, Sträuße, Preise, Liefergebiete, Extras
│   ├── workshops.ts   Kursformate und Termine
│   └── instagram.ts   Verweise auf die lokalen Instagram-Bilder
├── layouts/           BaseLayout (Meta, hreflang, JSON-LD), LegalLayout
├── components/        Header, Footer, ProductCard, Configurator, InquiryForm …
├── pages/
│   ├── index.astro    Weiterleitung auf die Browsersprache
│   ├── 404.astro
│   ├── api/           checkout.ts, inquiry.ts (serverseitig)
│   └── [lang]/        Alle Seiten, einmal pro Sprache generiert
└── styles/global.css  Designsystem — Farben, Typografie, Komponenten
```

### Sprachen

Die Sprache steckt im ersten Pfadsegment: `/de/shop/`, `/uk/shop/` …
Die URL-Segmente selbst sind bewusst in allen Sprachen gleich, damit ein
Sprachwechsel immer auf derselben Seite landet.

Oberflächentexte stehen in `src/i18n/ui.ts`. Ein neuer Schlüssel muss in allen
vier Sprachen ergänzt werden — der Typ `UiKey` erzwingt das beim Build.
Produkttexte liegen bei den Produkten selbst als `I18nText`-Objekt.

Fehlt eine Übersetzung, fällt der Text automatisch auf Deutsch zurück, statt
leer zu bleiben.

### Preise

Alle Beträge sind **Cent-Ganzzahlen**. Nie mit Fließkomma rechnen. Formatiert
wird ausschließlich über `formatPrice()` aus `src/data/shop.ts`.

Der Konfigurator rechnet im Browser nur für die Anzeige. Verbindlich ist allein
die Berechnung in `src/pages/api/checkout.ts` — sonst ließe sich der Preis im
Formular manipulieren. Wer die Preislogik ändert, muss beide Stellen ansehen.

---

## Bilder pflegen

Instagram-Bilder lassen sich nicht direkt einbinden: das CDN blockt fremde
Domains und die Bild-URLs laufen nach kurzer Zeit ab. Die Bilder müssen deshalb
lokal liegen.

**Ablauf:**

1. Bild aus dem Instagram-Beitrag exportieren (bei Reels das Cover)
2. Auf 1600 px kürzeste Kante skalieren, als `.jpg` mit Qualität ~82 speichern
3. In den passenden Ordner unter `public/images/` legen:

   | Ordner                     | Wofür                                   | Dateiname                       |
   | :------------------------- | :-------------------------------------- | :------------------------------ |
   | `public/images/products/`  | Produktfotos                             | `<produkt-slug>.jpg`            |
   | `public/images/categories/`| Kategoriekacheln                         | `<kategorie-slug>.jpg`          |
   | `public/images/instagram/` | Feed auf Start- und Atelierseite         | `01.jpg`, `02.jpg` …            |
   | `public/images/workshops/` | Kursformate, Teaser                      | `basics.jpg`, `teaser.jpg` …    |
   | `public/images/weddings/`  | Hochzeitsseite                           | `hero.jpg`, `teaser.jpg`        |
   | `public/images/atelier/`   | Porträt                                  | `portrait.jpg`                  |

4. Für Instagram-Bilder zusätzlich einen Eintrag in `src/data/instagram.ts`
   ergänzen (Permalink und Alternativtext in vier Sprachen)

Solange eine Datei fehlt, zeigt die Website eine dunkle Platzhalterkachel mit
dem Namen darin — nichts bricht, es sieht nur unfertig aus.

Die Logodateien in `public/brand/` sind bereits fertig aufbereitet
(freigestellt, mit Alphakanal): `wordmark.png`, `monogram.png`, `iris.webp`,
`iris-sm.webp`, `lockup.jpg` (für Vorschaubilder beim Teilen).

---

## Zahlungen und Formulare

### Stripe (Kasse)

`src/pages/api/checkout.ts` erstellt eine Stripe-Checkout-Session und leitet
dorthin weiter. Bezahlt wird nie auf dieser Website — Kartendaten sieht nur
Stripe.

Was zu tun ist:

1. Konto auf <https://stripe.com> anlegen, Geschäftsdaten verifizieren
2. Testschlüssel (`sk_test_…`) in `.env` als `STRIPE_SECRET_KEY` eintragen
3. Eine Testbestellung durchklicken (Testkarte `4242 4242 4242 4242`)
4. Zum Livegang auf den Live-Schlüssel wechseln

Die Bestelldetails — Größe, Präsentation, Grußkartentext, Wunschtermin,
Liefergebiet — landen als `metadata` an der Stripe-Session und sind im
Stripe-Dashboard bei jeder Zahlung sichtbar.

**Noch offen:** ein Webhook, der bei erfolgreicher Zahlung eine
Bestätigungsmail mit allen Details verschickt. Bis dahin steht alles im
Dashboard, muss aber dort abgelesen werden.

### Resend (Anfragen)

`src/pages/api/inquiry.ts` verschickt Anfragen aus den Formularen per E-Mail.
Konto auf <https://resend.com>, Absenderdomain verifizieren, Schlüssel als
`RESEND_API_KEY` eintragen.

Gegen Spam läuft ein Honeypot-Feld mit: Bots füllen es aus, ihre Anfrage wird
verworfen, sie bekommen trotzdem eine Erfolgsmeldung.

---

## Veröffentlichen

Die Website wird statisch gebaut; nur die beiden API-Routen laufen
serverseitig. Konfiguriert ist der Node-Adapter, damit sie überall läuft:

```bash
npm run build
node ./dist/server/entry.mjs
```

Domain und Basispfad kommen aus der Umgebung, damit dieselbe Codebasis an
mehreren Orten läuft:

| Variable | Beispiel                    | Wirkung                                  |
| :------- | :-------------------------- | :--------------------------------------- |
| `SITE`   | `https://kurazhblum.de`     | Domain für canonical, hreflang, Sitemap   |
| `BASE`   | `/kurazhblum`               | Unterverzeichnis; leer lassen für Wurzel  |

Interne Links müssen deshalb über `path()` und Dateien aus `public/` über
`asset()` gebaut werden (beides in `src/i18n/config.ts`). Ein hart
geschriebenes `"/brand/logo.png"` bricht, sobald `BASE` gesetzt ist.

### GitHub Pages

`.github/workflows/pages.yml` baut bei jedem Push auf `main` und
veröffentlicht nach <https://raimurokko.github.io/kurazhblum/>.

**Einmalig nötig:** Repository → Settings → Pages → „Build and deployment“ →
Source auf **GitHub Actions** stellen. Das lässt sich nicht automatisieren —
der `enablement`-Schalter von `actions/configure-pages` verlangt einen
persönlichen Zugriffstoken, das eingebaute `GITHUB_TOKEN` genügt nicht.

⚠️ **Pages liefert nur statische Dateien.** Die Routen `/api/checkout` und
`/api/inquiry` gibt es dort nicht. Der Shop ist vollständig benutzbar — bis
zum Klick auf „Zur Kasse“ oder „Anfrage senden“; dann erscheint statt einer
Weiterleitung die Fehlermeldung mit E-Mail-Adresse und Telefonnummer. Für
Pages ist das als Schaufenster in Ordnung, für den Verkauf nicht.

### Netlify oder Vercel (für den echten Betrieb)

Dort laufen auch die Serverfunktionen:

```bash
npx astro add netlify   # oder: npx astro add vercel
```

Der Befehl tauscht den Adapter in `astro.config.mjs` selbst aus. Die Variablen
aus `.env` müssen dann in der Oberfläche des Anbieters hinterlegt werden.
`BASE` bleibt bei diesen Anbietern leer.

---

## Barrierefreiheit

Umgesetzt nach dem Mindeststandard der Novum Analytica
(`BARRIEREFREIHEIT-STANDARD.md` im Projekt novumanalytica.com, Teil A).
Zielniveau ist WCAG 2.1 AA.

**Das Panel** liegt hinter dem runden Knopf mit dem Rollstuhl-Symbol am rechten
Bildschirmrand (`src/components/A11yPanel.astro`). Es bietet Textgröße bis
150 %, Hochkontrast, Graustufen, eine farbfehlsichtigkeits-sichere Palette,
Dyslexie-Modus mit lokal gehostetem OpenDyslexic, Link-Hervorhebung,
„Animationen reduzieren“ und Vorlesen per Klick über die Sprachausgabe des
Geräts.

Der Zustand liegt in `localStorage` unter `kb-a11y` — nie in Cookies. Ein
Inline-Skript im `<head>` (BaseLayout) wendet ihn vor dem ersten Paint an,
sonst blitzt beim Laden kurz die Standarddarstellung auf.

**„Zum Seitenanfang“** (`src/components/ScrollTop.astro`) sitzt unten rechts
und erscheint erst, wenn mehr als eine Bildschirmhöhe gescrollt wurde. Auf
schmalen Geräten rutscht das Barrierefreiheits-Menü in dieselbe Ecke — beide
teilen sich die Maße `--fab-size`, `--fab-inset` und `--fab-gap` aus
`global.css` und stapeln sich dann übereinander. Der Knopf setzt nach dem
Sprung den Fokus auf `#main`, damit auch die Tastatur oben ankommt.

**Die Erklärung** steht in allen vier Sprachen unter `/[lang]/barrierefreiheit/`;
der Inhalt liegt in `src/data/accessibility.ts`. Wird die Website verändert,
gehören `LAST_REVIEW` und der Abschnitt „Bekannte Lücken“ mitgepflegt.

### Worauf beim Ändern zu achten ist

Zwei Fallen, die beim Bauen aufgefallen sind und leicht wieder zuschlagen:

- **`rem` in `clamp()`-Minimalwerten.** Setzt jemand die Textgröße auf 150 %,
  wächst `rem` mit — eine Überschrift mit `clamp(2.6rem, …)` steht dann auch
  auf einem 320-px-Gerät bei 62 px und kann nicht mehr umbrechen. Deshalb sind
  alle großen Schriftgrade zusätzlich mit `min(…, Nvw)` gedeckelt, und die
  Seitenränder sind in px/vw statt rem angegeben.
- **Media Queries rechnen mit der ursprünglichen Schriftgröße**, nicht mit der
  hochgesetzten. Die Kopfzeile kann deshalb nicht per Breakpoint umbauen — sie
  reagiert auf die Klassen `a11y-size-1/2/3` am `<html>`.
- **`behavior: 'smooth'` in `scrollTo()` schlägt die CSS-Regel
  `scroll-behavior`.** Wer irgendwo animiert scrollt, muss
  `prefers-reduced-motion` und die Klasse `a11y-motion` selbst abfragen —
  sonst läuft die Animation trotz abgeschalteter Animationen.

Nach Layoutänderungen einmal gegenprüfen: 320 px Breite, Textgröße 150 %,
Dyslexie-Modus an — die Seite darf nicht seitlich scrollen (WCAG 1.4.10).
Kurztest in der Browserkonsole:

```js
document.documentElement.scrollWidth === document.documentElement.clientWidth
```

## Maschinenlesbare Dateien

| Datei                       | Erzeugt in                     | Zweck                                       |
| :-------------------------- | :----------------------------- | :------------------------------------------ |
| `/sitemap-index.xml`        | `@astrojs/sitemap`             | Alle Seiten, mit hreflang je Sprache         |
| `/robots.txt`               | `src/pages/robots.txt.ts`      | Crawler-Regeln, verweist auf die Sitemap     |
| `/llms.txt`                 | `src/pages/llms.txt.ts`        | Zusammenfassung für Sprachmodelle            |
| `/humans.txt`               | `public/humans.txt`            | Wer die Website gebaut hat                   |
| `/.well-known/security.txt` | `public/.well-known/`          | Sicherheitskontakt nach RFC 9116             |

`robots.txt` und `llms.txt` werden beim Build aus den echten Daten erzeugt —
ein neues Produkt taucht dort automatisch auf. Die beiden statischen Dateien
enthalten TODO-Markierungen (Kontaktadresse, Domain, `Expires`-Datum).

## Datenschutz

Bewusste Entscheidungen, die beim Ändern nicht verloren gehen sollten:

- **Schriften werden selbst gehostet.** Astro lädt Cormorant Garamond und Inter
  beim Build herunter und liefert sie vom eigenen Server aus. Keine Verbindung
  zu Google Fonts — das ist in Deutschland ein realer Abmahngrund.
- **Kein Tracking, keine Analyse-Cookies, keine Social-Media-Pixel.** Deshalb
  braucht die Website auch kein Cookie-Banner.
- **Instagram-Bilder liegen lokal.** Es entsteht keine Verbindung zu Meta,
  solange niemand einen Link anklickt.

Wer eine dieser Entscheidungen zurücknimmt, muss die Datenschutzerklärung
anpassen — und bei Analyse-Werkzeugen ein Einwilligungsbanner ergänzen.
