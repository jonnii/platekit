"use client";

import PlateFrame from "./PlateFrame.js";
import PlateSvg, { PLATE_INSET_RADIUS, PLATE_OUTLINE } from "./PlateSvg.js";
import { useId, type ReactNode } from "react";
import type { PlateProps } from "../types.js";

export const PLATE_SERIF = 'Georgia, "Times New Roman", serif';
export const PLATE_SANS = 'var(--font-geist-sans, Arial, sans-serif), Arial, sans-serif';
export const PLATE_SCRIPT = 'var(--font-plate-script, cursive), cursive';

type Props = PlateProps & {
  name: string;
  colors: string[];
  stops?: number[];
  ink?: string;
  heading: string;
  headingColor?: string;
  headingY?: number;
  headingX?: number;
  headingSize?: number;
  headingWidth?: number;
  headingFont?: string;
  headingWeight?: number;
  headingStyle?: "normal" | "italic";
  headingStroke?: string;
  serialStroke?: string;
  footer?: string;
  footerColor?: string;
  footerY?: number;
  footerSize?: number;
  footerFont?: string;
  footerWeight?: number;
  footerStyle?: "normal" | "italic";
  footerStroke?: string;
  serialX?: number;
  serialWidth?: number;
  serialY?: number;
  serialInset?: number;
  separator?: boolean;
  separatorWidth?: number;
  separatorX?: number;
  footerWidth?: number;
  footerTextLength?: number;
  border?: string;
  children?: ReactNode;
  rim?: boolean;
  rimWidth?: number;
  frame?: boolean;
  edgeColor?: string;
};

/** Shared physical plate and responsive lettering; state artwork lives in each component. */
export default function BaselinePlate({
  plate, state, className, style, name, colors, stops, ink = "#122856", heading,
  headingColor = ink, headingX = 500, headingY = 93, headingSize = 78, headingWidth = 690,
  headingFont = PLATE_SERIF, headingWeight = 700, headingStyle, headingStroke, serialStroke, footer, footerColor = headingColor, footerY = 465,
  footerSize = 43, footerFont = PLATE_SANS, footerWeight = 600, footerStyle, footerStroke, serialX = 500, serialWidth = 880,
  serialY = 373, serialInset = 20, separator = false, separatorWidth, separatorX = 500, footerWidth = 820, footerTextLength, border, children, rim = false, rimWidth = 24, frame = true, edgeColor,
  ...rest
}: Props) {
  const id = useId().replace(/:/g, "");
  const cleaned = plate.replace(/[\s\-–—]/g, "").toUpperCase();
  // Keep long registrations clear of fixed state symbols too.
  const split = separator && cleaned.length >= 5;
  const cut = Math.ceil(cleaned.length / 2);
  const leftCenter = separatorWidth ? (separatorX - separatorWidth / 2) / 2 : 269;
  const rightCenter = separatorWidth ? (1000 + separatorX + separatorWidth / 2) / 2 : 740;
  const leftGroupWidth = separatorWidth ? separatorX - separatorWidth / 2 - serialInset * 2 : 390;
  const rightGroupWidth = separatorWidth ? 1000 - separatorX - separatorWidth / 2 - serialInset * 2 : 390;
  const size = Math.min(316, 316 * 7 / Math.max(7, cleaned.length));
  const baselineY = serialY - (316 - size) * .35;
  const textWidth = Math.min(serialWidth, cleaned.length * 122);
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
          {rim && <rect x={rimWidth / 2} y={rimWidth / 2} width={1000 - rimWidth} height={500 - rimWidth} rx={PLATE_OUTLINE.rx} fill="none" stroke="#f5f5f2" strokeWidth={rimWidth} />}
          <text x={headingX} y={headingY} textAnchor="middle" fill={headingColor} stroke={headingStroke} strokeWidth={headingStroke ? 12 : undefined} paintOrder="stroke" strokeLinejoin="round" fontFamily={headingFont} fontWeight={headingWeight} fontStyle={headingStyle} fontSize={headingSize} textLength={Math.min(headingWidth, heading.length * headingSize * .83)} lengthAdjust="spacingAndGlyphs">{heading}</text>
          <g fill={ink} stroke={serialStroke} strokeWidth={serialStroke ? 3 : undefined} paintOrder="stroke" fontFamily="var(--font-plate-ny, sans-serif)" fontSize={size} textAnchor="middle">
            {split ? <>
              <text x={leftCenter} y={baselineY} textLength={Math.min(leftGroupWidth, cut * 116)} lengthAdjust="spacingAndGlyphs">{cleaned.slice(0, cut)}</text>
              <text x={rightCenter} y={baselineY} textLength={Math.min(rightGroupWidth, (cleaned.length - cut) * 116)} lengthAdjust="spacingAndGlyphs">{cleaned.slice(cut)}</text>
            </> : <text x={serialX} y={baselineY} textLength={textWidth} lengthAdjust="spacingAndGlyphs">{cleaned}</text>}
          </g>
          {footer && <text x="500" y={footerY} textAnchor="middle" fill={footerColor} fontFamily={footerFont} fontWeight={footerWeight} fontStyle={footerStyle} stroke={footerStroke} strokeWidth={footerStroke ? 4 : undefined} paintOrder="stroke" strokeLinejoin="round" fontSize={footerSize} textLength={footerTextLength ?? Math.min(footerWidth, footer.length * footerSize * .64)} lengthAdjust="spacingAndGlyphs">{footer}</text>}
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
