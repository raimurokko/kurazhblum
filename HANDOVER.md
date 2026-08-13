# Projektübergabe — KURAZHBLUM Berlin

Mehrsprachige Website mit Blumenshop für ein Floristik-Atelier in Berlin. Vier
Sprachen, Strauß-Konfigurator mit Stripe-Kasse, Anfragestrecken für
Veranstaltungen, Workshops mit Platzbuchung.

Dieses Dokument sagt, was steht, was fehlt und **warum** die Dinge so gebaut
sind, wie sie sind. Technische Einzelheiten stehen in `README.md`, die Regeln
fürs Weiterarbeiten in `AGENTS.md`.

| | |
| :--- | :--- |
| Stand | Commit `55820c2`, 13.08.2026 |
| Repository | <https://github.com/raimurokko/kurazhblum> |
| Vorschau | <https://raimurokko.github.io/kurazhblum/> |
| Umfang | 118 Seiten, 4 Sprachen, 10 Sträuße, 293 Textschlüssel je Sprache, 48 Quelldateien |

---

## 1. Wo das Projekt steht

Die Website ist technisch vollständig und läuft. Was fehlt, sind Inhalte, die
nur von der Inhaberin kommen können, und zwei Zugänge. Nichts davon ist
Entwicklungsarbeit.

| Bereich | Stand | Anmerkung |
| :--- | :--- | :--- |
| Gerüst, Design, vier Sprachen | fertig | Rückfall auf Deutsch bei Lücken, `UiKey` erzwingt Vollständigkeit |
| Shop, Konfigurator, drei Bestellwege | fertig | Preis wird serverseitig verbindlich nachgerechnet |
| Lieferzonen, -fenster und Adressprüfung | fertig | VBB-Tarifbereiche, Stundenfenster, Postleitzahl gegen Berlin geprüft |
| Anfrage- und Bestellstrecken | fertig | Ohne Server: WhatsApp, Instagram, E-Mail tragen die Angaben mit |
| Stammdaten, WhatsApp, Impressum | fertig | Halyna Zharuk, Storkower Straße, § 19 UStG |
| Barrierefreiheit | fertig | Panel, Erklärung, geprüft bei 320 px und 150 % |
| Veröffentlichung auf GitHub Pages | fertig | Baut bei jedem Push automatisch |
| Produktfotos | teilweise | 8 von 10 Sträußen und alle 4 Kategorien bebildert; die zwei ohne Foto tragen „Bild folgt“ |
| Preise | teilweise | Größen, Verpackung, Zonen und Fenster bestätigt; eine Lücke siehe § 12 |
| Stripe-Zugang | **offen** | Ohne Schlüssel keine Kasse — der Rest der Website läuft |
| Rechtstexte | **ungeprüft** | Entwürfe mit sichtbaren Lücken, anwaltlich prüfen lassen |
| Domain und E-Mail | **offen** | Gala legt beides noch an |

---

## 2. Vor dem Livegang

In dieser Reihenfolge. Nur die ersten beiden blockieren den Verkauf.

1. **Stripe-Konto anlegen** — blockierend für die Kasse.
   Ohne `STRIPE_SECRET_KEY` antwortet `/api/checkout` mit `503`, und der Knopf
   „Zur Kasse“ zeigt eine Fehlermeldung mit Kontaktwegen. Alles andere — die
   drei Bestellwege über WhatsApp, Instagram und E-Mail — läuft ohne.

2. **Rechtstexte prüfen lassen** — blockierend.
   Impressum, Datenschutz, AGB und Widerrufsbelehrung tragen noch sechs
   sichtbare `.todo`-Markierungen. Besonders zwei Punkte:

   - Die **Widerrufsbelehrung**: frei gebundene Sträuße, Standardware,
     Trockenblumen und Workshops fallen unter vier verschiedene Regeln.
   - Die **Datenschutzerklärung** beschreibt noch einen Formularversand über
     einen eigenen Server mit Resend. Den gibt es seit dem 13.08.2026 nicht
     mehr — die Anfragen gehen über WhatsApp, Instagram oder das Mailprogramm
     der Absenderin. Der Text verspricht damit etwas anderes, als die Seite tut.

3. **Domain und E-Mail eintragen.** Beides legt Gala noch an. Die Domain steht
   in `astro.config.mjs` (`site`) und `src/data/site.ts`; davon hängen
   canonical, hreflang, Sitemap und `robots.txt` ab. Die Telefonnummer ist
   Galas aktuelle — sie schafft sich eine eigene Geschäftsnummer an, dann sind
   `phone`, `phoneHref` und `whatsapp` gemeinsam zu ändern.

