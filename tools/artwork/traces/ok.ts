import { luminance, type Rgb, type TraceSource } from "./types.ts";

// Official Service Oklahoma SVG rendered so the plate is ~4000 px wide; the starburst lies outside the plate.
// White (L≈248) against red (L≈71) at L 160; navy against red split on the red channel (24 vs 168) at 96;
// white against navy (L≈40) at L 144.
const white = (c: Rgb) => luminance(c) > 160;
const navyOrWhite = (c: Rgb) => c[0] < 96 || luminance(c) > 144;

export default {
  url: "https://oklahoma.gov/content/dam/service-oklahoma/Images/sb2035/sok/SOK_Website%20Spikey%20New%20Plate%20NO%20TAG.svg",
  sha256: "57c28a80da5415747395000c75ad7876ce2e76ffc7dd65da97a23b1b6d536bfa",
  render: { density: 940 },
  plate: { x: 2019.5, y: 2946, width: 4030.8, height: 2024.8 },
  traces: [
    { name: "OK_NAME", doc: "OKLAHOMA", box: { x0: 260, y0: 30, x1: 740, y1: 125 }, ink: white },
    { name: "OK_STAR_OUTLINE", doc: "46 star, navy outline and white face extent", box: { x0: 395, y0: 150, x1: 610, y1: 350 }, ink: navyOrWhite },
    { name: "OK_STAR_FACE", doc: "46 star, white face with the numerals cut out", box: { x0: 395, y0: 150, x1: 610, y1: 350 }, ink: (c) => luminance(c) > 144 },
    { name: "OK_MOTTO", doc: "IMAGINE THAT", box: { x0: 382, y0: 385, x1: 690, y1: 435 }, ink: white },
    { name: "OK_EMBLEM", doc: "star-cluster emblem before IMAGINE THAT", box: { x0: 325, y0: 385, x1: 382, y1: 435 }, ink: white },
  ],
} satisfies TraceSource;
