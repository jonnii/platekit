import { referencePath } from "../paths.ts";
/**
 * Crop a reference photo down to just the plate, ready for compare-plate.
 *
 * This step is not optional. The comparator resizes the reference to 1000x500
 * with fit:"fill", so handing it an uncropped photo silently stretches the plate
 * and quietly corrupts every metric. Cropping here using the bounds recorded in
 * tools/artwork/references.ts keeps one source of truth for "where is
 * the plate inside this image".
 *
 *   bun run prepare-plate-reference --state=FL
 *   bun run prepare-plate-reference --state=FL --src=/tmp/my-photo.png
 *
 * Writes /tmp/<state>-plate-reference.jpg, which is what compare-plate expects.
 */
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";
import { PLATE_REFERENCES } from "../references.ts";
import { originalReference } from "../reference-assets.ts";

const PLATE_ASPECT = 2; // 12in x 6in

async function main() {
  const argv = process.argv.slice(2);
  const stateArg = argv.find((a) => a.startsWith("--state="));
  const srcArg = argv.find((a) => a.startsWith("--src="));
  if (!stateArg) {
    throw new Error(
      `--state is required. Known: ${PLATE_REFERENCES.map((r) => r.state).join(", ")}`,
    );
  }
  const state = stateArg.slice("--state=".length).toUpperCase();
  const ref = PLATE_REFERENCES.find((r) => r.state === state);
  if (!ref) {
    throw new Error(
      `No reference for ${state}. Known: ${PLATE_REFERENCES.map((r) => r.state).join(", ")}`,
    );
  }

  let input: Buffer;
  const preserved = originalReference(ref);
  if (!srcArg && preserved && !argv.includes("--fetch")) {
    const cropped = await readFile(referencePath(preserved.src));
    if (createHash("sha256").update(cropped).digest("hex") !== preserved.sha256) {
      throw new Error(`${state}: preserved reference checksum changed. Update its provenance deliberately before scoring.`);
    }
    const out = `/tmp/${state.toLowerCase()}-plate-reference.jpg`;
    await writeFile(out, cropped);
    console.log(`Wrote ${out} from the preserved original scoring crop.`);
    return;
  }
  if (srcArg) {
    const src = srcArg.slice("--src=".length);
    console.log(`Reading ${src}`);
    input = await sharp(src).toBuffer();
  } else {
    console.log(`Fetching ${ref.src}`);
    const res = await fetch(ref.src);
    if (!res.ok) {
      throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
    }
    input = Buffer.from(await res.arrayBuffer());
  }

  const meta = await sharp(input).metadata();
  if (meta.width !== ref.image.w || meta.height !== ref.image.h) {
    // Recorded bounds are in source pixels, so a different source size means the
    // bounds no longer point at the plate. Fail loudly rather than crop garbage.
    throw new Error(
      `Image is ${meta.width}x${meta.height} but references.ts records ` +
        `${ref.image.w}x${ref.image.h} for ${state}. Re-measure the plate bounds.`,
    );
  }

  const aspect = ref.plate.w / ref.plate.h;
  if (Math.abs(aspect - PLATE_ASPECT) > 0.06) {
    console.log(
      `Warning: recorded plate bounds are ${aspect.toFixed(3)}:1, expected ~${PLATE_ASPECT}:1. ` +
        `Bounds may be off, which will show up as a constant offset in every metric.`,
    );
  }

  const out = `/tmp/${state.toLowerCase()}-plate-reference.jpg`;
  const cropped = await sharp(input)
    .extract({
      left: ref.plate.x,
      top: ref.plate.y,
      width: ref.plate.w,
      height: ref.plate.h,
    })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 95 })
    .toBuffer();
  await writeFile(out, cropped);

  console.log(`Wrote ${out} (${ref.plate.w}x${ref.plate.h}, ${aspect.toFixed(3)}:1)`);
  console.log(`Next: bun run compare-plate --state=${state} --reference=${out}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
