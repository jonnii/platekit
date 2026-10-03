import { luminance, type Rgb, type TraceSource } from "./types.ts";

// Official ITD photo of a physical sample, straight on. The scoring reference is a re-drawn mockup whose lettering
// is smaller relative to the plate, so correlation is low (0.19, aligned on a white-padded copy because the plate's
// top-left edge is cropped). This rectangle registers the heading and fir line; the footer sits ~16 units higher
// than the mockup's and is shifted in IdahoPlate.
// White ink is cut on the channel its background lacks, at half coverage: green on red (≈16 vs ≈208), red on navy.
// On red, blue also keeps out the bronze screw hole above "Scenic" (blue ≤112 there, ≈190 in the ink).
const onRed = (c: Rgb) => c[1] > 112 && c[2] > 128;
const onNavy = (c: Rgb) => c[0] > 112 && luminance(c) > 112;

export default {
  url: "https://itd.idaho.gov/wp-content/uploads/2025/03/Idaho_Sample-High-Res.jpeg",
  sha256: "b38cefe1d6cfffac1cd4dfbc0b1fb0cf94ab452d26169ac825a4589d338e8cea",
  plate: { x: -41.6, y: -47.2, width: 5074.1, height: 2757.2 },
  traces: [
    { name: "ID_NAME", doc: "Scenic IDAHO, white script joined to the serif name", box: { x0: 105, y0: 30, x1: 705, y1: 150 }, ink: onRed, smooth: .6 },
    { name: "ID_SLOGAN", doc: "FAMOUS POTATOES", box: { x0: 235, y0: 414, x1: 775, y1: 466 }, ink: onNavy, smooth: .6 },
  ],
} satisfies TraceSource;
