import { luminance, type Rgb, type TraceSource } from "./types.ts";

// Official MS DOR flat artwork. The scoring reference is a horizontally stretched novelty render, so the aligned plate
// rectangle is narrower than 2:1 in source pixels (correlation 0.27: the serial and county differ; wordmark and medallion agree).
// Navy (L≈30) against white (L≈248): the edge sits at L 139.
const navy = (c: Rgb) => luminance(c) < 139;

export default {
  url: "https://www.dor.ms.gov/sites/default/files/news/2024%20License%20Plate%202.png",
  sha256: "1b7fb841423e7bb0221e3123b49df7afc61128d6df939c496f62367f32e8a379",
  plate: { x: 89.1, y: 9.4, width: 1933.7, height: 1071.8 },
  traces: [
    { name: "MS_NAME", doc: "MISSISSIPPI wordmark with its interlinked ring swashes", box: { x0: 280, y0: 10, x1: 720, y1: 150 }, ink: navy },
  ],
} satisfies TraceSource;
