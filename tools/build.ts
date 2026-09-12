import { copyFile, cp, rm } from "node:fs/promises";

// A clean output directory keeps moved internal modules out of public plate subpaths.
await rm(new URL("../dist", import.meta.url), { recursive: true, force: true });
const build = Bun.spawn(["tsc", "-p", "tsconfig.json"], { stdout: "inherit", stderr: "inherit" });
process.exitCode = await build.exited;
if (process.exitCode === 0) {
  await copyFile(new URL("../src/fonts.css", import.meta.url), new URL("../dist/fonts.css", import.meta.url));
  await cp(new URL("../src/fonts", import.meta.url), new URL("../dist/fonts", import.meta.url), { recursive: true });
}
