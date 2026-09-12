import { partitionColumns } from "./masks";
import { optionalFeatureRects } from "../optional-features";
import { AGREEMENT_SETTINGS, AGREEMENT_VERSION, featureRegions, measureAgreement } from "./agreement";
import { rasterizePlate } from "./raster";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { renderToString } from "react-dom/server";
import sharp from "sharp";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

/*
 * ARTWORK-ONLY MODE (default)
 *
 * The rasterizer cannot resolve any of the plate fonts. librsvg resolves families
 * through fontconfig, so it sees neither the `var(--font-plate-*)` CSS variables
 * (those only exist on the page) nor the font files themselves — Zurich Extra
 * Condensed, Playfair Display and Sanchez all silently fall back to one default
 * serif. Embedding them as a base64 @font-face does not help; librsvg ignores
 * @font-face.
 *
 * That is not a cosmetic problem. The fallback serif is far wider than Zurich, so
 * the registration overflows the viewBox, gets clipped, and bleeds down into the
 * scenery — which drags alignment off and contaminates regions that have nothing
 * to do with type. Scored that way, a good plate reads as ~58% structural
 * similarity and 0.05 SSIM, and a baseline would bake the artifact in.
 *
 * So by default we strip <text> from the render and mask the text regions out of
 * the reference, and score artwork only: frame, rules, scenery, graphics. That is
 * the part a pixel diff can actually judge, and the part worth iterating on.
 * Typography is chosen visually instead, against a cropped wordmark — see
 * dev/plate-compare/font-probe.
 *
 * `--with-text` restores the old behaviour. Do not trust its numbers unless the
 * fonts genuinely resolve; switching to @resvg/resvg-js, which accepts explicit
 * font files, would be the way to make that mode meaningful.
 */

import { PLATE_PROFILES, type PlateProfile, type Rect } from "../profiles";
import { ARTWORK_WIDTH as WIDTH, ARTWORK_HEIGHT as HEIGHT } from "../config";

function outputPaths(slug: string, directory: string) {
  const p = (name: string) => path.join(directory, `${slug}-${name}.png`);
  return {
    renderedRaw: p("rendered"),
    renderedAligned: p("rendered-aligned"),
    renderedNormalized: p("rendered-normalized"),
    referenceResized: p("reference-resized"),
    diffFull: p("diff"),
    diffAnnotated: p("diff-annotated"),
    topRef: p("top-ref"),
    topRendered: p("top-rendered"),
    topDiff: p("top-diff"),
    bottomRef: p("crop-ref"),
    bottomRendered: p("crop-rendered"),
    bottomDiff: p("crop-diff"),
    reportJson: path.join(directory, `${slug}-report.json`),
    scoringMask: p("scoring-mask"),
  };
}

type RegionMetric = {
  mismatchedPixels: number;
  totalPixels: number;
  similarityPct: number;
  diffPct: number;
};

type RegionComparison = RegionMetric & { diffBuffer: Buffer };

type Blob = {
  area: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  centerX: number;
  centerY: number;
  region: string;
};

type CompareOptions = {
  outputDirectory: string;
  profile: PlateProfile;
  referencePath: string;
  plateText: string;
  threshold: number;
  align: boolean;
  calibrate: boolean;
  /** Include text in the render and in scoring. See ARTWORK-ONLY MODE above. */
  withText: boolean;
};

