"""Postleitzahl → Berliner Bezirk aus OpenStreetMap holen.

Wozu: Im Konfigurator wählt die Kundin eine Lieferzone und tippt daneben eine
Adresse. Ohne Abgleich ließe sich Zone „Lichtenberg“ für 15 € wählen und eine
Adresse in Spandau eintragen — die Zone bestimmte den Preis, die Adresse
niemanden.

Was hier **nicht** entsteht: eine Zuordnung Postleitzahl → Tarifbereich A/B.
Die Tarifgrenze ist der S-Bahn-Ring, und der schneidet quer durch
Postleitzahlgebiete. Eine solche Tabelle wäre geraten, nicht abgeleitet.

Was entsteht: Postleitzahl → Bezirk. Das ist eine amtliche, überprüfbare
Zuordnung. Daraus lassen sich genau die Widersprüche erkennen, die sicher
falsch sind:

  * eine Postleitzahl, die gar nicht zu Berlin gehört
  * Zone „Lichtenberg“ mit einer Adresse außerhalb Lichtenbergs
  * Tarifbereich A in einem Bezirk, der vollständig außerhalb des Rings liegt

Wo der Ring einen Bezirk teilt, schweigt die Prüfung — lieber keine Aussage
als eine erfundene.

    python3 tools/orte/plz.py
"""

import io
import json
import time
import pathlib
import urllib.request

# Reihenfolge nach Erfahrung: Der Hauptserver weist Anfragen dieser Größe oft
# mit „too busy“ oder 504 ab, die Spiegel sind entspannter.
SERVER = [
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass-api.de/api/interpreter',
    'https://overpass.private.coffee/api/interpreter',
]

BEZIRKE = [
    'Mitte',
    'Friedrichshain-Kreuzberg',
    'Pankow',
    'Charlottenburg-Wilmersdorf',
    'Spandau',
    'Steglitz-Zehlendorf',
    'Tempelhof-Schöneberg',
    'Neukölln',
    'Treptow-Köpenick',
    'Marzahn-Hellersdorf',
    'Lichtenberg',
    'Reinickendorf',
]

ZIEL = pathlib.Path(__file__).resolve().parents[2] / 'src' / 'data' / 'berlin-plz.json'

UA = 'kurazhblum-website/1.0 (PLZ-Bezirk-Zuordnung, einmalig)'


def abfrage(bezirk: str) -> str:
    # Erst Berlin als Fläche, dann den Bezirk *darin* — sonst trifft „Mitte“
    # auch Ortsteile in anderen Bundesländern.
    return f"""
[out:csv("postal_code"; false)][timeout:300];
area["name"="Berlin"]["admin_level"="4"]["boundary"="administrative"]->.berlin;
rel(area.berlin)["admin_level"="9"]["name"="{bezirk}"]->.bezirk;
.bezirk map_to_area -> .flaeche;
rel(area.flaeche)["boundary"="postal_code"];
out tags;
"""


def hole(ql: str, versuche: int = 4, pause: int = 25) -> str:
    """Überall durchprobieren, dann warten und erneut.

    Overpass ist ein Gemeinschaftsdienst; 504 und „too busy“ sind der
    Normalfall und keine Störung. Zwölf Abfragen hintereinander treffen fast
    sicher auf einen ausgelasteten Moment — also nicht beim ersten Nein
    aufgeben, sondern in Ruhe wiederholen.
    """
    for versuch in range(1, versuche + 1):
        for server in SERVER:
            try:
                antwort = (
                    urllib.request.urlopen(
                        urllib.request.Request(server, data=ql.encode('utf-8'), headers={'User-Agent': UA}),
                        timeout=300,
                    )
                    .read()
                    .decode('utf-8')
                )
            except Exception as fehler:  # noqa: BLE001
                print(f'    {server.split("/")[2]}: {fehler}')
                continue
            if antwort.lstrip().startswith('<'):
                print(f'    {server.split("/")[2]}: abgelehnt (ausgelastet)')
                continue
            return antwort
        if versuch < versuche:
            print(f'    … alle belegt, {pause} s Pause (Versuch {versuch}/{versuche})')
            time.sleep(pause)
    raise SystemExit('Kein Overpass-Server hat geantwortet — später erneut versuchen.')


def main() -> None:
    zuordnung: dict[str, list[str]] = {}

    for bezirk in BEZIRKE:
        print(f'{bezirk} …')
        for zeile in hole(abfrage(bezirk)).splitlines():
            plz = zeile.strip()
            # Berlin liegt zwischen 10115 und 14199; alles andere ist ein
            # Nachbargebiet, das die Fläche nur streift.
            if not (plz.isdigit() and len(plz) == 5 and 10115 <= int(plz) <= 14199):
                continue
            zuordnung.setdefault(plz, [])
            if bezirk not in zuordnung[plz]:
                zuordnung[plz].append(bezirk)

    geordnet = {plz: sorted(bezirke) for plz, bezirke in sorted(zuordnung.items())}
    ZIEL.write_text(json.dumps(geordnet, ensure_ascii=False, indent=0), encoding='utf-8')

    mehrfach = sum(1 for b in geordnet.values() if len(b) > 1)
    print(f'\n{len(geordnet)} Postleitzahlen, davon {mehrfach} in mehreren Bezirken')
    print(f'geschrieben nach {ZIEL.relative_to(ZIEL.parents[2])}')
    print('\nQuelle: OpenStreetMap, ODbL.')


if __name__ == '__main__':
    main()
