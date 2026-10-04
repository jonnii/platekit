import { luminance, type Rgb, type TraceSource } from "./types.ts";

// The scoring reference itself: a 1200px seller render (about 1 px per plate unit), the best source found for
// this design. Its lettering is crisp, so it is upscaled 4× before tracing. Ink: deep red (heading L≈37,
// footer L≈47) against sky (L≈204) and white (L≈236); cut at half coverage with a red-tint guard.
const red = (c: Rgb) => luminance(c) < 125 && c[0] - c[1] > 40;

export default {
  url: "https://cdn.shopify.com/s/files/1/0267/1643/8599/products/arkansas-custom-text-license-plate.jpg?v=1588159643",
  sha256: "c5a90ef3a250b85c7705f25cef89a39cd530f538e6b0ffd2897dc270cb8dfd82",
  plate: { x: 95, y: 347, width: 1012, height: 506 }, // the scoring reference crop of this same image
  upscale: 4,
  traces: [
    { name: "AR_NAME", doc: "Arkansas", box: { x0: 200, y0: 6, x1: 772, y1: 150 }, ink: red, smooth: .5, minArea: 2 },
    { name: "AR_MOTTO", doc: "The Natural State", box: { x0: 262, y0: 408, x1: 724, y1: 484 }, ink: red, smooth: .5, minArea: 2 },
  ],
} satisfies TraceSource;
