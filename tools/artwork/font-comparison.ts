import sharp from "sharp";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { PLATE_PROFILES, type Rect } from "./profiles";
import { PLATE_REFERENCES } from "./references";
import { originalReference } from "./reference-assets";
import { referencePath } from "./paths";
import type { FontProbe } from "./font-probes";

export const FONT_COMPARISON_SETTINGS = { version: 1, glyphWidth: 64, glyphHeight: 128, wordWidth: 640, wordHeight: 128, edgeTolerance: 1, inkWeight: .65, edgeWeight: .35 } as const;
export type Bitmap = { pixels: Uint8Array; width: number; height: number };
type Component = Rect & { points: number[] };
export type BrowserGlyphs = { id: string; font: string; images: { text: string; png: string }[]; whole?: string };
type Ink = "dark" | "blue" | "green" | "red" | "white" | "gold";
const inks: Partial<Record<string, Ink>> = {
  AK: "blue", AZ: "green", CA: "blue", CO: "green", CT: "blue", DC: "blue", DE: "gold", FL: "green",
  IL: "red", IN: "blue", KY: "blue", MA: "red", MI: "blue", MO: "blue", MS: "blue", MT: "white",
  NC: "blue", NE: "blue", NH: "green", NM: "gold", NY: "blue", OH: "blue", OK: "white", OR: "blue",
  PA: "blue", RI: "blue", TN: "white", UT: "blue", VA: "blue", VT: "white", WA: "blue", WV: "blue", WY: "white",
};
const wordInks: Record<string, Ink> = {
  LA: "red", SD: "blue", GA: "dark", MD: "red", MA: "blue", NV: "dark", KS: "dark", NH: "green", NY: "dark", CA: "red",
};

function inkPixel(r: number, g: number, b: number, ink: Ink) {
  switch (ink) {
    case "blue": return r < 110 && g < 140 && b < 200 && b > r + 15 && b >= g * .95;
    case "green": return r < 70 && g < 145 && b < 125 && g > r * 1.2 && g > b * .9;
    case "red": return r > 110 && g < 105 && b < 120 && r > g * 1.5;
    case "white": return Math.min(r, g, b) > 195 && Math.max(r, g, b) - Math.min(r, g, b) < 55;
    case "gold": return r > 150 && g > 90 && g < 235 && b < 150 && b < g * .8;
    default: return Math.max(r, g, b) < 105;
  }
}

export function components(bitmap: Bitmap): Component[] {
  const { width, height, pixels } = bitmap;
  const seen = new Uint8Array(pixels.length), output: Component[] = [];
  for (let start = 0; start < pixels.length; start++) {
    if (!pixels[start] || seen[start]) continue;
    const points = [start]; seen[start] = 1;
    let x0 = start % width, x1 = x0, y0 = Math.floor(start / width), y1 = y0;
    for (let cursor = 0; cursor < points.length; cursor++) {
      const i = points[cursor], x = i % width, y = Math.floor(i / width);
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy, next = ny * width + nx;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height || seen[next] || !pixels[next]) continue;
        seen[next] = 1; points.push(next);
      }
    }
    output.push({ x: x0, y: y0, width: x1 - x0 + 1, height: y1 - y0 + 1, points });
  }
  return output;
}

function cropComponents(bitmap: Bitmap, selected: Component[]): Bitmap {
  if (!selected.length) throw new Error("No foreground lettering found");
  const x = Math.min(...selected.map((c) => c.x)), y = Math.min(...selected.map((c) => c.y));
  const width = Math.max(...selected.map((c) => c.x + c.width)) - x;
  const height = Math.max(...selected.map((c) => c.y + c.height)) - y;
  const pixels = new Uint8Array(width * height);
  for (const component of selected) for (const point of component.points) pixels[(Math.floor(point / bitmap.width) - y) * width + point % bitmap.width - x] = 1;
  return { pixels, width, height };
}

