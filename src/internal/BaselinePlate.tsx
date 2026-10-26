"use client";

import PlateFrame from "./PlateFrame.js";
import PlateSvg, { PLATE_INSET_RADIUS, PLATE_OUTLINE } from "./PlateSvg.js";
import Lettering, { TracedLettering, type LetteringRun, type TracedRun } from "./Lettering.js";
import Registration, { cleanRegistration } from "./Registration.js";
import type { RegistrationFace } from "./registrationGlyphs.js";
import { useId, type ReactNode } from "react";
import type { PlateProps } from "../types.js";

/** Registration glyphs stay this far inside the plate edge, clear of every design's inset frame. */
const SERIAL_EDGE = 48;

export const PLATE_SERIF = 'Georgia, "Times New Roman", serif';
export const PLATE_SANS = 'var(--font-geist-sans, Arial, sans-serif), Arial, sans-serif';
export const PLATE_SCRIPT = 'var(--font-plate-script, cursive), cursive';

/** Placement and typography for a heading or footer drawn as live text or a lettering run. */
export type TextStyle = {
  color?: string;
  x?: number;
  y?: number;
  size?: number;
  /** Caps the textLength estimated from the character count. */
  width?: number;
  /** Exact textLength, replacing the estimate. */
  length?: number;
  font?: string;
  weight?: number;
  italic?: boolean;
  stroke?: string;
};

/** Registration placement; a separator splits the registration around a fixed symbol of that width. */
export type SerialLayout = {
  x?: number;
  y?: number;
  width?: number;
  inset?: number;
  stroke?: string;
  separator?: { width?: number; x?: number };
};

type Props = PlateProps & {
  name: string;
  colors: string[];
  stops?: number[];
  ink?: string;
  /** Text in the heading font, a pre-drawn run that ignores the font, or lettering traced in place. */
  heading: string | LetteringRun | TracedRun;
  headingStyle?: TextStyle;
  footer?: string | LetteringRun | TracedRun;
  footerStyle?: TextStyle;
  serial?: SerialLayout;
  /** Inset frame strokes; border colors the inner stroke. */
  frame?: boolean;
  border?: string;
  /** Light rim stroke width; true uses 24. */
  rim?: boolean | number;
  edgeColor?: string;
  /** Supplied by the caller so each plate bundles only its selected alphabet. */
  registrationFace: RegistrationFace;
  children?: ReactNode;
};

