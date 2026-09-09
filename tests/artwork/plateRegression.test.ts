import { describe, expect, it } from "bun:test";
import { assertComparable } from "../../tools/artwork/comparison/regression";

describe("plate regression compatibility", () => {
  const current = { settings: { scoringVersion: 2, comparisonKey: "same-reference-masks-settings" } };
  it("accepts matching configurations", () => {
    expect(() => assertComparable(current, structuredClone(current))).not.toThrow();
  });
  it("rejects old baselines, changed references/settings and absent provenance", () => {
    expect(() => assertComparable({}, current)).toThrow("Regenerate both");
    expect(() => assertComparable(current, { settings: { scoringVersion: 1 } })).toThrow("Regenerate both");
    expect(() => assertComparable(current, { settings: { scoringVersion: 2, comparisonKey: "different" } })).toThrow("differ");
    expect(() => assertComparable({ settings: { scoringVersion: 2 } }, { settings: { scoringVersion: 2 } })).toThrow("differ");
  });
});
