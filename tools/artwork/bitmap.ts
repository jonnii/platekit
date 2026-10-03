import type { Rect } from "./profiles";

export type Bitmap = { pixels: Uint8Array; width: number; height: number };
export type Component = Rect & { points: number[] };

/** 8-connected foreground components of a binary bitmap, with their bounds and pixel indices. */
export function components(bitmap: Bitmap): Component[] {
  const { width, height, pixels } = bitmap;
  const seen = new Uint8Array(pixels.length), output: Component[] = [];
  for (let start = 0; start < pixels.length; start++) {
    if (!pixels[start] || seen[start]) continue;
    const points = [start]; seen[start] = 1;
    let x0 = start % width, x1 = x0, y0 = Math.floor(start / width), y1 = y0;
    for (let cursor = 0; cursor < points.length; cursor++) {
      const i = points[cursor], x = i % width, y = Math.floor(i / width);
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy, next = ny * width + nx;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height || seen[next] || !pixels[next]) continue;
        seen[next] = 1; points.push(next);
      }
    }
    output.push({ x: x0, y: y0, width: x1 - x0 + 1, height: y1 - y0 + 1, points });
  }
  return output;
}
