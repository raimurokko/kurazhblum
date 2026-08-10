# Produktfotos aufbereiten

Galas Fotos kommen als HEIC vom iPhone, mit sehr unterschiedlichen
Hintergründen — Schachbrettboden, Atelierwand, weißes Tuch, Hand im Bild. Im
Raster nebeneinander wirkt das unruhig.

Diese zwei Skripte stellen die Sträuße frei und setzen sie einheitlich in eine
4:5-Fläche. Auf dem schwarzen Grund der Website schwebt der Strauß dann — wie
die Iris im Logo.

**Alles läuft lokal.** Das Freistellen macht Apples Vision-Framework auf dem
Mac; es geht kein Bild an einen Cloud-Dienst. Das ist keine Bequemlichkeit,
sondern dieselbe Entscheidung wie beim Rest der Website.

## Voraussetzungen

- macOS 14 oder neuer mit Xcode Command Line Tools (`swift` im Pfad)
- Python mit Pillow und NumPy

## Ablauf

```bash
# 1. HEIC nach JPEG (macOS-Bordmittel)
sips -s format jpeg "IMG_1234.HEIC" --out arbeit/strauss.jpg

# 2. Freistellen — erzeugt ein PNG mit Alphakanal
swift tools/fotos/freistellen.swift arbeit/strauss.jpg arbeit/strauss-frei.png

# 3. Aufräumen und auf 4:5 normieren, 1200 px breit
python3 tools/fotos/aufbereiten.py arbeit/strauss-frei.png \
  public/images/products/mein-strauss.webp 1200
```

Danach den Pfad in `src/data/shop.ts` beim Produkt eintragen.

## Was `aufbereiten.py` macht

1. **Größte zusammenhängende Fläche behalten.** Vision lässt gelegentlich
   Reste stehen — eine Schachtel im Hintergrund, ein Stativbein. Alles, was
   nicht mit dem Strauß zusammenhängt, fällt weg.
2. **Auf das Motiv beschneiden.**
3. **Mittig in 4:5 setzen**, mit durchsichtigem Rand. Bewusst *nicht*
   zuschneiden: so geht nichts vom Strauß verloren, und alle Kacheln haben
   trotzdem dieselbe Form.

## Wenn ein Rest hängen bleibt

Manchmal klebt ein Stück Hintergrund am Motiv und überlebt Schritt 1 — dann
hilft nur ein gezielter Schnitt. Wichtig: **erst auf das Motiv beschneiden,
dann anteilig wegnehmen.** Ein Prozentsatz der Gesamthöhe trifft bei einem PNG
voller durchsichtiger Fläche nicht das, was man meint.

```python
from PIL import Image
import aufbereiten

im = Image.open('arbeit/strauss-frei.png').convert('RGBA')
im = im.crop(im.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox())
im = im.crop((0, round(im.height * 0.10), im.width, im.height))  # 10 % oben weg
im.save('arbeit/strauss-frei.png')
aufbereiten.aufbereiten('arbeit/strauss-frei.png', 'public/images/products/x.webp', 1200)
```

## Grenzen

Durchscheinende Blütenblätter und Seidenpapier sind der schwierige Fall — dort
sitzt die Kante nicht immer perfekt. Bei acht Testbildern saßen sieben auf
Anhieb; eines brauchte den Schnitt oben. Wer wirklich ruhige Kacheln will,
fotografiert mittelfristig vor gleichem Hintergrund; dann braucht es diese
Skripte gar nicht.
