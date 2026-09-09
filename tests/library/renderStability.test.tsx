import { PLATE_METADATA } from "../../tools/artwork/metadata";
import { afterEach, expect, it } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";
import { PLATES, PLATE_STATES } from "../../src/registry.js";

// sin/cos/tan are implementation-defined: Node and the browser disagree in the last ULP,
// so any coordinate emitted at full precision hydrates as a mismatch. Nudging them by a
// few ULP here stands in for that disagreement — rounded output shrugs it off.
const { sin, cos, tan } = Math;
const nudge = (fn: (x: number) => number) => (x: number) => fn(x) * (1 + 4 * Number.EPSILON);
afterEach(() => Object.assign(Math, { sin, cos, tan }));

it("renders identically when sin/cos/tan drift by a few ULP", () => {
  for (const state of PLATE_STATES) {
    const { component: Plate } = PLATES[state];
    const { sample } = PLATE_METADATA[state];
    const plate = <Plate plate={sample} state={state} />;
    const expected = renderToString(plate);
    Object.assign(Math, { sin: nudge(sin), cos: nudge(cos), tan: nudge(tan) });
    const drifted = renderToString(plate);
    Object.assign(Math, { sin, cos, tan });
    expect(`${state} ${drifted === expected ? "stable" : "drifted"}`).toBe(`${state} stable`);
  }
});
