/** Run with Bun from the Platekit root. Snapshots never overwrite SVGs. */
import { createRequire } from "node:module";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const option = (name: string) => args.find(arg => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
const directory = option("output-dir");
if (!directory) throw new Error("Usage: bun run audit-plates --output-dir=/tmp/unique-snapshot [--states=IN,NH,MD] [--baseline=/tmp/original] [--require-identical]");
const output = path.resolve(directory);
const baseline = option("baseline") && path.resolve(option("baseline")!);
if (baseline === output) throw new Error("Baseline and output directories must differ.");
if (args.includes("--require-identical") && !baseline) throw new Error("--require-identical needs --baseline.");
const requireFrontend = createRequire(path.join(process.cwd(), "package.json"));
const { createElement } = requireFrontend("react");
const { renderToStaticMarkup } = requireFrontend("react-dom/server");
const sharp = requireFrontend("sharp");
const { PLATES } = await import(pathToFileURL(path.join(process.cwd(), "src/registry.ts")).href);
const { PLATE_METADATA } = await import(pathToFileURL(path.join(process.cwd(), "tools/artwork/metadata.ts")).href);
const { COMPARISON_WIDTHS } = await import(pathToFileURL(path.join(process.cwd(), "tools/artwork/config.ts")).href);
const states = option("states")?.toUpperCase().split(",") ?? Object.keys(PLATES);
if (new Set(states).size !== states.length || states.some(state => !PLATES[state])) throw new Error("Use distinct state codes from src/registry.ts.");
const widths = [...new Set([...COMPARISON_WIDTHS, 1000])];
await mkdir(output, { recursive: true });
const metrics = (svg: string) => ({
  bytes: Buffer.byteLength(svg),
  gzipBytes: gzipSync(svg).length,
  elements: [...svg.matchAll(/<[a-zA-Z][\w:-]*\b/g)].length,
  paths: [...svg.matchAll(/<path\b/g)].length,
  pathCharacters: [...svg.matchAll(/\bd="([^"]*)"/g)].reduce((sum, match) => sum + match[1].length, 0),
});
async function raster(svg: string, width: number) {
  // Match the repository's artwork-only approach; browser captures validate fonts.
  return sharp(Buffer.from(svg.replace(/<text\b[\s\S]*?<\/text>/g, "")), { density: 200 })
    .resize(width, width / 2, { fit: "fill" }).flatten({ background: "#fff" }).removeAlpha().raw().toBuffer();
}
const results = [];
let changed = false;
for (const state of states) {
  const entry = PLATES[state];
  const html = renderToStaticMarkup(createElement(entry.component, { plate: PLATE_METADATA[state].sample, state: entry.name }));
  const svg = html.match(/<svg\b[\s\S]*?<\/svg>/)?.[0];
  if (!svg) throw new Error(`${state}: component did not render an SVG.`);
  const original = baseline ? await readFile(path.join(baseline, `${state}.svg`), "utf8") : undefined;
  // Exclusive writes prevent accidental destruction of a previous working baseline.
  await writeFile(path.join(output, `${state}.svg`), svg, { flag: "wx" });
  const differences = [];
  if (original) {
    // Samples must match; resource IDs can differ without affecting the artwork.
    if (original.match(/<title>(.*?)<\/title>/)?.[1] !== svg.match(/<title>(.*?)<\/title>/)?.[1]) {
      throw new Error(`${state}: sample/title changed; recreate a comparable baseline.`);
    }
    for (const width of widths) {
      const [before, after] = await Promise.all([raster(original, width), raster(svg, width)]);
      let changedPixels = 0, maximumChannelDelta = 0, totalDelta = 0;
      for (let i = 0; i < before.length; i += 3) {
        let pixelDelta = 0;
        for (let c = 0; c < 3; c++) {
          const delta = Math.abs(before[i + c] - after[i + c]);
          maximumChannelDelta = Math.max(maximumChannelDelta, delta);
          totalDelta += delta;
          pixelDelta += delta;
        }
        if (pixelDelta) changedPixels++;
      }
      if (changedPixels) changed = true;
      differences.push({ width, changedPixels, changedPercent: changedPixels / (before.length / 3) * 100,
        maximumChannelDelta, meanChannelDelta: totalDelta / before.length });
    }
  }
  const result = { state, before: original ? metrics(original) : undefined, after: metrics(svg), differences };
  results.push(result);
  console.log(JSON.stringify(result));
}
await writeFile(path.join(output, "audit.json"), `${JSON.stringify({
  generatedAt: new Date().toISOString(), baseline, widths,
  rasterizer: { sharp: sharp.versions.sharp, vips: sharp.versions.vips, rsvg: sharp.versions.rsvg, density: 200, text: false },
  results,
}, null, 2)}\n`, { flag: "wx" });
if (changed && args.includes("--require-identical")) process.exitCode = 1;
