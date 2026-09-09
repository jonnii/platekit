import { appendFile, readFile, writeFile } from "node:fs/promises";

/** Release tags define the published version; GitHub prereleases use npm's next tag. */
export function releaseSettings(tag: string, prerelease: boolean) {
  const match = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/.exec(tag);
  if (!match || match[4]?.split(".").some((part) => /^0\d+$/.test(part))) {
    throw new Error("Use a version tag such as v0.1.0 or v0.2.0-beta.1, without build metadata.");
  }
  if (Boolean(match[4]) !== prerelease) {
    throw new Error("Prerelease version tags must be marked as a prerelease in GitHub; stable tags must not be.");
  }
  return { version: tag.slice(1), distTag: prerelease ? "next" : "latest" };
}

if (import.meta.main) {
  const { RELEASE_TAG, RELEASE_PRERELEASE, GITHUB_OUTPUT } = process.env;
  if (!RELEASE_TAG || !["true", "false"].includes(RELEASE_PRERELEASE ?? "") || !GITHUB_OUTPUT) {
    throw new Error("Run this script from the GitHub release workflow.");
  }
  const { version, distTag } = releaseSettings(RELEASE_TAG, RELEASE_PRERELEASE === "true");
  const pkg = JSON.parse(await readFile("package.json", "utf8"));
  pkg.version = version;
  await writeFile("package.json", `${JSON.stringify(pkg, null, 2)}\n`);
  await appendFile(GITHUB_OUTPUT, `version=${version}\ndist-tag=${distTag}\n`);
  console.log(`Publishing ${pkg.name}@${version} with npm tag ${distTag}`);
}
