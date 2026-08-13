# Projektübergabe — KURAZHBLUM Berlin

Mehrsprachige Website mit Blumenshop für ein Floristik-Atelier in Berlin. Vier
Sprachen, Strauß-Konfigurator mit Stripe-Kasse, Anfragestrecken für
Veranstaltungen, Workshops mit Platzbuchung.

Dieses Dokument sagt, was steht, was fehlt und **warum** die Dinge so gebaut
sind, wie sie sind. Technische Einzelheiten stehen in `README.md`, die Regeln
fürs Weiterarbeiten in `AGENTS.md`.

| | |
| :--- | :--- |
| Stand | Commit `64720bf` |
| Repository | <https://github.com/raimurokko/kurazhblum> |
| Vorschau | <https://raimurokko.github.io/kurazhblum/> |
| Umfang | 113 Seiten, 4 Sprachen, 8 Sträuße, 956 Textschlüssel, 50 Quelldateien |

---

## 1. Wo das Projekt steht

Die Website ist technisch vollständig und läuft. Was fehlt, sind Inhalte, die
nur von der Inhaberin kommen können, und zwei Zugänge. Nichts davon ist
Entwicklungsarbeit.

| Bereich | Stand | Anmerkung |
| :--- | :--- | :--- |
| Gerüst, Design, vier Sprachen | fertig | 956 Textschlüssel, Rückfall auf Deutsch bei Lücken |
| Shop, Konfigurator, drei Bestellwege | fertig | Preis wird serverseitig verbindlich nachgerechnet |
| Barrierefreiheit | fertig | Panel, Erklärung, geprüft bei 320 px und 150 % |
| Veröffentlichung auf GitHub Pages | fertig | Baut bei jedem Push automatisch |
| Produktfotos | teilweise | 4 Sträuße bebildert, 3 Fotos vorläufig, Rest Platzhalter |
| Preise | teilweise | 4 bestätigt, 4 bewusst ohne Preis als Saisonbeispiele |
| Stammdaten & WhatsApp-Nummer | **offen** | Platzhalter in `src/data/site.ts` |
| Stripe- und Resend-Zugang | **offen** | Ohne Schlüssel keine Kasse, kein Formularversand |
| Rechtstexte | **ungeprüft** | Entwürfe mit sichtbaren Lücken, anwaltlich prüfen lassen |

---

## 2. Vor dem Livegang

In dieser Reihenfolge. Die ersten drei blockieren den Verkauf.

1. **Stammdaten eintragen** — blockierend.
   `src/data/site.ts` enthält vierzehn `TODO`-Stellen: vollständiger Name der
   Inhaberin, Adresse, Telefon, E-Mail, Umsatzsteuerstatus und die
   WhatsApp-Nummer. Letztere ist der wichtigste Knopf auf mehreren Seiten — ohne
   sie läuft der Weg „Strauß zusammenstellen“ ins Leere.

2. **Rechtstexte prüfen lassen** — blockierend.
   Impressum, Datenschutz, AGB und Widerrufsbelehrung sind durchdachte
   Entwürfe, aber ungeprüft. Besonders die Widerrufsbelehrung: frei gebundene
   Sträuße, Standardware, Trockenblumen und Workshops fallen unter vier
   verschiedene gesetzliche Regeln.

3. **Hosting mit Serverfunktionen wählen** — blockierend.
   GitHub Pages liefert nur statische Dateien. Kasse und Anfrageformulare
   brauchen Netlify oder Vercel. Dazu Stripe- und Resend-Konten anlegen.

4. **Preise freigeben.** Bestätigt sind nur Dopamin-Berlin, die 101 Rosen und
   die 35 Päonienrosen. Offen sind die Aufpreise für Verpackung und Extras.

5. **Fotos ersetzen.** Drei Aufnahmen sind sichtbar als „Platzhalter“ markiert
   (nur 1125 px breit). Kategoriekacheln, Atelierporträt und Instagram-Feed
   fehlen ganz.

