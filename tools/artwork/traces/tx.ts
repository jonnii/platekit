import { luminance, type Rgb, type TraceSource } from "./types.ts";

// Wikimedia Commons flat scan of a 2012 sample plate (public domain). The scan trims the plate's outer rim, so the
// plate rectangle extends past the image; it was aligned on the lettering (the sample registration differs from the
// reference, which keeps correlation low). Black ink (L≈0) against white sheeting (L≈226): cut at half coverage.
const ink = (c: Rgb) => luminance(c) < 113;

export default {
  url: "https://upload.wikimedia.org/wikipedia/commons/8/8f/2012_Texas_license_plate_ABC_1234.png",
  sha256: "512060419e860d8fd60531c7dd6a9471ed390a69a30c9c0245f5f9dd836a2e3f",
  plate: { x: 0, y: 0, width: 3348, height: 1622 }, // the scoring reference crop of this same image: exact registration
  traces: [
    { name: "TX_NAME", doc: "TEXAS", box: { x0: 280.9, y0: 12.7, x1: 710.7, y1: 129.4 }, ink, smooth: .4 },
    { name: "TX_STAR", doc: "outlined, faceted star at top left", box: { x0: 25, y0: 23.3, x1: 173.4, y1: 161.2 }, ink, smooth: .4 },
    { name: "TX_STATE", doc: "Texas outline between registration groups", box: { x0: 378.1, y0: 230.1, x1: 480.4, y1: 336.2 }, ink, smooth: .4 },
    { name: "TX_MOTTO", doc: "The Lone Star State", box: { x0: 239.9, y0: 426.3, x1: 751.6, y1: 492.1 }, ink, smooth: .4 },
  ],
} satisfies TraceSource;
