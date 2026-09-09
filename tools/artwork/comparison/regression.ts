import { readFile } from "node:fs/promises";

type SimilarityMetric = { similarityPct: number; diffPct: number };

type Report = {
  settings?: { scoringVersion?: number; comparisonKey?: string };
  alignment?: { dx: number; dy: number; mae: number };
  metrics: {
    agreement?: {
      pixelAgreement: number | null; shapeAgreement: number | null;
      colorAgreement: number | null; backgroundColorAgreement: number | null;
      features: Array<{ label: string; ranked: boolean; pixelAgreement: number | null; shapeAgreement: number | null }>;
    };
    full: SimilarityMetric;
    structural: SimilarityMetric;
    topBand: SimilarityMetric;
    bottomBand: SimilarityMetric;
    scenicCore: SimilarityMetric;
    stripeZone?: SimilarityMetric;
    topFeatures?: {
      stripes?: SimilarityMetric;
      wordmark?: SimilarityMetric;
      frameAndBolts?: SimilarityMetric;
    };
    structuralSsim: number;
    scenicSsim: number;
    scenicEdgeF1: { precision: number; recall: number; f1: number };
    bottomColumns: Array<{ label: string; similarityPct: number; diffPct: number }>;
  };
};

type Options = {
  baselinePath: string;
  candidatePath: string;
  maxStructuralDrop: number;
  maxTopDrop: number;
  maxTopStripesDrop: number;
  maxTopWordmarkDrop: number;
  maxTopFrameBoltsDrop: number;
  maxBottomDrop: number;
  maxScenicCoreDrop: number;
  maxScenicEdgeF1Drop: number;
  maxScenicSsimDrop: number;
  maxWorstBottomColumnDiffIncrease: number;
};

type Row = {
  label: string;
  baseline: number | null;
  candidate: number | null;
  comparator: "min" | "max" | "info";
  minDelta?: number;
  maxDelta?: number;
  format: "pct" | "float";
};

export function assertComparable(baseline: Pick<Report, "settings">, candidate: Pick<Report, "settings">) {
  if (baseline.settings?.scoringVersion !== 2 || candidate.settings?.scoringVersion !== 2) {
    throw new Error("Regenerate both reports with scoring version 2 before comparing them.");
  }
  if (!baseline.settings.comparisonKey || baseline.settings.comparisonKey !== candidate.settings.comparisonKey) {
    throw new Error("Comparison settings, reference or masks differ; regenerate both reports under identical settings.");
  }
}

function agreementRows(baseline: Report, candidate: Report, pixelDrop: number, shapeDrop: number): Row[] {
  const a = baseline.metrics.agreement, b = candidate.metrics.agreement;
  if (!a || !b) throw new Error("Both reports must contain agreement metrics.");
  const row = (label: string, before: number | null, after: number | null, drop: number): Row => {
    if (before !== null && (!Number.isFinite(before) || after === null || !Number.isFinite(after))) {
      throw new Error(`${label}: candidate has missing or invalid coverage`);
    }
    return { label, baseline: before, candidate: after, minDelta: -drop, comparator: "min", format: "pct" };
  };
  return [
    row("Feature pixel agreement", a.pixelAgreement, b.pixelAgreement, pixelDrop),
    row("Feature shape agreement", a.shapeAgreement, b.shapeAgreement, shapeDrop),
    row("Color agreement", a.colorAgreement, b.colorAgreement, pixelDrop),
    row("Background color agreement", a.backgroundColorAgreement, b.backgroundColorAgreement, pixelDrop),
    ...a.features.filter((feature) => feature.ranked).flatMap((feature) => {
      const next = b.features.find((item) => item.label === feature.label);
      if (!next) throw new Error(`Missing feature in candidate: ${feature.label}`);
      return [row(`${feature.label}: pixels`, feature.pixelAgreement, next.pixelAgreement, pixelDrop),
        row(`${feature.label}: shape`, feature.shapeAgreement, next.shapeAgreement, shapeDrop)];
    }),
  ];
}