async function normalized(bitmap: Bitmap, width: number, height: number): Promise<Bitmap> {
  const resized = await sharp(Buffer.from(bitmap.pixels.map((p) => p * 255)), { raw: { width: bitmap.width, height: bitmap.height, channels: 1 } })
    .resize(width - 8, height - 8, { fit: "fill" }).extend({ top: 4, bottom: 4, left: 4, right: 4, background: "black" }).raw().toBuffer({ resolveWithObject: true });
  const pixels = new Uint8Array(width * height);
  for (let i = 0; i < pixels.length; i++) pixels[i] = Number(resized.data[i * resized.info.channels] >= 128);
  return { pixels, width, height };
}

export async function bitmapPng(bitmap: Bitmap) {
  return sharp(Buffer.from(bitmap.pixels.map((p) => 255 - p * 255)), { raw: { width: bitmap.width, height: bitmap.height, channels: 1 } }).png().toBuffer();
}

function serialRegions(probe: FontProbe): Rect[] {
  const regions = PLATE_PROFILES[probe.state].textRects.filter((r) => r.y >= 90 && r.y < 240 && r.height >= 150 && r.width >= 30);
  // The initial six generic exclusions were for an older sample layout. Use a
  // single central region and verify the extracted glyph count for these cases.
  if (regions.length >= 5 && regions.every((r) => r.width < 180)) return [{ x: 15, y: 100, width: 970, height: 315 }];
  return regions;
}

const wordRegions: Record<string, Rect> = {
  "nh-new": { x: 350, y: 342, width: 295, height: 64 },
  "nh-hampshire": { x: 278, y: 399, width: 440, height: 80 },
  "md-name": { x: 433, y: 24, width: 260, height: 85 },
  "ga-motto": { x: 53, y: 52, width: 340, height: 88 },
};