4. **Preisangaben gegenzeichnen lassen** — siehe § 12. Einzelunterricht und
   Hutschachtel sind entschieden, gehen aber über Galas eigene Angaben hinaus.
   Offen bleiben die Einzelpreise für Bogen, Tischgestaltung und Fotozone.

5. **Fotos nachliefern.** Nichts davon blockiert den Verkauf, alles ist auf der
   Seite sichtbar markiert: „Platzhalter“ in Gold, wo eine Aufnahme zu klein
   ist, „Bild folgt“ in Grau, wo noch keine da ist. Die vollständige Liste
   steht in § 12.

6. **Galas Geschichte schreiben.** Die Atelier-Seite beschreibt bewusst nur die
   Arbeitsweise. Der eigene Werdegang wurde nicht erfunden.

7. **Workshop-Termine pflegen** in `src/data/workshops.ts`. Der Grundkurs läuft
   am letzten Samstag jedes Monats um 17:30; sechs Termine sind eingetragen,
   vergangene verschwinden automatisch.

8. **Hosting mit Serverfunktionen wählen** — nur noch für die Kasse.
   GitHub Pages liefert statische Dateien; `/api/checkout` gibt es dort nicht.
   `npx astro add netlify` oder `… vercel` tauscht den Adapter selbst aus.

## 3. Schnellstart

```bash
git clone git@github.com:raimurokko/kurazhblum.git
cd kurazhblum
npm install
cp .env.example .env     # Schlüssel eintragen — optional
npm run dev              # http://localhost:4321
```

Ohne Schlüssel läuft alles außer der Kasse. Sie antwortet mit einem klaren
Fehler und zeigt E-Mail und WhatsApp, statt still zu scheitern. Die
Anfragestrecken brauchen ohnehin keinen Server mehr.

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
│   └── ui.ts          1.168 Oberflächentexte in vier Sprachen
├── data/
│   ├── site.ts        Stammdaten, Öffnungszeiten, Lieferzeitfenster
│   ├── shop.ts        Kategorien, Sträuße, Preise, Liefergebiete
│   ├── flowers.ts     Auswahlliste für Weg A — keine Bestandsliste
│   ├── berlin-plz.ts  190 Berliner Postleitzahlen (OSM), Adressprüfung
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
| **A** Strauß zusammenstellen | Blumen, Farbstimmung, Größe, Budget, Termin, Adresse | vorbereiteter Nachricht — *nicht* in der Kasse |
| **B** Fertigen Strauß wählen | Katalog, Konfigurator | Stripe-Kasse |
| **C** Überraschungsstrauß | Floristin wählt, für gute Laune | Stripe-Kasse |

**Warum Weg A keine Kasse hat:** Gala hat kein Lager. Was heute frisch ist,
entscheidet der Markt am Morgen — ein Warenkorb würde Blumen zusagen, die sie
nicht halten kann. Die Seite baut aus der Auswahl eine fertige Nachricht, die
die Kundin selbst per WhatsApp, Instagram oder E-Mail abschickt: ohne Server
und ohne Zustellrisiko.

Weg A ist trotzdem eine **Bestellung** und sammelt seit dem 13.08.2026 alles,
was dazugehört — Name, Telefon, Wunschtermin mit Zeitfenster, Lieferadresse,
Kartentext. Vorher folgten darauf drei Rückfragen.

> **Nicht rückgängig machen.** Aus Weg A einen Warenkorb zu machen wäre
> technisch leicht und geschäftlich falsch.
>
> Bei Weg C ist der Nachlass seit dem 14.08.2026 **gar kein Thema mehr**. Er
> steckt in der Preisstaffel — 135 statt 150 €, 198 statt 220 € — und wird
> nirgends beworben. „Zehn Prozent günstiger“ warf die Frage auf, günstiger als
> was, und beantwortete sie nicht; jetzt steht dort, worum es geht: eine
> Überraschung für gute Laune. Keinen Streichpreis daraus machen — ein nie
> verlangter Vergleichspreis ist in Deutschland abmahnbar, und ein dauerhafter
> Nachlass *ist* schlicht der Preis.

### Anfragen ohne Server

Die Formulare für Veranstaltungen, Workshops und Kontakt haben **keinen
Absenden-Knopf** mehr. Sie bauen dieselbe Nachricht und öffnen WhatsApp,
Instagram oder das Mailprogramm — die Angaben gehen mit, niemand tippt zweimal.

Zwei getrennte Haken geben die Wege frei: einer für die Datenschutzerklärung,
einer für die Weitergabe an Dritte samt Übermittlung in die USA. Beides in ein
Kästchen zu packen wäre gebündelte Einwilligung und damit keine.

