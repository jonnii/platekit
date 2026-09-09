import cleanedReferences from "../../references/cleaned-references.json" with { type: "json" };
import originals from "../../references/original-references.json" with { type: "json" };
import type { PlateReference } from "./references.ts";

type OriginalReference = {
  source: string; image: PlateReference["image"]; plate: PlateReference["plate"];
  src: string; sha256: string;
};

/** Reuse a preserved crop only while its source and crop geometry still match. */
export function originalReference(reference: PlateReference): OriginalReference | undefined {
  const entry = (originals as Record<string, OriginalReference>)[reference.state];
  if (!entry || entry.source !== reference.src
    || entry.image.w !== reference.image.w || entry.image.h !== reference.image.h
    || (["x", "y", "w", "h"] as const).some((key) => entry.plate[key] !== reference.plate[key])) return undefined;
  return entry;
}

type CleanedReference = {
  source: string;
  image: PlateReference["image"];
  plate: PlateReference["plate"];
  src: string;
};

// Keep edited display images separate from the original scoring references.
// A replacement source or crop must never silently reuse an old cleaned plate.
export function cleanedReferenceSource(reference: PlateReference): string | undefined {
  const cleaned = (cleanedReferences as Record<string, CleanedReference>)[reference.state];
  if (!cleaned || cleaned.source !== reference.src
    || cleaned.image.w !== reference.image.w || cleaned.image.h !== reference.image.h
    || (["x", "y", "w", "h"] as const).some((key) => cleaned.plate[key] !== reference.plate[key])) {
    return undefined;
  }
  return cleaned.src;
}
