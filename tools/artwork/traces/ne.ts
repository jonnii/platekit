import { luminance, type Rgb, type TraceSource } from "./types.ts";

// Designer's reveal render (Drew Davies) of the Genius of Creative Energy plate. Edge correlation is low (0.28) because
// its registration, county box and year differ from the reference, and the reference sets NEBRASKA ~10 units lower on
// the plate; this rectangle registers the wordmark onto the reference's (measured bounding boxes, 3.62 × 3.71 px/unit).
// Navy (L≈45) against the pale sheeting and mural greys (L≥176): cut at half coverage, blue-dominant.
const navy = (c: Rgb) => luminance(c) < 130 && c[2] > c[0] + 30;

export default {
  url: "https://ewscripps.brightspotcdn.com/0c/7d/187967614ce399c56cf9f5cf504a/ne-license-plate-davies-20220524.jpg",
  sha256: "90c8c6d0864edc7f06cb9ef9552dc6866fd7999ff50ea59c8aa15a624fbeeca0",
  plate: { x: 612, y: 523, width: 3616, height: 1853 },
  traces: [
    { name: "NE_NAME", doc: "NEBRASKA", box: { x0: 235, y0: 38, x1: 765, y1: 125 }, ink: navy },
  ],
} satisfies TraceSource;
