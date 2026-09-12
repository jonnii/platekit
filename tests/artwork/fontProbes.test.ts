import { expect, it } from "bun:test";
import { candidateStylesheet, FONT_PROBES, REGISTRATION_PROBES } from "../../tools/artwork/font-probes";
import { ARTWORK_STATES } from "../../tools/artwork/metadata";
import { originalReference } from "../../tools/artwork/reference-assets";
import { PLATE_REFERENCES } from "../../tools/artwork/references";
import { FONT_PROBE_SELECTIONS } from "../../tools/artwork/font-selections";

it("provides a registration probe backed by an unchanged original for every jurisdiction", () => {
  expect(REGISTRATION_PROBES.map((probe) => probe.state).sort()).toEqual([...ARTWORK_STATES].sort());
  for (const probe of FONT_PROBES) {
    const reference = PLATE_REFERENCES.find((entry) => entry.state === probe.state)!;
    expect(originalReference(reference)?.src).toContain("/originals/");
  }
});

it("combines weights and styles per remote family without requesting bundled fonts", () => {
  const url = new URL(candidateStylesheet([
    { id: "regular", family: "PT Serif", weight: 400, remote: true },
    { id: "italic", family: "PT Serif", weight: 700, style: "italic", remote: true },
    { id: "duplicate", family: "PT Serif", weight: 400, remote: true },
    { id: "local", family: "Yellowtail", weight: 400 },
  ])!);
  expect(url.searchParams.getAll("family")).toEqual(["PT Serif:ital,wght@0,400;1,700"]);
  expect(candidateStylesheet([{ id: "local", family: "Yellowtail", weight: 400 }])).toBeUndefined();
});

it("keeps every measured selection attached to a live probe candidate", () => {
  for (const [id, selection] of Object.entries(FONT_PROBE_SELECTIONS)) {
    const probe = FONT_PROBES.find((entry) => entry.id === id);
    expect(probe).toBeDefined();
    expect(probe!.candidates.some((candidate) => candidate.id === selection.candidate)).toBe(true);
    expect(selection.selectedScore).toBeGreaterThan(selection.currentScore + 2);
  }
});