function parseArgs(argv: string[]): Options {
  const options: Options = {
    baselinePath: "/tmp/ny-plate-baseline-report.json",
    candidatePath: "/tmp/ny-plate-report.json",
    maxStructuralDrop: 0.15,
    maxTopDrop: 0.25,
    maxTopStripesDrop: 0.35,
    maxTopWordmarkDrop: 0.35,
    maxTopFrameBoltsDrop: 0.35,
    maxBottomDrop: 0.25,
    maxScenicCoreDrop: 0.25,
    maxScenicEdgeF1Drop: 0.01,
    maxScenicSsimDrop: 0.002,
    maxWorstBottomColumnDiffIncrease: 0.4,
  };

  for (const arg of argv) {
    if (arg.startsWith("--baseline=")) {
      options.baselinePath = arg.slice("--baseline=".length);
    } else if (arg.startsWith("--candidate=")) {
      options.candidatePath = arg.slice("--candidate=".length);
    } else if (arg.startsWith("--max-structural-drop=")) {
      options.maxStructuralDrop = Number(arg.slice("--max-structural-drop=".length));
    } else if (arg.startsWith("--max-top-drop=")) {
      options.maxTopDrop = Number(arg.slice("--max-top-drop=".length));
    } else if (arg.startsWith("--max-top-stripes-drop=")) {
      options.maxTopStripesDrop = Number(arg.slice("--max-top-stripes-drop=".length));
    } else if (arg.startsWith("--max-top-wordmark-drop=")) {
      options.maxTopWordmarkDrop = Number(arg.slice("--max-top-wordmark-drop=".length));
    } else if (arg.startsWith("--max-top-frame-bolts-drop=")) {
      options.maxTopFrameBoltsDrop = Number(arg.slice("--max-top-frame-bolts-drop=".length));
    } else if (arg.startsWith("--max-bottom-drop=")) {
      options.maxBottomDrop = Number(arg.slice("--max-bottom-drop=".length));
    } else if (arg.startsWith("--max-scenic-drop=")) {
      options.maxScenicCoreDrop = Number(arg.slice("--max-scenic-drop=".length));
    } else if (arg.startsWith("--max-scenic-edge-f1-drop=")) {
      options.maxScenicEdgeF1Drop = Number(arg.slice("--max-scenic-edge-f1-drop=".length));
    } else if (arg.startsWith("--max-scenic-ssim-drop=")) {
      options.maxScenicSsimDrop = Number(arg.slice("--max-scenic-ssim-drop=".length));
    } else if (arg.startsWith("--max-worst-bottom-diff-increase=")) {
      options.maxWorstBottomColumnDiffIncrease = Number(arg.slice("--max-worst-bottom-diff-increase=".length));
    } else if (arg.trim().length > 0) {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function delta(candidate: number, baseline: number): number {
  return candidate - baseline;
}

function pct(value: number): string {
  return `${value.toFixed(2)}%`;
}

function signed(value: number, digits = 2): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}`;
}

async function readReport(path: string): Promise<Report> {
  const text = await readFile(path, "utf8");
  return JSON.parse(text) as Report;
}

function getWorstBottomDiff(report: Report): number {
  return report.metrics.bottomColumns.reduce((maxDiff, col) => Math.max(maxDiff, col.diffPct), -Infinity);
}

function getTopFeatureSimilarity(
  report: Report,
  key: keyof NonNullable<Report["metrics"]["topFeatures"]>
): number | null {
  return report.metrics.topFeatures?.[key]?.similarityPct ?? null;
}

function getTopCompositeSimilarity(report: Report): number {
  const parts: number[] = [];
  const stripes = getTopFeatureSimilarity(report, "stripes");
  const wordmark = getTopFeatureSimilarity(report, "wordmark");
  const frameAndBolts = getTopFeatureSimilarity(report, "frameAndBolts");

  if (stripes !== null) parts.push(stripes);
  if (wordmark !== null) parts.push(wordmark);
  if (frameAndBolts !== null) parts.push(frameAndBolts);

  if (parts.length === 0) {
    return report.metrics.topBand.similarityPct;
  }

  return parts.reduce((sum, value) => sum + value, 0) / parts.length;
}

function hasAllTopFeatures(report: Report): boolean {
  return Boolean(
    report.metrics.topFeatures?.stripes &&
      report.metrics.topFeatures?.wordmark &&
      report.metrics.topFeatures?.frameAndBolts
  );
}

export async function main() {
  const options = parseArgs(process.argv.slice(2));
  const baseline = await readReport(options.baselinePath);
  const candidate = await readReport(options.candidatePath);
  assertComparable(baseline, candidate);
  const canUseTopFeatureComposite = hasAllTopFeatures(baseline) && hasAllTopFeatures(candidate);

  const rows: Row[] = [
    ...agreementRows(baseline, candidate, options.maxStructuralDrop, options.maxScenicEdgeF1Drop * 100),
    {
      label: "Structural Similarity",
      baseline: baseline.metrics.structural.similarityPct,
      candidate: candidate.metrics.structural.similarityPct,
      minDelta: -options.maxStructuralDrop,
      comparator: "min",
      format: "pct",
    },
    {
      label: "Top Composite Similarity",
      baseline: canUseTopFeatureComposite ? getTopCompositeSimilarity(baseline) : baseline.metrics.topBand.similarityPct,
      candidate: canUseTopFeatureComposite ? getTopCompositeSimilarity(candidate) : candidate.metrics.topBand.similarityPct,
      minDelta: -options.maxTopDrop,
      comparator: "min",
      format: "pct",
    },
    {
      label: "Top Stripes Similarity",
      baseline: getTopFeatureSimilarity(baseline, "stripes"),
      candidate: getTopFeatureSimilarity(candidate, "stripes"),
      minDelta: -options.maxTopStripesDrop,
      comparator: "min",
      format: "pct",
    },
    {
      label: "Top Wordmark Similarity",
      baseline: getTopFeatureSimilarity(baseline, "wordmark"),
      candidate: getTopFeatureSimilarity(candidate, "wordmark"),
      minDelta: -options.maxTopWordmarkDrop,
      comparator: "min",
      format: "pct",
    },
    {
      label: "Top Frame/Bolts Similarity",
      baseline: getTopFeatureSimilarity(baseline, "frameAndBolts"),
      candidate: getTopFeatureSimilarity(candidate, "frameAndBolts"),
      minDelta: -options.maxTopFrameBoltsDrop,
      comparator: "min",
      format: "pct",
    },
    {
      label: "Top Band Similarity (diag)",
      baseline: baseline.metrics.topBand.similarityPct,
      candidate: candidate.metrics.topBand.similarityPct,
      comparator: "info",
      format: "pct",
    },
    {
      label: "Bottom Band Similarity",
      baseline: baseline.metrics.bottomBand.similarityPct,
      candidate: candidate.metrics.bottomBand.similarityPct,
      minDelta: -options.maxBottomDrop,
      comparator: "min",
      format: "pct",
    },
    {
      label: "Scenic Core Similarity",
      baseline: baseline.metrics.scenicCore.similarityPct,
      candidate: candidate.metrics.scenicCore.similarityPct,
      minDelta: -options.maxScenicCoreDrop,
      comparator: "min",
      format: "pct",
    },
    {
      label: "Scenic Edge F1",
      baseline: baseline.metrics.scenicEdgeF1.f1,
      candidate: candidate.metrics.scenicEdgeF1.f1,
      minDelta: -options.maxScenicEdgeF1Drop,
      comparator: "min",
      format: "float",
    },
    {
      label: "Scenic SSIM",
      baseline: baseline.metrics.scenicSsim,
      candidate: candidate.metrics.scenicSsim,
      minDelta: -options.maxScenicSsimDrop,
      comparator: "min",
      format: "float",
    },
    {
      label: "Worst Bottom Diff%",
      baseline: getWorstBottomDiff(baseline),
      candidate: getWorstBottomDiff(candidate),
      maxDelta: options.maxWorstBottomColumnDiffIncrease,
      comparator: "max",
      format: "pct",
    },
  ];

  const failures: string[] = [];
  const skipped: string[] = [];

  console.log("Plate Regression Check");
  console.log(`  baseline:  ${options.baselinePath}`);
  console.log(`  candidate: ${options.candidatePath}`);
  console.log("");
  console.log(`${"Metric".padEnd(30)} ${"Baseline".padStart(10)} ${"Candidate".padStart(10)} ${"Delta".padStart(9)}  Status`);
  console.log("-".repeat(76));

  for (const row of rows) {
    if (row.baseline === null || row.candidate === null) {
      skipped.push(row.label);
      console.log(`${row.label.padEnd(30)} ${"n/a".padStart(10)} ${"n/a".padStart(10)} ${"n/a".padStart(9)}  SKIP`);
      continue;
    }

    const d = delta(row.candidate, row.baseline);
    let status = "PASS";

    if (row.comparator === "min") {
      const pass = d >= (row.minDelta ?? 0);
      status = pass ? "PASS" : "FAIL";
      if (!pass) {
        failures.push(`${row.label}: delta ${signed(d, 4)} < ${signed(row.minDelta ?? 0, 4)}`);
      }
    } else if (row.comparator === "max") {
      const pass = d <= (row.maxDelta ?? 0);
      status = pass ? "PASS" : "FAIL";
      if (!pass) {
        failures.push(`${row.label}: delta ${signed(d, 4)} > ${signed(row.maxDelta ?? 0, 4)}`);
      }
    } else {
      status = "INFO";
    }

    const baselineLabel = row.format === "float" ? row.baseline.toFixed(4) : pct(row.baseline);
    const candidateLabel = row.format === "float" ? row.candidate.toFixed(4) : pct(row.candidate);
    const deltaLabel = row.format === "float" ? signed(d, 4) : `${signed(d)}%`;

    console.log(`${row.label.padEnd(30)} ${baselineLabel.padStart(10)} ${candidateLabel.padStart(10)} ${deltaLabel.padStart(9)}  ${status}`);
  }

  if (skipped.length > 0) {
    console.log("\nSkipped feature gates (metric missing in baseline or candidate):");
    for (const label of skipped) {
      console.log(`  - ${label}`);
    }
  }

  if (failures.length > 0) {
    console.log("\nRegression checks failed:");
    for (const failure of failures) {
      console.log(`  - ${failure}`);
    }
    process.exit(1);
  }

  console.log("\nAll regression checks passed.");
}
