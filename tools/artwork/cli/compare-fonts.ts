import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { FONT_PROBES, fontReferenceKind } from "../font-probes";
import { FONT_COMPARISON_SETTINGS, bitmapPng, candidateGlyphs, glyphAgreement, referenceGlyphs, type Bitmap, type BrowserGlyphs } from "../font-comparison";

const option = (name: string, fallback: string) => process.argv.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;
const input = path.resolve(option("input-dir", "/tmp/plate-font-glyphs"));
const output = path.resolve(option("output-dir", "/tmp/plate-font-scores"));
const ids = option("probes", "all").split(",");
const probes = FONT_PROBES.filter((probe) => ids.includes("all") || ids.includes(probe.id));
await mkdir(output, { recursive: true });
const reports = [];

async function strip(glyphs: Bitmap[]) {
  const width = glyphs.reduce((sum, glyph) => sum + glyph.width, 0);
  let x = 0;
  const layers = await Promise.all(glyphs.map(async (glyph) => { const left = x; x += glyph.width; return { input: await bitmapPng(glyph), left, top: 0 }; }));
  return sharp({ create: { width, height: 128, channels: 3, background: "white" } }).composite(layers).png().toBuffer();
}

for (const probe of probes) {
  try {
    const ref = await referenceGlyphs(probe);
    await writeFile(path.join(output, `${probe.id}-reference-mask.png`), await bitmapPng(ref.mask));
    if (!ref.glyphs) {
      const report = { id: probe.id, state: probe.state, kind: probe.kind, ...ref, mask: undefined };
      await writeFile(path.join(output, `${probe.id}.json`), JSON.stringify(report, null, 2));
      reports.push(report); console.log(`${probe.id}: ${ref.error}`); continue;
    }
    const captured: BrowserGlyphs[] = JSON.parse(await readFile(path.join(input, `${probe.id}-glyphs.json`), "utf8"));
    const results = [];
    for (const candidate of captured) {
      const glyphs = await candidateGlyphs(candidate, probe.kind, ref.comparison);
      if (glyphs.length !== ref.glyphs.length) throw new Error("Candidate glyph count differs from reference");
      const metrics = glyphs.map((glyph, index) => glyphAgreement(ref.glyphs![index], glyph));
      const score = metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length;
      results.push({ id: candidate.id, font: candidate.font, score, metrics, glyphs });
    }
    results.sort((a, b) => b.score - a.score);
    const current = results.find((candidate) => candidate.id === "current")!;
    // A small difference is not enough evidence to add a new runtime font.
    const selected = results[0].score >= current.score + 2 ? results[0] : current;
    const report = { id: probe.id, state: probe.state, kind: probe.kind, text: probe.text, provenance: fontReferenceKind(probe.state),
      settings: FONT_COMPARISON_SETTINGS, reference: { sha256: ref.sha256, regions: ref.regions, ink: ref.ink, comparison: ref.comparison, components: ref.components },
      selected: selected.id, selectedScore: selected.score, currentScore: current.score, improvement: selected.score - current.score,
      ranking: results.map(({ glyphs, ...candidate }) => candidate) };
    await writeFile(path.join(output, `${probe.id}.json`), JSON.stringify(report, null, 2));
    for (const [name, glyphs] of [["reference", ref.glyphs], ["current", current.glyphs], ["selected", selected.glyphs]] as const) await writeFile(path.join(output, `${probe.id}-${name}.png`), await strip(glyphs));
    reports.push(report);
    console.log(`${probe.id}: ${selected.id} ${current.score.toFixed(1)} → ${selected.score.toFixed(1)}`);
  } catch (error) { const report = { id: probe.id, error: String(error) }; reports.push(report); console.log(`${probe.id}: ${error}`); }
}
await writeFile(path.join(output, "summary.json"), JSON.stringify({ settings: FONT_COMPARISON_SETTINGS, reports }, null, 2));
