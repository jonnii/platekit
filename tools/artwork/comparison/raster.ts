import sharp from "sharp";

/** Match the reference's white backing before alignment sees transparent RGB. */
export async function rasterizePlate(svg: string, width: number, height: number) {
  return sharp(Buffer.from(svg), { density: 200 })
    .resize(width, height, { fit: "fill" })
    .flatten({ background: "#fff" })
    .png()
    .toBuffer();
}
