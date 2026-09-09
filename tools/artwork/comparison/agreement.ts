import sharp from "sharp";
import pixelmatch from "pixelmatch";

/** Change this whenever the algorithm, region selection, or constants change. */
export const AGREEMENT_VERSION = 2;
export const AGREEMENT_SETTINGS = {
  blurSigma: 1.2, edgeThreshold: 40, edgeTolerance: 2, detailRadius: 8,
  flatPixelWeight: 0.05, maxFlatWeightShare: 0.1, maxFrameWeight: 0.2,
  minFeatureEdges: 32,
} as const;

export type FeatureRegion = { label: string; mask: Uint8Array; frame?: boolean };
export type AgreementMetric = {
  pixels: number;
  detailPixels: number;
  pixelAgreement: number | null;
  colorAgreement: number | null;
  backgroundColorAgreement: number | null;
  shapeAgreement: number | null;
  referenceEdges: number;
  renderedEdges: number;
};

/** Integral images make neighborhood operations independent of radius. */
function neighborhood(input: Uint8Array, width: number, height: number, radius: number, all = false) {
  const stride = width + 1;
  const sums = new Uint32Array(stride * (height + 1));
  for (let y = 0; y < height; y++) {
    let row = 0;
    for (let x = 0; x < width; x++) {
      row += input[y * width + x];
      sums[(y + 1) * stride + x + 1] = sums[y * stride + x + 1] + row;
    }
  }
  const out = new Uint8Array(input.length);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const x0 = Math.max(0, x - radius), x1 = Math.min(width, x + radius + 1);
    const y0 = Math.max(0, y - radius), y1 = Math.min(height, y + radius + 1);
    const sum = sums[y1 * stride + x1] - sums[y0 * stride + x1] - sums[y1 * stride + x0] + sums[y0 * stride + x0];
    out[y * width + x] = Number(all ? sum === (x1 - x0) * (y1 - y0) : sum > 0);
  }
  return out;
}

/** RGB edges retain boundaries between colors with similar luminance. */
function edges(raw: Uint8Array, width: number, height: number, valid: Uint8Array) {
  const out = new Uint8Array(width * height);
  const magnitude = new Float32Array(out.length);
  const direction = new Uint8Array(out.length);
  const sample = (x: number, y: number, c: number) => raw[(y * width + x) * 4 + c];
  for (let y = 1; y < height - 1; y++) for (let x = 1; x < width - 1; x++) {
    if (!valid[y * width + x]) continue;
    for (let c = 0; c < 3; c++) {
      const gx = -sample(x - 1, y - 1, c) - 2 * sample(x - 1, y, c) - sample(x - 1, y + 1, c)
        + sample(x + 1, y - 1, c) + 2 * sample(x + 1, y, c) + sample(x + 1, y + 1, c);
      const gy = -sample(x - 1, y - 1, c) - 2 * sample(x, y - 1, c) - sample(x + 1, y - 1, c)
        + sample(x - 1, y + 1, c) + 2 * sample(x, y + 1, c) + sample(x + 1, y + 1, c);
      const strength = Math.hypot(gx, gy);
      const i = y * width + x;
      if (strength > magnitude[i]) {
        magnitude[i] = strength;
        direction[i] = Math.round((Math.atan2(gy, gx) * 180 / Math.PI + 180) / 45) % 4;
      }
    }
  }
  // Thin gradient ridges before matching. Thick Sobel bands give busy but
  // differently drawn illustrations excessive opportunities to match an edge.
  const offsets = [1, width + 1, width, width - 1];
  for (let y = 1; y < height - 1; y++) for (let x = 1; x < width - 1; x++) {
    const i = y * width + x, step = offsets[direction[i]], strength = magnitude[i];
    if (strength >= AGREEMENT_SETTINGS.edgeThreshold && strength > magnitude[i - step] && strength >= magnitude[i + step]) out[i] = 1;
  }
  return out;
}

/** Every unmasked pixel belongs to exactly one feature, including the middle. */
export function featureRegions(state: string, mask: Uint8Array, width: number, height: number): FeatureRegion[] {
  const specs: { label: string; contains: (x: number, y: number) => boolean; frame?: boolean }[] = [
    { label: "Frame", frame: true, contains: (x, y) => x < 36 || x >= 964 || y < 36 || y >= 464
      // Maine's reference slots are hardware, not a fifth illustration.
      || state === "ME" && ((x >= 148 && x < 245) || (x >= 752 && x < 853))
        && ((y >= 28 && y < 66) || (y >= 425 && y < 464)) },
  ];
  if (state === "ME") {
    specs.push(
      { label: "Chickadee", contains: (x, y) => x < 178 && y < 255 },
      { label: "Pinecone", contains: (x, y) => x >= 42 && x < 148 && y >= 255 && y < 425 },
      { label: "Pine branch", contains: (x, y) => x < 250 && y < 388 },
      { label: "Forest", contains: (_x, y) => y >= 350 },
      { label: "Other artwork", contains: () => true },
    );
  } else {
    for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
      specs.push({
        label: `${["Upper", "Middle", "Lower"][row]} ${["left", "center", "right"][col]}`,
        contains: (x, y) => Math.min(2, Math.floor((x - 36) * 3 / 928)) === col
          && Math.min(2, Math.floor((y - 36) * 3 / 428)) === row,
      });
    }
  }
  const regions = specs.map(({ label, frame }) => ({ label, frame, mask: new Uint8Array(mask.length) }));
  for (let i = 0; i < mask.length; i++) {
    if (!mask[i]) continue;
    const x = (i % width) * 1000 / width, y = Math.floor(i / width) * 500 / height;
    const index = specs.findIndex((spec) => spec.contains(x, y));
    if (index < 0) throw new Error(`Uncovered artwork pixel: ${x},${y}`);
    regions[index].mask[i] = 1;
  }
  return regions;
}