function parseArgs(argv: string[]): CompareOptions {
  // Resolve --state first so the other defaults can depend on the profile.
  const stateArg = argv.find((a) => a.startsWith("--state="));
  const stateKey = (stateArg ? stateArg.slice("--state=".length) : "NY").toUpperCase();
  const profile = PLATE_PROFILES[stateKey];
  if (!profile) {
    throw new Error(
      `Unknown --state=${stateKey}. Known: ${Object.keys(PLATE_PROFILES).join(", ")}`,
    );
  }

  const options: CompareOptions = {
    outputDirectory: "/tmp",
    profile,
    referencePath: `/tmp/${profile.slug}-reference.jpg`,
    plateText: profile.defaultPlate,
    threshold: 0.15,
    align: true,
    calibrate: profile.calibrate ?? true,
    withText: false,
  };

  for (const arg of argv) {
    if (arg.startsWith("--state=")) {
      // already handled
    } else if (arg.startsWith("--reference=")) {
      options.referencePath = arg.slice("--reference=".length);
    } else if (arg.startsWith("--output-dir=")) {
      options.outputDirectory = path.resolve(arg.slice("--output-dir=".length));
    } else if (arg.startsWith("--plate=")) {
      options.plateText = arg.slice("--plate=".length);
    } else if (arg.startsWith("--threshold=")) {
      const parsed = Number(arg.slice("--threshold=".length));
      if (!Number.isFinite(parsed) || parsed <= 0 || parsed >= 1) {
        throw new Error(`Invalid --threshold value: ${arg}`);
      }
      options.threshold = parsed;
    } else if (arg === "--no-align") {
      options.align = false;
    } else if (arg === "--no-calibrate") {
      options.calibrate = false;
    } else if (arg === "--with-text") {
      options.withText = true;
    } else if (arg.trim().length > 0) {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function createMaskFromPredicate(predicate: (x: number, y: number) => boolean): Uint8Array {
  const mask = new Uint8Array(WIDTH * HEIGHT);
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (predicate(x, y)) {
        mask[y * WIDTH + x] = 1;
      }
    }
  }
  return mask;
}

/** mask AND NOT exclude — used to keep text out of every scored region. */
function subtractMask(mask: Uint8Array, exclude: Uint8Array): Uint8Array {
  const out = new Uint8Array(mask.length);
  for (let i = 0; i < mask.length; i++) {
    out[i] = mask[i] && !exclude[i] ? 1 : 0;
  }
  return out;
}

function createMaskFromRects(rects: Rect[]): Uint8Array {
  return createMaskFromPredicate((x, y) =>
    rects.some((rect) => {
      const right = rect.x + rect.width;
      const bottom = rect.y + rect.height;
      return x >= rect.x && x < right && y >= rect.y && y < bottom;
    })
  );
}

function maskPixelCount(mask: Uint8Array): number {
  let total = 0;
  for (let i = 0; i < mask.length; i++) total += mask[i];
  return total;
}

function maskedBuffer(raw: Uint8Array, mask: Uint8Array): Uint8Array {
  const out = Buffer.alloc(raw.length);
  for (let i = 0; i < mask.length; i++) {
    if (!mask[i]) continue;
    const idx = i * 4;
    out[idx] = raw[idx];
    out[idx + 1] = raw[idx + 1];
    out[idx + 2] = raw[idx + 2];
    out[idx + 3] = raw[idx + 3];
  }
  return out;
}

function compareRegion(referenceRaw: Uint8Array, renderedRaw: Uint8Array, mask: Uint8Array, threshold: number): RegionComparison {
  const refMasked = maskedBuffer(referenceRaw, mask);
  const renderedMasked = maskedBuffer(renderedRaw, mask);
  const diffBuffer = Buffer.alloc(referenceRaw.length);
  const mismatchedPixels = pixelmatch(refMasked, renderedMasked, diffBuffer, WIDTH, HEIGHT, { threshold });
  const totalPixels = maskPixelCount(mask);
  const similarityPct = totalPixels === 0 ? 0 : ((totalPixels - mismatchedPixels) / totalPixels) * 100;
  const diffPct = 100 - similarityPct;
  return { mismatchedPixels, totalPixels, similarityPct, diffPct, diffBuffer };
}

function toGrayscale(raw: Uint8Array): Float32Array {
  const gray = new Float32Array(WIDTH * HEIGHT);
  for (let i = 0; i < WIDTH * HEIGHT; i++) {
    const idx = i * 4;
    gray[i] = 0.2126 * raw[idx] + 0.7152 * raw[idx + 1] + 0.0722 * raw[idx + 2];
  }
  return gray;
}

function findBestTranslation(referenceRaw: Uint8Array, renderedRaw: Uint8Array, mask: Uint8Array): { dx: number; dy: number; mae: number } {
  const refGray = toGrayscale(referenceRaw);
  const renderedGray = toGrayscale(renderedRaw);
  const maxOffset = 8;
  const step = 2;

  let bestDx = 0;
  let bestDy = 0;
  let bestMae = Number.POSITIVE_INFINITY;

  for (let dy = -maxOffset; dy <= maxOffset; dy++) {
    for (let dx = -maxOffset; dx <= maxOffset; dx++) {
      let error = 0;
      let count = 0;
      for (let y = 0; y < HEIGHT; y += step) {
        for (let x = 0; x < WIDTH; x += step) {
          const pixelIndex = y * WIDTH + x;
          if (!mask[pixelIndex]) continue;

          const sx = x - dx;
          const sy = y - dy;
          let renderedValue = 255;
          if (sx >= 0 && sx < WIDTH && sy >= 0 && sy < HEIGHT) {
            renderedValue = renderedGray[sy * WIDTH + sx];
          }

          error += Math.abs(refGray[pixelIndex] - renderedValue);
          count++;
        }
      }

      if (count === 0) continue;
      const mae = error / count;
      if (mae < bestMae) {
        bestMae = mae;
        bestDx = dx;
        bestDy = dy;
      }
    }
  }

  return { dx: bestDx, dy: bestDy, mae: bestMae };
}

function shiftImage(raw: Uint8Array, dx: number, dy: number): Uint8Array {
  const out = Buffer.alloc(raw.length, 255);
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const srcX = x - dx;
      const srcY = y - dy;
      const dstIdx = (y * WIDTH + x) * 4;
      if (srcX < 0 || srcX >= WIDTH || srcY < 0 || srcY >= HEIGHT) {
        out[dstIdx] = 255;
        out[dstIdx + 1] = 255;
        out[dstIdx + 2] = 255;
        out[dstIdx + 3] = 255;
        continue;
      }
      const srcIdx = (srcY * WIDTH + srcX) * 4;
      out[dstIdx] = raw[srcIdx];
      out[dstIdx + 1] = raw[srcIdx + 1];
      out[dstIdx + 2] = raw[srcIdx + 2];
      out[dstIdx + 3] = raw[srcIdx + 3];
    }
  }
  return out;
}

