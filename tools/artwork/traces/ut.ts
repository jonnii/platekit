import { luminance, type Rgb, type TraceSource } from "./types.ts";

// Wikimedia Commons front-on photo of a flat-printed plate (UTnewfont.png, CC BY-SA 4.0). Correlation 0.39 against
// the replica reference (different registration and sticker); UTAH and LIFE ELEVATED register on the overlay.
// Both are black (L≈25) with a white keyline: face at half coverage against white (L≈195), L<105. LIFE ELEVATED's
// keyline (G≈188) against the red desert (G≈90) is cut at G>139. UTAH's keyline is not traced: it merges with the
// arch's pale highlight lines, and the sky behind it lightens towards the keyline's colour, so UtahPlate strokes the
// traced face instead (keyline ≈3.5 units wide).
const black = (c: Rgb) => luminance(c) < 105;

export default {
  url: "https://upload.wikimedia.org/wikipedia/commons/3/39/UTnewfont.png",
  sha256: "00e074c3882e582c4d2bd3ee0e55822c80656a60db4e075c1ffc7cfb5a352373",
  plate: { x: 0, y: 0, width: 2573, height: 1283 }, // the scoring reference crop of this same image: exact registration
  traces: [
    { name: "UT_NAME", doc: "UTAH, black face", box: { x0: 316, y0: 31.5, x1: 684.1, y1: 125.6 }, ink: black, smooth: .4 },
    { name: "UT_SLOGAN_OUTLINE", doc: "LIFE ELEVATED, white keyline and face extent", box: { x0: 246.4, y0: 429.7, x1: 738.8, y1: 471.3 }, ink: (c) => black(c) || c[1] > 139, smooth: .4, minArea: 4 },
    { name: "UT_SLOGAN", doc: "LIFE ELEVATED, black face", box: { x0: 246.4, y0: 429.7, x1: 738.8, y1: 471.3 }, ink: black, smooth: .4, minArea: 4 },
  ],
} satisfies TraceSource;
