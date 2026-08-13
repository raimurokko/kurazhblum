// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

/*
  Domain und Basispfad kommen aus der Umgebung, damit dieselbe Codebasis
  an drei Orten läuft:

    lokal            SITE=… BASE=… nicht gesetzt  →  http://localhost:4321/
    GitHub Pages     im Workflow gesetzt          →  …github.io/kurazhblum/
    eigene Domain    SITE=https://kurazhblum.de   →  https://kurazhblum.de/

  Wichtig: Wer `BASE` setzt, muss interne Links über `path()` und Dateien in
  `public/` über `asset()` aufbauen (src/i18n/config.ts). Hart geschriebene
  Pfade wie "/brand/logo.png" brechen unter einem Unterverzeichnis.
*/
const SITE = process.env.SITE ?? 'https://kurazhblum.de';
const BASE = process.env.BASE ?? '/';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,

  // Statisch gebaut; nur die API-Routen (Checkout, Anfragen) laufen serverseitig.
  // Für Netlify/Vercel den Adapter tauschen — siehe README.
  output: 'static',
  adapter: node({ mode: 'standalone' }),

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'de',
        locales: { de: 'de-DE', uk: 'uk-UA', en: 'en', ru: 'ru' },
      },
    }),
  ],

  /*
    Selbst gehostete Schriften — kein Request an Google, weder zur Laufzeit
    noch beim Bauen.

    Bis August 2026 holte der `google()`-Provider die Dateien bei jedem Build
    von fonts.gstatic.com. Zur Laufzeit war das unkritisch, der Build hing aber
    an URLs, die Google ohne Vorwarnung dreht: Am 13.08.2026 lieferte eine
    davon einen 404 und der Pages-Build brach ab. Die Dateien liegen deshalb
    jetzt im Repository.

    Beides sind Variable Fonts, ein Schnitt deckt die ganze Gewichtsspanne ab —
    zwölf Dateien statt achtundvierzig, 404 KB gesamt. Die unicode-range-Angaben
    stammen aus Googles eigenem CSS: Wer nur Deutsch liest, lädt die kyrillischen
    Schnitte gar nicht erst.

    Neu holen lässt sich das Ganze mit tools/schriften/holen.py.
  */
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Cormorant Garamond',
      cssVariable: '--font-display',
      options: {
        variants: [
        {
          // cyrillic-ext
          src: ['./src/fonts/cormorant-garamond-italic-cyrillic-ext.woff2'],
          weight: '300 700',
          style: 'italic',
          unicodeRange: ['U+0460-052F', 'U+1C80-1C8A', 'U+20B4', 'U+2DE0-2DFF', 'U+A640-A69F', 'U+FE2E-FE2F'],
        },
        {
          // cyrillic
          src: ['./src/fonts/cormorant-garamond-italic-cyrillic.woff2'],
          weight: '300 700',
          style: 'italic',
          unicodeRange: ['U+0301', 'U+0400-045F', 'U+0490-0491', 'U+04B0-04B1', 'U+2116'],
        },
        {
          // latin-ext
          src: ['./src/fonts/cormorant-garamond-italic-latin-ext.woff2'],
          weight: '300 700',
          style: 'italic',
          unicodeRange: ['U+0100-02BA', 'U+02BD-02C5', 'U+02C7-02CC', 'U+02CE-02D7', 'U+02DD-02FF', 'U+0304', 'U+0308', 'U+0329', 'U+1D00-1DBF', 'U+1E00-1E9F', 'U+1EF2-1EFF', 'U+2020', 'U+20A0-20AB', 'U+20AD-20C0', 'U+2113', 'U+2C60-2C7F', 'U+A720-A7FF'],
        },
        {
          // latin
          src: ['./src/fonts/cormorant-garamond-italic-latin.woff2'],
          weight: '300 700',
          style: 'italic',
          unicodeRange: ['U+0000-00FF', 'U+0131', 'U+0152-0153', 'U+02BB-02BC', 'U+02C6', 'U+02DA', 'U+02DC', 'U+0304', 'U+0308', 'U+0329', 'U+2000-206F', 'U+20AC', 'U+2122', 'U+2191', 'U+2193', 'U+2212', 'U+2215', 'U+FEFF', 'U+FFFD'],
        },
        {
          // cyrillic-ext
          src: ['./src/fonts/cormorant-garamond-normal-cyrillic-ext.woff2'],
          weight: '300 700',
          style: 'normal',
          unicodeRange: ['U+0460-052F', 'U+1C80-1C8A', 'U+20B4', 'U+2DE0-2DFF', 'U+A640-A69F', 'U+FE2E-FE2F'],
        },
        {
          // cyrillic
          src: ['./src/fonts/cormorant-garamond-normal-cyrillic.woff2'],
          weight: '300 700',
          style: 'normal',
          unicodeRange: ['U+0301', 'U+0400-045F', 'U+0490-0491', 'U+04B0-04B1', 'U+2116'],
        },
        {
          // latin-ext
          src: ['./src/fonts/cormorant-garamond-normal-latin-ext.woff2'],
          weight: '300 700',
          style: 'normal',
          unicodeRange: ['U+0100-02BA', 'U+02BD-02C5', 'U+02C7-02CC', 'U+02CE-02D7', 'U+02DD-02FF', 'U+0304', 'U+0308', 'U+0329', 'U+1D00-1DBF', 'U+1E00-1E9F', 'U+1EF2-1EFF', 'U+2020', 'U+20A0-20AB', 'U+20AD-20C0', 'U+2113', 'U+2C60-2C7F', 'U+A720-A7FF'],
        },
        {
          // latin
          src: ['./src/fonts/cormorant-garamond-normal-latin.woff2'],
          weight: '300 700',
          style: 'normal',
          unicodeRange: ['U+0000-00FF', 'U+0131', 'U+0152-0153', 'U+02BB-02BC', 'U+02C6', 'U+02DA', 'U+02DC', 'U+0304', 'U+0308', 'U+0329', 'U+2000-206F', 'U+20AC', 'U+2122', 'U+2191', 'U+2193', 'U+2212', 'U+2215', 'U+FEFF', 'U+FFFD'],
        },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-body',
      options: {
        variants: [
        {
          // cyrillic-ext
          src: ['./src/fonts/inter-normal-cyrillic-ext.woff2'],
          weight: '100 900',
          style: 'normal',
          unicodeRange: ['U+0460-052F', 'U+1C80-1C8A', 'U+20B4', 'U+2DE0-2DFF', 'U+A640-A69F', 'U+FE2E-FE2F'],
        },
        {
          // cyrillic
          src: ['./src/fonts/inter-normal-cyrillic.woff2'],
          weight: '100 900',
          style: 'normal',
          unicodeRange: ['U+0301', 'U+0400-045F', 'U+0490-0491', 'U+04B0-04B1', 'U+2116'],
        },
        {
          // latin-ext
          src: ['./src/fonts/inter-normal-latin-ext.woff2'],
          weight: '100 900',
          style: 'normal',
          unicodeRange: ['U+0100-02BA', 'U+02BD-02C5', 'U+02C7-02CC', 'U+02CE-02D7', 'U+02DD-02FF', 'U+0304', 'U+0308', 'U+0329', 'U+1D00-1DBF', 'U+1E00-1E9F', 'U+1EF2-1EFF', 'U+2020', 'U+20A0-20AB', 'U+20AD-20C0', 'U+2113', 'U+2C60-2C7F', 'U+A720-A7FF'],
        },
        {
          // latin
          src: ['./src/fonts/inter-normal-latin.woff2'],
          weight: '100 900',
          style: 'normal',
          unicodeRange: ['U+0000-00FF', 'U+0131', 'U+0152-0153', 'U+02BB-02BC', 'U+02C6', 'U+02DA', 'U+02DC', 'U+0304', 'U+0308', 'U+0329', 'U+2000-206F', 'U+20AC', 'U+2122', 'U+2191', 'U+2193', 'U+2212', 'U+2215', 'U+FEFF', 'U+FFFD'],
        },
        ],
      },
    },
  ],
});
