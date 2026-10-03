import type { Rgb, TraceSource } from "./types.ts";

// Two CC BY-SA 4.0 photos. The scoring reference is a replica whose lettering is ~12% shorter relative to its width
// than on real plates, and whose rim and serial differ, so each rectangle was fitted by edge correlation masked to the
// one element traced from that source (wordmark 0.40, motto 0.38); full-plate correlation is meaningless here.
// (a) A Veterans plate, upscaled and crisp (~6 px/unit): only the shared "Massachusetts" wordmark is traced; its bottom
//     line reads "Veteran".
// (b) A 2011 standard plate (~1.6 px/unit), for "The Spirit of America".
// Edges sit at half coverage on red, which the blue ink lacks: wordmark R≈16 on R≈215. The motto (R≈20 on R≈210) is
// cut lower, at R<100, because chroma blur at this resolution otherwise thickens its strokes against the photo.
const blue = (c: Rgb) => c[0] < 116;
const motto = (c: Rgb) => c[0] < 100;

export default [
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/4/47/Massachusetts_Veterans_1.jpg",
    sha256: "aacd8e0a05fcef2265013c239b7c2fe28ed44757b018729c31ea11f6e24f189c",
    plate: { x: -170.5, y: -81.9, width: 6092.2, height: 3446.5 },
    traces: [
      { name: "MA_NAME", doc: "Massachusetts", box: { x0: 235, y0: 8, x1: 775, y1: 96 }, ink: blue, smooth: .3 },
    ],
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/a/af/Massachusetts_2011_license_plate.png",
    sha256: "ad27e543ca9f02c9273a12298ffd9bff12fadc0e655fc0b2728742644e86cf90",
    plate: { x: 14.0, y: 35.7, width: 1604.8, height: 767.7 },
    replaces: ["ma-motto"],
    traces: [
      { name: "MA_MOTTO", doc: "The Spirit of America", box: { x0: 232, y0: 405, x1: 790, y1: 492 }, ink: motto, smooth: .6 },
    ],
  },
] satisfies TraceSource[];
