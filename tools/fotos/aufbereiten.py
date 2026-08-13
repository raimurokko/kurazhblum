"""
Freigestellte Fotos für die Website aufbereiten.

Drei Schritte:
  1. Nur die größte zusammenhängende Fläche behalten — Vision lässt manchmal
     Reste stehen (eine Schachtel im Hintergrund, ein Hockerbein).
  2. Auf den sichtbaren Inhalt beschneiden.
  3. Mittig in eine 4:5-Fläche setzen, mit durchsichtigem Rand. Nicht
     zuschneiden: auf schwarzem Grund schwebt der Strauß dann, und es geht
     nichts vom Motiv verloren.

Aufruf:
    python3 aufbereiten.py <eingabe.png> <ausgabe.webp|png> <breite>
"""

import sys
from collections import deque

import numpy as np
from PIL import Image, ImageOps


def groesste_flaeche(alpha: np.ndarray, schwelle: int = 24) -> np.ndarray:
    """Maske der größten zusammenhängenden Fläche (4er-Nachbarschaft, iterativ)."""
    fest = alpha > schwelle
    h, w = fest.shape
    beste = np.zeros_like(fest, dtype=bool)
    beste_groesse = 0

    # Zur Beschleunigung auf einem verkleinerten Bild suchen und danach
    # hochskalieren — bei 3000 × 4000 px wäre eine Pixel-BFS zu langsam.
    skala = max(1, int(max(h, w) / 700))
    klein = fest[::skala, ::skala]
    kh, kw = klein.shape
    kbesucht = np.zeros_like(klein, dtype=bool)

    for sy in range(kh):
        for sx in range(kw):
            if not klein[sy, sx] or kbesucht[sy, sx]:
                continue
            warteschlange = deque([(sy, sx)])
            kbesucht[sy, sx] = True
            zellen = []
            while warteschlange:
                y, x = warteschlange.popleft()
                zellen.append((y, x))
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < kh and 0 <= nx < kw and klein[ny, nx] and not kbesucht[ny, nx]:
                        kbesucht[ny, nx] = True
                        warteschlange.append((ny, nx))
            if len(zellen) > beste_groesse:
                beste_groesse = len(zellen)
                maske_klein = np.zeros_like(klein, dtype=bool)
                for y, x in zellen:
                    maske_klein[y, x] = True
                beste = maske_klein

    if beste_groesse == 0:
        return fest

    # Zurück auf volle Auflösung und mit der Originalmaske verschneiden,
    # damit die Kanten scharf bleiben.
    gross = np.kron(beste, np.ones((skala, skala), dtype=bool))[:h, :w]
    if gross.shape != fest.shape:
        auffuellen = np.zeros_like(fest, dtype=bool)
        auffuellen[: gross.shape[0], : gross.shape[1]] = gross
        gross = auffuellen
    return fest & gross


def motivkasten(im: Image.Image, schwelle: int = 24):
    """Begrenzungsrahmen des sichtbaren Inhalts."""
    return im.getchannel('A').point(lambda v: 255 if v > schwelle else 0).getbbox()


def aufbereiten(pfad_ein: str, pfad_aus: str, breite: int, verhaeltnis=(4, 5)) -> None:
    # Die Lage zuerst festschreiben. Aus `freistellen.swift` kommt ein PNG ohne
    # EXIF, da ist das ein Leerlauf — wird dieses Skript aber direkt auf ein
    # Foto aus der Kamera angesetzt, entscheidet es über hochkant oder quer.
    im = ImageOps.exif_transpose(Image.open(pfad_ein)).convert('RGBA')
    a = np.array(im)[:, :, 3]

    maske = groesste_flaeche(a)
    daten = np.array(im)
    daten[:, :, 3] = np.where(maske, a, 0)
    im = Image.fromarray(daten, 'RGBA')

    kasten = motivkasten(im)
    if kasten:
        im = im.crop(kasten)

    # In 4:5 einpassen, ohne zu beschneiden
    zielh = round(breite * verhaeltnis[1] / verhaeltnis[0])
    rand = 0.94  # etwas Luft an den Rändern
    im.thumbnail((round(breite * rand), round(zielh * rand)), Image.LANCZOS)

    leinwand = Image.new('RGBA', (breite, zielh), (0, 0, 0, 0))
    leinwand.alpha_composite(im, ((breite - im.width) // 2, (zielh - im.height) // 2))

    if pfad_aus.lower().endswith('.png'):
        leinwand.save(pfad_aus, optimize=True)
    else:
        leinwand.save(pfad_aus, quality=86, method=6)


if __name__ == '__main__':
    # Viertes Argument: Seitenverhältnis, z. B. `1:1` für Kategoriekacheln.
    # Ohne Angabe bleibt es bei 4:5 wie bei den Produktbildern.
    verhaeltnis = (4, 5)
    if len(sys.argv) > 4:
        b, _, h = sys.argv[4].partition(':')
        verhaeltnis = (int(b), int(h))

    aufbereiten(sys.argv[1], sys.argv[2], int(sys.argv[3]), verhaeltnis)
    print('ok', sys.argv[2])
