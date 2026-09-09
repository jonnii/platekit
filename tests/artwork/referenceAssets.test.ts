import { referencePath } from "../../tools/artwork/paths";
import { describe, expect, it } from "bun:test";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { PLATE_REFERENCES } from "../../tools/artwork/references";
import { originalReference } from "../../tools/artwork/reference-assets";
import { cleanedReferenceSource } from "../../tools/artwork/reference-assets";

describe("portable reference assets", () => {
  it("includes intact original scoring crops and cleaned display copies for every reference", async () => {
    for (const ref of PLATE_REFERENCES) {
      const original = originalReference(ref)!;
      expect(original).toBeDefined();
      const pixels = await readFile(referencePath(original.src));
      expect(createHash("sha256").update(pixels).digest("hex")).toBe(original.sha256);
      const meta = await sharp(pixels).metadata();
      expect([meta.width, meta.height]).toEqual([ref.plate.w, ref.plate.h]);
      const cleaned = cleanedReferenceSource(ref)!;
      expect(cleaned).toBeDefined();
      expect(await Bun.file(referencePath(cleaned)).exists()).toBe(true);
      expect(cleaned).not.toBe(original.src);
    }
  });

  it("rejects an original crop when source provenance changes", () => {
    const ref = PLATE_REFERENCES[0];
    expect(originalReference({ ...ref, src: "https://example.com/replacement.jpg" })).toBeUndefined();
    expect(originalReference({ ...ref, plate: { ...ref.plate, x: ref.plate.x + 1 } })).toBeUndefined();
    expect(originalReference({ ...ref, image: { ...ref.image, w: ref.image.w + 1 } })).toBeUndefined();
  });
});
