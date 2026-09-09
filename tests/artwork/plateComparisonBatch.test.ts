import { describe, expect, it, spyOn } from "bun:test";
import { compareStates } from "../../tools/artwork/comparison/batch";
import type { ComparisonEntry } from "../../tools/artwork/comparison/data";

describe("parallel plate comparisons", () => {
  it("runs four at a time, refills workers, isolates failures, and preserves input order", async () => {
    const states = ["AL", "AK", "AZ", "AR", "CO", "CT", "DE"];
    const started: string[] = [];
    const jobs = new Map<string, { resolve: (entry: ComparisonEntry) => void; reject: (error: Error) => void }>();
    const missing = (state: string): ComparisonEntry => ({ state, status: "missing-reference" });
    const log = spyOn(console, "error").mockImplementation(() => {});
    try {
      const batch = compareStates(states, (state) => {
        started.push(state);
        return new Promise<ComparisonEntry>((resolve, reject) => { jobs.set(state, { resolve, reject }); });
      }, 4);
      expect(started).toEqual(states.slice(0, 4));

      jobs.get("AR")!.resolve(missing("AR"));
      await Promise.resolve();
      expect(started).toEqual(states.slice(0, 5));

      jobs.get("AK")!.reject(new Error("reference unavailable"));
      await Promise.resolve();
      expect(started).toEqual(states.slice(0, 6));

      jobs.get("CO")!.resolve(missing("CO"));
      await Promise.resolve();
      expect(started).toEqual(states);
      for (const state of ["DE", "CT", "AZ", "AL"]) jobs.get(state)!.resolve(missing(state));

      const entries = await batch;
      expect(entries.map((entry) => entry.state)).toEqual(states);
      expect(entries[1]).toEqual({ state: "AK", status: "error", message: "reference unavailable" });
      expect(entries.filter((entry) => entry.status === "missing-reference")).toHaveLength(6);
    } finally {
      log.mockRestore();
    }
  });

  it("handles an empty batch without starting work", async () => {
    let calls = 0;
    expect(await compareStates([], async (state) => {
      calls++;
      return { state, status: "missing-reference" };
    })).toEqual([]);
    expect(calls).toBe(0);
  });
});
