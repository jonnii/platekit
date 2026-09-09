import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";

const run = promisify(execFile);
const { stdout } = await run("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], { maxBuffer: 1024 * 1024 });
const [pack] = JSON.parse(stdout) as { name: string; version: string; size: number; files: { path: string }[] }[];
const files = new Set(pack.files.map((file) => file.path));
const metadata = new Set(["package.json", "README.md", "LICENSE"]);
for (const file of files) {
  assert(metadata.has(file) || /^dist\/.+\.(?:js|d\.ts)$/.test(file), `Unexpected published file: ${file}`);
}
for (const file of [...metadata, "dist/index.js", "dist/index.d.ts", "dist/types.d.ts"]) {
  assert(files.has(file), `Missing published file: ${file}`);
}
const plates = [...files].filter((file) => /^dist\/plates\/[A-Za-z]+Plate\.js$/.test(file));
assert.equal(plates.length, 51, "Every state must have a public component");
for (const file of plates) assert(files.has(file.replace(/\.js$/, ".d.ts")), `Missing declaration for ${file}`);
for (const file of files) {
  if (file.startsWith("dist/plates/")) assert(/\/[A-Za-z]+Plate\.(?:js|d\.ts)$/.test(file), `Internal module in public plate exports: ${file}`);
}
assert(!files.has("dist/plates/BaselinePlate.js"), "BaselinePlate must stay internal");
assert((await readFile("dist/index.js", "utf8")).startsWith('"use client";'), "Preserve the React client boundary");
console.log(`${pack.name}@${pack.version}: ${files.size} package files, ${plates.length} state components, ${(pack.size / 1024).toFixed(1)} KiB packed. No development assets included.`);
