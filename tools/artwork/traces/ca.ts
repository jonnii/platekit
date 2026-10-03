import type { Rgb, TraceSource } from "./types.ts";

// Wikimedia Commons photo of a 2018 plate (CC BY-SA 4.0), straight on and evenly lit. The scoring reference is a
// replica whose registration and script placement differ, so edge correlation is low; the rectangle is the photo's own
// plate outline. Red ink (G≈75) against white (G≈235): cut at half coverage. The orange sticker beside the swash has
// G well above B (≈144 vs ≈80) while the red ink and its white blend keep G≈B, which keeps the sticker out.
const red = (c: Rgb) => c[1] < 155 && c[0] - c[1] > 60 && c[1] - c[2] < 35;

export default {
  url: "https://upload.wikimedia.org/wikipedia/commons/b/b0/California_2018_license_plate_%28USA%29.jpg",
  sha256: "dd58b62f4f75690280dd0b021b19422cef7f4f4381664d3ee512106e6f491e5c",
  plate: { x: 41, y: 23, width: 3396, height: 1725 },
  traces: [
    { name: "CA_NAME", doc: "California script with its trailing swash", box: { x0: 200, y0: 35, x1: 822, y1: 205 }, ink: red, smooth: .8 },
    { name: "CA_URL", doc: "dmv.ca.gov", box: { x0: 250, y0: 425, x1: 770, y1: 488 }, ink: red, smooth: .6, minArea: 2 },
  ],
} satisfies TraceSource;
