import { expect, it } from "bun:test";
import { releaseSettings } from "../../tools/prepare-release";

it("uses the GitHub release version for stable npm releases", () => {
  expect(releaseSettings("v0.1.1", false)).toEqual({ version: "0.1.1", distTag: "latest" });
});

it("publishes GitHub prereleases to next instead of latest", () => {
  expect(releaseSettings("v0.2.0-beta.1", true)).toEqual({ version: "0.2.0-beta.1", distTag: "next" });
  expect(releaseSettings("v1.0.0-0", true)).toEqual({ version: "1.0.0-0", distTag: "next" });
});

it("rejects mismatched release channels", () => {
  expect(() => releaseSettings("v0.2.0-beta.1", false)).toThrow("must be marked");
  expect(() => releaseSettings("v0.2.0", true)).toThrow("must be marked");
});

it("rejects malformed and ambiguous release tags", () => {
  for (const tag of ["main", "0.1.0", "v01.0.0", "v1.00.0", "v1.0.01", "v1.0.0-01", "v1.0.0-beta..1", "v1.0.0+build", "v1.0.0\ndist-tag=latest"]) {
    expect(() => releaseSettings(tag, tag.includes("-"))).toThrow();
  }
});
