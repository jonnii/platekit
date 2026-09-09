import { describe, expect, it } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";
import { BASELINE_PLATE_STATES } from "../../tools/artwork/profiles/initial-states.js";
import { PLATES } from "../../src/registry.js";
import { PLATE_REFERENCES } from "../../tools/artwork/references";
import LicensePlate from "../../src/LicensePlate.js";

describe("LicensePlate component", () => {
  it("renders plate and state into markup", () => {
    const html = renderToString(
      <LicensePlate plate="ABC123" state="CA" />
    );

    expect(html).toContain("ABC123");
    expect(html).toContain("CA");
    expect(html).toContain("aria-label=\"License plate ABC123 from CA\"");
  });

  it("renders Florida variant with split and wordmark", () => {
    const html = renderToString(
      <LicensePlate plate="ABC123" state="FL" />
    );
    expect(html).toContain("Florida");
    expect(html.toLowerCase()).toContain("sunshine state");
    // Split into letters and digits should appear
    expect(html).toContain("ABC");
    expect(html).toContain("123");
  });

  it("renders Texas classic variant with TEXAS wordmark and motto", () => {
    const html = renderToString(
      <LicensePlate plate="CL4SS1C" state="TX" />
    );
    expect(html).toContain("TEXAS");
    expect(html.toLowerCase()).toContain("the lone star state");
    expect(html).toContain("CL4SS1C");
  });

  it.each([
    ...BASELINE_PLATE_STATES.map((code) => [code, PLATES[code].name]),
    ["NV", "Nevada"],
    ["MT", "Montana"],
    ["MI", "Michigan"],
    ["LA", "Louisiana"],
    ["PA", "Pennsylvania"],
    ["TX", "Texas"],
    ["MO", "Missouri"],
    ["CA", "California"],
    ["FL", "Florida"],
    ["GA", "Georgia"],
    ["MD", "Maryland"],
    ["OH", "Ohio"],
    ["IL", "Illinois"],
    ["NJ", "New Jersey"],
  ])("keeps %s SVG resources unique when multiple plates share a page", (state, name) => {
    const html = renderToString(
      <>
        <LicensePlate plate="abc–1234" state={state} />
        <LicensePlate plate={`${state}*99X`} state={name} />
      </>
    );
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    const references = [
      ...[...html.matchAll(/url\(#([^)]+)\)/g)].map((match) => match[1]),
      ...[...html.matchAll(/\bhref="#([^"]+)"/g)].map((match) => match[1]),
    ];
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
    for (const reference of references) expect(ids).toContain(reference);
    const visibleText = [...html.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)]
      .map((match) => match[1].replace(/<[^>]*>/g, "")).join("");
    expect(visibleText).toContain("ABC1234");
    expect(visibleText).toContain(`${state}*99X`);
  });
  it.each(["AK", "AR", "DC", "MN", "MS", "NM", "OK", "OR", "TN"])("keeps long %s registrations split around fixed artwork", (state) => {
    const html = renderToString(<LicensePlate plate="custom–12345" state={state} />);
    const registration = html.match(/<g[^>]*font-family="var\(--font-plate-ny, sans-serif\)"[^>]*>([\s\S]*?)<\/g>/)![1];
    const parts = [...registration.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)].map((match) => match[1]);
    expect(parts).toEqual(["CUSTOM", "12345"]);
  });

  it.each([["TN", 368.5, 503.5], ["MN", 398.5, 533.5], ["AK", 370, 550], ["OR", 375, 625]] as const)("reserves the %s symbol for every supported sample", (state, leftEdge, rightEdge) => {
    for (const plate of ["ABC123", `${state}*99X`, "CUSTOM12345"]) {
      const html = renderToString(<LicensePlate plate={plate} state={state} />);
      const registration = html.match(/<g[^>]*font-family="var\(--font-plate-ny, sans-serif\)"[^>]*>([\s\S]*?)<\/g>/)![1];
      const parts = [...registration.matchAll(/<text\b([^>]*)>/g)].map((match) => ({
        x: Number(match[1].match(/\bx="([^"]+)"/)![1]),
        width: Number(match[1].match(/\btextLength="([^"]+)"/)![1]),
      }));
      expect(parts).toHaveLength(2);
      expect(parts[0].x + parts[0].width / 2).toBeLessThan(leftEdge);
      expect(parts[1].x - parts[1].width / 2).toBeGreaterThan(rightEdge);
    }
  });

  it("provides nationwide custom dispatch and references", () => {
    expect(Object.keys(PLATES)).toHaveLength(51);
    expect(new Set(PLATE_REFERENCES.map((ref) => ref.state)).size).toBe(51);
    for (const code of BASELINE_PLATE_STATES) {
      const ref = PLATE_REFERENCES.find((entry) => entry.state === code);
      expect(ref).toBeDefined();
      expect(ref!.samples.some((sample) => sample.includes("*"))).toBe(true);
      expect(ref!.samples.some((sample) => sample.length > 8)).toBe(true);
      const html = renderToString(<LicensePlate plate="custom–12345" state={code.toLowerCase()} />);
      const lettering = [...html.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)].map((match) => match[1]).join("");
      expect(lettering).toContain("CUSTOM12345");
      expect(html).not.toContain("<image");
    }
  });

  it("falls back to a generic plate for an unrecognised jurisdiction", () => {
    const html = renderToString(<LicensePlate plate="ABC123" state="Guam" />);

    expect(html).toContain("ABC123");
    expect(html).toContain("GUAM");
    expect(html).toContain('aria-label="License plate ABC123 from Guam"');
  });

});
