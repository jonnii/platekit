import { describe, expect, it } from "bun:test";
import sharp from "sharp";
import { compactIntegerPath, compactPathSyntax } from "../../tools/artwork/path-compaction.ts";

describe("lossless path compaction", () => {
  it("preserves numeric precision and command order when removing separators", () => {
    const source = "M10.000 2.500 C3.1250, -4.2500, 5.0, 6.0, 7.0, 8.0 Z";
    expect(compactPathSyntax(source)).toBe("M10 2.5C3.125-4.25 5 6 7 8Z");
    expect(compactPathSyntax("M9007199254740993.0 0.12345678901234567890"))
      .toBe("M9007199254740993 0.1234567890123456789");
    expect(compactPathSyntax("M1e-5 +2.00L-3.0 4E+2")).toBe("M1e-5+2L-3 4E+2");
  });

  it("tracks subpath origins through closepath and preserves curve control points", () => {
    const path = "M100 100L120 100L120 140L100 140ZM105 110Q110 105 115 110C116 120 114 130 105 130Z";
    const compact = compactIntegerPath(path);
    expect(compact.length).toBeLessThan(path.length);
    expect(compact).toContain("Zm5 10");
    expect(compact).toContain("q5-5 10 0");
    expect(compact).toContain("c1 10-1 20-10 20");
    expect(compactIntegerPath(compact)).toBe(compact);
  });

  it.each([
    "M1.5 2L3 4", "M1 2H3", "M1 2S3 4 5 6", "M1 2L3", "M1 2LZ",
    "L1 2", "M9007199254740993 2L3 4", "M9007199254740991 0L-9007199254740991 0",
    "M1 2 rubbish", "",
  ])("leaves unsupported or unsafe integer paths unchanged: %s", path => {
    expect(compactIntegerPath(path)).toBe(path);
  });

  it("does not drop unfamiliar syntax", () => {
    expect(compactPathSyntax("M1 2 rubbish")).toBe("M1 2 rubbish");
  });

  it("preserves filled and stroked raster pixels with implicit commands and multiple subpaths", async () => {
    const paths = [
      "M5 5L50 5L50 50L5 50ZM15 15L15 40L40 40L40 15Z",
      "M5 30Q10 5 25 15Q40 25 55 5C60 10 60 40 40 55L5 55Z",
      "M10 10L10 10L40 10L40 10L40 45ZM20 20L30 30M25 15L25 40",
    ];
    for (const d of paths) for (const width of [64, 340]) {
      const render = (path: string) => sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${width}" height="${width}"><path d="${path}" fill="#abc" fill-rule="evenodd" stroke="#123" stroke-width="1.25" stroke-linecap="round"/></svg>`)).raw().toBuffer();
      expect(await render(compactIntegerPath(d))).toEqual(await render(d));
    }
  });
});
