import type { SVGProps } from "react";
import { UNITS_PER_EM, type RegistrationFace } from "./registrationGlyphs.js";

/** Plates ignore spaces and dashes in the supplied registration. */
export function cleanRegistration(input: string) {
  return input.replace(/[\s\-\u2013\u2014]/g, "").toUpperCase();
}

// ponytail: characters outside printable ASCII fall back to "?" after accents are stripped; add glyphs when a plate needs them.
function glyph({ glyphs }: RegistrationFace, char: string) {
  return glyphs[char] ?? glyphs[char.normalize("NFD").replace(/[\u0300-\u036f]/g, "")] ?? glyphs["?"]!;
}

type Props = Omit<SVGProps<SVGGElement>, "x" | "y" | "width"> & {
  text: string;
  /** The state's measured registration face; see tools/artwork/font-selections.ts. */
  face: RegistrationFace;
  x: number;
  /** Baseline, as for SVG text. */
  y: number;
  fontSize: number;
  /** Glyphs keep their drawn proportions until the run would exceed this width, then narrow to fit. */
  width?: number;
  textAnchor?: "start" | "middle" | "end";
  letterSpacing?: number;
};

/** Registration lettering drawn from outlines, so its size never depends on a loaded font. */
export default function Registration({ text, face, x, y, fontSize, width = Infinity, textAnchor = "start", letterSpacing = 0, strokeWidth, ...props }: Props) {
  const scale = fontSize / UNITS_PER_EM;
  const spacing = letterSpacing / scale;
  const chars = [...text];
  const offsets: number[] = [];
  let natural = 0;
  for (const char of chars) {
    offsets.push(natural);
    natural += glyph(face, char)[0] + spacing;
  }
  natural = Math.max(0, natural - (chars.length ? spacing : 0));
  const drawn = Math.min(width, natural * scale);
  const scaleX = natural ? drawn / natural : scale;
  const left = textAnchor === "middle" ? x - drawn / 2 : textAnchor === "end" ? x - drawn : x;
  return (
    <g data-registration={text} data-face={face.id} data-extent={`${round(left)} ${round(left + drawn)}`} {...props}>
      <g transform={`translate(${round(left)} ${y}) scale(${round(scaleX, 5)} ${round(scale, 5)})`}
        strokeWidth={strokeWidth === undefined ? undefined : Number(strokeWidth) / scale}>
        {chars.map((char, i) => <path key={i} transform={offsets[i] ? `translate(${offsets[i]} 0)` : undefined} d={glyph(face, char)[1]} />)}
      </g>
    </g>
  );
}

function round(value: number, places = 2) {
  return Number(value.toFixed(places));
}
