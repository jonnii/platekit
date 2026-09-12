import type { PlateState } from "../../src/registry";
import { ARTWORK_STATES, PLATE_METADATA } from "./metadata";

export type FontCandidate = {
  id: string;
  family: string;
  weight: number;
  style?: "italic";
  remote?: boolean;
};
export type FontProbe = {
  id: string;
  state: PlateState;
  kind: "wordmark" | "registration";
  label: string;
  text: string;
  crop: { x: number; y: number; w: number; h: number };
  candidates: FontCandidate[];
  note: string;
};

const face = (family: string, weight = 400, remote = true, style?: "italic"): FontCandidate => ({
  id: `${family.toLowerCase().replaceAll(" ", "-")}-${weight}${style ? "-italic" : ""}`,
  family, weight, remote, style,
});
const scripts = [face("Yellowtail", 400, false), ...["Kaushan Script", "Satisfy", "Damion", "Courgette", "Grand Hotel", "Mr Dafoe", "Lobster"].map((name) => face(name))];
const serifs = [face("Playfair Display", 700, false), face("Bodoni Moda", 700), face("Libre Bodoni", 700), face("Source Serif 4", 700), face("PT Serif", 700)];
const italics = [face("Source Serif 4", 700, true, "italic"), face("PT Serif", 700, true, "italic"), face("Libre Bodoni", 700, true, "italic"), face("Lora", 700, true, "italic"), face("Merriweather", 700, true, "italic")];
const slabs = [face("Sanchez", 400, false), face("Bitter", 800), face("Zilla Slab", 700), face("Roboto Slab", 800), face("Aleo", 800), face("Bevan"), face("Alfa Slab One")];
export const REGISTRATION_CANDIDATES = [face("Bebas Neue", 400, false), face("Barlow Condensed", 500), face("Barlow Condensed", 700), face("Oswald", 500), face("Roboto Condensed", 700), face("Teko", 500), face("Antonio", 600)];

const wordmark = (state: PlateState, suffix: string, text: string, crop: FontProbe["crop"], candidates: FontCandidate[], note: string): FontProbe => ({
  id: `${state.toLowerCase()}-${suffix}`, state, kind: "wordmark", label: `${PLATE_METADATA[state].name} · ${text}`, text, crop, candidates, note,
});

export const WORDMARK_PROBES: FontProbe[] = [
  wordmark("LA", "name", "Louisiana", { x: 270, y: 15, w: 500, h: 110 }, scripts, "Compare the angular L, repeated i strokes and trailing swash. A font alone may not reproduce the custom wordmark."),
  wordmark("SD", "name", "South Dakota", { x: 270, y: 0, w: 470, h: 135 }, scripts, "Compare the large S and D, connected letters and underline. Retain the selected Rushmore base."),
  wordmark("GA", "motto", "Peach State", { x: 45, y: 15, w: 370, h: 130 }, scripts, "Compare with the existing outline applied; the outline changes apparent stroke weight."),
  wordmark("GA", "name", "GEORGIA", { x: 385, y: 25, w: 560, h: 120 }, [...serifs.map((font) => ({ ...font, id: `${font.id}-regular`, weight: 400 })), face("Cinzel"), face("Marcellus")], "Compare the G, R leg, horizontal proportions and thin strokes. Cinzel and Marcellus test the reference’s inscription-style capitals."),
  wordmark("MD", "name", "aryland", { x: 310, y: 10, w: 400, h: 100 }, italics, "Only ‘aryland’ changes. The custom SVG M stays visible so its join and stroke contrast can be judged."),
  wordmark("MA", "name", "Massachusetts", { x: 235, y: 10, w: 530, h: 100 }, italics, "Compare the italic M, double s and terminal s."),
  wordmark("MA", "motto", "The Spirit of America", { x: 235, y: 405, w: 535, h: 85 }, italics, "Compare italic rhythm and spacing at both display sizes."),
  wordmark("NV", "name", "NEVADA", { x: 240, y: 20, w: 520, h: 110 }, slabs, "Current Sanchez has only a bundled regular face; the plate requests 900. Compare real bold weights with the existing stroke applied."),
  wordmark("NV", "motto", "Home Means Nevada", { x: 225, y: 405, w: 550, h: 80 }, slabs, "Compare slab shape and lowercase weight. Current Sanchez requests an unbundled 800 weight."),
  wordmark("KS", "motto", "to the stars", { x: 330, y: 395, w: 355, h: 90 }, scripts, "Official DOR sample. Compare t crossbars, joins and the final s."),
  wordmark("NH", "new", "New", { x: 330, y: 330, w: 330, h: 105 }, scripts, "Compare the broad N and rising finish. Full-plate previews expose the current oversized script’s proximity to the serial; a family swap alone does not fix that layout."),
  wordmark("NH", "hampshire", "HAMPSHIRE", { x: 295, y: 405, w: 415, h: 90 }, serifs, "Compare the tall, narrow serif forms in the split state name."),
  wordmark("NY", "name", "NEW YORK", { x: 240, y: 30, w: 520, h: 105 }, serifs, "Use the preserved DMV sample; compare high contrast, serifs and the E’s middle bar."),
  wordmark("NY", "motto", "EXCELSIOR", { x: 265, y: 395, w: 470, h: 90 }, slabs, "Compare the outlined slab serif with the existing gold fill and navy outline."),
  wordmark("CA", "name", "California", { x: 225, y: 10, w: 600, h: 130 }, scripts, "The existing separate trailing swash stays visible. Check its connection to each candidate."),
];

