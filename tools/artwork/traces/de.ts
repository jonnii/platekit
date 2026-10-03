import { luminance, type Rgb, type TraceSource } from "./types.ts";

// Official Delaware DMV sample artwork; its PLACE STICKER HERE box (bottom right) lies outside the boxes.
// Gold (L≈157) against navy (L≈12): the edge sits at L 85.
const gold = (c: Rgb) => luminance(c) > 85;

export default {
  url: "https://services.dmv.de.gov/VehicleServices/tags/specialty-plates/images/PNG/Sample.png",
  sha256: "0d34b738f062ce8498a0a89d6adcd3e2c6bdffe2226d1c956a610b7ca4d5ba07",
  plate: { x: 0, y: 0, width: 3597, height: 1796 }, // the scoring reference crop of this same image: exact registration
  traces: [
    { name: "DE_MOTTO", doc: "THE FIRST STATE", box: { x0: 242.1, y0: 31.7, x1: 760.4, y1: 111.1 }, ink: gold },
    { name: "DE_NAME", doc: "DELAWARE", box: { x0: 262, y0: 394.1, x1: 740.5, y1: 478.6 }, ink: gold },
  ],
} satisfies TraceSource;
