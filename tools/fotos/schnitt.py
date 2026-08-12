"""Gezielter Schnitt entlang eines Polygons.

Vision stellt den Hintergrund zuverlässig frei, hält aber alles fest, was zum
selben Vordergrund gehört — bei einem gehaltenen Strauß also auch die Person.
Die Personensegmentierung (`VNGeneratePersonSegmentationRequest`) hilft dabei
nicht: Sie liefert die Silhouette *samt* dem, was die Person hält, und deckt
damit den Strauß mit ab. Getestet, verworfen.

Bleibt der Schnitt von Hand. Das ist weniger schlimm, als es klingt: Ein
Polygon entlang der Papierkante ist in zehn Minuten gesetzt und danach
reproduzierbar, weil die Koordinaten hier als Anteile der Bildbreite und
-höhe stehen — unabhängig von der Auflösung.

Läuft *vor* `aufbereiten.py`:

    swift tools/fotos/freistellen.swift arbeit/foto.jpg arbeit/frei.png
    python3 tools/fotos/schnitt.py arbeit/frei.png arbeit/schnitt.png "[[0,0.2],…]"
    python3 tools/fotos/aufbereiten.py arbeit/schnitt.png ziel.webp 1200

Zum Setzen der Koordinaten hilft ein Raster über dem freigestellten Bild:
durchsichtige Flächen mit Magenta hinterlegen, alle 5 % eine Linie ziehen,
Prozentwerte anschreiben. Dann lässt sich die Kante direkt ablesen.
"""

import sys

from PIL import Image, ImageChops, ImageDraw, ImageFilter

# Die tatsächlich verwendeten Polygone der drei Kategoriekacheln. Rohbilder
# liegen in preparation/fotos-raw/. Wer eine Kachel neu erzeugen muss, nimmt
# diese Werte als Ausgangspunkt statt bei null anzufangen.
POLYGONE = {
    # Hortensien: Person rechts oben weg, Schnitt folgt der Papierkante.
    'hortensien': [
        (0.0, 0.20), (0.20, 0.24), (0.36, 0.26), (0.47, 0.28), (0.535, 0.295),
        (0.575, 0.355), (0.615, 0.415), (0.655, 0.47), (0.71, 0.545),
        (0.775, 0.635), (0.835, 0.745), (0.86, 0.86), (0.87, 1.0), (0.0, 1.0),
    ],
    # Dopamin: drei Sträuße berühren sich, deshalb greift die
    # Größte-Fläche-Regel in aufbereiten.py nicht. Nur der mittlere bleibt.
    'dopamin': [
        (0.0, 0.18), (0.10, 0.04), (0.20, 0.0), (0.30, 0.08), (0.42, 0.04),
        (0.55, 0.0), (0.62, 0.06), (0.70, 0.11), (0.745, 0.22), (0.755, 0.34),
        (0.735, 0.44), (0.72, 0.50), (0.695, 0.57), (0.655, 0.645), (0.60, 0.705),
        (0.52, 0.775), (0.44, 0.825), (0.375, 0.838), (0.30, 0.80), (0.255, 0.755),
        (0.195, 0.695), (0.13, 0.635), (0.06, 0.593), (0.0, 0.565),
    ],
    # Rosen: Die Hand greift mitten in die Stiele — beides ist nicht zu
    # trennen. Deshalb bleibt der Blütenkopf samt Grün, Stiele und Band gehen
    # mit der Hand weg.
    'rosen': [
        (0.0, 0.05), (1.0, 0.05), (1.0, 0.60), (0.97, 0.665), (0.90, 0.735),
        (0.80, 0.775), (0.68, 0.78), (0.56, 0.755), (0.46, 0.70), (0.40, 0.645),
        (0.34, 0.60), (0.28, 0.583), (0.19, 0.565), (0.10, 0.50), (0.0, 0.42),
    ],
}


def schneiden(pfad_ein: str, pfad_aus: str, polygon, weich: int = 2) -> None:
    """Behält nur, was innerhalb des Polygons liegt.

    `polygon` sind (x, y)-Paare als Anteile zwischen 0 und 1. `weich` glättet
    die Schnittkante um wenige Pixel — ohne das sitzt auf dem schwarzen Grund
    der Website eine harte Treppe.
    """
    im = Image.open(pfad_ein).convert('RGBA')
    w, h = im.size

    maske = Image.new('L', (w, h), 0)
    ImageDraw.Draw(maske).polygon([(round(x * w), round(y * h)) for x, y in polygon], fill=255)
    if weich:
        maske = maske.filter(ImageFilter.GaussianBlur(weich))

    im.putalpha(ImageChops.multiply(im.getchannel('A'), maske))
    im.save(pfad_aus)


if __name__ == '__main__':
    import json

    vorgabe = sys.argv[3]
    polygon = POLYGONE[vorgabe] if vorgabe in POLYGONE else json.loads(vorgabe)
    schneiden(sys.argv[1], sys.argv[2], polygon)
    print('ok', sys.argv[2])
