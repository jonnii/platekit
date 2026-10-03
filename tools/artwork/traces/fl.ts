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
  plate: { x: 0, y: 0, width: 3050, height: 1512 }, // the scoring reference crop of this same image: exact registration
  traces: [
    { name: "FL_URL", doc: "MYFLORIDA.COM along its arc", box: { x0: 197.1, y0: 16.1, x1: 825.9, y1: 140.9 }, ink: printed, smooth: .5 },
    { name: "FL_MOTTO", doc: "SUNSHINE STATE, embossed", box: { x0: 218.2, y0: 414.7, x1: 815.3, y1: 503 }, ink: embossed, smooth: 1.3 },
  ],
} satisfies TraceSource;
