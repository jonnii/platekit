import { describe, expect, it } from "bun:test";
import { renderToString } from "react-dom/server";
import BaselinePlate from "../../src/internal/BaselinePlate.js";
import LicensePlate from "../../src/LicensePlate.js";
import * as WORDMARKS from "../../src/internal/wordmarks.js";
import { registrationRuns } from "./registration.js";

describe("refined plate lettering", () => {
  it("allows spaced mottos without changing the existing automatic width", () => {
    const props = { plate: "ABC123", state: "TN", name: "Tennessee", colors: ["#fff"], heading: "TENNESSEE", footer: "MOTTO", footerSize: 20 };
    const automatic = renderToString(<BaselinePlate {...props} />);
    const spaced = renderToString(<BaselinePlate {...props} footerTextLength={300} />);
    expect(automatic).toMatch(/textLength="64"[^>]*>MOTTO</);
    expect(spaced).toMatch(/textLength="300"[^>]*>MOTTO</);
  });

  it.each(["ABC123", "MS*99X", "custom–12345"])("keeps %s clear of Mississippi's magnolia", (plate) => {
    const html = renderToString(<LicensePlate plate={plate} state="MS" />);
    const groups = registrationRuns(html);
    expect(groups).toHaveLength(2);
    expect(groups[0]!.left).toBeGreaterThanOrEqual(40);
    expect(groups[1]!.right).toBeLessThanOrEqual(960);
    expect(groups[0]!.right).toBeLessThan(394);
    expect(groups[1]!.left).toBeGreaterThan(608);
  });

  it("keeps Tennessee's longest groups inside its inset rim", () => {
    const html = renderToString(<LicensePlate plate="CUSTOM12345" state="TN" />);
    for (const { left, right } of registrationRuns(html)) {
      expect(left).toBeGreaterThanOrEqual(48);
      expect(right).toBeLessThanOrEqual(952);
    }
  });

  it("bounds Nevada's custom serials and preserves anonymization", () => {
    for (const [plate, cleaned] of [["custom–123456789", "CUSTOM123456789"], ["NV*–99X7", "NV*99X7"]]) {
      const html = renderToString(<LicensePlate plate={plate} state="NV" />);
      const serial = registrationRuns(html).find((run) => run.text === cleaned)!;
      expect(serial).toBeDefined();
      expect(serial.right - serial.left).toBeLessThanOrEqual(880);
      expect((serial.left + serial.right) / 2).toBeCloseTo(500, 0);
    }
  });
});

describe("adopted wordmarks", () => {
  it.each(Object.entries(WORDMARKS))("draws %s as an outline, not live text", (key, run) => {
    const html = renderToString(<LicensePlate plate="ABC123" state={key.slice(0, 2)} />);
    expect(html).toContain(`data-lettering="${run.text}"`);
    expect([...html.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)].map((match) => match[1])).not.toContain(run.text);
  });
});
