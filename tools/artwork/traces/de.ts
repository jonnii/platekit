import { luminance, type Rgb, type TraceSource } from "./types.ts";

// Official Delaware DMV sample artwork; its PLACE STICKER HERE box (bottom right) lies outside the boxes.
// Gold (L≈157) against navy (L≈12): the edge sits at L 85.
const gold = (c: Rgb) => luminance(c) > 85;

export default {
  url: "https://services.dmv.de.gov/VehicleServices/tags/specialty-plates/images/PNG/Sample.png",
  sha256: "0d34b738f062ce8498a0a89d6adcd3e2c6bdffe2226d1c956a610b7ca4d5ba07",
  plate: { x: 10.1, y: 6.7, width: 3585.8, height: 1783.6 },
  traces: [
    { name: "DE_MOTTO", doc: "THE FIRST STATE", box: { x0: 240, y0: 30, x1: 760, y1: 110 }, ink: gold },
    { name: "DE_NAME", doc: "DELAWARE", box: { x0: 260, y0: 395, x1: 740, y1: 480 }, ink: gold },
  ],
} satisfies TraceSource;
