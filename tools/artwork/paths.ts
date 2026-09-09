import path from "node:path";

/** Map preserved public URLs to repository assets without changing manifest provenance. */
export function referencePath(source: string): string {
  const match = /^\/plate-references\/(originals\/[a-z]{2}\.jpg|cleaned\/[a-z]{2}\.webp)$/.exec(source);
  if (!match) throw new Error(`Unknown reference asset: ${source}`);
  return path.join(process.cwd(), "references", match[1]);
}
