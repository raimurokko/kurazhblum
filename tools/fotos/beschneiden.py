"""
Fotos mit Hintergrund für die Website zuschneiden.

Gegenstück zu `aufbereiten.py`: Dort wird ein Motiv freigestellt und schwebt
auf schwarzem Grund. Hier bleibt das Bild, wie es ist — bei einer Trauung am
See, einem gedeckten Tisch oder einem Kurstisch *ist* der Hintergrund die
Aussage. Freistellen würde ihn wegnehmen.

Drei Schritte:
  1. EXIF-Lage festschreiben. iPhone-Fotos liegen im Speicher quer und sind
     nur durch ein Etikett hochkant; ohne diesen Schritt landen sie gedreht
     auf der Seite.
  2. Auf das Zielverhältnis beschneiden, ohne zu verzerren. Der Anker
     entscheidet, welcher Teil erhalten bleibt — bei einem Hochformat, aus dem
     ein Querformat werden soll, geht zwangsläufig viel verloren.
  3. Auf die Zielbreite verkleinern und als WebP speichern.

Aufruf:
    python3 beschneiden.py <ein> <aus.webp> <breite> [<b:h>] [mitte|oben|unten]

Beispiel:
    python3 tools/fotos/beschneiden.py \
      arbeit/hochzeit.jpg public/images/weddings/hero.webp 1600 4:3 oben
"""

import sys

from PIL import Image, ImageOps

ANKER = ('mitte', 'oben', 'unten')


def zuschneiden(im: Image.Image, verhaeltnis: float, anker: str = 'mitte') -> Image.Image:
    """Größtmöglicher Ausschnitt im gewünschten Verhältnis."""
    b, h = im.size
    if b / h > verhaeltnis:
        # zu breit — links und rechts abnehmen, immer mittig
        neu_b = round(h * verhaeltnis)
        links = (b - neu_b) // 2
        return im.crop((links, 0, links + neu_b, h))

    # zu hoch — oben und unten abnehmen, der Anker entscheidet wo
    neu_h = round(b / verhaeltnis)
    if anker == 'oben':
        oben = 0
    elif anker == 'unten':
        oben = h - neu_h
    else:
        oben = (h - neu_h) // 2
    return im.crop((0, oben, b, oben + neu_h))


def beschneiden(
    pfad_ein: str,
    pfad_aus: str,
    breite: int,
    verhaeltnis=(4, 3),
    anker: str = 'mitte',
) -> None:
    im = ImageOps.exif_transpose(Image.open(pfad_ein)).convert('RGB')
    im = zuschneiden(im, verhaeltnis[0] / verhaeltnis[1], anker)

    hoehe = round(breite * verhaeltnis[1] / verhaeltnis[0])
    if im.width > breite:
        im = im.resize((breite, hoehe), Image.LANCZOS)

    # Nicht hochrechnen: Ein vergrößertes Bild sieht schlechter aus als ein
    # kleines und täuscht eine Auflösung vor, die es nicht gibt.
    if pfad_aus.lower().endswith('.png'):
        im.save(pfad_aus, optimize=True)
    else:
        im.save(pfad_aus, quality=86, method=6)


if __name__ == '__main__':
    if len(sys.argv) < 4:
        print(__doc__)
        raise SystemExit(2)

    verhaeltnis = (4, 3)
    if len(sys.argv) > 4:
        b, _, h = sys.argv[4].partition(':')
        verhaeltnis = (int(b), int(h))

    anker = sys.argv[5] if len(sys.argv) > 5 else 'mitte'
    if anker not in ANKER:
        raise SystemExit(f'Anker muss einer von {ANKER} sein, nicht {anker!r}')

    beschneiden(sys.argv[1], sys.argv[2], int(sys.argv[3]), verhaeltnis, anker)

    with Image.open(sys.argv[2]) as fertig:
        print(f'ok {sys.argv[2]} {fertig.width}×{fertig.height}')