function meanRgb(raw: Uint8Array, mask: Uint8Array): { r: number; g: number; b: number } {
  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  let count = 0;
  for (let i = 0; i < mask.length; i++) {
    if (!mask[i]) continue;
    const idx = i * 4;
    rSum += raw[idx];
    gSum += raw[idx + 1];
    bSum += raw[idx + 2];
    count++;
  }
  if (count === 0) return { r: 255, g: 255, b: 255 };
  return { r: rSum / count, g: gSum / count, b: bSum / count };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function applyColorCalibration(raw: Uint8Array, gains: { r: number; g: number; b: number }): Uint8Array {
  const out = Buffer.from(raw);
  for (let i = 0; i < WIDTH * HEIGHT; i++) {
    const idx = i * 4;
    out[idx] = clamp(Math.round(out[idx] * gains.r), 0, 255);
    out[idx + 1] = clamp(Math.round(out[idx + 1] * gains.g), 0, 255);
    out[idx + 2] = clamp(Math.round(out[idx + 2] * gains.b), 0, 255);
  }
  return out;
}

function maskedSsim(referenceRaw: Uint8Array, renderedRaw: Uint8Array, mask: Uint8Array): number {
  const n = maskPixelCount(mask);
  if (n < 2) return 0;

  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < mask.length; i++) {
    if (!mask[i]) continue;
    const idx = i * 4;
    const x = 0.2126 * referenceRaw[idx] + 0.7152 * referenceRaw[idx + 1] + 0.0722 * referenceRaw[idx + 2];
    const y = 0.2126 * renderedRaw[idx] + 0.7152 * renderedRaw[idx + 1] + 0.0722 * renderedRaw[idx + 2];
    sumX += x;
    sumY += y;
  }
  const meanX = sumX / n;
  const meanY = sumY / n;

  let varX = 0;
  let varY = 0;
  let covXY = 0;
  for (let i = 0; i < mask.length; i++) {
    if (!mask[i]) continue;
    const idx = i * 4;
    const x = 0.2126 * referenceRaw[idx] + 0.7152 * referenceRaw[idx + 1] + 0.0722 * referenceRaw[idx + 2];
    const y = 0.2126 * renderedRaw[idx] + 0.7152 * renderedRaw[idx + 1] + 0.0722 * renderedRaw[idx + 2];
    const dx = x - meanX;
    const dy = y - meanY;
    varX += dx * dx;
    varY += dy * dy;
    covXY += dx * dy;
  }

  const denom = n - 1;
  if (denom <= 0) return 0;
  varX /= denom;
  varY /= denom;
  covXY /= denom;

  const c1 = (0.01 * 255) ** 2;
  const c2 = (0.03 * 255) ** 2;
  const numerator = (2 * meanX * meanY + c1) * (2 * covXY + c2);
  const denominator = (meanX * meanX + meanY * meanY + c1) * (varX + varY + c2);
  if (denominator === 0) return 0;
  return numerator / denominator;
}

function sobelEdges(raw: Uint8Array, threshold = 40): Uint8Array {
  const gray = toGrayscale(raw);
  const edges = new Uint8Array(WIDTH * HEIGHT);

  for (let y = 1; y < HEIGHT - 1; y++) {
    for (let x = 1; x < WIDTH - 1; x++) {
      const tl = gray[(y - 1) * WIDTH + (x - 1)];
      const tc = gray[(y - 1) * WIDTH + x];
      const tr = gray[(y - 1) * WIDTH + (x + 1)];
      const ml = gray[y * WIDTH + (x - 1)];
      const mr = gray[y * WIDTH + (x + 1)];
      const bl = gray[(y + 1) * WIDTH + (x - 1)];
      const bc = gray[(y + 1) * WIDTH + x];
      const br = gray[(y + 1) * WIDTH + (x + 1)];

      const gx = -tl - 2 * ml - bl + tr + 2 * mr + br;
      const gy = -tl - 2 * tc - tr + bl + 2 * bc + br;
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      if (magnitude >= threshold) {
        edges[y * WIDTH + x] = 1;
      }
    }
  }

  return edges;
}

function dilateBinary(input: Uint8Array, radius: number): Uint8Array {
  if (radius <= 0) return input;
  const out = new Uint8Array(input.length);
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let found = false;
      for (let yy = Math.max(0, y - radius); yy <= Math.min(HEIGHT - 1, y + radius) && !found; yy++) {
        for (let xx = Math.max(0, x - radius); xx <= Math.min(WIDTH - 1, x + radius); xx++) {
          if (input[yy * WIDTH + xx]) {
            found = true;
            break;
          }
        }
      }
      if (found) out[y * WIDTH + x] = 1;
    }
  }
  return out;
}

