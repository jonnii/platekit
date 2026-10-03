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
  plate: { x: 0, y: 0, width: 3800, height: 1954 }, // the scoring reference crop of this same image: exact registration
  traces: [
    { name: "IL_NAME", doc: "ILLINOIS", box: { x0: 250.8, y0: 31, x1: 740.4, y1: 114.9 }, ink: navy, smooth: .4 },
    { name: "IL_MOTTO", doc: "LAND OF LINCOLN", box: { x0: 275, y0: 393.5, x1: 716.2, y1: 455 }, ink: charcoal, smooth: .4 },
  ],
} satisfies TraceSource;
