"""
Dunkle Requisiten aus einem Freisteller nehmen.

Vision stellt zuverlässig frei, hält dabei aber alles für Vordergrund, worauf
das Motiv steht — bei Galas Aufnahmen ist das immer wieder derselbe dunkelgrüne
Samthocker. Auf schwarzem Grund wird daraus ein Klotz unter dem Strauß.

Die Trennung ist einfach, weil die Werte weit auseinanderliegen: Der Hocker
misst rund R19/G45/B44 — dunkel, und Rot deutlich schwächer als Grün und Blau.
Blüten und Papier liegen bei 170–220 in allen Kanälen. Ein Schwellenwert
genügt, es braucht kein Modell.

Danach bleibt die größte zusammenhängende Fläche übrig; das erledigt
`aufbereiten.py` im nächsten Schritt ohnehin.

Aufruf:
    python3 dunkles-entfernen.py <ein.png> <aus.png> [helligkeit] [abstand]

    helligkeit  Ab welcher Helligkeit ein Pixel sicher zum Motiv gehört (110)
    abstand     Wie viel schwächer Rot sein muss als Grün und Blau (8)
"""

import sys

import numpy as np
from PIL import Image


def dunkles_entfernen(
    pfad_ein: str,
    pfad_aus: str,
    helligkeit: int = 110,
    abstand: int = 8,
) -> int:
    im = Image.open(pfad_ein).convert('RGBA')
    daten = np.array(im).astype(int)
    rot, gruen, blau, alpha = (daten[:, :, i] for i in range(4))

    sichtbar = alpha > 24
    dunkel = daten[:, :, :3].max(axis=2) < helligkeit
    blaugruen = (gruen > rot + abstand) & (blau > rot + abstand)

    weg = sichtbar & dunkel & blaugruen
    daten[:, :, 3] = np.where(weg, 0, alpha)

    Image.fromarray(daten.astype(np.uint8), 'RGBA').save(pfad_aus, optimize=True)
    return int(weg.sum())


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(__doc__)
        raise SystemExit(2)

    entfernt = dunkles_entfernen(
        sys.argv[1],
        sys.argv[2],
        int(sys.argv[3]) if len(sys.argv) > 3 else 110,
        int(sys.argv[4]) if len(sys.argv) > 4 else 8,
    )
    print(f'ok {sys.argv[2]} — {entfernt:,} Pixel entfernt'.replace(',', '.'))