function maskedEdgeF1(referenceRaw: Uint8Array, renderedRaw: Uint8Array, mask: Uint8Array): { precision: number; recall: number; f1: number } {
  const refEdges = sobelEdges(referenceRaw);
  const renderedEdges = sobelEdges(renderedRaw);
  const refDilated = dilateBinary(refEdges, 1);
  const renderedDilated = dilateBinary(renderedEdges, 1);

  let tp = 0;
  let fp = 0;
  let fn = 0;

  for (let i = 0; i < mask.length; i++) {
    if (!mask[i]) continue;
    const isPred = renderedEdges[i] === 1;
    const isTrue = refEdges[i] === 1;

    if (isPred) {
      if (refDilated[i]) tp++;
      else fp++;
    }
    if (isTrue && !renderedDilated[i]) {
      fn++;
    }
  }

  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
  return { precision, recall, f1 };
}

function diffToMismatchMap(diffBuffer: Buffer, mask: Uint8Array): Uint8Array {
  const out = new Uint8Array(mask.length);
  for (let i = 0; i < mask.length; i++) {
    if (!mask[i]) continue;
    const idx = i * 4;
    const r = diffBuffer[idx];
    const g = diffBuffer[idx + 1];
    const b = diffBuffer[idx + 2];
    if (r > 200 && g < 120 && b < 120) {
      out[i] = 1;
    }
  }
  return out;
}

function classifyRegion(
  centerX: number,
  centerY: number,
  TOP_END: number,
  BOTTOM_START: number,
): string {
  if (centerY < TOP_END) {
    return "top-band";
  }
  if (centerY >= BOTTOM_START) {
    const colWidth = WIDTH / 5;
    const col = Math.min(4, Math.floor(centerX / colWidth));
    const labels = ["bottom-far-left", "bottom-center-left", "bottom-center", "bottom-center-right", "bottom-far-right"];
    return labels[col];
  }
  return "middle-artwork";
}

function findLargestBlobs(
  mismatchMap: Uint8Array,
  TOP_END: number,
  BOTTOM_START: number,
  maxBlobs = 12,
): Blob[] {
  const visited = new Uint8Array(mismatchMap.length);
  const blobs: Blob[] = [];
  const neighbors = [-1, 1, -WIDTH, WIDTH];

  for (let i = 0; i < mismatchMap.length; i++) {
    if (!mismatchMap[i] || visited[i]) continue;

    const queue: number[] = [i];
    visited[i] = 1;

    let area = 0;
    let sumX = 0;
    let sumY = 0;
    let minX = WIDTH;
    let minY = HEIGHT;
    let maxX = 0;
    let maxY = 0;

    while (queue.length > 0) {
      const current = queue.pop() as number;
      const y = Math.floor(current / WIDTH);
      const x = current - y * WIDTH;

      area++;
      sumX += x;
      sumY += y;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;

      for (const delta of neighbors) {
        const next = current + delta;
        if (next < 0 || next >= mismatchMap.length) continue;

        const ny = Math.floor(next / WIDTH);
        const nx = next - ny * WIDTH;
        if (Math.abs(nx - x) + Math.abs(ny - y) !== 1) continue;
        if (!mismatchMap[next] || visited[next]) continue;

        visited[next] = 1;
        queue.push(next);
      }
    }

    if (area < 40) continue;
    const centerX = sumX / area;
    const centerY = sumY / area;
    blobs.push({
      area,
      minX,
      minY,
      maxX,
      maxY,
      centerX,
      centerY,
      region: classifyRegion(centerX, centerY, TOP_END, BOTTOM_START),
    });
  }

  blobs.sort((a, b) => b.area - a.area);
  return blobs.slice(0, maxBlobs);
}

function drawRect(raw: Uint8Array, rect: Rect, rgba: [number, number, number, number], thickness = 2) {
  const x1 = clamp(Math.floor(rect.x), 0, WIDTH - 1);
  const y1 = clamp(Math.floor(rect.y), 0, HEIGHT - 1);
  const x2 = clamp(Math.floor(rect.x + rect.width - 1), 0, WIDTH - 1);
  const y2 = clamp(Math.floor(rect.y + rect.height - 1), 0, HEIGHT - 1);

  for (let t = 0; t < thickness; t++) {
    for (let x = x1; x <= x2; x++) {
      const top = ((y1 + t) * WIDTH + x) * 4;
      const bottom = ((y2 - t) * WIDTH + x) * 4;
      raw[top] = rgba[0];
      raw[top + 1] = rgba[1];
      raw[top + 2] = rgba[2];
      raw[top + 3] = rgba[3];
      raw[bottom] = rgba[0];
      raw[bottom + 1] = rgba[1];
      raw[bottom + 2] = rgba[2];
      raw[bottom + 3] = rgba[3];
    }
    for (let y = y1; y <= y2; y++) {
      const left = (y * WIDTH + (x1 + t)) * 4;
      const right = (y * WIDTH + (x2 - t)) * 4;
      raw[left] = rgba[0];
      raw[left + 1] = rgba[1];
      raw[left + 2] = rgba[2];
      raw[left + 3] = rgba[3];
      raw[right] = rgba[0];
      raw[right + 1] = rgba[1];
      raw[right + 2] = rgba[2];
      raw[right + 3] = rgba[3];
    }
  }
}