/** Shared physical plate and responsive lettering; state artwork lives in each component. */
export default function BaselinePlate({
  plate, state, className, style, name, colors, stops, ink = "#122856", heading, headingStyle, footer, footerStyle, serial,
  frame = true, border, rim = false, edgeColor, registrationFace, children, ...rest
}: Props) {
  const h = { color: ink, x: 500, y: 93, size: 78, width: 690, font: PLATE_SERIF, weight: 700, ...headingStyle };
  const f = { color: h.color, y: 465, size: 43, width: 820, font: PLATE_SANS, weight: 600, ...footerStyle };
  const s = { x: 500, y: 373, width: 880, inset: 20, ...serial };
  const sepWidth = s.separator?.width, sepX = s.separator?.x ?? 500;
  const rimWidth = rim === true ? 24 : rim || 0;
  const id = useId().replace(/:/g, "");
  const cleaned = cleanRegistration(plate);
  // Keep long registrations clear of fixed state symbols too.
  const split = s.separator && cleaned.length >= 5;
  const cut = Math.ceil(cleaned.length / 2);
  // Split groups sit between the plate frame (SERIAL_EDGE) and the separator symbol (the serial inset clear of it).
  const leftEdge = sepX - (sepWidth ?? 0) / 2 - s.inset, rightEdge = sepX + (sepWidth ?? 0) / 2 + s.inset;
  const leftCenter = sepWidth ? (SERIAL_EDGE + leftEdge) / 2 : 269;
  const rightCenter = sepWidth ? (rightEdge + 1000 - SERIAL_EDGE) / 2 : 740;
  const leftGroupWidth = sepWidth ? leftEdge - SERIAL_EDGE : 390;
  const rightGroupWidth = sepWidth ? 1000 - SERIAL_EDGE - rightEdge : 390;
  const size = Math.min(316, 316 * 7 / Math.max(7, cleaned.length));
  const baselineY = s.y - (316 - size) * .35;
  const textWidth = Math.min(s.width, cleaned.length * 122);
  return (
    <PlateFrame className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }} aria-label={`License plate ${plate} from ${state ?? name}`} {...rest}>
      <PlateSvg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
        <title>{`${name} license plate: ${plate}`}</title>
        <defs>
          <linearGradient id={`${id}-bg`} x2="0" y2="1">
            {colors.map((color, i) => <stop key={i} offset={stops?.[i] ?? i / Math.max(1, colors.length - 1)} stopColor={color} />)}
          </linearGradient>
          <clipPath id={`${id}-clip`}><rect {...PLATE_OUTLINE} /></clipPath>
        </defs>
        {edgeColor && <rect {...PLATE_OUTLINE} fill={edgeColor} />}
        <g clipPath={`url(#${id}-clip)`}>
          <rect width="1000" height="500" fill={`url(#${id}-bg)`} />
          {children}
          {frame && <><rect x="12" y="12" width="976" height="476" rx={PLATE_INSET_RADIUS} fill="none" stroke={border ?? "#777"} strokeOpacity={border ? 1 : .25} strokeWidth={border ? 7 : 3} />
          <rect {...PLATE_OUTLINE} fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="5" /></>}
          {rimWidth > 0 && <rect x={rimWidth / 2} y={rimWidth / 2} width={1000 - rimWidth} height={500 - rimWidth} rx={PLATE_OUTLINE.rx} fill="none" stroke="#f5f5f2" strokeWidth={rimWidth} />}
          {typeof heading === "object" && "paths" in heading ? <TracedLettering {...heading} fill={h.color} />
            : typeof heading === "string"
            ? <text x={h.x} y={h.y} textAnchor="middle" fill={h.color} stroke={h.stroke} strokeWidth={h.stroke ? 12 : undefined} paintOrder="stroke" strokeLinejoin="round" fontFamily={h.font} fontWeight={h.weight} fontStyle={h.italic ? "italic" : undefined} fontSize={h.size} textLength={Math.min(h.width, heading.length * h.size * .83)} lengthAdjust="spacingAndGlyphs">{heading}</text>
            : <Lettering run={heading} x={h.x} y={h.y} textAnchor="middle" fill={h.color} stroke={h.stroke} strokeWidth={h.stroke ? 12 : undefined} paintOrder="stroke" strokeLinejoin="round" fontSize={h.size} textLength={Math.min(h.width, heading.text.length * h.size * .83)} />}
          <g fill={ink} stroke={s.stroke} paintOrder="stroke">
            {split ? <>
              <Registration face={registrationFace} text={cleaned.slice(0, cut)} x={leftCenter} y={baselineY} fontSize={size} textAnchor="middle" width={Math.min(leftGroupWidth, cut * 116)} strokeWidth={s.stroke ? 3 : undefined} />
              <Registration face={registrationFace} text={cleaned.slice(cut)} x={rightCenter} y={baselineY} fontSize={size} textAnchor="middle" width={Math.min(rightGroupWidth, (cleaned.length - cut) * 116)} strokeWidth={s.stroke ? 3 : undefined} />
            </> : <Registration face={registrationFace} text={cleaned} x={s.x} y={baselineY} fontSize={size} textAnchor="middle" width={textWidth} strokeWidth={s.stroke ? 3 : undefined} />}
          </g>
          {typeof footer === "string" && <text x="500" y={f.y} textAnchor="middle" fill={f.color} fontFamily={f.font} fontWeight={f.weight} fontStyle={f.italic ? "italic" : undefined} stroke={f.stroke} strokeWidth={f.stroke ? 4 : undefined} paintOrder="stroke" strokeLinejoin="round" fontSize={f.size} textLength={f.length ?? Math.min(f.width, footer.length * f.size * .64)} lengthAdjust="spacingAndGlyphs">{footer}</text>}
          {footer && typeof footer === "object" && "paths" in footer && <TracedLettering {...footer} fill={f.color} />}
          {footer && typeof footer === "object" && !("paths" in footer) && <Lettering run={footer} x={500} y={f.y} textAnchor="middle" fill={f.color} stroke={f.stroke} strokeWidth={f.stroke ? 4 : undefined} paintOrder="stroke" strokeLinejoin="round" fontSize={f.size} textLength={f.length ?? Math.min(f.width, footer.text.length * f.size * .64)} />}
        </g>
      </PlateSvg>
    </PlateFrame>
  );
}

export function Pine({ x, y, size, fill = "#174838" }: { x: number; y: number; size: number; fill?: string }) {
  return <path vectorEffect="non-scaling-stroke" transform={`translate(${x} ${y}) scale(${size / 100})`} fill={fill} d="M0 100 L-4 100 -4 79 -29 83 -18 66 -33 70 -18 50 -26 54 -12 32 -18 35 0 0 17 32 11 31 26 52 18 49 33 70 19 66 31 83 4 79 4 100Z" />;
}

export function Star({ x, y, size, fill }: { x: number; y: number; size: number; fill: string }) {
  return <path transform={`translate(${x} ${y}) scale(${size / 100})`} fill={fill} d="M0 -50 12 -16 48 -15 20 7 29 42 0 22 -29 42 -20 7 -48 -15 -12 -16Z" />;
}
