import { z } from "zod";

const percent = z.number().finite().min(0).max(100);
const unit = z.number().finite().min(0).max(1);
const optionalPercent = percent.nullable();
const featureSchema = z.object({
  label: z.string(), frame: z.boolean(), ranked: z.boolean(),
  pixels: z.number().int().nonnegative(), detailPixels: z.number().int().nonnegative(),
  pixelAgreement: optionalPercent, shapeAgreement: optionalPercent,
  colorAgreement: optionalPercent, backgroundColorAgreement: optionalPercent,
  referenceEdges: z.number().int().nonnegative(), renderedEdges: z.number().int().nonnegative(),
});
const agreementSchema = z.object({
  version: z.literal(2),
  pixelAgreement: optionalPercent, shapeAgreement: optionalPercent,
  colorAgreement: optionalPercent, backgroundColorAgreement: optionalPercent,
  coveragePct: percent, detailSharePct: percent,
  features: z.array(featureSchema),
});
export const scoreSchema = z.object({
  agreement: agreementSchema,
  structural: percent,
  top: percent,
  bottom: percent,
  scenic: percent,
  edgeF1: unit,
  ssim: z.number().finite().min(-1).max(1),
  weakestRegion: z.string(),
});

export const comparisonEntrySchema = z.object({
  state: z.string(),
  status: z.enum(["ready", "error", "missing-reference"]),
  fingerprint: z.string().optional(),
  scores: scoreSchema.optional(),
  message: z.string().optional(),
}).refine((entry) => entry.status !== "ready" || (entry.scores && entry.fingerprint), {
  message: "A completed comparison must include scores and a source fingerprint",
});

export const comparisonReportSchema = z.object({
  version: z.literal(2),
  generatedAt: z.iso.datetime(),
  entries: z.array(comparisonEntrySchema),
});

export type ComparisonEntry = z.infer<typeof comparisonEntrySchema>;
export type ComparisonReport = z.infer<typeof comparisonReportSchema>;
export type ComparisonRow = Omit<ComparisonEntry, "status"> & {
  status: ComparisonEntry["status"] | "not-run" | "stale";
};

/** Only fresh, successful measurements participate in the priority ranking. */
export function rankComparisons(rows: ComparisonRow[]): ComparisonRow[] {
  return [...rows].sort((a, b) => {
    const aScore = a.status === "ready" ? a.scores?.agreement.pixelAgreement ?? undefined : undefined;
    const bScore = b.status === "ready" ? b.scores?.agreement.pixelAgreement ?? undefined : undefined;
    if (aScore !== undefined && bScore !== undefined) return aScore - bScore || a.state.localeCompare(b.state);
    if (aScore !== undefined) return -1;
    if (bScore !== undefined) return 1;
    return a.state.localeCompare(b.state);
  });
}

const regionSchema = z.object({ similarityPct: percent });
const rawReportSchema = z.object({
  settings: z.object({ state: z.string(), artworkOnly: z.literal(true), scoringVersion: z.literal(2) }),
  metrics: z.object({
    agreement: agreementSchema,
    structural: regionSchema,
    topBand: regionSchema,
    bottomBand: regionSchema,
    scenicCore: regionSchema,
    scenicEdgeF1: z.object({ f1: unit }),
    scenicSsim: z.number().finite().min(-1).max(1),
    bottomColumns: z.array(z.object({ label: z.string(), diffPct: percent })),
  }),
});

export function scoresFromReport(input: unknown, state: string): z.infer<typeof scoreSchema> {
  const report = rawReportSchema.parse(input);
  if (report.settings.state !== state) throw new Error(`Expected ${state} report, received ${report.settings.state}`);
  const metrics = report.metrics;
  const weakest = metrics.agreement.features.filter((feature) => feature.ranked && feature.pixelAgreement !== null)
    .sort((a, b) => a.pixelAgreement! - b.pixelAgreement!)[0];
  return {
    agreement: metrics.agreement,
    structural: metrics.structural.similarityPct,
    top: metrics.topBand.similarityPct,
    bottom: metrics.bottomBand.similarityPct,
    scenic: metrics.scenicCore.similarityPct,
    edgeF1: metrics.scenicEdgeF1.f1,
    ssim: metrics.scenicSsim,
    weakestRegion: weakest?.label ?? "No detailed artwork measured",
  };
}
