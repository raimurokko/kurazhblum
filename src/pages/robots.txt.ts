import type { APIRoute } from 'astro';

/**
 * robots.txt — wird beim Build erzeugt, damit die Sitemap-URL immer zur
 * konfigurierten Domain passt (astro.config.mjs → `site`).
 */
export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? 'https://kurazhblum.de';

  const body = `# KURAZHBLUM Berlin — Crawler sind willkommen.
# Für Sprachmodelle:  /llms.txt
# Für Menschen:       /humans.txt
# Sicherheitskontakt: /.well-known/security.txt

User-agent: *
Allow: /

# Bestell- und Bezahlstrecke gehört nicht in den Index.
Disallow: /api/
Disallow: /de/bestellung/
Disallow: /uk/bestellung/
Disallow: /en/bestellung/
Disallow: /ru/bestellung/

Sitemap: ${origin}/sitemap-index.xml
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