6. **Galas Geschichte schreiben.** Die Atelier-Seite beschreibt bewusst nur die
   Arbeitsweise. Der eigene Werdegang wurde nicht erfunden.

7. **Domain eintragen** in `astro.config.mjs` (`site`) und `src/data/site.ts`.
   Davon hängen canonical, hreflang, Sitemap und `robots.txt` ab.

8. **Workshop-Termine pflegen** in `src/data/workshops.ts`. Vergangene Daten
   verschwinden automatisch.

---

## 3. Schnellstart

```bash
git clone git@github.com:raimurokko/kurazhblum.git
cd kurazhblum
npm install
cp .env.example .env     # Schlüssel eintragen — optional
npm run dev              # http://localhost:4321
```

Ohne Schlüssel läuft alles außer Kasse und Formularversand. Beide antworten mit
einem klaren Fehler und zeigen der Kundschaft E-Mail und Telefonnummer, statt
still zu scheitern.

| Befehl | Wirkung |
| :--- | :--- |
| `npm run dev` | Entwicklungsserver auf Port 4321 |
| `npm run build` | Produktions-Build nach `dist/` |
| `npx astro check` | TypeScript- und Astro-Prüfung — muss 0 Fehler zeigen |

---

## 4. Aufbau

Astro 7 mit TypeScript. Statisch gebaut; nur zwei API-Routen laufen
serverseitig. Keine Datenbank — alle Inhalte liegen als typisierte
TypeScript-Objekte im Repository.

```
src/
├── i18n/
│   ├── config.ts      Sprachen, path()/asset()-Helfer, I18nText-Typ
│   └── ui.ts          956 Oberflächentexte in vier Sprachen
├── data/
│   ├── site.ts        Stammdaten, Öffnungszeiten, Lieferzeitfenster
│   ├── shop.ts        Kategorien, Sträuße, Preise, Liefergebiete
│   ├── flowers.ts     Auswahlliste für Weg A — keine Bestandsliste
│   ├── workshops.ts   Kursformate und Termine
│   └── instagram.ts   Verweise auf lokal liegende Instagram-Bilder
├── layouts/           BaseLayout (Meta, hreflang, JSON-LD), LegalLayout
├── components/        Header, Footer, Configurator, OrderWays,
│                      ContactChannels, A11yPanel, ScrollTop …
├── pages/
│   ├── index.astro    Weiterleitung auf die Browsersprache
│   ├── api/           checkout.ts, inquiry.ts — serverseitig
│   └── [lang]/        Alle Seiten, einmal je Sprache erzeugt
└── styles/
    ├── global.css     Designsystem: Farben, Typografie, Bausteine
    └── a11y.css       Barrierefreiheits-Panel und Darstellungsmodi
```

**Vier Sprachen.** Die Sprache steckt im ersten Pfadsegment (`/de/shop/`,
`/uk/shop/`). Die Segmente sind in allen Sprachen gleich, damit ein
Sprachwechsel auf derselben Seite landet. Ein neuer Textschlüssel muss in allen
vier Sprachen vorliegen — der Typ `UiKey` erzwingt das beim Build.

**Preise** sind immer Cent-Ganzzahlen, Ausgabe nur über `formatPrice()`. Der
Preis wird zweimal berechnet: im Browser für die Anzeige und noch einmal in
`src/pages/api/checkout.ts`. Verbindlich ist allein der Serverwert — sonst
ließe sich der Preis im Formular manipulieren.

---

## 5. Die drei Bestellwege

| Weg | Was passiert | Endet in |
| :--- | :--- | :--- |
| **A** Strauß zusammenstellen | Blumen, Farbstimmung, Größe, Budget wählen | vorbereiteter Nachricht — *nicht* in der Kasse |
| **B** Fertigen Strauß wählen | Katalog, Konfigurator | Stripe-Kasse |
| **C** Überraschungsstrauß | Floristin wählt, 10 % günstiger | Stripe-Kasse |

