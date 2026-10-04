import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";
import { renderToStaticMarkup } from "react-dom/server";
import LicensePlate from "../../../src/LicensePlate.tsx";
import { PLATE_REFERENCES } from "../references.ts";
import { fetchSource, loadSources, sourceImage } from "../traces/source.ts";

// Side-by-side check of a state's traced lettering against its full-resolution source.
// Usage: bun run tools/artwork/cli/trace-preview.tsx --state=TX --out=/tmp/tx-trace [--image=/local/copy.png]
// Writes plate.png (source above, ours below) and closeups.png (source left, ours right, per traced box).
const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const state = arg("state")!.toLowerCase(), out = arg("out")!, local = arg("image");
// --source picks one of a config's sources when it has several (default 0).
const source = (await loadSources(state))[Number(arg("source") ?? 0)]!;
const { image: bytes, plate } = await sourceImage(source, local ? await readFile(local) : await fetchSource(source));
const sample = PLATE_REFERENCES.find((entry) => entry.state === state.toUpperCase())?.samples[0] ?? "ABC1234";
const svg = renderToStaticMarkup(<LicensePlate state={state} plate={sample} />).match(/<svg[\s\S]*<\/svg>/)![0];

const W = 1400, H = 700, k = W / 1000;
const ours = await sharp(Buffer.from(svg), { density: 200 }).resize(W, H, { fit: "fill" }).flatten({ background: "#fff" }).png().toBuffer();
// A plate rectangle may overhang the image (e.g. a cropped source); pad with white so it can still be cut out.
const meta = await sharp(bytes).metadata();
const pad = { left: Math.max(0, -Math.round(plate.x)), top: Math.max(0, -Math.round(plate.y)),
  right: Math.max(0, Math.round(plate.x + plate.width) - meta.width!), bottom: Math.max(0, Math.round(plate.y + plate.height) - meta.height!) };
const padded = await sharp(bytes).extend({ ...pad, background: "#fff" }).png().toBuffer();
const ref = await sharp(padded).extract({ left: Math.round(plate.x) + pad.left, top: Math.round(plate.y) + pad.top, width: Math.round(plate.width), height: Math.round(plate.height) })
  .resize(W, H, { fit: "fill" }).flatten({ background: "#fff" }).png().toBuffer();
await mkdir(out, { recursive: true });
await sharp({ create: { width: W, height: H * 2 + 10, channels: 3, background: "#888" } })
  .composite([{ input: ref, top: 0, left: 0 }, { input: ours, top: H + 10, left: 0 }]).png().toFile(`${out}/plate.png`);

// One close-up row per distinct traced box, padded slightly so edges are visible.
const boxes = [...new Map(source.traces.map(({ box }) => [JSON.stringify(box), box])).values()];
const rows = [];
for (const box of boxes) {
  const pad = 6, region = { left: Math.max(0, Math.round((box.x0 - pad) * k)), top: Math.max(0, Math.round((box.y0 - pad) * k)) };
  const crop = { ...region, width: Math.min(W - region.left, Math.round((box.x1 - box.x0 + pad * 2) * k)), height: Math.min(H - region.top, Math.round((box.y1 - box.y0 + pad * 2) * k)) };
  rows.push(await Promise.all([ref, ours].map((image) => sharp(image).extract(crop).png().toBuffer())), crop);
}
const pairs = rows.filter((_, i) => i % 2 === 0) as Buffer[][], crops = rows.filter((_, i) => i % 2 === 1) as { width: number; height: number }[];
const width = Math.max(...crops.map((c) => c.width)) * 2 + 10;
let top = 0;
const layers = pairs.flatMap((pair, i) => { const at = top; top += crops[i]!.height + 10; return [{ input: pair[0]!, left: 0, top: at }, { input: pair[1]!, left: crops[i]!.width + 10, top: at }]; });
await sharp({ create: { width, height: top, channels: 3, background: "#888" } }).composite(layers).png().toFile(`${out}/closeups.png`);
console.log(`${out}/plate.png\n${out}/closeups.png`);
