export type Rgb = [r: number, g: number, b: number];

/** A full-resolution source for one state's fixed lettering, and what to trace from it. */
export type TraceSource = {
  url: string;
  sha256: string;
  /** Vector sources are rasterised before tracing: an SVG at `density` dpi, or one PDF page at `dpi` (needs poppler's pdftoppm). */
  render?: { density: number } | { pdfPage: number; dpi: number };
  /** Resample a low-resolution raster by this factor (Lanczos) before tracing; `plate` stays in source pixels. */
  upscale?: number;
  /** Where the scoring reference's plate (1000 × 500 units) sits in the source image (rendered, for vector sources), in pixels. */
  plate: { x: number; y: number; width: number; height: number };
  /** Font-probe wordmarks (e.g. "ny-name") these traces replace; tools/outline-glyphs.ts stops generating them. */
  replaces?: string[];
  /** Compact generated path syntax without changing coordinates or commands. */
  compactPaths?: boolean;
  traces: {
    /** Export name in src/internal/traces/<state>.ts. */
    name: string;
    doc: string;
    /** Search box in plate units. Ink touching its edge is treated as neighbouring artwork and dropped. */
    box: { x0: number; y0: number; x1: number; y1: number };
    /** Pixels belonging to this shape. Put the edge at half coverage between ink and background. */
    ink: (color: Rgb) => boolean;
    /** Smallest shape kept, in square plate units (default 8). Lower it for small text whose dots and counters are tiny. */
    minArea?: number;
    /** Blur radius in plate units applied to the mask before tracing; evens out photo-edge noise without changing weight. */
    smooth?: number;
  }[];
};

export const luminance = ([r, g, b]: Rgb) => .299 * r + .587 * g + .114 * b;