**Warum Weg A keine Kasse hat:** Gala hat kein Lager. Was heute frisch ist,
entscheidet der Markt am Morgen — ein Warenkorb würde Blumen zusagen, die sie
nicht halten kann. Die Seite baut aus der Auswahl eine fertige Nachricht, die
die Kundin selbst per WhatsApp oder E-Mail abschickt: ohne Server, ohne
Einwilligungskästchen, und sie funktioniert auch auf GitHub Pages.

> **Nicht rückgängig machen.** Aus Weg A einen Warenkorb zu machen wäre
> technisch leicht und geschäftlich falsch. Ebenso der Rabatt bei Weg C: Er
> steht bewusst als Begründung da, nicht als durchgestrichener Preis. Ein
> dauerhafter Nachlass *ist* der Preis, und ein nie verlangter Streichpreis ist
> in Deutschland abmahnbar.

---

## 6. Sortiment & Preise

Galas Staffel heißt **M/L/XL** — kein S. Ihr M ist mit 85 € der Einstieg und
liegt genau auf dem Mindestbestellwert für Lieferung.

| Strauß | Kategorie | Preis | Stand |
| :--- | :--- | :--- | :--- |
| Dopamin-Berlin | Dopamin-Sträuße | 85 / 150 / 220 € | bestätigt |
| Überraschungsstrauß | Dopamin-Sträuße | 85 / 135 / 198 € | abgeleitet |
| 101 Rosen mit Herz | Rosen | 400 € | bestätigt |
| 35 Päonienrosen, 60 cm | Rosen | 180 € | bestätigt |
| Rosen pur | Rosen | je nach Saison | Saisonbeispiel |
| Pfingstrosen-Wolke | Pfingstrosen | je nach Saison | Saisonbeispiel |
| Hortensie solo | Hortensien | je nach Saison | Saisonbeispiel |
| Trocken, Atelier | Trockenblumen | je nach Saison | Saisonbeispiel |

Drei Modelle im Datentyp, genau eines der ersten beiden setzen:

- **`prices`** — Größenstaffel für M, L und XL. Der Konfigurator zeigt die
  Größenwahl.
- **`price`** — Festpreis, keine Größenwahl. Die 101 Rosen und die Päonienrosen
  gibt es nur in einer Ausführung.
- **`priceOnRequest`** — Saisonbeispiel. Kein Betrag, kein Konfigurator, keine
  Kasse; die API weist solche Produkte auch bei nachgebautem Aufruf mit `422`
  ab. Der Weg führt zum Kundenservice.

Gekapselt in `hasSizes()`, `sizesOf()`, `priceFor()` und `isOrderable()`.

> **Fachlicher Hinweis.** Päonienrosen sind *keine* Pfingstrosen. Es sind stark
> gefüllte Gartenrosen, die deren Form nachbilden. Sie stehen deshalb unter
> „Rosen“. Sie zu vertauschen ist ein Fehler, den jede Floristin sofort sieht.

---

## 7. Bilder

Produktfotos werden **freigestellt** und einheitlich in eine 4:5-Fläche gesetzt.
Auf dem schwarzen Grund schwebt der Strauß dann wie die Iris im Logo — und die
sehr verschiedenen Hintergründe der Originalaufnahmen fallen nicht mehr ins
Gewicht.

Das Freistellen läuft **lokal über Apples Vision-Framework**; es geht kein Bild
an einen Cloud-Dienst. Skripte in `tools/fotos/`, Ablauf in deren README.

```bash
sips -s format jpeg IMG_1234.HEIC --out arbeit/strauss.jpg
swift tools/fotos/freistellen.swift arbeit/strauss.jpg arbeit/frei.png
python3 tools/fotos/aufbereiten.py arbeit/frei.png \
  public/images/products/mein-strauss.webp 1200
```

