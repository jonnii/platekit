import { luminance, type Rgb, type TraceSource } from "./types.ts";

// The scoring reference itself: a 1200px digital novelty render (about 1 px per plate unit), the best source
// found for this design. Its lettering is crisp, so it is upscaled 4× before tracing. Ink: dark green
// (L≈61, g−r≈60) against granite (L≈164) and sky (L≈212); cut at half coverage with a green-tint guard so
// dark granite specks stay out.
const green = (c: Rgb) => luminance(c) < 112 && c[1] - c[0] > 30;

export default {
  url: "https://cdn.shopify.com/s/files/1/0267/1643/8599/files/custom-text-new-hampshire-novelty-flat-license-plate.jpg?v=1718202049&width=1946",
  sha256: "edf94b913dbc27979cc0442d905efceabb2fd4f8b03c07b03352de46f4d9f278",
  plate: { x: 94, y: 346, width: 1011, height: 505 }, // the scoring reference crop of this same image
  upscale: 4,
  replaces: ["nh-hampshire"],
  traces: [
    { name: "NH_MOTTO", doc: "LIVE FREE OR DIE", box: { x0: 236, y0: 20, x1: 766, y1: 94 }, ink: green, smooth: .5, minArea: 2 },
    { name: "NH_NAME", doc: "New HAMPSHIRE, the script New over the serif name", box: { x0: 276, y0: 338, x1: 734, y1: 486 }, ink: green, smooth: .5, minArea: 2 },
  ],
} satisfies TraceSource;