function toPngBuffer(raw: Uint8Array): Buffer {
  const png = new PNG({ width: WIDTH, height: HEIGHT });
  png.data = Buffer.from(raw);
  return PNG.sync.write(png);
}

async function saveRawPng(raw: Uint8Array, path: string) {
  await sharp(toPngBuffer(raw)).toFile(path);
}

async function saveCrops(
  referencePath: string,
  renderedPath: string,
  diffPath: string,
  TOP_END: number,
  BOTTOM_START: number,
  OUTPUT_PATHS: ReturnType<typeof outputPaths>,
) {
  const cropHeight = HEIGHT - BOTTOM_START;
  await Promise.all([
    sharp(referencePath).extract({ left: 0, top: 0, width: WIDTH, height: TOP_END }).toFile(OUTPUT_PATHS.topRef),
    sharp(renderedPath).extract({ left: 0, top: 0, width: WIDTH, height: TOP_END }).toFile(OUTPUT_PATHS.topRendered),
    sharp(diffPath).extract({ left: 0, top: 0, width: WIDTH, height: TOP_END }).toFile(OUTPUT_PATHS.topDiff),
    sharp(referencePath).extract({ left: 0, top: BOTTOM_START, width: WIDTH, height: cropHeight }).toFile(OUTPUT_PATHS.bottomRef),
    sharp(renderedPath).extract({ left: 0, top: BOTTOM_START, width: WIDTH, height: cropHeight }).toFile(OUTPUT_PATHS.bottomRendered),
    sharp(diffPath).extract({ left: 0, top: BOTTOM_START, width: WIDTH, height: cropHeight }).toFile(OUTPUT_PATHS.bottomDiff),
  ]);
}

function metricOf(c: RegionMetric) {
  return {
    mismatchedPixels: c.mismatchedPixels,
    totalPixels: c.totalPixels,
    similarityPct: c.similarityPct,
    diffPct: c.diffPct,
  };
}

function formatMetric(name: string, metric: RegionMetric) {
  if (metric.totalPixels === 0) {
    // Empty mask — e.g. a feature that sits entirely inside a text region in
    // artwork-only mode. 0% here would read as a total failure; it's "no data".
    console.log(`\n=== ${name} ===`);
    console.log("  (mask empty — not scored)");
    return;
  }
  console.log(`\n=== ${name} ===`);
  console.log(`  Pixels:      ${metric.totalPixels.toLocaleString()}`);
  console.log(`  Mismatched:  ${metric.mismatchedPixels.toLocaleString()}`);
  console.log(`  Similarity:  ${metric.similarityPct.toFixed(2)}%`);
  console.log(`  Diff:        ${metric.diffPct.toFixed(2)}%`);
}