Instagram kann eine Direktnachricht nicht vorausfüllen — es gibt kein
Adressschema dafür. Der Text geht deshalb in die Zwischenablage, ein Dialog
nennt das Tastenkürzel je nach Gerät, und erst nach dem Bestätigen öffnet
`ig.me/m/…`.

> `src/pages/api/inquiry.ts` wird dadurch von nichts mehr aufgerufen. Die Datei
> steht noch da, damit der Serverweg jederzeit zurückkann — als toter Pfad
> gehört sie aber auf die Liste.

---

## 6. Sortiment & Preise

Galas Staffel heißt **M/L/XL** — kein S. Ihr M ist mit 85 € der Einstieg und
liegt genau auf dem Mindestbestellwert für Lieferung. Die Einstiegspreise
stehen als `SIZE_ENTRY_PRICES` in `shop.ts`; Weg A liest sie von dort, damit
dieselbe Zahl nicht an zwei Orten gepflegt wird.

| Strauß | Kategorie | Preis | Stand |
| :--- | :--- | :--- | :--- |
| Dopamin-Berlin | Dopamin-Sträuße | ab 85 / 150 / 220 € | bestätigt |
| Überraschungsstrauß | Dopamin-Sträuße | ab 85 / 135 / 198 € | abgeleitet |
| 101 Rosen mit Herz | Rosen | 400 € | bestätigt |
| 35 Päonienrosen, 60 cm | Rosen | 180 € | bestätigt |
| Rosen pur | Rosen | je nach Saison | Saisonware |
| Pfingstrosen | Pfingstrosen | je nach Saison | Saisonware |
| Mono-Hortensie | Hortensien | je nach Saison | Saisonware |
| Hortensie & Calla | Hortensien | je nach Saison | **Entwurf** |
| Blumen in der Hutschachtel | Dopamin-Sträuße | je nach Saison | **Entwurf** |
| Dunkle Callas mit Anthurium | Dopamin-Sträuße | je nach Saison | **Entwurf** |

> **Drei Einträge sind Entwürfe.** Name, Beschreibung und Zusammensetzung von
> „Hortensie & Calla“, „Blumen in der Hutschachtel“ und „Dunkle Callas mit
> Anthurium“ beschreiben, was auf dem jeweiligen Foto zu sehen ist — sie
> stammen nicht von Gala. Im Code stehen sie als TODO markiert. Alle drei sind
> bewusst ohne Preis: Als Saisonbeispiel führt der Weg zum Kundenservice, damit
> nichts zugesagt wird, was nicht abgestimmt ist.

Drei Modelle im Datentyp, genau eines der ersten beiden setzen:

- **`prices`** — Größenstaffel für M, L und XL. Der Konfigurator zeigt die
  Größenwahl.
- **`price`** — Festpreis, keine Größenwahl. Die 101 Rosen und die Päonienrosen
  gibt es nur in einer Ausführung.
- **`priceOnRequest`** — Saisonware. Kein Betrag, kein Konfigurator, keine
  Kasse; die API weist solche Produkte auch bei nachgebautem Aufruf mit `422`
  ab. Der Weg führt zum Kundenservice.

Gekapselt in `hasSizes()`, `sizesOf()`, `priceFor()` und `isOrderable()`.

### Aufpreise hängen an der Größe

Ein Korb für einen XL-Strauß ist ein anderer Korb als für M. `null` heißt: in
dieser Größe nicht im Angebot — die Vase zum XL-Strauß entfällt darum ganz, im
Browser wie serverseitig.

| | M | L | XL |
| :--- | ---: | ---: | ---: |
| Strauß | gratis | + 15 € | + 20 € |
| Designerverpackung | + 15 € | + 25 € | + 35 € |
| Korb | ab 15 € | ab 20 € | ab 30 € |
| Hutschachtel | ab 25 € | ab 30 € | ab 40 € |
| Vase | ab 20 € | ab 40 € | — |

Korb, Schachtel und Vase sind **Ab-Preise** (`PRESENTATION_FROM`): Das Gefäß
wird vor der Lieferung abgestimmt. Deshalb zeigen auch die Größen „ab“ — mit
Verpackung, Extras und Lieferung liegt der Endpreis darüber.

### Lieferung

Die Zonen sind die **VBB-Tarifbereiche** vom BVG-Ticket, nicht selbstgebaute
Gebiete: In Berlin weiß fast jede Kundin, ob sie in A oder B wohnt.

| Zone | Preis |
| :--- | ---: |
| Abholung im Atelier | nur nach Absprache, separat gebucht |
| Lichtenberg | 15 € |
| Berlin — Tarifbereich A | 20 € |
| Berlin — Tarifbereich B | 25 € |

