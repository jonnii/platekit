import type { Rgb, TraceSource } from "./types.ts";

// Wikimedia Commons photo of a 2016 plate (CC BY 4.0), straight on; the rectangle is the photo's own plate outline
// (the replica reference's registration differs, so edge correlation is low). NEVADA: near-black ink (G≈20) against
// the sky (G≈140), cut at half coverage, which also keeps out the blue security wave.
// "Home Means Nevada" is not traced: at ~2.3 px/unit its translucent ink over the halftone mountains cannot be cut
// cleanly from the darkest facets (thin strokes break before the dot screen drops out), so NV_MOTTO stays a font outline.
const onSky = (c: Rgb) => c[1] < 80;

export default {
  url: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Nevada_2016_License_Plate.png",
  sha256: "2d64ca288db7fd3d624a3aac370df290a5fdf31b44753acc93d1bcc433608e59",
  plate: { x: 15, y: 27, width: 2258, height: 1132 },
  replaces: ["nv-name"],
  traces: [
    { name: "NV_NAME", doc: "NEVADA", box: { x0: 250, y0: 25, x1: 775, y1: 125 }, ink: onSky, smooth: .6 },
  ],
} satisfies TraceSource;
