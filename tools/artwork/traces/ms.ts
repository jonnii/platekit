import { luminance, type Rgb, type TraceSource } from "./types.ts";

// Official MS DOR flat artwork. The scoring reference is a horizontally stretched novelty render, so the aligned plate
// rectangle is narrower than 2:1 in source pixels (correlation 0.27: the serial and county differ; wordmark and medallion agree).
// Navy (L≈30) against white (L≈248): the edge sits at L 139.
const navy = (c: Rgb) => luminance(c) < 139;

export default {
  url: "https://www.dor.ms.gov/sites/default/files/news/2024%20License%20Plate%202.png",
  sha256: "1b7fb841423e7bb0221e3123b49df7afc61128d6df939c496f62367f32e8a379",
  plate: { x: 0, y: 0, width: 2159, height: 1113 }, // the scoring reference crop of this same image: exact registration
  traces: [
    { name: "MS_NAME", doc: "MISSISSIPPI wordmark with its interlinked ring swashes", box: { x0: 292.1, y0: 13.9, x1: 686.1, y1: 148.7 }, ink: navy },
  ],
} satisfies TraceSource;
