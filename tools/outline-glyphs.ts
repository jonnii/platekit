import { createHash } from "node:crypto";
import { readdir, writeFile } from "node:fs/promises";
import * as fontkit from "fontkit";
import { FONT_PROBES } from "./artwork/font-probes.ts";
import { FONT_PROBE_SELECTIONS } from "./artwork/font-selections.ts";
import { loadSources } from "./artwork/traces/source.ts";

// Lettering ships as outlines, so layout never depends on a loaded font.
const REVISION = "809e4d8b8d7e9364a914909bb777679606c178b8";
type Source = { path: string; sha256: string; variation?: Record<string, number> };
const SOURCES: Record<string, Source> = {
  "bebas-neue-400": { path: "ofl/bebasneue/BebasNeue-Regular.ttf", sha256: "08e4623805102d819f58601e46e345648846075e363b2ceb23313c2d1c83ec73" },
  "barlow-condensed-500": { path: "ofl/barlowcondensed/BarlowCondensed-Medium.ttf", sha256: "262bd143292ce479ee0cd09a42b47ab173fca8e9c6eb5ed0b5c8a845bc371d17" },
  "barlow-condensed-700": { path: "ofl/barlowcondensed/BarlowCondensed-Bold.ttf", sha256: "e476562ec9c1e16cf16475895b511f08c804f438cc9a9f80a44ea50a0eeb5b65" },
  "teko-500": { path: "ofl/teko/Teko[wght].ttf", sha256: "d1321889f262bbbff632e7976349853399cd097b6f382d4b19790c915c13c1ae", variation: { wght: 500 } },
  "antonio-600": { path: "ofl/antonio/Antonio[wght].ttf", sha256: "9e95a2258ecdf3e45c72c5bbea1c4cd350e8f7bebc87c9dba53b29b1890b8903", variation: { wght: 600 } },
  "roboto-condensed-700": { path: "ofl/robotocondensed/RobotoCondensed[wght].ttf", sha256: "dace262afcee68a5276f200d8026c57221735c0118ab5fda8c2c0d3dc409a8d0", variation: { wght: 700 } },
  "mr-dafoe-400": { path: "ofl/mrdafoe/MrDafoe-Regular.ttf", sha256: "a42a3c66a709927f358243fdfcbc437bd8eb188e2ee6a680c52f5be12c670fd2" },
  "satisfy-400": { path: "apache/satisfy/Satisfy-Regular.ttf", sha256: "55bb141a0a23a32278d5fa7fd2e853824faa173b94774660ebeddb106be07c80" },
  "grand-hotel-400": { path: "ofl/grandhotel/GrandHotel-Regular.ttf", sha256: "ec7ae65d49c936cb5ed32534ab74dbd40c56733de5145ac3aae9da362e02b50f" },
  "marcellus-400": { path: "ofl/marcellus/Marcellus-Regular.ttf", sha256: "1cf0cd10b17d35e852729962cc1ffaffed94514895972458345e2df34abb2f81" },
  "lora-700-italic": { path: "ofl/lora/Lora-Italic[wght].ttf", sha256: "22d8d8854b53807aa664ca34f2031a9ed57a1d0dea296b8b96cdd3aad937a2b3", variation: { wght: 700 } },
  "merriweather-700-italic": { path: "ofl/merriweather/Merriweather-Italic[opsz,wdth,wght].ttf", sha256: "f68a8f4989258679e4fbaf50aa42400132b5373c2d9d2514ba82ef6e85947a0b", variation: { wght: 700 } },
  "bevan-400": { path: "ofl/bevan/Bevan-Regular.ttf", sha256: "8d16c0920330f1def84e342ce70626c27fbf179b4294e6391b19301ff5873469" },
  "roboto-slab-800": { path: "apache/robotoslab/RobotoSlab[wght].ttf", sha256: "786ae192477447d33c6672c3055fba7cbfe45184c9a79e77a14f15716ca05b16", variation: { wght: 800 } },
  "kaushan-script-400": { path: "ofl/kaushanscript/KaushanScript-Regular.ttf", sha256: "6d8d379d9bba98178bee476d68114c8f83812c18005ecccf679e70f60e03d8f6" },
  "playfair-display-700": { path: "ofl/playfairdisplay/PlayfairDisplay[wght].ttf", sha256: "c40f2293766a503bc70cce9e512ef844a4ccb7cbcde792fe2ea31d191917d8d6", variation: { wght: 700 } },
  "pt-serif-700": { path: "ofl/ptserif/PT_Serif-Web-Bold.ttf", sha256: "038ba7336bd7ea14f12ad155bed51a4345cac5153275d521dec3ba04021c526e" },
};
const EM = 1000;

