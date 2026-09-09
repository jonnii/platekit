import { expect, it } from "bun:test";
import sharp from "sharp";
import { rasterizePlate } from "../../tools/artwork/comparison/raster";

it("backs transparent plate corners with white while preserving printed artwork", async () => {
  const png = await rasterizePlate('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50"><rect x="10" y="10" width="80" height="30" fill="#123456"/><rect x="40" y="20" width="20" height="10" fill="#fff" fill-opacity=".5"/></svg>', 100, 50);
  const raw = await sharp(png).ensureAlpha().raw().toBuffer();
  const pixel = (x: number, y: number) => [...raw.subarray((y * 100 + x) * 4, (y * 100 + x) * 4 + 4)];
  expect(pixel(0, 0)).toEqual([255, 255, 255, 255]);
  expect(pixel(99, 49)).toEqual([255, 255, 255, 255]);
  expect(pixel(20, 20)).toEqual([18, 52, 86, 255]);
  const blend = pixel(50, 25);
  expect(blend[0]).toBeGreaterThan(130);
  expect(blend[0]).toBeLessThan(140);
  expect(blend[3]).toBe(255);
});
