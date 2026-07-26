// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: auf die echte Domain ändern, sobald sie registriert ist.
  site: 'https://kurazhblum.de',

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
