import { luminance, type Rgb, type TraceSource } from "./types.ts";

// Official Oregon DMV plate manual (form 6726), page 26 "PASSENGER (Tree)", vector artwork rendered at 1200 dpi.
// Correlation is modest because the manual's sample registration and sticker boxes differ from the reference; the
// wordmark, mountains and tree register closely. Navy (L≈45) against sky blue (L≈205): cut at half coverage, and
// keep the green fir (blue below green) out where it passes behind the "g".
const navy = (c: Rgb) => luminance(c) < 125 && c[2] > c[1] + 30;

export default {
  url: "https://www.oregon.gov/odot/Forms/DMV/6726.pdf",
  sha256: "56ccdbf8dbbcd39c2803308f255e7374998c1ab418893da8b3577ff2098bdd50",
  render: { pdfPage: 26, dpi: 1200 },
  plate: { x: 1436.1, y: 5231.5, width: 3089.8, height: 1550.5 }, // aligned to the extracted-raster scoring reference (correlation 0.998)
  traces: [
    { name: "OR_NAME", doc: "Oregon wordmark", box: { x0: 292.1, y0: -1.2, x1: 721, y1: 113.4 }, ink: navy },
  ],
} satisfies TraceSource;
