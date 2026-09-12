import { fontProbeSelection } from "./font-selections";

/** Short workshop copy for the fixed-reference comparison result. */
export function fontProbeFinding(id: string) {
  const selection = fontProbeSelection(id);
  if (selection.candidate === "current") return "The current implementation remained the best candidate in this fixed-reference pass.";
  const basis = selection.comparison === "whole"
    ? "The source letters touch or include plate detail, so this is a lower-confidence whole-run comparison."
    : selection.comparison === "word"
      ? "The result compares the normalized word shape."
      : "The result averages normalized individual-glyph comparisons.";
  return `Measured lead: ${selection.selectedScore.toFixed(1)} versus ${selection.currentScore.toFixed(1)} for the current face. ${basis}`;
}
