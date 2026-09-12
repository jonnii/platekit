import { referencePath } from "../paths.ts";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PLATE_METADATA, ARTWORK_STATES } from "../metadata.ts";
import type { PlateState } from "../../../src/registry.ts";
import { comparisonReportSchema, rankComparisons, type ComparisonReport, type ComparisonRow } from "./data.ts";
import { PLATE_REFERENCES, SPEC_SCORED_STATES } from "../references.ts";
import { originalReference } from "../reference-assets.ts";

export const comparisonDirectory = path.join(process.cwd(), ".plate-comparisons");
export const comparisonReportPath = path.join(comparisonDirectory, "latest.json");

/** Every state the dashboard scores: bespoke components plus the spec-driven ones. */
export const SCORED_STATES: string[] = [...ARTWORK_STATES, ...SPEC_SCORED_STATES];

/** The display name for a scored state. */
export function scoredStateName(state: string): string {
  return PLATE_METADATA[state as PlateState]?.name ?? state;
}

export async function comparisonFingerprint(state: string): Promise<string> {
  const custom = PLATE_METADATA[state as PlateState];
  const files = [
    `src/plates/${custom.file}`,
    ...(state === "ME" ? ["src/internal/MaineIllustration.tsx"] : []),
    "src/types.ts",
    "tools/artwork/metadata.ts",
    "tools/artwork/config.ts",
    "tools/artwork/profiles/index.tsx",
    "src/internal/BaselinePlate.tsx",
    "src/internal/PlateFrame.tsx",
    "src/internal/PlateSvg.tsx",
    "tools/artwork/optional-features.ts",
    "tools/artwork/profiles/initial-states.ts",
    "tools/artwork/comparison/compare.tsx",
    "tools/artwork/comparison/raster.ts",
    "tools/artwork/comparison/masks.ts",
    "tools/artwork/comparison/agreement.ts",
    "tools/artwork/comparison/batch.ts",
    "tools/artwork/cli/prepare-reference.ts",
    "tools/artwork/comparison/data.ts",
    "tools/artwork/comparison/store.ts",
    "tools/artwork/reference-assets.ts",
    "references/original-references.json",
  ];
  const contents = await Promise.all(files.map((file) => readFile(path.join(process.cwd(), file))));
  const hash = createHash("sha256");
  for (const content of contents) hash.update(content);
  const reference = PLATE_REFERENCES.find((ref) => ref.state === state);
  const original = reference && originalReference(reference);
  if (original) hash.update(await readFile(referencePath(original.src)));
  hash.update(JSON.stringify(PLATE_REFERENCES.find((ref) => ref.state === state)) ?? "missing-reference");
  return hash.digest("hex");
}

export async function loadComparisons(): Promise<{ generatedAt?: string; rows: ComparisonRow[] }> {
  let report: ComparisonReport | undefined;
  try {
    report = comparisonReportSchema.parse(JSON.parse(await readFile(comparisonReportPath, "utf8")));
  } catch {
    // Missing or incompatible cache: show the empty state, never fabricated scores.
  }
  const rows = await Promise.all(SCORED_STATES.map(async (state): Promise<ComparisonRow> => {
    if (!PLATE_REFERENCES.some((ref) => ref.state === state)) return { state, status: "missing-reference" };
    const entry = report?.entries.find((entry) => entry.state === state);
    if (!entry) return { state, status: "not-run" };
    if (entry.status === "ready" && entry.fingerprint !== await comparisonFingerprint(state)) {
      return { ...entry, status: "stale" };
    }
    return entry;
  }));
  return { generatedAt: report?.generatedAt, rows: rankComparisons(rows) };
}