**Instagram-Bilder** lassen sich nicht direkt einbinden: Das CDN blockt fremde
Domains und die Adressen laufen ab. Exportieren, lokal ablegen, Eintrag in
`src/data/instagram.ts`.

**Drei Platzhalter** tragen eine sichtbare Markierung (1125 px): Brautstrauß,
Pfingstrosen-Wolke, Workshop-Teaser. Der Brautstrauß steht an zwei Stellen —
auf der Veranstaltungsseite und als Teaser auf der Startseite —, weil es
bislang nur diese eine Hochzeitsaufnahme gibt. Bei Produkten hängt die
Markierung am Feld `imagePlaceholder`.

> **Endungen prüfen.** Die Fotoskripte schreiben `.webp`; frühere Zwischenstufen
> waren `.png`. Zeigt eine Referenz auf die falsche Endung, verschwindet das
> Bild **stillschweigend** — `onerror="this.remove()"` lässt die Platzhalter-
> kachel zurück, ohne Fehler in der Konsole. Nach jedem neuen Foto abgleichen,
> dass die Referenz zur Datei in `public/images/` passt.

**Immer WebP.** Dieselben drei Bilder wogen als PNG 3,4 MB und als WebP 412 KB.

---

## 8. Barrierefreiheit

Nach dem Mindeststandard der Novum Analytica, Zielniveau WCAG 2.1 AA. Panel
hinter dem Rollstuhl-Knopf am rechten Bildschirmrand:

- Textgröße bis 150 %, Hochkontrast, Graustufen, farbsichere Palette
- Dyslexie-Modus mit lokal gehostetem OpenDyslexic
- Link-Hervorhebung, „Animationen reduzieren“, Vorlesen per Klick
- Zustand in `localStorage`, angewendet vor dem ersten Paint
- Erklärung zur Barrierefreiheit in allen vier Sprachen

> **Nach jeder Layoutänderung prüfen:** 320 px Breite, Textgröße 150 %,
> Dyslexie-Modus an — die Seite darf nicht seitlich scrollen.
> `document.documentElement.scrollWidth === document.documentElement.clientWidth`

---

## 9. Recht & Datenschutz

> **Ungeprüft.** Impressum, Datenschutz, AGB und Widerrufsbelehrung sind
> Entwürfe mit sichtbaren Markierungen an den Stellen, wo Angaben fehlen. Diese
> Markierungen nicht ohne Rücksprache entfernen.

Die Rechtstexte stehen nur auf Deutsch. Verbindlich ist ohnehin die deutsche
Fassung; eine ungeprüfte Übersetzung würde mehr Risiko schaffen als Nutzen. In
den anderen Sprachen steht ein Hinweis darauf.

Bewusste Entscheidungen, die beim Ändern nicht verloren gehen sollten:

- **Schriften liegen im Repository**, nicht bei Google. Keine Verbindung zu
  Google Fonts — in Deutschland ein realer Abmahngrund. Seit August 2026 auch
  nicht mehr beim Bauen: Der frühere Abruf von fonts.gstatic.com brach den
  Build, als Google eine Datei-URL drehte.
- **Kein Tracking, keine Analyse-Cookies, keine Pixel.** Deshalb braucht die
  Website auch kein Cookie-Banner.
- **Instagram-Bilder liegen lokal.** Keine Verbindung zu Meta, solange niemand
  einen Link anklickt.

---

## 10. Veröffentlichen

Domain und Basispfad kommen aus `SITE` und `BASE`, damit dieselbe Codebasis an
mehreren Orten läuft.

**Heute: GitHub Pages.** `.github/workflows/pages.yml` baut bei jedem Push auf
`main`. Pages liefert nur statische Dateien — `/api/checkout` und
`/api/inquiry` gibt es dort nicht. Der Shop ist vollständig benutzbar bis zum
Klick auf „Zur Kasse“; dann erscheint die Fehlermeldung mit Kontaktdaten. Als
Schaufenster in Ordnung, zum Verkaufen nicht.

