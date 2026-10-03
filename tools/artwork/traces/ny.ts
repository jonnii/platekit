import { luminance, type Rgb, type TraceSource } from "./types.ts";

// Official NY DMV artwork. references.ts scores its 660px CMS derivative, cropped at (9, 9, 642, 324), so the
// plate maps exactly: 3750 / 660 horizontally and 1950 / 343 vertically.
// Edges sit at half coverage: navy (L≈38) against white (L≈255), and gold's blue deficit (b≈30) against white.
const navy = (c: Rgb) => luminance(c) < 146 && c[2] > c[0];
const gold = (c: Rgb) => c[2] < 142 && c[0] > 128;

export default {
  url: "https://dmv.ny.gov/sites/default/files/images/2021-11/excelsior_embossed_plate_3d_master.jpg",
  sha256: "b14f3b7116ec365765f90e6461be7410fa8721cf67121c1641b6d9fb8ff7c3ce",
  plate: { x: 9 * 3750 / 660, y: 9 * 1950 / 343, width: 642 * 3750 / 660, height: 324 * 1950 / 343 },
  replaces: ["ny-name"],
  traces: [
    { name: "NY_NAME", doc: "NEW YORK", box: { x0: 252, y0: 35, x1: 748, y1: 125 }, ink: navy },
    { name: "NY_MOTTO_OUTLINE", doc: "EXCELSIOR, navy outline and fill extent", box: { x0: 276, y0: 390, x1: 740, y1: 468 }, ink: (c) => navy(c) || gold(c) },
    { name: "NY_MOTTO_FILL", doc: "EXCELSIOR, gold face", box: { x0: 276, y0: 390, x1: 740, y1: 468 }, ink: gold },
    { name: "NY_STATE", doc: "state outline and Long Island between registration groups", box: { x0: 392, y0: 215, x1: 522, y1: 330 }, ink: navy },
  ],
} satisfies TraceSource;
