import { describe, expect, it } from "bun:test";
import { renderToString } from "react-dom/server";
import BaselinePlate from "../../src/internal/BaselinePlate.js";
import LicensePlate from "../../src/LicensePlate.js";

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
    const registration = html.match(/<g[^>]*font-family="var\(--font-plate-ny, sans-serif\)"[^>]*>([\s\S]*?)<\/g>/)![1];
    const groups = [...registration.matchAll(/<text\b([^>]*)>/g)].map((match) => ({
      x: Number(match[1].match(/\bx="([^"]+)"/)![1]),
      width: Number(match[1].match(/\btextLength="([^"]+)"/)![1]),
    }));
    expect(groups).toHaveLength(2);
    expect(groups[0].x - groups[0].width / 2).toBeGreaterThanOrEqual(40);
    expect(groups[1].x + groups[1].width / 2).toBeLessThanOrEqual(960);
    expect(groups[0].x + groups[0].width / 2).toBeLessThan(394);
    expect(groups[1].x - groups[1].width / 2).toBeGreaterThan(608);
  });

  it("keeps Tennessee's longest groups inside its inset rim", () => {
    const html = renderToString(<LicensePlate plate="CUSTOM12345" state="TN" />);
    const registration = html.match(/<g[^>]*font-family="var\(--font-plate-ny, sans-serif\)"[^>]*>([\s\S]*?)<\/g>/)![1];
    for (const [, attributes] of registration.matchAll(/<text\b([^>]*)>/g)) {
      const x = Number(attributes.match(/\bx="([^"]+)"/)![1]);
      const width = Number(attributes.match(/\btextLength="([^"]+)"/)![1]);
      expect(x - width / 2).toBeGreaterThanOrEqual(48);
      expect(x + width / 2).toBeLessThanOrEqual(952);
    }
  });

  it("bounds Nevada's custom serials and preserves anonymization", () => {
    for (const [plate, cleaned] of [["custom–123456789", "CUSTOM123456789"], ["NV*–99X7", "NV*99X7"]]) {
      const html = renderToString(<LicensePlate plate={plate} state="NV" />);
      const serial = [...html.matchAll(/<text\b([^>]*)>([^<]*)<\/text>/g)].find((match) => match[2] === cleaned)!;
      expect(serial).toBeDefined();
      expect(Number(serial[1].match(/textLength="([^"]+)"/)![1])).toBeLessThanOrEqual(880);
      expect(serial[1]).toContain('text-anchor="middle"');
    }
  });
});
