import { luminance, type Rgb, type TraceSource } from "./types.ts";

// CC0 scan of a 2010 issue. Edge correlation 0.42 against the scoring reference (serial and sticker differ; the
// fixed lettering registers). Edges at half coverage: white (L≈205) on navy (L≈18), black (L≈10) on yellow (L≈172).
// The embossed keystone traces with rounded shoulders and regressed the artwork gate, so it stays hand-drawn.
const white = (c: Rgb) => luminance(c) > 112;
const black = (c: Rgb) => luminance(c) < 91;

export default {
  url: "https://upload.wikimedia.org/wikipedia/commons/1/16/2010_Pennsylvania_license_plate_-_HJG-7895.jpg",
  sha256: "f4be9b222b305325c1083dd957d933785612d838eda1aa6516f8db38706e7e13",
  plate: { x: 10, y: 10, width: 3620, height: 1810 }, // the scoring reference crop of this same image: exact registration
  traces: [
    { name: "PA_NAME", doc: "PENNSYLVANIA", box: { x0: 244.3, y0: 41.6, x1: 759, y1: 114.1 }, ink: white },
    { name: "PA_URL", doc: "visitPA.com", box: { x0: 312.9, y0: 389.4, x1: 695.3, y1: 461.9 }, ink: black },
  ],
} satisfies TraceSource;
