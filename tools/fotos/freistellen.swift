// Freistellen mit Apples Vision-Framework — läuft lokal, nichts verlässt den Rechner.
// Aufruf: swift freistellen.swift <eingabe.jpg> <ausgabe.png>

import Foundation
import Vision
import CoreImage
import AppKit

let args = CommandLine.arguments
guard args.count == 3 else {
    FileHandle.standardError.write("Aufruf: freistellen.swift <eingabe> <ausgabe.png>\n".data(using: .utf8)!)
    exit(2)
}

let inputURL = URL(fileURLWithPath: args[1])
let outputURL = URL(fileURLWithPath: args[2])

let handler = VNImageRequestHandler(url: inputURL, options: [:])
let request = VNGenerateForegroundInstanceMaskRequest()

do {
    try handler.perform([request])
} catch {
    FileHandle.standardError.write("Vision-Fehler: \(error)\n".data(using: .utf8)!)
    exit(1)
}

guard let observation = request.results?.first else {
    FileHandle.standardError.write("Kein Vordergrund erkannt\n".data(using: .utf8)!)
    exit(1)
}

do {
    // Alle erkannten Instanzen zusammen — bei einem Strauß ist das der Strauß
    // samt Papier; einzelne Instanzen würden ihn zerlegen.
    let masked = try observation.generateMaskedImage(
        ofInstances: observation.allInstances,
        from: handler,
        croppedToInstancesExtent: false
    )

    let ciImage = CIImage(cvPixelBuffer: masked)
    let context = CIContext()
    guard let colorSpace = CGColorSpace(name: CGColorSpace.sRGB) else { exit(1) }

    try context.writePNGRepresentation(
        of: ciImage,
        to: outputURL,
        format: .RGBA8,
        colorSpace: colorSpace
    )

    let count = observation.allInstances.count
    print("ok \(inputURL.lastPathComponent) → \(count) Instanz(en)")
} catch {
    FileHandle.standardError.write("Maskierung fehlgeschlagen: \(error)\n".data(using: .utf8)!)
    exit(1)
}
