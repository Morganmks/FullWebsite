// Re-encode a video at an explicit bitrate and size, keeping FULL duration.
// avconvert only offers fixed-quality presets, which is why the shipped hero
// had to be trimmed to fit. This gives real rate control, so length is no
// longer the lever — compression is.
//
// usage: swift encode.swift <in> <out.mp4> <width> <height> <videoKbps> <audioKbps>
import Foundation
import AVFoundation

let a = CommandLine.arguments
guard a.count >= 7,
      let W = Int(a[3]), let H = Int(a[4]),
      let vKbps = Int(a[5]), let aKbps = Int(a[6]) else { exit(64) }

let inURL = URL(fileURLWithPath: a[1])
let outURL = URL(fileURLWithPath: a[2])
try? FileManager.default.removeItem(at: outURL)

let asset = AVAsset(url: inURL)
guard let vTrack = asset.tracks(withMediaType: .video).first else {
    FileHandle.standardError.write("no video track\n".data(using: .utf8)!); exit(65)
}
let aTrack = asset.tracks(withMediaType: .audio).first

let target = CGSize(width: W, height: H)
let natural = vTrack.naturalSize.applying(vTrack.preferredTransform)
let srcW = abs(natural.width), srcH = abs(natural.height)

// Scale through a video composition — this is what actually resizes the frames.
let comp = AVMutableVideoComposition()
comp.renderSize = target
comp.frameDuration = CMTime(value: 1, timescale: 30)
let instruction = AVMutableVideoCompositionInstruction()
instruction.timeRange = CMTimeRange(start: .zero, duration: asset.duration)
let layer = AVMutableVideoCompositionLayerInstruction(assetTrack: vTrack)
let scale = min(target.width / srcW, target.height / srcH)
layer.setTransform(vTrack.preferredTransform.concatenating(
    CGAffineTransform(scaleX: scale, y: scale)), at: .zero)
instruction.layerInstructions = [layer]
comp.instructions = [instruction]

let reader = try AVAssetReader(asset: asset)
let vOut = AVAssetReaderVideoCompositionOutput(
    videoTracks: [vTrack],
    videoSettings: [kCVPixelBufferPixelFormatTypeKey as String:
                        Int(kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange)])
vOut.videoComposition = comp
vOut.alwaysCopiesSampleData = false
reader.add(vOut)

var aOut: AVAssetReaderTrackOutput?
if let aTrack {
    let o = AVAssetReaderTrackOutput(track: aTrack, outputSettings: [
        AVFormatIDKey: Int(kAudioFormatLinearPCM),
        AVLinearPCMBitDepthKey: 16,
        AVLinearPCMIsFloatKey: false,
        AVLinearPCMIsBigEndianKey: false,
        AVLinearPCMIsNonInterleaved: false,
    ])
    o.alwaysCopiesSampleData = false
    reader.add(o); aOut = o
}

let writer = try AVAssetWriter(outputURL: outURL, fileType: .mp4)
// faststart: the player can begin before the whole file has downloaded, which
// matters a lot for a hero video on a landing page.
writer.shouldOptimizeForNetworkUse = true

let vIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: W,
    AVVideoHeightKey: H,
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: vKbps * 1000,
        AVVideoMaxKeyFrameIntervalKey: 60,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
    ],
])
vIn.expectsMediaDataInRealTime = false
writer.add(vIn)

var aIn: AVAssetWriterInput?
if aTrack != nil {
    let i = AVAssetWriterInput(mediaType: .audio, outputSettings: [
        AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
        AVNumberOfChannelsKey: 2,
        AVSampleRateKey: 44100,
        AVEncoderBitRateKey: aKbps * 1000,
    ])
    i.expectsMediaDataInRealTime = false
    writer.add(i); aIn = i
}

writer.startWriting()
writer.startSession(atSourceTime: .zero)
reader.startReading()

let group = DispatchGroup()

group.enter()
vIn.requestMediaDataWhenReady(on: DispatchQueue(label: "v")) {
    while vIn.isReadyForMoreMediaData {
        guard let buf = vOut.copyNextSampleBuffer() else { vIn.markAsFinished(); group.leave(); return }
        vIn.append(buf)
    }
}

if let aIn, let aOut {
    group.enter()
    aIn.requestMediaDataWhenReady(on: DispatchQueue(label: "a")) {
        while aIn.isReadyForMoreMediaData {
            guard let buf = aOut.copyNextSampleBuffer() else { aIn.markAsFinished(); group.leave(); return }
            aIn.append(buf)
        }
    }
}

group.wait()
let sem = DispatchSemaphore(value: 0)
writer.finishWriting { sem.signal() }
sem.wait()

if writer.status != .completed {
    FileHandle.standardError.write("write failed: \(String(describing: writer.error))\n".data(using: .utf8)!)
    exit(66)
}
let size = (try? FileManager.default.attributesOfItem(atPath: outURL.path)[.size] as? Int) ?? 0
let dur = CMTimeGetSeconds(asset.duration)
print(String(format: "ok %@  %dx%d  %.1fs  %.1f MB", outURL.lastPathComponent, W, H, dur, Double(size ?? 0)/1_048_576))
