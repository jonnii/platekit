import { expect, it } from "bun:test";
import sharp from "sharp";
import { compositeReferenceCleanup } from "../../tools/artwork/reference-cleanup";

it("uses generated pixels only inside the selected cleanup region", async () => {
  const source = await sharp({ create: { width: 1000, height: 500, channels: 3, background: "blue" } }).png().toBuffer();
  const generated = await sharp({ create: { width: 500, height: 250, channels: 3, background: "blue" } })
    .composite([{ input: await sharp({ create: { width: 30, height: 30, channels: 3, background: "red" } }).png().toBuffer(), left: 60, top: 60 }]).png().toBuffer();
  const result = await compositeReferenceCleanup(source, generated, [{ x: 100, y: 100, width: 100, height: 100 }]);
  const { data, info } = await sharp(result).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  expect([info.width, info.height]).toEqual([1000, 500]);
  const pixel = (x: number, y: number) => [...data.subarray((y * info.width + x) * 3, (y * info.width + x) * 3 + 3)];
  expect(pixel(150, 150)).toEqual([255, 0, 0]);
  expect(pixel(50, 150)).toEqual([0, 0, 255]);
  expect(pixel(250, 150)).toEqual([0, 0, 255]);
  expect(pixel(500, 250)).toEqual([0, 0, 255]);
});

it("does not reintroduce a repaired hole where cleanup regions overlap", async () => {
  const blue = await sharp({ create: { width: 1000, height: 500, channels: 3, background: "blue" } }).png().toBuffer();
  const source = await sharp(blue).composite([{ input: await sharp({ create: { width: 20, height: 20, channels: 3, background: "white" } }).png().toBuffer(), left: 170, top: 170 }]).png().toBuffer();
  const result = await compositeReferenceCleanup(source, blue, [
    { x: 150, y: 150, width: 60, height: 60 },
    { x: 170, y: 120, width: 100, height: 150 },
  ]);
  expect(await sharp(result).removeAlpha().raw().toBuffer()).toEqual(await sharp(blue).removeAlpha().raw().toBuffer());
});
