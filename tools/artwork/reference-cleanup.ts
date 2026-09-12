import sharp from "sharp";
import type { Rect } from "./profiles";

/** Integrate only AI-reconstructed regions; preserve all other decoded pixels. */
export async function compositeReferenceCleanup(source: Buffer, generated: Buffer, regions: Rect[]): Promise<Buffer> {
  const { width, height } = await sharp(source).metadata();
  if (!width || !height) throw new Error("Reference image has no dimensions");
  const original = await sharp(source).removeAlpha().raw().toBuffer();
  const reconstruction = await sharp(generated).resize(width, height, { fit: "fill" }).removeAlpha().raw().toBuffer();
  const output = Buffer.from(original);
  for (const region of regions) {
    const left = Math.max(0, Math.floor(region.x * width / 1000));
    const top = Math.max(0, Math.floor(region.y * height / 500));
    const right = Math.min(width, Math.ceil((region.x + region.width) * width / 1000));
    const bottom = Math.min(height, Math.ceil((region.y + region.height) * height / 500));
    const w = right - left, h = bottom - top;
    if (w < 3 || h < 3) continue;
    // Match the existing surface at the boundary while retaining the AI's
    // reconstructed detail. A harmonic color correction avoids rectangular seams.
    for (let channel = 0; channel < 3; channel++) {
      const correction = new Float32Array(w * h);
      const delta = (x: number, y: number) => {
        const index = ((top + y) * width + left + x) * 3 + channel;
        // Earlier regions may already have repaired a hole that touches a decal.
        return output[index] - reconstruction[index];
      };
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        correction[y * w + x] = x === 0 || y === 0 || x === w - 1 || y === h - 1
          ? delta(x, y) : (delta(x, 0) * (h - 1 - y) + delta(x, h - 1) * y) / (h - 1);
      }
      for (let iteration = 0; iteration < 250; iteration++) {
        let change = 0;
        for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
          const i = y * w + x;
          const value = (correction[i - 1] + correction[i + 1] + correction[i - w] + correction[i + w]) / 4;
          change = Math.max(change, Math.abs(value - correction[i]));
          correction[i] = value;
        }
        if (change < 0.05) break;
      }
      for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
        const i = ((top + y) * width + left + x) * 3 + channel;
        output[i] = Math.max(0, Math.min(255, Math.round(reconstruction[i] + correction[y * w + x])));
      }
    }
  }
  return sharp(output, { raw: { width, height, channels: 3 } }).webp({ lossless: true }).toBuffer();
}
