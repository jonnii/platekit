import { expect, it } from "bun:test";
import { PLATE_LOADERS } from "../../src/loaders.js";
import { PLATES, PLATE_STATES } from "../../src/registry.js";

it("loads the same component the registry holds for every state", async () => {
  expect(Object.keys(PLATE_LOADERS).sort()).toEqual([...PLATE_STATES].sort());
  for (const state of PLATE_STATES) {
    const { default: Plate } = await PLATE_LOADERS[state]();
    expect(Plate).toBe(PLATES[state].component);
  }
});
