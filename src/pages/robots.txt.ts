import type { APIRoute } from 'astro';

import { LOCALES, asset } from '../i18n/config';

/**
 * robots.txt — wird beim Build erzeugt, damit die Sitemap-URL immer zur
 * konfigurierten Domain passt (astro.config.mjs → `site`).
 */
export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? 'https://kurazhblum.de';

  const body = `# KURAZHBLUM Berlin — Crawler sind willkommen.
# Für Sprachmodelle:  ${asset('/llms.txt')}
# Für Menschen:       ${asset('/humans.txt')}
# Sicherheitskontakt: ${asset('/.well-known/security.txt')}

User-agent: *
Allow: /

# Bestell- und Bezahlstrecke gehört nicht in den Index.
Disallow: ${asset('/api/')}
${LOCALES.map((locale) => `Disallow: ${asset(`/${locale}/bestellung/`)}`).join('\n')}

Sitemap: ${origin}${asset('/sitemap-index.xml')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
