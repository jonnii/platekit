import { luminance, type Rgb, type TraceSource } from "./types.ts";

// NJ MVC 2019 sample artwork, flat digital. The scoring reference is a replica with a wider serial and a smaller
// separator, so only the wordmarks register (edge correlation 0.21); the separator outline is refitted in the plate.
// Edges at half coverage: near-black ink (L≈32) against yellow-to-white (L≈225–236).
const ink = (c: Rgb) => luminance(c) < 130;

export default {
  url: "https://upload.wikimedia.org/wikipedia/commons/d/d0/New_Jersey_sample_license_plate%2C_2019.png",
  sha256: "ec8fb6221e7a3fd2af829185872783ec9c33ff65402d68e91af11b6529ca785c",
  plate: { x: 46.5, y: 50.4, width: 3450.7, height: 1718.2 },
  traces: [
    { name: "NJ_NAME", doc: "New Jersey", box: { x0: 240, y0: 10, x1: 760, y1: 135 }, ink },
    { name: "NJ_MOTTO", doc: "Garden State", box: { x0: 240, y0: 395, x1: 760, y1: 480 }, ink },
    { name: "NJ_STATE", doc: "state outline separator, in the source's position and scale", box: { x0: 445, y0: 165, x1: 540, y1: 325 }, ink },
  ],
} satisfies TraceSource;
