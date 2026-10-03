import sharp, { type Sharp } from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { PLATE_REFERENCES } from "../references.ts";
import { originalReference } from "../reference-assets.ts";
import { referencePath } from "../paths.ts";
import { fetchSource, loadSources, rasterise } from "../traces/source.ts";

// Find where the scoring reference's plate sits in a higher-resolution source image, for tools/artwork/traces/<state>.ts.
// Usage: bun run tools/artwork/cli/align-source.ts --state=TX --plate=x,y,width,height [--image=/tmp/tx.png] [--out=/tmp/tx-align.png]
// Without --image it aligns in the rendered pixels of tools/artwork/traces/<state>.ts's source, as the tracer sees them.
// The starting rectangle can be rough (within a few percent); the result is refined by edge correlation at plate scale.
const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const state = arg("state")!.toUpperCase(), image = arg("image"), out = arg("out");
let [x, y, width, height] = arg("plate")!.split(",").map(Number) as [number, number, number, number];

const W = 500, H = 250; // half plate scale is enough to register; refinement steps go below one source pixel
async function edges(input: Sharp) {
  const { data } = await input.resize(W, H, { fit: "fill" }).greyscale().raw().toBuffer({ resolveWithObject: true });
  const e = new Float32Array(W * H);
  for (let j = 1; j < H - 1; j++) for (let i = 1; i < W - 1; i++) {
    const k = j * W + i;
    e[k] = Math.hypot(data[k + 1]! - data[k - 1]!, data[k + W]! - data[k - W]!);
  }
  let mean = 0; for (const v of e) mean += v; mean /= e.length;
  let norm = 0; for (let k = 0; k < e.length; k++) { e[k]! -= mean; norm += e[k]! ** 2; }
  norm = Math.sqrt(norm); for (let k = 0; k < e.length; k++) e[k]! /= norm;
  return e;
}
const reference = PLATE_REFERENCES.find((entry) => entry.state === state)!;
const original = originalReference(reference)!;
const target = await edges(sharp(await readFile(referencePath(original.src))));
// --source picks one of a config's sources when it has several (default 0).
const config = image ? undefined : (await loadSources(state))[Number(arg("source") ?? 0)];
const raw = image ? await readFile(image) : await rasterise(await fetchSource(config!), config!.render);
// Pad with white so a plate whose rim is cropped from the source (the rectangle overhangs the image) can still be searched.
const PAD = Math.round(Math.max(...[await sharp(raw).metadata()].map((m) => Math.max(m.width!, m.height!))) * .1);
const source = await sharp(raw).extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: "#fff" }).png().toBuffer();
const meta = await sharp(source).metadata();
x += PAD; y += PAD;
const score = async (r: number[]) => {
  const [rx, ry, rw, rh] = r.map(Math.round) as [number, number, number, number];
  if (rx < 0 || ry < 0 || rx + rw > meta.width! || ry + rh > meta.height!) return -1;
  const e = await edges(sharp(source).extract({ left: rx, top: ry, width: rw, height: rh }));
  let dot = 0; for (let k = 0; k < e.length; k++) dot += e[k]! * target[k]!;
  return dot;
};

let best = [x, y, width, height], bestScore = await score(best);
console.log(`start correlation ${bestScore.toFixed(4)}`);
// Coordinate descent on position and size, halving the step until it is below a source pixel.
for (let step = width * .02; step >= .5; step /= 2) {
  let improved = true;
  while (improved) {
    improved = false;
    for (const [dx, dy, dw, dh] of [[1, 0, 0, 0], [-1, 0, 0, 0], [0, 1, 0, 0], [0, -1, 0, 0], [0, 0, 1, 0], [0, 0, -1, 0], [0, 0, 0, 1], [0, 0, 0, -1], [-.5, 0, 1, 0], [.5, 0, -1, 0], [0, -.5, 0, 1], [0, .5, 0, -1]]) {
      const next = [best[0]! + dx! * step, best[1]! + dy! * step, best[2]! + dw! * step, best[3]! + dh! * step];
      const s = await score(next);
      if (s > bestScore) { best = next; bestScore = s; improved = true; }
    }
  }
}
[x, y, width, height] = best as [number, number, number, number];
console.log(`plate: { x: ${(x - PAD).toFixed(1)}, y: ${(y - PAD).toFixed(1)}, width: ${width.toFixed(1)}, height: ${height.toFixed(1)} }  correlation ${bestScore.toFixed(4)}`);

if (out) {
  // Red: reference edges; cyan: aligned source edges. Overlap reads as grey.
  const [r, s] = [target, await edges(sharp(source).extract({ left: Math.round(x), top: Math.round(y), width: Math.round(width), height: Math.round(height) }))];
  const max = Math.max(...r, ...s);
  const rgb = Buffer.alloc(W * H * 3, 255);
  for (let k = 0; k < W * H; k++) {
    const a = Math.max(0, r[k]!) / max, b = Math.max(0, s[k]!) / max;
    rgb[k * 3] = 255 - Math.min(255, b * 1200); rgb[k * 3 + 1] = rgb[k * 3 + 2] = 255 - Math.min(255, a * 1200);
  }
  await writeFile(out, await sharp(rgb, { raw: { width: W, height: H, channels: 3 } }).resize(1000, 500).png().toBuffer());
}
