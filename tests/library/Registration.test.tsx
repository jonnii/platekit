import { expect, it } from "bun:test";
import LicensePlate from "../../src/LicensePlate.js";
import { PLATE_STATES } from "../../src/registry.js";
import { FONT_PROBE_SELECTIONS } from "../../tools/artwork/font-selections.js";
import { renderToStaticMarkup } from "react-dom/server";
import Registration, { cleanRegistration } from "../../src/internal/Registration.js";
import { registrationRuns } from "./registration.js";
import { BARLOW_CONDENSED_500 as face } from "../../src/internal/registrationGlyphs.js";

const run = (text: string, width?: number) =>
  registrationRuns(renderToStaticMarkup(<svg><Registration face={face} text={text} x={500} y={300} fontSize={300} textAnchor="middle" width={width} /></svg>))[0]!;

it("narrows registrations to their width but never stretches them", () => {
  const natural = run("ABC1234");
  expect(natural.right - natural.left).toBeGreaterThan(800);
  expect(run("ABC1234", 600)).toEqual({ text: "ABC1234", left: 200, right: 800 });
  expect(run("A", 600)).toEqual(run("A"));
  expect(run("A").right - run("A").left).toBeLessThan(200);
});

it("draws one outline per character, falling back for unknown glyphs", () => {
  const html = renderToStaticMarkup(<svg><Registration face={face} text="É✓1" x={0} y={0} fontSize={100} /></svg>);
  expect(html.match(/<path /g)).toHaveLength(3);
  expect(cleanRegistration(" ab–12-3 ")).toBe("AB123");
});

it.each(PLATE_STATES)("draws %s registrations in its measured face", (state) => {
  const expected = FONT_PROBE_SELECTIONS[`${state.toLowerCase()}-registration`]?.candidate ?? "bebas-neue-400";
  const html = renderToStaticMarkup(<LicensePlate state={state} plate="ABC1234" />);
  const faces = [...html.matchAll(/data-registration="[^"]*" data-face="([^"]+)"/g)].map((match) => match[1]);
  expect(faces.length).toBeGreaterThan(0);
  expect(new Set(faces)).toEqual(new Set([expected]));
});
