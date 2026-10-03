import { luminance, type Rgb, type TraceSource } from "./types.ts";

// CC0 scan of a 2010 issue. Edge correlation 0.42 against the scoring reference (serial and sticker differ; the
// fixed lettering registers). Edges at half coverage: white (L≈205) on navy (L≈18), black (L≈10) on yellow (L≈172).
// The embossed keystone traces with rounded shoulders and regressed the artwork gate, so it stays hand-drawn.
const white = (c: Rgb) => luminance(c) > 112;
const black = (c: Rgb) => luminance(c) < 91;

export default {
  url: "https://upload.wikimedia.org/wikipedia/commons/1/16/2010_Pennsylvania_license_plate_-_HJG-7895.jpg",
  sha256: "f4be9b222b305325c1083dd957d933785612d838eda1aa6516f8db38706e7e13",
  plate: { x: 42.3, y: 38.3, width: 3549.6, height: 1748.6 },
  traces: [
    { name: "PA_NAME", doc: "PENNSYLVANIA", box: { x0: 240, y0: 35, x1: 765, y1: 110 }, ink: white },
    { name: "PA_URL", doc: "visitPA.com", box: { x0: 310, y0: 395, x1: 700, y1: 470 }, ink: black },
  ],
} satisfies TraceSource;
