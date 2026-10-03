import { luminance, type Rgb, type TraceSource } from "./types.ts";

// Official TN Department of Revenue art for the 2024 revision of the 2022 blue plate. It drops TNVACATION.COM and
// the curved IN GOD WE TRUST ring and moves the tristar, so only the top lettering is shared with the reference.
// The plate rectangle was fitted on those shared top elements alone (masked edge correlation 0.97); the full-plate
// fit is poor (0.32) because the frame, registration and footer differ. The plate's left/top edge lies just outside
// the image, hence the negative origin. The state outline joins the top rim line, so it cannot be isolated in a box.
// Edges sit at half coverage: white (L≈252) against navy (L≈38).
const white = (c: Rgb) => luminance(c) > 146;

export default {
  url: "https://www.tn.gov/content/dam/tn/revenue/images/licenseplates/large_images/auto-plate-new.jpg",
  sha256: "ccd20ebb124d41a9ed9474ab94ade091ac98fa0fa85227a5a570be7c449d0b68",
  plate: { x: -36.0, y: -14.9, width: 4850.6, height: 2410.1 },
  traces: [
    { name: "TN_NAME", doc: "TENNESSEE", box: { x0: 318, y0: 42, x1: 690, y1: 108 }, ink: white },
    { name: "TN_MOTTO", doc: "THE VOLUNTEER STATE", box: { x0: 36, y0: 40, x1: 250, y1: 135 }, ink: white },
  ],
} satisfies TraceSource;
