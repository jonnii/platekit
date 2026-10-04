import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import type { PlateState } from "../../src/registry.ts";
import { ARTWORK_STATES, PLATE_METADATA } from "./metadata.ts";

export type ComponentSize = { bytes: number; gzipBytes: number };
export type ComponentSizes = Record<PlateState, ComponentSize>;

/** Standalone production ESM bundles; shared helpers are counted in each plate. */
export async function measureComponentSizes() {
  const root = fileURLToPath(new URL("../../", import.meta.url));
  const inputs = new Set<string>();
  const sizes = {} as ComponentSizes;
  // Separate builds are essential: Bun's multi-entry build retains exports used
  // by other entries, even with splitting disabled, inflating standalone sizes.
  await Promise.all(ARTWORK_STATES.map(async state => {
    const build = await Bun.build({
      entrypoints: [resolve(root, "src/plates", PLATE_METADATA[state].file)],
      target: "browser",
      format: "esm",
      minify: true,
      splitting: false,
      sourcemap: "none",
      external: ["react", "react/*"],
      define: { "process.env.NODE_ENV": JSON.stringify("production") },
      metafile: true,
    });
    if (!build.success) throw new Error(build.logs.map(log => log.message).join("\n"));
    const name = PLATE_METADATA[state].file.replace(/\.tsx$/, ".js");
    const output = build.outputs.find(output => output.path.endsWith(`/${name}`));
    if (!output) throw new Error(`Missing component bundle for ${state}`);
    const bytes = Buffer.from(await output.arrayBuffer());
    sizes[state] = { bytes: bytes.length, gzipBytes: gzipSync(bytes, { level: 9 }).length };
    for (const input of Object.keys(build.metafile!.inputs)) inputs.add(resolve(root, input));
  }));
  return {
    sizes,
    inputs: [...inputs],
  };
}
