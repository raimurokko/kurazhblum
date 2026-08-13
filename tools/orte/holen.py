"""Berliner Straßennamen aus OpenStreetMap holen und lokal ablegen.

Warum lokal und nicht per Geocoder-Aufruf: Eine Adresssuche gegen Nominatim
oder einen kommerziellen Dienst schickt bei **jedem Tastendruck** die
IP-Adresse der Besucherin und ihre Eingabe an einen Dritten. Die Website hat
sonst nirgends eine solche Verbindung — deshalb braucht sie kein Cookie-Banner
—, und eine Adresssuche wäre ein schlechter Ort, damit anzufangen: Wer eine
Veranstaltungsadresse eintippt, verrät mehr als beim Surfen.

Die Liste liegt deshalb im Repository und wird im Browser durchsucht. Das ist
kein Kompromiss, sondern schneller: keine Netzwerklatenz je Tastendruck,
Vorschläge erscheinen sofort.

    python3 tools/orte/holen.py

Ergebnis: public/data/berlin-strassen.json, rund 170 KB, gezippt 44 KB. Die
Datei wird erst beim ersten Klick ins Adressfeld nachgeladen, nicht beim
Seitenaufbau.

Rechtliches: OpenStreetMap-Daten stehen unter der ODbL. Sie verlangt die
Nennung „© OpenStreetMap-Mitwirkende“ überall dort, wo die Daten auftauchen —
der Hinweis steht am Adressfeld und in der Datenschutzerklärung.
"""

import collections
import io
import json
import pathlib
import urllib.request

# Der Hauptserver weist Anfragen dieser Größe oft mit „too busy“ ab; die
# Spiegel sind entspannter. Reihenfolge = Reihenfolge der Versuche.
SERVER = [
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass-api.de/api/interpreter',
    'https://overpass.private.coffee/api/interpreter',
]

# Nur befahrbare und begehbare Straßen — keine Feldwege, Gleise oder
# Grundstückszufahrten. `admin_level=4` ist das Land Berlin.
ABFRAGE = """
[out:csv(name; false)][timeout:600];
area["name"="Berlin"]["admin_level"="4"]["boundary"="administrative"]->.berlin;
way(area.berlin)["highway"~"^(residential|primary|secondary|tertiary|living_street|unclassified|pedestrian|trunk)$"]["name"];
out tags;
"""

ZIEL = pathlib.Path(__file__).resolve().parents[2] / 'public' / 'data' / 'berlin-strassen.json'


def hole() -> str:
    for server in SERVER:
        try:
            antwort = urllib.request.urlopen(
                urllib.request.Request(
                    server,
                    data=ABFRAGE.encode('utf-8'),
                    headers={'User-Agent': 'kurazhblum-website/1.0 (Strassenliste, einmalig)'},
                ),
                timeout=600,
            ).read().decode('utf-8')
        except Exception as fehler:  # noqa: BLE001 — jeder Fehler heißt: nächster Server
            print(f'  {server}: {fehler}')
            continue

        # Overpass antwortet im Fehlerfall mit einer HTML-Seite, nicht mit CSV.
        if antwort.lstrip().startswith('<'):
            print(f'  {server}: abgelehnt (vermutlich ausgelastet)')
            continue

        print(f'  {server}: OK')
        return antwort

    raise SystemExit('Kein Overpass-Server hat geantwortet — später erneut versuchen.')


def main() -> None:
    print('Overpass wird abgefragt …')
    rohdaten = hole()

    namen = collections.Counter()
    for zeile in rohdaten.splitlines():
        name = zeile.split('\t')[0].strip()
        if name:
            namen[name] += 1

    eindeutig = sorted(namen)
    ZIEL.parent.mkdir(parents=True, exist_ok=True)
    text = json.dumps(eindeutig, ensure_ascii=False)
    io.open(ZIEL, 'w', encoding='utf-8').write(text)

    print(f'\n{len(eindeutig)} eindeutige Straßennamen')
    print(f'{len(text.encode()) // 1024} KB nach {ZIEL.relative_to(ZIEL.parents[2])}')
    print('\nQuelle: OpenStreetMap, ODbL. Der Attributionshinweis gehört an jede')
    print('Stelle, an der die Vorschläge auftauchen.')


if __name__ == '__main__':
    main()
