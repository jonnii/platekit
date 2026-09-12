import { expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import PlateSvg from "../../src/internal/PlateSvg.js";
import { PLATES, PLATE_STATES } from "../../src/registry.js";

it("clips every state's artwork to the common silhouette", async () => {
  const alpha = async (markup: string) => {
    const svg = markup.slice(markup.indexOf("<svg"), markup.lastIndexOf("</svg>") + 6)
      .replace(/<text\b[^>]*>[\s\S]*?<\/text>/g, "");
    return sharp(Buffer.from(svg)).resize(340, 170).ensureAlpha().extractChannel(3).raw().toBuffer();
  };
  const silhouette = await alpha(renderToStaticMarkup(
    <PlateSvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 500">
      <rect width="1000" height="500" fill="white" />
    </PlateSvg>,
  ));
  for (const state of PLATE_STATES) {
    const Plate = PLATES[state].component;
    const markup = renderToStaticMarkup(<Plate plate="ABC123" />);
    const pixels = await alpha(markup);
    let escaped = 0;
    for (let i = 0; i < pixels.length; i++) {
      if (silhouette[i] === 0 && pixels[i]! > 1) escaped++;
    }
    expect({ state, escaped }).toEqual({ state, escaped: 0 });
    expect(pixels[85 * 340 + 170]).toBe(255);
    // Keep the SVG's accessible title outside the clipping group.
    expect(markup).toMatch(/<svg\b[^>]*><title>/);
  }
});
