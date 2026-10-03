import { luminance, type Rgb, type TraceSource } from "./types.ts";

// Wikimedia Commons flat scan of a 2012 sample plate (public domain). The scan trims the plate's outer rim, so the
// plate rectangle extends past the image; it was aligned on the lettering (the sample registration differs from the
// reference, which keeps correlation low). Black ink (L≈0) against white sheeting (L≈226): cut at half coverage.
const ink = (c: Rgb) => luminance(c) < 113;

export default {
  url: "https://upload.wikimedia.org/wikipedia/commons/8/8f/2012_Texas_license_plate_ABC_1234.png",
  sha256: "512060419e860d8fd60531c7dd6a9471ed390a69a30c9c0245f5f9dd836a2e3f",
  plate: { x: -36.2, y: -62.1, width: 3426.3, height: 1720.4 },
  traces: [
    { name: "TX_NAME", doc: "TEXAS", box: { x0: 285, y0: 30, x1: 705, y1: 140 }, ink, smooth: .4 },
    { name: "TX_STAR", doc: "outlined, faceted star at top left", box: { x0: 35, y0: 40, x1: 180, y1: 170 }, ink, smooth: .4 },
    { name: "TX_STATE", doc: "Texas outline between registration groups", box: { x0: 380, y0: 235, x1: 480, y1: 335 }, ink, smooth: .4 },
    { name: "TX_MOTTO", doc: "The Lone Star State", box: { x0: 245, y0: 420, x1: 745, y1: 482 }, ink, smooth: .4 },
  ],
} satisfies TraceSource;
