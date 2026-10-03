import { luminance, type Rgb, type TraceSource } from "./types.ts";

// CC0 flat scan of a 2017 issue. Edge correlation 0.26 against the scoring reference (a replica with a different
// serial and portrait); ILLINOIS and LAND OF LINCOLN register. Edges at half coverage. The sky's sheeting texture
// overlaps navy in luminance, so the name splits on blue instead: navy (b≈70) on sky (b≈175). Charcoal (L≈62) on
// silver (L≈172). Rust specks fall below the turd size.
const navy = (c: Rgb) => c[2] < 122;
const charcoal = (c: Rgb) => luminance(c) < 117;

export default {
  url: "https://upload.wikimedia.org/wikipedia/commons/b/b4/2017_Illinois_License_Plate.png",
  sha256: "2072aa92c5ca1444e7e1fc3cb85ba82d77f0ab0e9803fcd1a0419169a2c6ab50",
  plate: { x: 31.9, y: 66.7, width: 3684.3, height: 1820.6 },
  traces: [
    { name: "IL_NAME", doc: "ILLINOIS", box: { x0: 250, y0: 15, x1: 755, y1: 105 }, ink: navy, smooth: .4 },
    { name: "IL_MOTTO", doc: "LAND OF LINCOLN", box: { x0: 275, y0: 404, x1: 730, y1: 470 }, ink: charcoal, smooth: .4 },
  ],
} satisfies TraceSource;