export async function main() {
  const options = parseArgs(process.argv.slice(2));
  const profile = options.profile;
  const state = Object.keys(PLATE_PROFILES).find((key) => PLATE_PROFILES[key] === profile)!;
  const TOP_END = profile.topEnd;
  const BOTTOM_START = profile.bottomStart;
  const OUTPUT_PATHS = outputPaths(profile.slug, options.outputDirectory);
  await mkdir(options.outputDirectory, { recursive: true });

  const emptyMask = () => createMaskFromPredicate(() => false);

  const masks = {
    full: createMaskFromPredicate(() => true),
    topBand: createMaskFromPredicate((_x, y) => y < TOP_END),
    topStripes: profile.features.stripes ? createMaskFromRects(profile.features.stripes) : emptyMask(),
    topWordmark: profile.features.wordmark ? createMaskFromRects(profile.features.wordmark) : emptyMask(),
    topFrameBolts: profile.features.frameAndBolts
      ? createMaskFromRects(profile.features.frameAndBolts)
      : emptyMask(),
    bottomBand: createMaskFromPredicate((_x, y) => y >= BOTTOM_START),
    // All visible artwork, including separators and illustrations beside serials.
    structural: createMaskFromPredicate(() => true),
    scenicCore: createMaskFromPredicate(
      (_x, y) => y >= profile.scenicCore.y0 && y < profile.scenicCore.y1,
    ),
    stripeZone: profile.stripeZone ? createMaskFromRects(profile.stripeZone) : emptyMask(),
    alignmentAnchor: createMaskFromRects(profile.alignmentAnchor),
    whitePatches: createMaskFromRects(profile.whitePatches),
  };

  // The original photographs retain optional holes and decals. Exclude those
  // physical features from scoring and alignment, including text-enabled runs.
  const optionalMask = createMaskFromRects(optionalFeatureRects(state));
  for (const key of Object.keys(masks) as Array<keyof typeof masks>) {
    masks[key] = subtractMask(masks[key], optionalMask);
  }

  // Artwork-only: drop every text region from every scored mask, so the
  // reference's lettering can't register as mismatch against our text-free
  // render. whitePatches is left alone — it samples blank areas for calibration.
  if (!options.withText) {
    const textMask = createMaskFromRects(profile.textRects);
    for (const key of Object.keys(masks) as Array<keyof typeof masks>) {
      if (key === "whitePatches") continue;
      masks[key] = subtractMask(masks[key], textMask);
    }
  }

  // Subdivide the already-masked band; otherwise footer lettering leaks back
  // into the regional diagnostics and regression gate.
  const bottomColumnMasks = partitionColumns(masks.bottomBand, WIDTH, 5);
  const bottomColumnLabels = ["far-left", "center-left", "center", "center-right", "far-right"];

  console.log(`Rendering ${profile.label} plate component...`);
  const html = renderToString(profile.render(options.plateText));
  const svgMatch = html.match(/<svg[\s\S]*<\/svg>/);
  if (!svgMatch) {
    throw new Error("Failed to extract SVG from rendered HTML");
  }
  let svg = svgMatch[0];
  if (!options.withText) {
    // Drop <text> so unresolvable fonts can't overflow and bleed into artwork.
    const before = svg.length;
    svg = svg.replace(/<text\b[\s\S]*?<\/text>/g, "");
    console.log(`Artwork-only: stripped ${before - svg.length} bytes of <text>.`);
  }

  console.log(`Rasterizing component to ${WIDTH}x${HEIGHT}...`);
  const renderedPng = await rasterizePlate(svg, WIDTH, HEIGHT);

  const renderedRaw = await sharp(renderedPng).ensureAlpha().raw().toBuffer();
  await sharp(renderedPng).toFile(OUTPUT_PATHS.renderedRaw);

  console.log(`Loading reference image: ${options.referencePath}`);
  const referenceRaw = await sharp(options.referencePath)
    .resize(WIDTH, HEIGHT, { fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer();
  await saveRawPng(referenceRaw, OUTPUT_PATHS.referenceResized);

  let processedRenderedRaw: Uint8Array = Uint8Array.from(renderedRaw);
  let alignment = { dx: 0, dy: 0, mae: 0 };
  if (options.align) {
    console.log("Finding best translational alignment...");
    alignment = findBestTranslation(referenceRaw, processedRenderedRaw, masks.alignmentAnchor);
    processedRenderedRaw = shiftImage(processedRenderedRaw, alignment.dx, alignment.dy);
    if (alignment.mae > 60) {
      console.log(`Warning: high alignment MAE (${alignment.mae.toFixed(2)}); compare scores may be less reliable.`);
    }
  }
  await saveRawPng(processedRenderedRaw, OUTPUT_PATHS.renderedAligned);

  // New agreement metrics use actual rendered colors. Legacy calibrated metrics
  // remain available for diagnostics, but cannot conceal a wrong base color.
  const regions = featureRegions(state, masks.full, WIDTH, HEIGHT);
  const comparisonHash = createHash("sha256").update(referenceRaw).update(masks.full)
    .update(JSON.stringify({ state, profile, threshold: options.threshold, align: options.align,
      calibrate: options.calibrate, withText: options.withText, settings: AGREEMENT_SETTINGS, version: AGREEMENT_VERSION }));
  for (const source of ["./compare.tsx", "./agreement.ts", "./masks.ts", "./raster.ts", "../optional-features.ts", "../profiles/index.tsx", "../config.ts"]) {
    comparisonHash.update(await readFile(new URL(source, import.meta.url)));
  }
  for (const region of regions) comparisonHash.update(region.label).update(region.mask);
  const comparisonKey = comparisonHash.digest("hex");
  const { metrics: agreement, detailMask } = await measureAgreement(
    referenceRaw, processedRenderedRaw, WIDTH, HEIGHT, masks.full, options.threshold, regions,
  );
  const scoringMask = Buffer.alloc(WIDTH * HEIGHT * 4);
  for (let i = 0; i < masks.full.length; i++) {
    const rgb = !masks.full[i] ? [35, 35, 35] : detailMask[i] ? [0, 180, 210] : [220, 220, 220];
    scoringMask.set([...rgb, 255], i * 4);
  }
  await saveRawPng(scoringMask, OUTPUT_PATHS.scoringMask);
  console.log(`Feature pixel agreement: ${agreement.pixelAgreement?.toFixed(2) ?? "not scored"}%`);
  console.log(`Shape agreement: ${agreement.shapeAgreement?.toFixed(2) ?? "not scored"}%; color agreement: ${agreement.colorAgreement?.toFixed(2) ?? "not scored"}%`);
  console.log(`Scoring coverage: ${agreement.coveragePct.toFixed(1)}%; detail share: ${agreement.detailSharePct.toFixed(1)}%`);

  let calibration = {
    enabled: false,
    referenceMean: { r: 255, g: 255, b: 255 },
    renderedMean: { r: 255, g: 255, b: 255 },
    gains: { r: 1, g: 1, b: 1 },
  };
  if (options.calibrate) {
    console.log("Applying color calibration from white sample patches...");
    const refMean = meanRgb(referenceRaw, masks.whitePatches);
    const renderedMean = meanRgb(processedRenderedRaw, masks.whitePatches);
    const gains = {
      r: clamp(refMean.r / Math.max(1, renderedMean.r), 0.85, 1.15),
      g: clamp(refMean.g / Math.max(1, renderedMean.g), 0.85, 1.15),
      b: clamp(refMean.b / Math.max(1, renderedMean.b), 0.85, 1.15),
    };
    processedRenderedRaw = applyColorCalibration(processedRenderedRaw, gains);
    calibration = {
      enabled: true,
      referenceMean: refMean,
      renderedMean,
      gains,
    };
  }
  await saveRawPng(processedRenderedRaw, OUTPUT_PATHS.renderedNormalized);

  console.log("Running masked comparisons...");
  const fullComparison = compareRegion(referenceRaw, processedRenderedRaw, masks.full, options.threshold);
  const topComparison = compareRegion(referenceRaw, processedRenderedRaw, masks.topBand, options.threshold);
  const topStripesComparison = compareRegion(referenceRaw, processedRenderedRaw, masks.topStripes, options.threshold);
  const topWordmarkComparison = compareRegion(referenceRaw, processedRenderedRaw, masks.topWordmark, options.threshold);
  const topFrameBoltsComparison = compareRegion(referenceRaw, processedRenderedRaw, masks.topFrameBolts, options.threshold);
  const bottomComparison = compareRegion(referenceRaw, processedRenderedRaw, masks.bottomBand, options.threshold);
  const structuralComparison = compareRegion(referenceRaw, processedRenderedRaw, masks.structural, options.threshold);
  const scenicCoreComparison = compareRegion(referenceRaw, processedRenderedRaw, masks.scenicCore, options.threshold);
  const stripeComparison = compareRegion(referenceRaw, processedRenderedRaw, masks.stripeZone, options.threshold);

  await saveRawPng(fullComparison.diffBuffer, OUTPUT_PATHS.diffFull);
  await saveCrops(
    OUTPUT_PATHS.referenceResized,
    OUTPUT_PATHS.renderedNormalized,
    OUTPUT_PATHS.diffFull,
    TOP_END,
    BOTTOM_START,
    OUTPUT_PATHS,
  );

  const mismatchMap = diffToMismatchMap(structuralComparison.diffBuffer, masks.structural);
  const largestBlobs = findLargestBlobs(mismatchMap, TOP_END, BOTTOM_START, 12);
  const annotatedDiff = Buffer.from(fullComparison.diffBuffer);
  for (const blob of largestBlobs) {
    drawRect(
      annotatedDiff,
      { x: blob.minX, y: blob.minY, width: blob.maxX - blob.minX + 1, height: blob.maxY - blob.minY + 1 },
      [20, 220, 20, 255],
      2
    );
  }
  await saveRawPng(annotatedDiff, OUTPUT_PATHS.diffAnnotated);

  const structuralSsim = maskedSsim(referenceRaw, processedRenderedRaw, masks.structural);
  const scenicSsim = maskedSsim(referenceRaw, processedRenderedRaw, masks.scenicCore);
  const scenicEdge = maskedEdgeF1(referenceRaw, processedRenderedRaw, masks.scenicCore);

  const bottomColumnMetrics: Array<{ label: string } & RegionMetric> = bottomColumnMasks.map((mask, index) => {
    const region = compareRegion(referenceRaw, processedRenderedRaw, mask, options.threshold);
    return {
      label: bottomColumnLabels[index],
      mismatchedPixels: region.mismatchedPixels,
      totalPixels: region.totalPixels,
      similarityPct: region.similarityPct,
      diffPct: region.diffPct,
    };
  });

  formatMetric("Full Plate", fullComparison);
  formatMetric("All artwork (lettering masked)", structuralComparison);
  formatMetric(`Top Band (y=0..${TOP_END})`, topComparison);
  formatMetric("Top Stripes (feature mask)", topStripesComparison);
  formatMetric("Top Wordmark (feature mask)", topWordmarkComparison);
  formatMetric("Top Frame/Bolts (feature mask)", topFrameBoltsComparison);
  formatMetric(`Bottom Band (y=${BOTTOM_START}..${HEIGHT})`, bottomComparison);
  formatMetric(`Scenic Core (y=${profile.scenicCore.y0}..${profile.scenicCore.y1})`, scenicCoreComparison);
  formatMetric("Top Stripe Zone", stripeComparison);

  console.log("\n=== Additional Metrics ===");
  console.log(`  Structural SSIM:  ${structuralSsim.toFixed(4)}`);
  console.log(`  Scenic SSIM:      ${scenicSsim.toFixed(4)}`);
  console.log(`  Scenic Edge F1:   ${scenicEdge.f1.toFixed(4)} (P=${scenicEdge.precision.toFixed(4)}, R=${scenicEdge.recall.toFixed(4)})`);

  console.log(`\n=== Bottom Columns (Diff%) ===`);
  for (const region of bottomColumnMetrics) {
    console.log(`  ${region.label.padEnd(13)} ${region.diffPct.toFixed(2).padStart(7)}%`);
  }

  if (largestBlobs.length > 0) {
    console.log("\n=== Largest Diff Blobs (structural mask) ===");
    for (const [index, blob] of largestBlobs.entries()) {
      console.log(
        `  #${String(index + 1).padStart(2, "0")} area=${blob.area
          .toString()
          .padStart(6)} bbox=(${blob.minX},${blob.minY})..(${blob.maxX},${blob.maxY}) region=${blob.region}`
      );
    }
  }

  const report = {
    settings: {
      // Recorded so a baseline can't be compared against a different state's
      // candidate without it being obvious.
      state: Object.keys(PLATE_PROFILES).find((k) => PLATE_PROFILES[k] === profile),
      scoringVersion: AGREEMENT_VERSION,
      comparisonKey,
      agreementSettings: AGREEMENT_SETTINGS,
      agreementCalibration: false,
      textRects: profile.textRects,
      profileLabel: profile.label,
      width: WIDTH,
      height: HEIGHT,
      threshold: options.threshold,
      referencePath: options.referencePath,
      plateText: options.plateText,
      artworkOnly: !options.withText,
      alignmentEnabled: options.align,
      calibrationEnabled: options.calibrate,
    },
    outputs: OUTPUT_PATHS,
    alignment,
    calibration,
    metrics: {
      agreement,
      full: {
        mismatchedPixels: fullComparison.mismatchedPixels,
        totalPixels: fullComparison.totalPixels,
        similarityPct: fullComparison.similarityPct,
        diffPct: fullComparison.diffPct,
      },
      structural: {
        mismatchedPixels: structuralComparison.mismatchedPixels,
        totalPixels: structuralComparison.totalPixels,
        similarityPct: structuralComparison.similarityPct,
        diffPct: structuralComparison.diffPct,
      },
      topBand: {
        mismatchedPixels: topComparison.mismatchedPixels,
        totalPixels: topComparison.totalPixels,
        similarityPct: topComparison.similarityPct,
        diffPct: topComparison.diffPct,
      },
      // Features whose mask came out empty are omitted rather than reported as
      // 0% — the regression gate treats a missing feature as "no opinion".
      topFeatures: {
        ...(topStripesComparison.totalPixels > 0 && {
          stripes: metricOf(topStripesComparison),
        }),
        ...(topWordmarkComparison.totalPixels > 0 && {
          wordmark: metricOf(topWordmarkComparison),
        }),
        ...(topFrameBoltsComparison.totalPixels > 0 && {
          frameAndBolts: metricOf(topFrameBoltsComparison),
        }),
      },
      bottomBand: {
        mismatchedPixels: bottomComparison.mismatchedPixels,
        totalPixels: bottomComparison.totalPixels,
        similarityPct: bottomComparison.similarityPct,
        diffPct: bottomComparison.diffPct,
      },
      scenicCore: {
        mismatchedPixels: scenicCoreComparison.mismatchedPixels,
        totalPixels: scenicCoreComparison.totalPixels,
        similarityPct: scenicCoreComparison.similarityPct,
        diffPct: scenicCoreComparison.diffPct,
      },
      stripeZone: {
        mismatchedPixels: stripeComparison.mismatchedPixels,
        totalPixels: stripeComparison.totalPixels,
        similarityPct: stripeComparison.similarityPct,
        diffPct: stripeComparison.diffPct,
      },
      bottomColumns: bottomColumnMetrics,
      structuralSsim,
      scenicSsim,
      scenicEdgeF1: scenicEdge,
    },
    topDiffBlobs: largestBlobs,
  };

  await writeFile(OUTPUT_PATHS.reportJson, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log("\nOutputs:");
  console.log(`  ${OUTPUT_PATHS.referenceResized}`);
  console.log(`  ${OUTPUT_PATHS.renderedRaw}`);
  console.log(`  ${OUTPUT_PATHS.renderedAligned}`);
  console.log(`  ${OUTPUT_PATHS.renderedNormalized}`);
  console.log(`  ${OUTPUT_PATHS.diffFull}`);
  console.log(`  ${OUTPUT_PATHS.diffAnnotated}`);
  console.log(`  ${OUTPUT_PATHS.topRef}`);
  console.log(`  ${OUTPUT_PATHS.topRendered}`);
  console.log(`  ${OUTPUT_PATHS.topDiff}`);
  console.log(`  ${OUTPUT_PATHS.bottomRef}`);
  console.log(`  ${OUTPUT_PATHS.bottomRendered}`);
  console.log(`  ${OUTPUT_PATHS.bottomDiff}`);
  console.log(`  ${OUTPUT_PATHS.reportJson}`);
  console.log(`  ${OUTPUT_PATHS.scoringMask}`);
}
