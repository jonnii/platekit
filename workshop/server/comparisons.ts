import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { loadComparisons } from "../../tools/artwork/comparison/store.ts";

const run = promisify(execFile);
let refresh: Promise<void> | undefined;
let result = { running: false, message: "", error: false };

export function refreshStatus() { return result; }

export function refreshComparisons() {
  if (refresh) return result;
  result = { running: true, message: "Measuring changed plates…", error: false };
  refresh = run(process.execPath, ["run", "tools/artwork/cli/compare-all.ts"], {
    cwd: process.cwd(), timeout: 300_000, maxBuffer: 2 * 1024 * 1024,
  }).then(async () => {
    const { rows } = await loadComparisons();
    const completed = rows.filter((row) => row.status === "ready").length;
    const failed = rows.filter((row) => row.status === "error").length;
    result = { running: false, message: `${completed} comparisons ready; ${failed} failed.`, error: failed > 0 };
  }).catch((error: Error) => {
    result = { running: false, message: `Comparison refresh failed: ${error.message.slice(0, 1000)}`, error: true };
  }).finally(() => { refresh = undefined; });
  return result;
}
