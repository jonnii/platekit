import { expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import LicensePlate from "../../src/LicensePlate";
import { PLATES, PLATE_STATES } from "../../src/registry";

function artwork(html: string) {
  let svg = html.match(/<svg\b[\s\S]*?<\/svg>/)![0];
  const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  // Compare resource relationships, independent of React's per-render IDs.
  for (const [index, id] of ids.entries()) svg = svg.replaceAll(id, `resource-${index}`);
  return svg;
}

it.each([...PLATE_STATES, "UNKNOWN"])("adds optional hardware to %s without changing its artwork SVG", (state) => {
  const plain = renderToStaticMarkup(<LicensePlate state={state} plate="AB***34" />);
  expect(plain.match(/<svg\b/g)).toHaveLength(1);
  expect(plain).not.toContain("data-plate-mounting-holes");
  for (const mountingHoles of [true, "slots", "round"] as const) {
    const withHoles = renderToStaticMarkup(<LicensePlate state={state} plate="AB***34" mountingHoles={mountingHoles} />);
    expect(withHoles.match(/<svg\b/g)).toHaveLength(2);
    expect(artwork(withHoles)).toBe(artwork(plain));
    expect(withHoles).toContain(`data-plate-mounting-holes="${mountingHoles === "round" ? "round" : "slots"}"`);
    expect(withHoles).toContain('aria-hidden="true"');
    expect(withHoles).toContain('pointer-events:none');
    expect(withHoles).not.toContain('mountingHoles=');
  }
});

it("supports optional features on direct imports and does not forward them to the DOM", () => {
  for (const state of PLATE_STATES) {
    const Component = PLATES[state].component;
    const html = renderToStaticMarkup(<Component plate="ABC123" mountingHoles registrationStickerAreas data-testid="plate" />);
    expect(html).toContain('data-plate-mounting-holes="slots"');
    expect(html).toContain('data-testid="plate"');
    expect(html).not.toMatch(/(?:mountingHoles|registrationStickerAreas)=/);
  }
});

it.each(["FL", "GA", "MA", "KS", "ND", "NV", "MT", "LA", "RI", "SC", "OK", "IN", "AR", "KY", "TN"])("makes %s registration sticker areas independently optional", (state) => {
  const plain = renderToStaticMarkup(<LicensePlate state={state} plate="ABC123" />);
  const enabled = renderToStaticMarkup(<LicensePlate state={state} plate="ABC123" registrationStickerAreas />);
  expect(plain).not.toContain("data-plate-registration-sticker-area");
  expect(enabled).toContain("data-plate-registration-sticker-area");
  expect(enabled).not.toContain("data-plate-mounting-holes");
  expect(artwork(enabled)).not.toBe(artwork(plain));
});

it("does not invent sticker areas on designs without them", () => {
  expect(artwork(renderToStaticMarkup(<LicensePlate state="CA" plate="ABC123" registrationStickerAreas />)))
    .toBe(artwork(renderToStaticMarkup(<LicensePlate state="CA" plate="ABC123" />)));
});
