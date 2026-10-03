import { luminance, type Rgb, type TraceSource } from "./types.ts";

// Wikimedia Commons photo of a real 2018 plate (Colorado_2018_License_Plate.jpg, CC BY 4.0), straight on, with
// sparkly reflective sheeting. Aligned on the border and mountains (0.31 against the replica reference, whose
// COLORADO sits a few units higher and narrower). Green ink (L≈40) against white sheeting (L≈185): half coverage.
const green = (c: Rgb) => luminance(c) < 112;

export default {
  url: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Colorado_2018_License_Plate.jpg",
  sha256: "068be6a0e4947d85b1f14aa681598a1f8f5118a09ae62cfa25bc6af160a3983e",
  plate: { x: 12.0, y: 14.0, width: 2559.6, height: 1242.9 },
  traces: [
    { name: "CO_NAME", doc: "COLORADO", box: { x0: 255, y0: 368, x1: 750, y1: 457 }, ink: green, smooth: .5 },
  ],
} satisfies TraceSource;
