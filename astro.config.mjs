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

  // Selbst gehostete Schriften — kein Request an Google, DSGVO-konform.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Cormorant Garamond',
      cssVariable: '--font-display',
      weights: [300, 400, 500, 600],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-body',
      weights: [300, 400, 500, 600],
      subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
    },
  ],
});
