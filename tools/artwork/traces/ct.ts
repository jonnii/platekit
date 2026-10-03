import type { Rgb, TraceSource } from "./types.ts";

// CC BY-SA 3.0 scan of a Fire Apparatus plate on the same white-to-blue base; its bottom line differs, so only
// "Connecticut" and the state outline are traced. The scoring reference is a replica whose outline is ~15% larger and
// further left than on real plates, so the same image is registered twice, each rectangle fitted by edge correlation
// masked to what it traces: the name (0.46) and the outline (0.57); full plate 0.27.
// Navy (G≈48) against the sky gradient (G≈176–208) is cut on green at half coverage; low red keeps out the red rim.
const navy = (c: Rgb) => c[1] < 112 && c[0] < 100;
const url = "https://upload.wikimedia.org/wikipedia/commons/0/01/Connecticut_Fire_2585.png";
const sha256 = "80a8fcebb9005b2341f4e0621eb498799b49f7afdee6db3457eabfd5b04442ef";

export default [
  {
    url, sha256,
    plate: { x: 44.4, y: 61.4, width: 3760.0, height: 1780.2 },
    traces: [
      { name: "CT_NAME", doc: "Connecticut", box: { x0: 265, y0: 22, x1: 740, y1: 118 }, ink: navy },
    ],
  },
  {
    url, sha256,
    plate: { x: 158.3, y: 96.0, width: 3258.3, height: 1600.0 },
    traces: [
      { name: "CT_STATE", doc: "state outline", box: { x0: 18, y0: 24, x1: 162, y1: 140 }, ink: navy },
    ],
  },
] satisfies TraceSource[];
