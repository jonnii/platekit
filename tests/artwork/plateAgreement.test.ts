import { describe, expect, it } from "bun:test";
import { featureRegions, measureAgreement } from "../../tools/artwork/comparison/agreement";

const height = 120;
function solid(width: number, value = 255) {
  const image = new Uint8Array(width * height * 4).fill(value);
  for (let i = 3; i < image.length; i += 4) image[i] = 255;
  return image;
}
function rect(image: Uint8Array, width: number, x: number, y: number, w: number, h: number, color = [0, 0, 0]) {
  for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) image.set([...color, 255], (yy * width + xx) * 4);
}
async function compare(a: Uint8Array, b: Uint8Array, width: number, mask = new Uint8Array(width * height).fill(1)) {
  return (await measureAgreement(a, b, width, height, mask, 0.15, [{ label: "Artwork", mask }])).metrics;
}

describe("plate artwork agreement", () => {
  it("scores identical detailed artwork perfectly", async () => {
    const a = solid(200); rect(a, 200, 30, 25, 30, 70);
    const score = await compare(a, a, 200);
    expect(score.pixelAgreement).toBe(100);
    expect(score.shapeAgreement).toBe(100);
    expect(score.colorAgreement).toBe(100);
  });

  it("does not reward a blank render for deleting artwork or adding whitespace", async () => {
    const scores = [];
    for (const width of [200, 600]) {
      const reference = solid(width); rect(reference, width, 30, 25, 30, 70);
      scores.push(await compare(reference, solid(width), width));
    }
    for (const score of scores) {
      expect(score.shapeAgreement).toBe(0);
      expect(score.pixelAgreement!).toBeLessThan(75);
      expect(score.colorAgreement!).toBeGreaterThan(90);
    }
    expect(Math.abs(scores[0].pixelAgreement! - scores[1].pixelAgreement!)).toBeLessThan(5);
  });

  it("reports wrong uniform colors separately and never invents shape coverage", async () => {
    const score = await compare(solid(200), solid(200, 0), 200);
    expect(score.pixelAgreement).toBeNull();
    expect(score.shapeAgreement).toBeNull();
    expect(score.backgroundColorAgreement).toBe(0);
    expect(score.colorAgreement).toBe(0);
  });

  it("penalizes extra shapes even on an empty reference", async () => {
    const extra = solid(200); rect(extra, 200, 30, 25, 30, 70);
    const score = await compare(solid(200), extra, 200);
    expect(score.shapeAgreement).toBe(0);
    expect(score.backgroundColorAgreement!).toBeLessThan(100);
  });

  it("penalizes a displaced illustration even with identical colors and area", async () => {
    const a = solid(200), b = solid(200);
    rect(a, 200, 30, 25, 30, 70); rect(b, 200, 100, 25, 30, 70);
    const score = await compare(a, b, 200);
    expect(score.shapeAgreement).toBe(0);
    expect(score.pixelAgreement!).toBeLessThan(75);
  });

  it("distinguishes shape agreement from a wrong fill color", async () => {
    const a = solid(200), b = solid(200);
    rect(a, 200, 30, 25, 30, 70, [0, 0, 120]);
    rect(b, 200, 30, 25, 30, 70, [200, 0, 0]);
    const score = await compare(a, b, 200);
    expect(score.shapeAgreement!).toBeGreaterThan(99);
    expect(score.pixelAgreement!).toBeLessThan(90);
  });

  it("ignores lettering without producing mask edges or matching through exclusions", async () => {
    const a = solid(200), b = solid(200);
    rect(a, 200, 30, 25, 20, 70); rect(b, 200, 30, 25, 20, 70);
    rect(a, 200, 95, 30, 45, 60);
    const mask = new Uint8Array(200 * height).fill(1);
    for (let y = 20; y < 100; y++) for (let x = 85; x < 150; x++) mask[y * 200 + x] = 0;
    const score = await compare(a, b, 200, mask);
    expect(score.pixelAgreement).toBe(100);
    expect(score.shapeAgreement).toBe(100);
    expect(score.coveragePct).toBeLessThan(100);
    const empty = await compare(a, b, 200, new Uint8Array(200 * height));
    expect(empty.pixelAgreement).toBeNull();
    expect(empty.colorAgreement).toBeNull();
    expect(empty.shapeAgreement).toBeNull();
    expect(empty.coveragePct).toBe(0);
  });

  it("keeps a perfect frame from overwhelming a missing illustration", async () => {
    const width = 200, a = solid(width, 0), b = solid(width, 0);
    rect(a, width, 10, 10, 180, 100, [255, 255, 255]);
    rect(b, width, 10, 10, 180, 100, [255, 255, 255]);
    rect(a, width, 60, 30, 40, 60);
    const mask = new Uint8Array(width * height).fill(1);
    const frame = mask.map((_v, i) => Number(i % width < 20 || i % width >= 180 || i / width < 20 || i / width >= 100));
    const artwork = frame.map((v) => 1 - v);
    const { metrics } = await measureAgreement(a, b, width, height, mask, 0.15,
      [{ label: "Frame", mask: frame, frame: true }, { label: "Illustration", mask: artwork }]);
    expect(metrics.shapeAgreement).toBeCloseTo(20);
    expect(metrics.pixelAgreement!).toBeLessThan(80);
  });

  it("partitions all unmasked artwork exactly once, including Maine's middle", () => {
    const mask = new Uint8Array(1000 * 500).fill(1); mask[250 * 1000 + 500] = 0;
    for (const state of ["ME", "NY"]) {
      const regions = featureRegions(state, mask, 1000, 500);
      const union = new Uint8Array(mask.length);
      for (const region of regions) for (let i = 0; i < mask.length; i++) union[i] += region.mask[i];
      expect(union).toEqual(mask);
      if (state === "ME") {
        expect(regions.find((r) => r.label === "Chickadee")!.mask[200 * 1000 + 100]).toBe(1);
        expect(regions.find((r) => r.frame)!.mask[45 * 1000 + 160]).toBe(1);
      }
    }
  });
});