export async function measureAgreement(
  reference: Uint8Array, rendered: Uint8Array, width: number, height: number,
  mask: Uint8Array, threshold: number, regions: FeatureRegion[],
) {
  if (mask.length !== width * height || reference.length !== mask.length * 4 || rendered.length !== reference.length) {
    throw new Error("Agreement image and mask dimensions differ");
  }
  const blur = (raw: Uint8Array) => sharp(Buffer.from(raw), { raw: { width, height, channels: 4 } })
    .blur(AGREEMENT_SETTINGS.blurSigma).raw().toBuffer();
  const [refSmooth, renderedSmooth] = await Promise.all([blur(reference), blur(rendered)]);
  // Exclude the convolution footprint beside lettering; never create edges by
  // blacking out a text box, or let ignored text match a nearby artwork edge.
  const edgeValid = neighborhood(mask, width, height, 5, true);
  const refEdges = edges(refSmooth, width, height, edgeValid);
  const renderEdges = edges(renderedSmooth, width, height, edgeValid);
  const detail = neighborhood(refEdges, width, height, AGREEMENT_SETTINGS.detailRadius);
  const diff = new Uint8Array(reference.length);
  pixelmatch(reference, rendered, diff, width, height, { threshold, diffMask: true });
  const mismatch = (i: number) => diff[i * 4 + 3] !== 0;

  function measure(region: Uint8Array): AgreementMetric {
    let pixels = 0, detailPixels = 0, wrongDetail = 0, wrongFlat = 0;
    let referenceEdges = 0, renderedEdges = 0, matchedReference = 0, matchedRendered = 0;
    const a = refEdges.map((value, i) => value && region[i] ? 1 : 0);
    const b = renderEdges.map((value, i) => value && region[i] ? 1 : 0);
    const refNearby = neighborhood(a, width, height, AGREEMENT_SETTINGS.edgeTolerance);
    const renderNearby = neighborhood(b, width, height, AGREEMENT_SETTINGS.edgeTolerance);
    for (let i = 0; i < region.length; i++) {
      if (!region[i] || !mask[i]) continue;
      pixels++;
      if (detail[i]) { detailPixels++; wrongDetail += Number(mismatch(i)); }
      else wrongFlat += Number(mismatch(i));
      referenceEdges += a[i]; renderedEdges += b[i];
      matchedReference += a[i] && renderNearby[i] ? 1 : 0;
      matchedRendered += b[i] && refNearby[i] ? 1 : 0;
    }
    const flat = pixels - detailPixels;
    // Reference-only weights remain fixed even if a candidate deletes artwork.
    // Large smooth areas together contribute at most 10% of detailed regions.
    const flatWeight = detailPixels === 0 ? 1 : Math.min(AGREEMENT_SETTINGS.flatPixelWeight,
      flat === 0 ? 0 : detailPixels * AGREEMENT_SETTINGS.maxFlatWeightShare / (flat * (1 - AGREEMENT_SETTINGS.maxFlatWeightShare)));
    const weight = detailPixels + flat * flatWeight;
    const precision = renderedEdges ? matchedRendered / renderedEdges : 0;
    const recall = referenceEdges ? matchedReference / referenceEdges : 0;
    return {
      pixels, detailPixels, referenceEdges, renderedEdges,
      pixelAgreement: weight ? 100 * (1 - (wrongDetail + wrongFlat * flatWeight) / weight) : null,
      colorAgreement: pixels ? 100 * (1 - (wrongDetail + wrongFlat) / pixels) : null,
      backgroundColorAgreement: flat ? 100 * (1 - wrongFlat / flat) : null,
      shapeAgreement: referenceEdges + renderedEdges === 0 ? null
        : precision + recall === 0 ? 0 : 100 * 2 * precision * recall / (precision + recall),
    };
  }
  const overall = measure(mask);
  const features = regions.map((region) => ({ label: region.label, frame: Boolean(region.frame), ...measure(region.mask) }))
    .map((feature) => ({ ...feature, ranked: feature.referenceEdges >= AGREEMENT_SETTINGS.minFeatureEdges }));
  const frame = features.find((feature) => feature.frame && feature.ranked);
  const mean = (key: "pixelAgreement" | "shapeAgreement") => {
    const artwork = features.filter((feature) => !feature.frame && (feature.ranked
      || key === "shapeAgreement" && feature.renderedEdges >= AGREEMENT_SETTINGS.minFeatureEdges));
    const measured = artwork.map((feature) => feature[key]).filter((value): value is number => value !== null);
    if (!measured.length) return null;
    const average = measured.reduce((sum, value) => sum + value, 0) / measured.length;
    return frame?.[key] == null ? average
      : average * (1 - AGREEMENT_SETTINGS.maxFrameWeight) + frame[key] * AGREEMENT_SETTINGS.maxFrameWeight;
  };
  return { detailMask: detail, metrics: {
    version: AGREEMENT_VERSION,
    pixelAgreement: mean("pixelAgreement"), shapeAgreement: mean("shapeAgreement"),
    colorAgreement: overall.colorAgreement, backgroundColorAgreement: overall.backgroundColorAgreement,
    coveragePct: 100 * overall.pixels / mask.length,
    detailSharePct: overall.pixels ? 100 * overall.detailPixels / overall.pixels : 0,
    overall, features,
  } };
}
