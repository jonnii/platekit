import { referencePath as referenceAssetPath } from "../paths.ts";
/** Refresh the development dashboard's scores; keep failures visible and unranked. */
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, rename, writeFile, access } from "node:fs/promises";
import { cpus } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { PLATE_REFERENCES } from "../references.ts";
import { originalReference } from "../reference-assets.ts";
import { SCORED_STATES, comparisonDirectory, comparisonFingerprint, comparisonReportPath } from "./store.ts";
import { comparisonReportSchema, scoresFromReport, type ComparisonEntry, type ComparisonReport } from "./data.ts";

const run = promisify(execFile);

async function compareState(state: string, previous?: ComparisonEntry): Promise<ComparisonEntry> {
  const reference = PLATE_REFERENCES.find((ref) => ref.state === state);
  if (!reference) {
    console.log(`${state}: reference needed`);
    return { state, status: "missing-reference", message: "Add a reference and comparison profile." };
  }
  const fingerprint = await comparisonFingerprint(state);
  // The fingerprint covers the plate, the scoring scripts and the reference, so a match means nothing to redo.
  if (previous?.status === "ready" && previous.fingerprint === fingerprint) {
    console.log(`${state}: unchanged`);
    return previous;
  }
  const original = originalReference(reference);
  if (original) {
    const pixels = await readFile(referenceAssetPath(original.src));
    if (createHash("sha256").update(pixels).digest("hex") !== original.sha256) {
      throw new Error(`${state}: preserved reference checksum changed; update its provenance before scoring.`);
    }
  }
  const referenceKey = createHash("sha256").update(JSON.stringify({ reference, original: original?.sha256 })).digest("hex").slice(0, 16);
  const referencePath = path.join(comparisonDirectory, `${state}-${referenceKey}.jpg`);
  const slug = `${state.toLowerCase()}-plate`;
  const options = { cwd: process.cwd(), timeout: 120_000, maxBuffer: 2 * 1024 * 1024 };
  try {
    await access(referencePath);
  } catch {
    await run(process.execPath, ["run", "tools/artwork/cli/prepare-reference.ts", `--state=${state}`], options);
    await copyFile(`/tmp/${slug}-reference.jpg`, referencePath);
  }
  await run(process.execPath, ["run", "tools/artwork/cli/compare.ts", `--state=${state}`, `--reference=${referencePath}`], options);
  const report = JSON.parse(await readFile(`/tmp/${slug}-report.json`, "utf8"));
  const scores = scoresFromReport(report, state);
  console.log(`${state}: ${scores.agreement.pixelAgreement?.toFixed(1) ?? "unranked"}% feature pixel agreement; ${scores.weakestRegion}`);
  return { state, status: "ready", fingerprint, scores };
}

/** Bound CPU/memory use while keeping results in registry order, regardless of completion order. */
export async function compareStates(
  states: readonly string[],
  compare: (state: string) => Promise<ComparisonEntry> = compareState,
  limit = Math.max(2, cpus().length - 2),
): Promise<ComparisonEntry[]> {
  const entries: ComparisonEntry[] = new Array(states.length);
  let next = 0;
  const worker = async () => {
    while (next < states.length) {
      const index = next++;
      const state = states[index];
      try {
        entries[index] = await compare(state);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        entries[index] = { state, status: "error", message: message.slice(0, 1200) };
        console.error(`${state}: ${message}`);
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, states.length) }, worker));
  return entries;
}

async function loadPrevious(): Promise<Map<string, ComparisonEntry>> {
  try {
    const report = comparisonReportSchema.parse(JSON.parse(await readFile(comparisonReportPath, "utf8")));
    return new Map(report.entries.map((entry) => [entry.state, entry]));
  } catch {
    return new Map();
  }
}

let writes = Promise.resolve();
/** Publish what is finished so far, so the dashboard can show results as they land. */
function save(entries: ComparisonEntry[]): Promise<void> {
  const report: ComparisonReport = { version: 2, generatedAt: new Date().toISOString(), entries };
  writes = writes.then(async () => {
    const temporary = `${comparisonReportPath}.${process.pid}.tmp`;
    await writeFile(temporary, `${JSON.stringify(report, null, 2)}\n`);
    await rename(temporary, comparisonReportPath);
  });
  return writes;
}

export async function main() {
  await mkdir(comparisonDirectory, { recursive: true });
  const previous = await loadPrevious();
  const done = new Map<string, ComparisonEntry>();
  const entries = await compareStates(SCORED_STATES, async (state) => {
    const entry = await compareState(state, previous.get(state));
    done.set(state, entry);
    await save(SCORED_STATES.flatMap((s) => done.get(s) ?? previous.get(s) ?? []));
    return entry;
  });
  await save(entries);
  console.log(`Updated ${comparisonReportPath}`);
}
