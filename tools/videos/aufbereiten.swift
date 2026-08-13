// Videos für die Website aufbereiten — lokal über AVFoundation, nichts
// verlässt den Rechner. Wie beim Freistellen der Fotos: keine neue
// Abhängigkeit, `ffmpeg` ist auf keinem Rechner vorausgesetzt.
//
// Aus einem iPhone-Original (30–60 MB) wird eine stumme Schleife von wenigen
// Sekunden. Das Ziel sind ≤ 2 MB je Video: Die Seite liegt auf GitHub Pages
// im selben Repository, und Git LFS liefert Pages nicht aus — große Dateien
// kämen als Zeigerdatei beim Besucher an.
//
// Aufruf:
//   swift aufbereiten.swift <ein.mov> <aus.mp4> [start] [dauer] [hoehe] [mb]
// Beispiel:
//   swift tools/videos/aufbereiten.swift video-workshop-0372.mov \
//     public/videos/workshop.mp4 2 8 720 2

import Foundation
import AVFoundation
import CoreImage

let args = CommandLine.arguments
guard args.count >= 3 else {
    FileHandle.standardError.write("""
    Aufruf: aufbereiten.swift <ein> <aus.mp4> [start=0] [dauer=8] [hoehe=720] [mb=2]

    start   Sekunde, ab der geschnitten wird
    dauer   Länge in Sekunden — kurz halten, es ist eine Schleife
    hoehe   540, 720 oder 1080; bestimmt die Voreinstellung
    mb      harte Obergrenze der Dateigröße in Megabyte

    """.data(using: .utf8)!)
    exit(2)
}

let quelle = URL(fileURLWithPath: args[1])
let ziel = URL(fileURLWithPath: args[2])
let start = args.count > 3 ? Double(args[3]) ?? 0 : 0
let dauer = args.count > 4 ? Double(args[4]) ?? 8 : 8
let hoehe = args.count > 5 ? Int(args[5]) ?? 720 : 720
let maxMB = args.count > 6 ? Double(args[6]) ?? 2 : 2

func abbruch(_ text: String) -> Never {
    FileHandle.standardError.write("\(text)\n".data(using: .utf8)!)
    exit(1)
}

let asset = AVURLAsset(url: quelle)
guard let spur = asset.tracks(withMediaType: .video).first else {
    abbruch("Keine Videospur in \(quelle.lastPathComponent)")
}

let voreinstellung: String
switch hoehe {
case ...540: voreinstellung = AVAssetExportPreset960x540
case ...720: voreinstellung = AVAssetExportPreset1280x720
default:     voreinstellung = AVAssetExportPreset1920x1080
}

// — Nur die Videospur übernehmen ————————————————————————————————————————
// Damit fällt der Ton weg, und zwar bewusst: Er kostet Budget, und bei
// gesprochenem Inhalt verlangt er Untertitel. Eine stumme Schleife braucht
// beides nicht — Autoplay lassen Browser ohnehin nur ohne Ton zu.
let komposition = AVMutableComposition()
guard let zielspur = komposition.addMutableTrack(
    withMediaType: .video,
    preferredTrackID: kCMPersistentTrackID_Invalid
) else { abbruch("Spur nicht anlegbar") }

let zeitraum = CMTimeRange(
    start: CMTime(seconds: start, preferredTimescale: 600),
    duration: CMTime(seconds: min(dauer, asset.duration.seconds - start), preferredTimescale: 600)
)

do {
    try zielspur.insertTimeRange(zeitraum, of: spur, at: .zero)
} catch {
    abbruch("Ausschnitt nicht möglich: \(error.localizedDescription)")
}

// Die Lage steckt in `preferredTransform` — dieselbe Falle wie die
// EXIF-Orientierung bei den Fotos: Ein hochkant gedrehtes iPhone-Video liegt
// im Speicher quer und ist nur durch diese Matrix aufrecht. Ohne sie kippt
// das Video, und es fällt erst auf der Website auf.
zielspur.preferredTransform = spur.preferredTransform

// — Ausgeben ————————————————————————————————————————————————————————————
try? FileManager.default.removeItem(at: ziel)
guard let export = AVAssetExportSession(asset: komposition, presetName: voreinstellung) else {
    abbruch("Voreinstellung \(voreinstellung) nicht verfügbar")
}
export.outputURL = ziel
export.outputFileType = .mp4
export.shouldOptimizeForNetworkUse = true   // Index nach vorn: startet ohne Volldownload
export.fileLengthLimit = Int64(maxMB * 1_048_576)

let warte = DispatchSemaphore(value: 0)
export.exportAsynchronously { warte.signal() }
warte.wait()

guard export.status == .completed else {
    abbruch("Abbruch: \(export.error?.localizedDescription ?? "unbekannt")")
}

// — Posterbild ———————————————————————————————————————————————————————————
// Jedes Video braucht eines: Es ist das, was vor dem Abspielen zu sehen ist,
// was bei „Animationen reduzieren“ allein stehen bleibt und was in den
// strukturierten Daten als `thumbnailUrl` steht.
let posterURL = ziel.deletingPathExtension().appendingPathExtension("jpg")
let erzeuger = AVAssetImageGenerator(asset: asset)
erzeuger.appliesPreferredTrackTransform = true
erzeuger.maximumSize = CGSize(width: 0, height: CGFloat(hoehe))
if let bild = try? erzeuger.copyCGImage(at: zeitraum.start, actualTime: nil),
   let raum = CGColorSpace(name: CGColorSpace.sRGB),
   let daten = CIContext().jpegRepresentation(
       of: CIImage(cgImage: bild),
       colorSpace: raum,
       options: [kCGImageDestinationLossyCompressionQuality as CIImageRepresentationOption: 0.82]
   ) {
    try? daten.write(to: posterURL)
}

let groesse = ((try? FileManager.default.attributesOfItem(atPath: ziel.path))?[.size] as? Int) ?? 0
print(String(
    format: "ok %@ %.2f MB, %.0f s (+ Poster %@)",
    ziel.lastPathComponent,
    Double(groesse) / 1_048_576,
    zeitraum.duration.seconds,
    posterURL.lastPathComponent
))
