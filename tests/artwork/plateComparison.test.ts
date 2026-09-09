import { describe, expect, it } from "bun:test";
import { comparisonReportSchema, rankComparisons, scoresFromReport, type ComparisonRow } from "../../tools/artwork/comparison/data";

function report(state = "FL") {
  return {
    settings: { state, artworkOnly: true, scoringVersion: 2 },
    metrics: {
      agreement: {
        version: 2, pixelAgreement: 38, shapeAgreement: 32, colorAgreement: 62,
        backgroundColorAgreement: 95, coveragePct: 45, detailSharePct: 30,
        features: [{ label: "Chickadee", frame: false, ranked: true, pixels: 1000, detailPixels: 400,
          pixelAgreement: 25, shapeAgreement: 30, colorAgreement: 50, backgroundColorAgreement: 90,
          referenceEdges: 100, renderedEdges: 90 }],
      },
      structural: { similarityPct: 62 }, topBand: { similarityPct: 80 },
      bottomBand: { similarityPct: 40 }, scenicCore: { similarityPct: 50 },
      scenicEdgeF1: { f1: 0.6 }, scenicSsim: 0.4,
      bottomColumns: [{ label: "far-left", diffPct: 75 }, { label: "center", diffPct: 15 }],
    },
  };
}

const scores = scoresFromReport(report(), "FL");
const withPixelAgreement = (pixelAgreement: number | null) => ({ ...scores, agreement: { ...scores.agreement, pixelAgreement } });

describe("custom plate comparison priorities", () => {
  it("ranks the lowest fresh score first, including zero, and excludes outdated and failed scores", () => {
    const rows: ComparisonRow[] = [
      { state: "NY", status: "ready", scores: withPixelAgreement(80) },
      { state: "TX", status: "missing-reference" },
      { state: "FL", status: "stale", scores: withPixelAgreement(1) },
      { state: "NJ", status: "ready", scores: withPixelAgreement(0) },
      { state: "CA", status: "error", scores: withPixelAgreement(2) },
      { state: "ME", status: "ready", scores: withPixelAgreement(null) },
    ];
    expect(rankComparisons(rows).map((row) => row.state)).toEqual(["NJ", "NY", "CA", "FL", "ME", "TX"]);
    expect(rows[0].state).toBe("NY");
  });

  it("reports the worst measured region alongside the overall score", () => {
    expect(scores.structural).toBe(62);
    expect(scores.agreement.pixelAgreement).toBe(38);
    expect(scores.weakestRegion).toBe("Chickadee");
  });

  it("rejects another state's output and text-inclusive runs", () => {
    expect(() => scoresFromReport(report("NY"), "FL")).toThrow("Expected FL report");
    const withText = report();
    withText.settings.artworkOnly = false;
    expect(() => scoresFromReport(withText, "FL")).toThrow();
  });

  it("does not accept incomplete or invalid results as completed measurements", () => {
    const base = { version: 2, generatedAt: "2026-09-05T12:00:00.000Z" };
    expect(comparisonReportSchema.safeParse({ ...base, entries: [{ state: "FL", status: "ready" }] }).success).toBe(false);
    expect(comparisonReportSchema.safeParse({ ...base, entries: [{ state: "FL", status: "ready", fingerprint: "source", scores }] }).success).toBe(true);
    const invalid = report();
    invalid.metrics.structural.similarityPct = NaN;
    expect(() => scoresFromReport(invalid, "FL")).toThrow();
    expect(comparisonReportSchema.safeParse({ ...base, version: 1, entries: [] }).success).toBe(false);
    const old = report();
    old.settings.scoringVersion = 1;
    expect(() => scoresFromReport(old, "FL")).toThrow();
  });
});