**Die Grenze ist der S-Bahn-Ring, nicht die Bezirksgrenze.** Neukölln,
Prenzlauer Berg, Schöneberg, Wedding und Alt-Treptow liegen teils in A, teils
in B; die Ringbahnhöfe zählen noch zu A. Wer nach Bezirken sortiert, rechnet
systematisch falsch — die Hinweise nennen darum Grenzbahnhöfe.

**Tarifbereich C fehlt mit Absicht.** C ist kein Berliner Gebiet, sondern das
Brandenburger Umland samt Potsdam und BER; Gala liefert dort nicht. Ganz
Berlin ist AB, die Auswahl deckt ihr Gebiet also vollständig ab.

Lieferfenster im **Stundentakt**, 10 bis 20 Uhr. Vor 14 Uhr kostet es 15 €
Aufschlag — Gala kauft morgens am Großmarkt ein und bindet danach, eine
Vormittagslieferung ist eine Extrafahrt. Sonntags schließt das Atelier um
16 Uhr; spätere Fenster verschwinden aus der Auswahl und die Kasse weist sie
mit `422` ab.

Die **Postleitzahl** wird gegen die 190 Berliner Postleitzahlen geprüft
(`src/data/berlin-plz.ts`). Vorher ließ sich Zone „Lichtenberg“ für 15 € wählen
und an der Kasse eine Adresse in Hamburg eintragen.

Dazu kommt die Zone: `src/data/berlin-plz.json` hält je Postleitzahl ihre
Bezirke — 56 der 190 liegen in mehreren. Zone „Lichtenberg“ mit einer Adresse
in Spandau wird abgewiesen, ebenso Tarifbereich A, wenn jeder in Frage
kommende Bezirk vollständig außerhalb des Rings liegt.

> **Keine Tabelle Postleitzahl → Tarifbereich.** Der Ring schneidet quer durch
> Postleitzahlgebiete; eine solche Zuordnung wäre geraten und würde
> Bestellungen abweisen, die in Ordnung sind. Wo er einen Bezirk teilt —
> Neukölln, Prenzlauer Berg, Schöneberg, Wedding, Alt-Treptow —, sagt die
> Prüfung nichts. Und sie prüft nur die Richtung, die Gala Geld kostet: eine zu
> billige Zone. Wer zu viel zahlen will, darf das.

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

**Die goldene Platzhalter-Marke gibt es nicht mehr.** Sie wies auf Fotos hin,
die zu klein aufgelöst waren; diese Aufnahmen sind ersetzt. Geblieben ist die
graue Marke **„Bild folgt“** (`imagePending`) für Stellen, an denen noch gar
keine Aufnahme existiert — dort wird bewusst auch kein `<img>` erzeugt, damit
der Browser keine 404 holt.

Die Kategoriekacheln Dopamin und Rosen stammen weiterhin aus Bildschirmfotos
mit 1125 px. Sie tragen keine Marke mehr; wer sie ersetzen will, findet den
Hinweis nur noch hier.

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
>
> **Die Datenschutzerklärung ist zusätzlich überholt.** Sie beschreibt einen
> Formularversand über einen eigenen Server mit Resend; den gibt es seit dem
> 13.08.2026 nicht mehr. Anfragen gehen über WhatsApp, Instagram oder das
> Mailprogramm der Absenderin — der Text verspricht damit etwas anderes, als
> die Seite tut.

Die Rechtstexte stehen nur auf Deutsch. Verbindlich ist ohnehin die deutsche
Fassung; eine ungeprüfte Übersetzung würde mehr Risiko schaffen als Nutzen. In
den anderen Sprachen steht ein Hinweis darauf.

Bewusste Entscheidungen, die beim Ändern nicht verloren gehen sollten:

- **Schriften liegen im Repository**, nicht bei Google. Keine Verbindung zu
  Google Fonts — in Deutschland ein realer Abmahngrund. Seit August 2026 auch
  nicht mehr beim Bauen: Der frühere Abruf von fonts.gstatic.com brach den
  Build, als Google eine Datei-URL drehte.
- **Kleinunternehmerin nach § 19 UStG.** Solange das gilt, darf nirgends
  „inkl. MwSt.“ stehen — ausgewiesene Umsatzsteuer, die nicht abgeführt wird,
  schuldet man nach § 14c UStG trotzdem. Der Schalter steht in `site.legal`,
  betroffen sind zusätzlich `cfg.incl_vat` in vier Sprachen und der
  Preisabsatz der AGB.
