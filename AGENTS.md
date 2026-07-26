## Projektkonventionen

Siehe README.md für den vollen Überblick. Das Wichtigste beim Ändern:

- **Vier Sprachen, keine Ausnahmen.** Neue Oberflächentexte gehören in
  `src/i18n/ui.ts` und müssen in `de`, `uk`, `en` und `ru` vorliegen. Texte an
  Produkten und Kursen sind `I18nText`-Objekte mit denselben vier Schlüsseln.
  Nie einen Text direkt in eine Komponente schreiben.
- **Geld ist immer Cent als Ganzzahl.** Ausgabe nur über `formatPrice()`.
- **Preise werden zweimal berechnet:** im Browser für die Live-Anzeige
  (`src/components/Configurator.astro`) und verbindlich auf dem Server
  (`src/pages/api/checkout.ts`). Änderungen an der Preislogik betreffen beide.
- **Farben und Abstände kommen aus `src/styles/global.css`.** Keine
  Einzelfarben in Komponenten hart schreiben — die Palette stammt aus dem Logo.
- **Keine externen Ressourcen zur Laufzeit.** Schriften sind selbst gehostet,
  Bilder liegen lokal. Das ist eine Datenschutzentscheidung, kein Zufall.
- **Rechtstexte sind Entwürfe** und tragen sichtbare `.todo`-Markierungen.
  Diese Markierungen nicht ohne Rücksprache entfernen.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
