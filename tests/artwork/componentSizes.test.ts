import { expect, it } from "bun:test";
import { gzipSync } from "node:zlib";
import { measureComponentSizes } from "../../tools/artwork/component-sizes.ts";
import { ARTWORK_STATES } from "../../tools/artwork/metadata.ts";

it("reports the cost of importing one plate without retaining other plates' glyphs", async () => {
  const { sizes } = await measureComponentSizes();
  const standalone = await Bun.build({
    entrypoints: ["./src/plates/MissouriPlate.tsx"],
    target: "browser", format: "esm", minify: true,
    external: ["react", "react/*"],
    define: { "process.env.NODE_ENV": JSON.stringify("production") },
  });
  expect(standalone.success).toBe(true);
  const bytes = Buffer.from(await standalone.outputs[0].arrayBuffer());
  expect(Object.keys(sizes).sort()).toEqual([...ARTWORK_STATES].sort());
  expect(sizes.MO).toEqual({ bytes: bytes.length, gzipBytes: gzipSync(bytes, { level: 9 }).length });
});
