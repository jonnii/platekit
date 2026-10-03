import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import type { TraceSource } from "./types.ts";

/** A state's trace sources: a config exports one source, or several when its lettering comes from different images. */
export async function loadSources(state: string): Promise<TraceSource[]> {
  return [(await import(`./${state.toLowerCase()}.ts`)).default as TraceSource | TraceSource[]].flat();
}

/** Download a trace source and verify its pinned checksum. */
export async function fetchSource(source: TraceSource) {
  const bytes = Buffer.from(await (await fetch(source.url, { headers: { "user-agent": "platekit-trace/1.0 (https://github.com/jonnii/platekit)" } })).arrayBuffer());
  const sha = createHash("sha256").update(bytes).digest("hex");
  if (sha !== source.sha256) throw new Error(`Unexpected checksum ${sha} for ${source.url}`);
  return bytes;
}

/** The raster image that a source's plate rectangle and boxes refer to. */
export async function rasterise(bytes: Buffer, render: TraceSource["render"]) {
  if (!render) return bytes;
  if ("density" in render) return sharp(bytes, { density: render.density }).png().toBuffer();
  const dir = await mkdtemp(join(tmpdir(), "platekit-trace-"));
  try {
    await writeFile(join(dir, "source.pdf"), bytes);
    const result = spawnSync("pdftoppm", ["-f", String(render.pdfPage), "-l", String(render.pdfPage), "-r", String(render.dpi), "-png", "-singlefile", "source.pdf", "page"], { cwd: dir });
    if (result.status !== 0) throw new Error(`pdftoppm failed (install poppler): ${result.stderr}`);
    return await readFile(join(dir, "page.png"));
  } finally { await rm(dir, { recursive: true, force: true }); }
}
