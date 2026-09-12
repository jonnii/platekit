import type { Rect } from "./profiles";

/** Bounds in the original reference crops, normalized to 1000 × 500.
 * Exclude optional hardware from artwork scoring; never score reconstructed pixels.
 */
export function optionalFeatureRects(state: string): Rect[] {
  const round = ["FL", "KS", "OK", "SC", "WY"].includes(state);
  const xs = state === "NY" || state === "TX" ? [180, 768] : round ? [182, 775] : [150, 754];
  const ys = state === "TX" || round ? [22, 424] : state === "NY" ? [33, 424] : [30, 428];
  const width = state === "NY" || state === "TX" ? 57 : round ? 49 : 100;
  const holes = xs.flatMap((x) => ys.map((y) => ({ x, y, width, height: state === "TX" || round ? 64 : 40 })));
  return [...holes, ...(STICKER_AREAS[state] ?? [])];
}

/** Tight display-edit bounds; scoring bounds above also allow for photo alignment. */
export function referenceCleanupRects(state: string): Rect[] {
  let holes: Rect[];
  if (["FL", "KS", "OK", "SC", "WY"].includes(state)) {
    const xs = state === "OK" ? [211, 791] : state === "SC" ? [207, 801] : state === "WY" ? [197, 803] : [202, 799];
    const ys = state === "SC" ? [43, 449] : state === "WY" ? [47, 456] : [55, 444];
    holes = xs.flatMap((x) => ys.map((y) => ({ x: x - 20, y: y - 20, width: 40, height: 40 })));
  } else if (state === "NY") {
    holes = [183, 769].flatMap((x) => [43, 430].map((y) => ({ x, y, width: 51, height: 30 })));
  } else if (state === "TX") {
    holes = [166, 770].flatMap((x) => [20, 445].map((y) => ({ x, y, width: 82, height: y === 20 ? 68 : 41 })));
  } else {
    holes = [153, 758].flatMap((x) => [32, 430].map((y) => ({ x, y, width: 94, height: 36 })));
  }
  return [...holes, ...(STICKER_AREAS[state] ?? [])];
}

// Include photo-only decals too: the runtime deliberately does not invent their values.
const STICKER_AREAS: Record<string, Rect[]> = {
  AR: [{ x: 25, y: 20, width: 130, height: 117 }, { x: 844, y: 20, width: 134, height: 117 }],
  DC: [{ x: 18, y: 18, width: 127, height: 84 }, { x: 857, y: 18, width: 126, height: 84 }],
  FL: [{ x: 833, y: 10, width: 148, height: 112 }],
  GA: [{ x: 242, y: 397, width: 516, height: 76 }],
  IN: [{ x: 822, y: 384, width: 158, height: 116 }],
  KS: [{ x: 47, y: 33, width: 138, height: 129 }, { x: 815, y: 33, width: 139, height: 129 }],
  KY: [{ x: 245, y: 377, width: 508, height: 86 }],
  LA: [{ x: 845, y: 372, width: 130, height: 100 }],
  MA: [{ x: 20, y: 15, width: 140, height: 85 }, { x: 845, y: 12, width: 124, height: 113 }],
  MO: [{ x: 10, y: 15, width: 145, height: 75 }],
  MT: [{ x: 857, y: 23, width: 120, height: 84 }],
  ND: [{ x: 840, y: 22, width: 110, height: 78 }],
  NV: [{ x: 844, y: 21, width: 134, height: 105 }],
  OK: [{ x: 34, y: 30, width: 116, height: 63 }, { x: 853, y: 30, width: 115, height: 63 }],
  RI: [{ x: 847, y: 385, width: 129, height: 103 }],
  SC: [{ x: 828, y: 378, width: 136, height: 96 }],
  TN: [{ x: 251, y: 396, width: 496, height: 95 }, { x: 825, y: 45, width: 146, height: 100 }],
  WY: [{ x: 6, y: 12, width: 116, height: 74 }],
};
