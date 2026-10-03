import type { Rgb, TraceSource } from "./types.ts";

// CC BY-SA 3.0 scan of a Street Rod sample plate on the same green base. Its middle (STREET RODS, T emblem) and the
// bolts on the bottom band are not traced. The tree stays hand-drawn: its trunk runs into the white band below with
// no colour break, so it cannot be isolated in a box. The scoring reference is a replica that sets the top band ~11
// units lower relative to the footer than this plate does, so the same image is registered twice, each rectangle
// fitted by edge correlation masked to what it traces: tree and VERMONT (0.78), Green Mountain State (0.87); full
// plate 0.29. White ink (R≈200) against green (R≈20) is cut on red at half coverage.
const white = (c: Rgb) => c[0] > 112;
const url = "https://upload.wikimedia.org/wikipedia/commons/d/d1/Vermont_Street_Rod_sample_plate.png";
const sha256 = "25e75a97651143105b780c33057318deaff42d87d0692ac2ab3bb89f6cc6cd32";

export default [
  {
    url, sha256,
    plate: { x: 1.7, y: 19.2, width: 2375.9, height: 1200.1 },
    traces: [
      { name: "VT_NAME", doc: "Vermont", box: { x0: 280, y0: 8, x1: 710, y1: 94 }, ink: white, smooth: .3 },
    ],
  },
  {
    url, sha256,
    plate: { x: 17.2, y: -8.6, width: 2364.8, height: 1211.9 },
    traces: [
      { name: "VT_SLOGAN", doc: "Green Mountain State", box: { x0: 238, y0: 428, x1: 768, y1: 488 }, ink: white, smooth: .3, minArea: 4 },
    ],
  },
] satisfies TraceSource[];
