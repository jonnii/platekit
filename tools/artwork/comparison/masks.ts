/** Partition a scored mask without reintroducing any excluded lettering. */
export function partitionColumns(mask: Uint8Array, width: number, count: number): Uint8Array[] {
  const columns = Array.from({ length: count }, () => new Uint8Array(mask.length));
  for (let i = 0; i < mask.length; i++) {
    const column = Math.floor((i % width) * count / width);
    columns[column][i] = mask[i];
  }
  return columns;
}