- **Adressvorschläge kommen aus dem eigenen Repository.** 9.074 Berliner
  Straßen, im Browser durchsucht. Ein Geocoder-Aufruf würde bei jedem
  Tastendruck IP-Adresse und Eingabe an einen Dritten schicken — die ODbL
  verlangt dafür die Nennung „© OpenStreetMap-Mitwirkende“, die am Feld steht.
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

Am 13.08.2026 entschieden — Gala sollte beides noch gegenzeichnen, weil die
Beträge über ihren eigenen Angaben hinausgehen:

- **Einzelunterricht: 249 € für eine Person, danach degressiv** — 429 € zu
  zweit, 579 € zu dritt. Damit ist Galas Satz „цена указана за человека“
  aufgelöst: Pro Person genommen hätte dieselbe Stunde zu zweit das Doppelte
  gekostet. Die 249 € sind ihre Zahl, die beiden Stufen darüber nicht.
- **Hutschachtel: je Größe 10 € mehr** — ab 25 / 30 / 40 €. Sie liegt damit
  durchgehend 10 € über dem Korb, statt sich seinen Preis zu teilen.
- **Höchstwert statt Summe im Anfrageformular: bestätigt.** Die Rechenart
  bleibt, auch wenn Gala später Einzelpreise nennt.

**Offen, weil nur Gala es sagen kann:**

- **Einzelpreise für Bogen, Tischgestaltung und Fotozone.** Das Anfrageformular
  koppelt das Budget an die gewählten Leistungen und rechnet dafür mit dem
  **Höchstwert** der Untergrenzen — was ein Bogen zusätzlich zur
  Tischgestaltung kostet, hat sie nie gesagt, und es zu addieren wäre eine
  erfundene Zahl. Sobald die echten Beträge vorliegen, gehören sie nach
  `LEISTUNG_MINDESTBUDGET`; die Rechenart bleibt davon unberührt.

**Angaben, die noch fehlen:**

- E-Mail-Adresse und die neue Geschäftsnummer — beide legt sie noch an
- Domain
- Handelsregistereintrag: falls keiner besteht, kann die Zeile im Impressum raus
- Sitzplatzzahlen der Workshops (acht ist geschätzt)
- Ihre eigene Geschichte für die Atelier-Seite

**Fotos** — Stand 14.08.2026, nach dem Durchgang durch Galas Laufwerk:

Neu eingesetzt sind Pfingstrosen (Produkt und Kategoriekachel), der
Hochzeits-Hero mit der Trauung am See, Blumenbogen und Tischgestaltung als
zweite Bildflächen auf der Veranstaltungsseite, der Workshop-Teaser sowie Korb
und Hutschachtel im Konfigurator. Alles Übrige trägt jetzt die Marke **„Bild
folgt“** statt eines Verweises ins Leere:

- Drei Workshop-Fotos für Blumenabend, Einzelunterricht und mobilen Workshop.
  Der Grundkurs hat ein Video. Die vorhandenen Aufnahmen stammen alle aus
  derselben Session; sie auf alle Formate zu verteilen hieße, verschiedene
  Kurse mit demselben Tisch zu bebildern.
- Atelierporträt. Es gibt nur ein Video, in dem eine Person zu sehen ist — ob
  ihr Gesicht auf die Website kommt, entscheidet Gala.
- Instagram: Die sechs Kacheln zeigen vorläufig Aufnahmen aus dem Laufwerk und
  verlinken auf das Profil, nicht auf einzelne Beiträge. Sobald Gala eine eigene
  Auswahl exportiert, gehören die Bilder und die `permalink`-Adressen ersetzt.
- Höher aufgelöste Kategoriekacheln für Dopamin und Rosen (bislang 1125 px,
  ohne sichtbare Marke).
- Fotos für Rosen pur und Mono-Hortensie. Beide tragen „Bild folgt“; im
  Laufwerk liegt für keinen von beiden etwas Passendes.
- Bilder für Strauß, Designerverpackung und Vase im Konfigurator. Korb und
  Hutschachtel sind belegt.

> **Zwei Marken, zwei Bedeutungen.** „Platzhalter“ in Gold heißt: Ein Foto ist
> da, aber zu klein. „Bild folgt“ in Grau heißt: Es gibt noch keins. Wer beides
> gleich behandelt, verliert den Unterschied, auf den es beim Aufräumen ankommt.

**Offene Baustellen im Code:**

Keine mehr. Die Zonenprüfung ist seit dem 13.08.2026 vollständig: 190
Postleitzahlen mit ihren Bezirken in `src/data/berlin-plz.json`, erneuerbar
über `tools/orte/plz.py`.
