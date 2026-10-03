import { type Rgb, type TraceSource } from "./types.ts";

// Wikimedia Commons flat scan of a 2017 plate (public domain), aligned on the lettering (the registration differs).
// Edges sit at half coverage on the red channel: blue ink (R≈8) against white sheeting (R≈226), requiring a blue cast
// so the grey security wave (R≈173) and bolt-hole shadows stay out; white footer (R≈239) against the band (R≈7).
const blue = (c: Rgb) => c[0] < 117 && c[2] - c[0] > 40;
const white = (c: Rgb) => c[0] > 123;

export default {
  url: "https://upload.wikimedia.org/wikipedia/commons/5/56/2017_Michigan_state_license_plate%2C_DNJ-0955.jpg",
  sha256: "1848b47f7a8416cbd559b4c8e06ce93a8fe9951a99672ef8f1c953c637f8f0bb",
  plate: { x: 34.0, y: 19.4, width: 3815.8, height: 1926.5 },
  traces: [
    { name: "MI_NAME", doc: "PURE MICHIGAN with the brush-script M", box: { x0: 268, y0: 22, x1: 728, y1: 140 }, ink: blue, smooth: .4 },
    { name: "MI_URL", doc: "michigan.org, reversed out of the footer band", box: { x0: 345, y0: 418, x1: 655, y1: 482 }, ink: white, smooth: .4 },
  ],
} satisfies TraceSource;
