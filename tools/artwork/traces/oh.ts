import { luminance, type Rgb, type TraceSource } from "./types.ts";

// Official Sunrise in Ohio artwork from the Governor's October 2021 release (the Wright Flyer there is reversed, so
// alignment correlation is lower; the plane is not traced). Edges sit at half coverage:
// state outline red (R≈188, G≈52) against white (G≈255), kept apart from the darker ribbon (R≈166) behind it;
// grey lettering (L≈77) against white (L≈254); the ribbon's cream lettering (G≈240) against its red (G≈48). The ribbon
// lettering is ~12 units tall, so its i-dots need a smaller minimum area; the light sky around the ribbon touches the
// box edges and is dropped.
const outline = (c: Rgb) => c[0] > 177 && c[1] < 153 && c[0] - c[1] > 60;
const cream = (c: Rgb) => c[0] > 204 && c[1] > 144 && c[2] > 144;
const grey = (c: Rgb) => luminance(c) < 165 && Math.abs(c[0] - c[1]) < 30 && Math.abs(c[2] - c[1]) < 30;

export default {
  url: "https://content.govdelivery.com/attachments/OHIOGOVERNOR/2021/10/19/file_attachments/1969494/Sunrise%20in%20Ohio.JPG",
  sha256: "aa93928dabdcbb4c2c62ac8adadec8dd83367dbd028017cb3adeef5dba878498",
  plate: { x: 151.7, y: 83.6, width: 14143.6, height: 6830.0 },
  traces: [
    { name: "OH_STATE", doc: "red state outline around OhiO; its first subpath is the filled silhouette", box: { x0: 383, y0: 16, x1: 515, y1: 150 }, ink: outline },
    { name: "OH_NAME", doc: "OhiO", box: { x0: 383, y0: 16, x1: 515, y1: 150 }, ink: grey },
    { name: "OH_RIBBON_BIRTHPLACE", doc: "Birthplace, on the ribbon", box: { x0: 525, y0: 22, x1: 615, y1: 66 }, ink: cream, minArea: .5 },
    { name: "OH_RIBBON_AVIATION", doc: "of Aviation, on the ribbon", box: { x0: 620, y0: 28, x1: 730, y1: 72 }, ink: cream, minArea: .5 },
  ],
} satisfies TraceSource;
