import type { SVGProps } from "react";

/** A word pre-shaped from its font into one outline, in 1000-unit em space with a baseline origin. */
export type LetteringRun = { text: string; face: string; advance: number; d: string };

type Props = Omit<SVGProps<SVGGElement>, "x" | "y"> & {
  run: LetteringRun;
  x: number;
  /** Baseline, as for SVG text. */
  y: number;
  fontSize: number;
  /** Fitted width, as SVG textLength with spacingAndGlyphs; the probes scored these fitted widths. */
  textLength?: number;
  textAnchor?: "start" | "middle" | "end";
};

/** Fixed lettering drawn from outlines, so it never depends on a loaded font. */
export default function Lettering({ run, x, y, fontSize, textLength, textAnchor = "start", strokeWidth, ...props }: Props) {
  const scale = fontSize / 1000;
  const drawn = textLength ?? run.advance * scale;
  const left = textAnchor === "middle" ? x - drawn / 2 : textAnchor === "end" ? x - drawn : x;
  return (
    <g data-lettering={run.text} data-extent={`${round(left)} ${round(left + drawn)}`} {...props}>
      <g transform={`translate(${round(left)} ${y}) scale(${round(drawn / run.advance, 5)} ${round(scale, 5)})`}
        strokeWidth={strokeWidth === undefined ? undefined : Number(strokeWidth) / scale}>
        <path d={run.d} />
      </g>
    </g>
  );
}

function round(value: number, places = 2) {
  return Number(value.toFixed(places));
}

/** Words traced from reference artwork, in plate units. A path without a fill takes the group's. */
export type TracedRun = { text: string; paths: { d: string; fill?: string }[] };

/** Lettering traced from reference artwork; its paths are already in plate units, with potrace's even-odd counters. */
export function TracedLettering({ text, paths, ...props }: SVGProps<SVGGElement> & TracedRun) {
  return (
    <g data-lettering={text} data-face="traced" {...props}>
      <g data-trace="">{paths.map(({ d, fill }, i) => <path key={i} d={d} fill={fill} fillRule="evenodd" />)}</g>
    </g>
  );
}