export async function referenceGlyphs(probe: FontProbe) {
  const reference = PLATE_REFERENCES.find((entry) => entry.state === probe.state)!;
  const original = originalReference(reference);
  if (!original) throw new Error("Missing or stale preserved original");
  const buffer = await readFile(referencePath(original.src));
  if (createHash("sha256").update(buffer).digest("hex") !== original.sha256) throw new Error("Original reference checksum changed");
  const { data, info } = await sharp(buffer).resize(1000, 500, { fit: "fill" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const regions = probe.kind === "registration" ? serialRegions(probe) : [wordRegions[probe.id] ?? { x: probe.crop.x, y: probe.crop.y, width: probe.crop.w, height: probe.crop.h }];
  if (!regions.length) throw new Error("No lettering region configured");
  const ink = probe.kind === "registration" ? inks[probe.state] ?? "dark" : wordInks[probe.state];
  const pixels = new Uint8Array(1000 * 500);
  for (const region of regions) for (let y = region.y; y < Math.min(500, region.y + region.height); y++) for (let x = region.x; x < Math.min(1000, region.x + region.width); x++) {
    const i = (y * 1000 + x) * info.channels;
    pixels[y * 1000 + x] = Number(inkPixel(data[i], data[i + 1], data[i + 2], ink));
  }
  const bitmap = { pixels, width: 1000, height: 500 };
  let selected = components(bitmap).filter((c) => c.points.length >= (probe.kind === "registration" ? 100 : 8));
  if (probe.kind === "registration") {
    // Reject frame runs before choosing glyph components. The test is fixed by
    // source geometry, not by a candidate's result.
    selected = selected.filter((c) => c.x > 40 && c.x + c.width < 960);
    selected = selected.filter((c) => c.height >= 90 && c.width >= 8 && c.width / c.height < 1.2 && c.points.length / (c.width * c.height) > .12);
    const heights = selected.map((c) => c.height).sort((a, b) => a - b);
    const median = heights[Math.floor(heights.length / 2)] ?? 0;
    selected = selected.filter((c) => c.height > median * .72 && c.height < median * 1.35).sort((a, b) => a.x - b.x);
  } else {
    // Tiny source texture and fragments of neighboring labels do not constitute
    // letters. This fixed cleanup is applied before examining any candidate.
    const largest = Math.max(0, ...selected.map((c) => c.height));
    selected = selected.filter((c) => c.height > largest * .15 || c.points.length > 60);
  }
  const extracted = probe.kind === "registration" ? selected.map((c) => cropComponents(bitmap, [c])) : [cropComponents(bitmap, selected)];
  const expected = probe.kind === "registration" ? probe.text.length : 1;
  if (extracted.length !== expected) {
    if (probe.kind === "registration" && selected.length) {
      return { glyphs: [await normalized(cropComponents(bitmap, selected), 640, 128)], comparison: "whole" as const,
        regions, ink, sha256: original.sha256, components: selected.map(({ points, ...bounds }) => ({ ...bounds, area: points.length })), mask: bitmap };
    }
    return { error: `Expected ${expected} glyphs; extracted ${extracted.length}`, regions, ink, sha256: original.sha256, components: selected.map(({ points, ...bounds }) => ({ ...bounds, area: points.length })), mask: bitmap };
  }
  const glyphs = await Promise.all(extracted.map((glyph) => normalized(glyph, probe.kind === "registration" ? 64 : 640, 128)));
  return { glyphs, comparison: probe.kind === "registration" ? "glyphs" as const : "word" as const, regions, ink, sha256: original.sha256, components: selected.map(({ points, ...bounds }) => ({ ...bounds, area: points.length })), mask: bitmap };
}

export async function candidateGlyphs(entry: BrowserGlyphs, kind: FontProbe["kind"], comparison: "glyphs" | "word" | "whole" = "glyphs") {
  if (comparison === "whole") {
    if (!entry.whole) throw new Error("Capture lacks a whole-registration sample; recapture browser glyphs");
    const { data, info } = await sharp(Buffer.from(entry.whole, "base64")).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const pixels = new Uint8Array(info.width * info.height);
    for (let i = 0; i < pixels.length; i++) pixels[i] = Number(data[i * info.channels + info.channels - 1] >= 128);
    return [await normalized(cropComponents({ pixels, width: info.width, height: info.height }, components({ pixels, width: info.width, height: info.height })), 640, 128)];
  }
  return Promise.all(entry.images.map(async ({ png }) => {
    const { data, info } = await sharp(Buffer.from(png, "base64")).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const pixels = new Uint8Array(info.width * info.height);
    for (let i = 0; i < pixels.length; i++) pixels[i] = Number(data[i * info.channels + info.channels - 1] >= 128);
    const bitmap = { pixels, width: info.width, height: info.height };
    return normalized(cropComponents(bitmap, components(bitmap)), kind === "registration" ? 64 : 640, 128);
  }));
}

function boundary(bitmap: Bitmap) {
  const { width, height, pixels } = bitmap;
  return pixels.map((value, i) => Number(value && (i % width === 0 || i % width === width - 1 || i < width || i >= width * (height - 1)
    || !pixels[i - 1] || !pixels[i + 1] || !pixels[i - width] || !pixels[i + width])));
}

/** Foreground Dice and symmetric boundary F1; empty background earns no credit. */
export function glyphAgreement(reference: Bitmap, candidate: Bitmap) {
  if (reference.width !== candidate.width || reference.height !== candidate.height) throw new Error("Glyph dimensions differ");
  const a = reference.pixels, b = candidate.pixels, width = reference.width;
  const ea = boundary(reference), eb = boundary(candidate);
  let na = 0, nb = 0, overlap = 0, nea = 0, neb = 0, ma = 0, mb = 0;
  const nearby = (edges: Uint8Array, i: number) => {
    const x = i % width, y = Math.floor(i / width);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (x + dx >= 0 && x + dx < width && y + dy >= 0 && y + dy < reference.height && edges[i + dy * width + dx]) return true;
    }
    return false;
  };
  for (let i = 0; i < a.length; i++) {
    na += a[i]; nb += b[i]; overlap += a[i] && b[i] ? 1 : 0;
    if (ea[i]) { nea++; if (nearby(eb, i)) ma++; }
    if (eb[i]) { neb++; if (nearby(ea, i)) mb++; }
  }
  const dice = na + nb ? 2 * overlap / (na + nb) : 0;
  const precision = neb ? mb / neb : 0, recall = nea ? ma / nea : 0;
  const edgeF1 = precision + recall ? 2 * precision * recall / (precision + recall) : 0;
  return { dice: dice * 100, edgeF1: edgeF1 * 100, score: (dice * .65 + edgeF1 * .35) * 100 };
}