**Für den Betrieb: Netlify oder Vercel.**

```bash
npx astro add netlify     # oder: npx astro add vercel
```

Der Befehl tauscht den Adapter selbst aus. `BASE` bleibt dort leer, die
Variablen aus `.env` werden beim Anbieter hinterlegt. Azure wurde ebenfalls
gerechnet: Static Web Apps kostet 0 € im Free-Tier bzw. rund 8,50 € mit SLA —
dafür müssten die beiden API-Routen als Azure Functions neu geschrieben werden.

`robots.txt` und `llms.txt` werden beim Build aus den echten Produktdaten
erzeugt. Dazu `security.txt` (RFC 9116), `humans.txt` und eine Sitemap mit
hreflang je Sprache.

---

## 11. Fallstricke

Dinge, die während der Entwicklung schiefgingen und wieder zuschlagen werden,
wenn niemand sie kennt.

- **`rem` in `clamp()`-Minimalwerten.** Bei 150 % Textgröße wächst `rem` mit;
  eine Überschrift mit `clamp(2.6rem, …)` stand auch auf 320 px bei 62 px und
  konnte nicht umbrechen. Alle großen Schriftgrade sind deshalb zusätzlich mit
  `min(…, Nvw)` gedeckelt, Seitenränder in px/vw.
- **Media Queries kennen die eingestellte Textgröße nicht.** Sie rechnen mit der
  ursprünglichen. Die Kopfzeile reagiert deshalb auf `a11y-size-1/2/3` am
  `<html>` statt auf einen Breakpoint.
- **`minmax(min(14rem, 100%), 1fr)` ohne feste Containerbreite.** Dann lässt
  sich `100%` nicht auflösen und der rem-Wert gewinnt. px verwenden und dem
  äußeren Grid-Kind `min-width: 0` geben.
- **`behavior: 'smooth'` schlägt die CSS-Regel** `scroll-behavior`. Wer animiert
  scrollt, muss `prefers-reduced-motion` und `a11y-motion` selbst abfragen.
- **`display: none` lässt sich nicht animieren.** Ein-/Ausblender laufen über
  `visibility` — das nimmt unsichtbare Knöpfe zusätzlich aus der Tab-Reihenfolge.
- **`URLSearchParams` in `mailto:`** kodiert Leerzeichen als `+`, das dort ein
  Pluszeichen bleibt. `encodeURIComponent` verwenden.
- **Astros `base` kommt ohne Schrägstrich.** Aus `/kurazhblum` +
  `brand/iris.webp` wurde `/kurazhblumbrand/iris.webp`. Der Schrägstrich wird in
  `src/i18n/config.ts` erzwungen — interne Links deshalb immer über `path()`,
  Dateien über `asset()`.
- **Öffnungszeiten stehen an zwei Stellen** in `src/data/site.ts`: `site.hours`
  für die Anzeige auf der Kontaktseite und `ERSTE_STUNDE`/`LETZTE_STUNDE`/
  `SUNDAY_LAST_START` für die Lieferfenster im Konfigurator. Sie wissen nichts
  voneinander. Wer nur eine ändert, verkauft ein Fenster, zu dem niemand
  ausfährt — oder verschweigt eines, das es gäbe.
- **Jekyll frisst `_astro`.** Ohne `.nojekyll` verschluckt GitHub Pages jeden
  Ordner mit führendem Unterstrich — also CSS, JavaScript und Schriften.

---

## 12. Offene Fragen an Gala

- WhatsApp-Nummer im internationalen Format
- Vollständiger Name, Anschrift, Telefon, E-Mail, Umsatzsteuerstatus
- Aufpreise für Verpackung und Extras: gelten die eingesetzten Werte?
- Ihre eigene Geschichte für die Atelier-Seite
- Höher aufgelöste Fotos für die drei markierten Platzhalter
- Kategoriekacheln, Atelierporträt, Instagram-Auswahl
- Echte Workshop-Termine und Preise