/** Transcribed from the preserved original images, not the development samples. */
const referenceSerials: Partial<Record<PlateState, string>> = {
  CA: "1234567890", FL: "ABC234", KS: "038ADQ2", MD: "1234567890", MI: "BOBSTRUCK",
  MS: "ANYTXT", NM: "ANYTXT", NY: "ABC1234", OK: "ABC123", SC: "999AAA",
  TX: "LHD8448", VA: "1234567890", WY: "0P0000",
};
export const REGISTRATION_PROBES: FontProbe[] = ARTWORK_STATES.map((state) => ({
  id: `${state.toLowerCase()}-registration`, state, kind: "registration", label: `${PLATE_METADATA[state].name} · registration`,
  text: referenceSerials[state] ?? "ANYTEXT", crop: { x: 20, y: 130, w: 960, h: 270 }, candidates: REGISTRATION_CANDIDATES,
  note: "Compare A/R/M, curved digits, stroke ends and counters. Preview preserves the component’s grouping and separator positions; reference sample spacing can differ. Candidate glyph height is matched to the current render, not fitted to the photograph.",
}));
export const FONT_PROBES = [...WORDMARK_PROBES, ...REGISTRATION_PROBES];

/** Explicit provenance avoids treating vendor samples as issued lettering. */
export function fontReferenceKind(state: PlateState) {
  if (["NY", "KS", "OK", "SC", "WY"].includes(state)) return "Official agency sample";
  if (state === "TX") return "Issued plate photograph";
  if (state === "FL") return "Vendor reference — verify issued lettering";
  return "Novelty reference — issued lettering needs verification";
}

export function candidateStylesheet(candidates: FontCandidate[]) {
  const families = new Map<string, Set<string>>();
  // All remote families use the same axes so regular and italic requests combine safely.
  for (const candidate of candidates.filter((font) => font.remote)) {
    const values = families.get(candidate.family) ?? new Set<string>();
    values.add(`${candidate.style === "italic" ? 1 : 0},${candidate.weight}`);
    families.set(candidate.family, values);
  }
  const params = new URLSearchParams();
  for (const [family, values] of families) params.append("family", `${family}:ital,wght@${[...values].sort().join(";")}`);
  params.set("display", "swap");
  return families.size ? `https://fonts.googleapis.com/css2?${params}` : undefined;
}
