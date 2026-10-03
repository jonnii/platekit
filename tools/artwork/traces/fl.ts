import type { Rgb, TraceSource } from "./types.ts";

// Wikimedia Commons photo of a real 2023 plate (CC BY-SA 4.0). The rim is cropped at both sides, so the rectangle
// (registered by edge correlation on the lettering, 0.06: the replica reference's registration and shading differ)
// overhangs the image. Printed green ink (B≈85) against the grey-white sheeting (B≈200) and the halftone state
// silhouette under MYFLORIDA (B≈170): cut on blue at half coverage. Requiring G above R keeps out the screws' dark
// shadows and grey emboss sides. SUNSHINE STATE is embossed: its lit top edges reach B≈145, so blue is cut there, and
// the silhouette's darkest halftone dots behind "ST" (R≈72–150) are held out on red at the ink core (R≈30–50); a wider
// blur evens the shading.
const printed = (c: Rgb) => c[2] < 130 && c[1] - c[0] > 20;
const embossed = (c: Rgb) => c[2] < 150 && c[0] < 95 && c[1] - c[0] > 20;

export default {
  url: "https://upload.wikimedia.org/wikipedia/commons/4/48/Fl_Plate_2023.jpg",
  sha256: "429305faadfe72dea5b845284b2e142ac44ed73c9c35dd163704e350b687aee2",
  plate: { x: -59.6, y: 11.9, width: 3223.3, height: 1533.6 },
  traces: [
    { name: "FL_URL", doc: "MYFLORIDA.COM along its arc", box: { x0: 205, y0: 12, x1: 800, y1: 135 }, ink: printed, smooth: .5 },
    { name: "FL_MOTTO", doc: "SUNSHINE STATE, embossed", box: { x0: 225, y0: 405, x1: 790, y1: 492 }, ink: embossed, smooth: 1.3 },
  ],
} satisfies TraceSource;
