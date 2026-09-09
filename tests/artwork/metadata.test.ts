import { expect, it } from "bun:test";
import { PLATES, PLATE_STATES } from "../../src/registry.js";
import { PLATE_METADATA } from "../../tools/artwork/metadata";
import { PLATE_PROFILES } from "../../tools/artwork/profiles";
import { referencePath } from "../../tools/artwork/paths";

it("keeps tooling coverage and source locations aligned with the library", async () => {
  expect(Object.keys(PLATE_METADATA).sort()).toEqual([...PLATE_STATES].sort());
  expect(Object.keys(PLATE_PROFILES).sort()).toEqual([...PLATE_STATES].sort());
  for (const state of PLATE_STATES) {
    expect(PLATE_METADATA[state].name).toBe(PLATES[state].name);
    const module = await import(`../../src/plates/${PLATE_METADATA[state].file}`);
    expect(module.default).toBe(PLATES[state].component);
  }
});

it("only maps known reference asset paths", () => {
  expect(referencePath("/plate-references/originals/ga.jpg")).toEndWith("/references/originals/ga.jpg");
  expect(referencePath("/plate-references/cleaned/ga.webp")).toEndWith("/references/cleaned/ga.webp");
  for (const source of ["/plate-references/../../package.json", "/plate-references/originals/ga.webp", "/fonts/serial.otf"]) {
    expect(() => referencePath(source)).toThrow("Unknown reference asset");
  }
});
