"""Schriftdateien von Google holen und lokal ablegen.

Warum es dieses Skript gibt: Astros `google()`-Provider lädt die Dateien bei
*jedem* Build von fonts.gstatic.com. Zur Laufzeit spielt das keine Rolle — die
Seite bindet nichts Fremdes ein —, der Build hing aber an URLs, die Google ohne
Ankündigung dreht. Am 13.08.2026 lieferte eine davon einen 404 und der
Pages-Build brach ab. Seitdem liegen die Dateien im Repository.

Dieses Skript ist der Weg zurück an die Quelle: einmal ausführen, wenn eine
Schrift ausgetauscht, ein Schnitt ergänzt oder eine Sprache dazugenommen wird.
Es lädt die Dateien nach `src/fonts/` und druckt den Konfigurationsblock, der
in `astro.config.mjs` gehört.

    python3 tools/schriften/holen.py

Beide Familien sind Variable Fonts: Ein Schnitt deckt die ganze Gewichtsspanne
ab, deshalb sind es zwölf Dateien und nicht achtundvierzig. Die
`unicode-range`-Angaben kommen aus Googles eigenem CSS — dadurch lädt, wer nur
Deutsch liest, die kyrillischen Schnitte gar nicht erst.
"""

import io
import pathlib
import re
import urllib.request

# Genau die vier Sprachen der Website. Griechisch und Vietnamesisch liefert
# Google mit, hier wären sie totes Gewicht.
SUBSETS = ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext']

CSS_URL = (
    'https://fonts.googleapis.com/css2'
    '?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700'
    '&family=Inter:wght@100..900'
    '&display=swap'
)

# Ohne modernen User-Agent liefert Google TTF statt WOFF2.
UA = (
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
)

WURZEL = pathlib.Path(__file__).resolve().parents[2]
ZIEL = WURZEL / 'src' / 'fonts'

KURZNAMEN = {'Cormorant Garamond': 'cormorant-garamond', 'Inter': 'inter'}


def lade(url: str, ua: str = UA) -> bytes:
    return urllib.request.urlopen(
        urllib.request.Request(url, headers={'User-Agent': ua}), timeout=60
    ).read()


def varianten() -> list[dict]:
    css = lade(CSS_URL).decode('utf-8')
    gefunden = []
    for subset, body in re.findall(r'/\* ([\w-]+) \*/\s*@font-face \{(.*?)\}', css, re.S):
        if subset not in SUBSETS:
            continue
        feld = lambda k: re.search(rf'{k}:\s*([^;]+);', body).group(1).strip().strip("'")
        familie = feld('font-family')
        stil = feld('font-style')
        gefunden.append({
            'subset': subset,
            'family': familie,
            'style': stil,
            'weight': feld('font-weight'),
            'unicodeRange': feld('unicode-range'),
            'url': re.search(r'url\(([^)]+)\)', body).group(1),
            'datei': f'{KURZNAMEN[familie]}-{stil}-{subset}.woff2',
        })
    return gefunden


def block(eintraege: list[dict], familie: str) -> str:
    zeilen = []
    for v in [e for e in eintraege if e['family'] == familie]:
        bereiche = ', '.join(f"'{r.strip()}'" for r in v['unicodeRange'].split(','))
        zeilen.append(
            f"        {{\n"
            f"          // {v['subset']}\n"
            f"          src: ['./src/fonts/{v['datei']}'],\n"
            f"          weight: '{v['weight']}',\n"
            f"          style: '{v['style']}',\n"
            f"          unicodeRange: [{bereiche}],\n"
            f"        }},"
        )
    return '\n'.join(zeilen)


def main() -> None:
    eintraege = varianten()
    ZIEL.mkdir(parents=True, exist_ok=True)

    gesamt = 0
    for v in eintraege:
        daten = lade(v['url'])
        (ZIEL / v['datei']).write_bytes(daten)
        gesamt += len(daten)
        print(f"{v['datei']:46} {len(daten) // 1024:>4} KB")

    print(f'\n{len(eintraege)} Dateien, {gesamt // 1024} KB gesamt\n')
    for familie in KURZNAMEN:
        print(f'— {familie} —')
        print(block(eintraege, familie))
        print()

    print('Diese Blöcke in astro.config.mjs unter `options.variants` eintragen.')
    print('Bei einer neuen Schrift auch die OFL-Lizenz nach public/fonts/ legen.')


if __name__ == '__main__':
    main()