async function load(id: string) {
  const source = SOURCES[id];
  if (!source) throw new Error(`No pinned source for ${id}`);
  const url = `https://raw.githubusercontent.com/google/fonts/${REVISION}/${source.path.replace("[", "%5B").replace("]", "%5D")}`;
  const bytes = Buffer.from(await (await fetch(url)).arrayBuffer());
  const sha = createHash("sha256").update(bytes).digest("hex");
  if (sha !== source.sha256) throw new Error(`Unexpected checksum ${sha} for ${source.path}`);
  const font = fontkit.create(bytes) as fontkit.Font;
  return source.variation ? font.getVariation(source.variation) : font;
}

/** Outline in 1000-unit em space, y down, with its origin on the baseline. */
function outline(font: fontkit.Font, glyphs: fontkit.Glyph[], positions: { xAdvance: number; xOffset: number; yOffset: number }[], size = 1) {
  const scale = size * EM / font.unitsPerEm;
  let x = 0;
  const d = glyphs.map((glyph, i) => {
    const { xAdvance, xOffset, yOffset } = positions[i]!;
    const path = glyph.path.transform(scale, 0, 0, -scale, (x + xOffset) * scale, -yOffset * scale).toSVG();
    x += xAdvance;
    return path;
  }).join("").replace(/-?\d*\.\d+/g, (n) => String(Math.round(Number(n)))).replace(/ (?=-)/g, "");
  return { d, advance: Math.round(x * scale) };
}

// Registrations use each state's measured probe winner, or Bebas Neue where none beat it.
// Probe trials matched glyph height to Bebas, so every face is scaled to Bebas's ink height; plate font sizes stay valid.
const SAMPLE = "H0123456789";
const inkHeight = (font: fontkit.Font) => { const box = font.layout(SAMPLE).bbox; return (box.maxY - box.minY) / font.unitsPerEm; };
const registrationFaces = ["bebas-neue-400", ...new Set(Object.entries(FONT_PROBE_SELECTIONS)
  .filter(([id]) => id.endsWith("-registration")).map(([, selection]) => selection.candidate))].sort();
const bebasHeight = inkHeight(await load("bebas-neue-400"));
// Formatters upper-case input, so lowercase letters are never drawn.
const chars = [...Array.from({ length: 94 }, (_, i) => String.fromCharCode(33 + i)).filter((c) => !/[a-z]/.test(c)), " "];
const faces = [];
for (const id of registrationFaces) {
  const font = await load(id);
  const size = bebasHeight / inkHeight(font);
  const glyphs = chars.map((char) => {
    const glyph = font.glyphForCodePoint(char.codePointAt(0)!);
    const { d, advance } = outline(font, [glyph], [{ xAdvance: glyph.advanceWidth, xOffset: 0, yOffset: 0 }], size);
    return `    ${JSON.stringify(char)}: [${advance}, ${JSON.stringify(d)}],`;
  });
  faces.push(`/** ${id}, scaled ${size.toFixed(3)}× to Bebas Neue's glyph height. */
export const ${id.toUpperCase().replace(/-/g, "_")}: RegistrationFace = { id: ${JSON.stringify(id)}, glyphs: {
${glyphs.join("\n")}
} };`);
}
await writeFile(new URL("../src/internal/registrationGlyphs.ts", import.meta.url), `// Generated by tools/outline-glyphs.ts; do not edit.
// Font copyrights and licenses: ../fonts/NOTICE.md. These are glyph outlines, not fonts.
export const UNITS_PER_EM = ${EM};

/** Advance width and baseline-origin outline per character, in 1000-unit em space. */
export type RegistrationFace = { id: string; glyphs: Record<string, [advance: number, d: string]> };

${faces.join("\n\n")}
`);

// Fixed wordmarks use the measured fixed-reference probe winners, shaped with kerning and script joins,
// except those traced from full-resolution artwork instead (tools/artwork/traces/<state>.ts).
const traced = new Set<string>();
for (const file of (await readdir(new URL("./artwork/traces/", import.meta.url))).filter((name) => /^[a-z]{2}\.ts$/.test(name)))
  for (const source of await loadSources(file.slice(0, 2))) for (const id of source.replaces ?? []) traced.add(id);
const runs = [];
for (const [probeId, selection] of Object.entries(FONT_PROBE_SELECTIONS)) {
  if (selection.comparison !== "word" || traced.has(probeId)) continue;
  const probe = FONT_PROBES.find((entry) => entry.id === probeId)!;
  const font = await load(selection.candidate);
  const shaped = font.layout(probe.text);
  const { d, advance } = outline(font, shaped.glyphs, shaped.positions);
  runs.push(`/** ${probe.label}, ${selection.candidate}. */
export const ${probeId.toUpperCase().replace(/-/g, "_")}: LetteringRun = { text: ${JSON.stringify(probe.text)}, face: ${JSON.stringify(selection.candidate)}, advance: ${advance}, d: ${JSON.stringify(d)} };`);
}
await writeFile(new URL("../src/internal/wordmarks.ts", import.meta.url), `// Generated by tools/outline-glyphs.ts; do not edit.
// Font copyrights and licenses: ../fonts/NOTICE.md. These are drawn words, not fonts.
import type { LetteringRun } from "./Lettering.js";

${runs.join("\n")}
`);
