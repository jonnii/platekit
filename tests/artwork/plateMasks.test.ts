import { expect, it } from "bun:test";
import { partitionColumns } from "../../tools/artwork/comparison/masks";

it("keeps footer exclusions in every column and preserves the total scored area", () => {
  // Two rows with lettering excluded across column boundaries.
  const mask = Uint8Array.from([1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0]);
  const columns = partitionColumns(mask, 10, 5);
  expect(columns).toHaveLength(5);
  for (let i = 0; i < mask.length; i++) {
    expect(columns.reduce((total, column) => total + column[i], 0)).toBe(mask[i]);
    for (let column = 0; column < 5; column++) {
      if (Math.floor(i % 10 / 2) !== column) expect(columns[column][i]).toBe(0);
    }
  }
  expect([...mask]).toEqual([1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0]);
});
