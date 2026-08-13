import zuordnung from './berlin-plz.json';

/**
 * Postleitzahl → Berliner Bezirk, aus OpenStreetMap (ODbL).
 *
 * Wozu: Der Konfigurator lässt eine Lieferzone wählen und daneben eine Adresse
 * eintippen. Ohne Abgleich ließe sich Zone „Lichtenberg“ für 15 € wählen und
 * eine Adresse in Spandau eintragen — die Zone bestimmte den Preis, die
 * Adresse niemanden.
 *
 * 56 der 190 Postleitzahlen liegen in mehreren Bezirken; deshalb steht je
 * Postleitzahl eine Liste und keine einzelne Angabe. Geprüft wird immer gegen
 * die ganze Liste: Reicht ein Bezirk aus, ist die Zone plausibel.
 *
 * Erneuern: `python3 tools/orte/plz.py`
 */
export const PLZ_BEZIRKE: Record<string, string[]> = zuordnung;

/** Gehört diese Postleitzahl zu Berlin? */
export function istBerlinerPlz(plz: string): boolean {
  return plz.trim() in PLZ_BEZIRKE;
}

/**
 * Bezirke, die **vollständig außerhalb** des S-Bahn-Rings liegen und damit
 * nie im Tarifbereich A sein können.
 *
 * Lichtenberg fehlt hier bewusst, obwohl es praktisch ebenfalls ganz in B
 * liegt: Die Ringbahnhöfe am Westrand (Ostkreuz, Frankfurter Allee) gehören
 * noch zu A. Wer dort Zone A wählt, zahlt 20 € statt 15 € — zu viel, nicht zu
 * wenig. Diese Richtung muss die Prüfung nicht verhindern.
 */
const NUR_TARIFBEREICH_B = [
  'Spandau',
  'Steglitz-Zehlendorf',
  'Marzahn-Hellersdorf',
  'Reinickendorf',
];

/**
 * Passt die Postleitzahl zur gewählten Zone?
 *
 * Geprüft wird nur, was sich sicher sagen lässt — und nur in die Richtung, die
 * Gala Geld kostet: eine zu billige Zone. Wo der Ring einen Bezirk teilt
 * (Neukölln, Prenzlauer Berg, Schöneberg, Wedding, Alt-Treptow), sagt die
 * Prüfung nichts, statt etwas zu behaupten.
 *
 * `null` heißt: in Ordnung. Sonst der Grund, als Schlüssel für den Text.
 */
export function zonenFehler(plz: string, zoneId: string): 'outside' | 'not_lichtenberg' | 'not_zone_a' | null {
  const sauber = plz.trim();
  if (zoneId === 'pickup') return null;

  const bezirke = PLZ_BEZIRKE[sauber];
  if (!bezirke) return 'outside';

  // Die günstigste Zone gilt nur für den Bezirk rund ums Atelier.
  if (zoneId === 'lichtenberg' && !bezirke.includes('Lichtenberg')) return 'not_lichtenberg';

  // Tarifbereich A ist unmöglich, wenn jeder in Frage kommende Bezirk
  // vollständig außerhalb des Rings liegt.
  if (zoneId === 'a' && bezirke.every((bezirk) => NUR_TARIFBEREICH_B.includes(bezirk))) {
    return 'not_zone_a';
  }

  return null;
}
