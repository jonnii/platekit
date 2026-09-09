"use client";

import { useId } from "react";
import { PlateProps } from "../types.js";

/** Pure Michigan's open brush M, white reflective field, and curved blue footer. */
const BLUE = "#193f97";
const SANS = 'var(--font-geist-sans, Arial, sans-serif), ui-sans-serif, system-ui, sans-serif';

export default function MichiganPlate({ plate, state = "Michigan", className, style, ...rest }: PlateProps) {
  const id = useId().replace(/:/g, "");
  const cleaned = plate.replace(/[\s\-–—]/g, "").toUpperCase();
  const serialSize = cleaned.length <= 7 ? 300 : Math.round((300 * 7) / cleaned.length);

  return (
    <div
      className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }}
      aria-label={`License plate ${plate} from ${state}`} {...rest}
    >
      <svg
        viewBox="0 0 1000 500"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "auto" }}
      >
        <title>{`Michigan license plate: ${plate}`}</title>
        <defs>
          <clipPath id={`miClip-${id}`}><rect x="18" y="19" width="964" height="465" rx="21" /></clipPath>
          <linearGradient id={`miRim-${id}`} x2="0" y2="1"><stop stopColor="#9eaaa8" /><stop offset="0.5" stopColor="#f6f7f2" /><stop offset="1" stopColor="#9bacae" /></linearGradient>
          <linearGradient id={`miSlot-${id}`} x2="0" y2="1"><stop stopColor="#9aa39a" /><stop offset="0.5" stopColor="#e4e8de" /><stop offset="1" stopColor="#a7ada1" /></linearGradient>
          <filter id={`miEmboss-${id}`} x="-5%" y="-5%" width="110%" height="115%"><feDropShadow dx="1" dy="1.8" stdDeviation="0.5" floodColor="#b4b7a4" /></filter>
        </defs>
        <rect width="1000" height="500" rx="34" fill="#f6f6f3" />
        <rect x="18" y="19" width="964" height="465" rx="21" fill="#f4f5f2" />
        <g clipPath={`url(#miClip-${id})`}>
          <path d="M17 390 C160 423 295 424 403 417 C594 410 810 374 983 390 V489 H17 Z" fill={BLUE} />
        </g>
        <rect x="18" y="19" width="964" height="465" rx="21" fill="none" stroke={`url(#miRim-${id})`} strokeWidth="2.7" />
        {[158, 765].flatMap((x) => [38, 438].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="83" height="21" rx="10" fill={`url(#miSlot-${id})`} stroke="#afb7ad" strokeWidth="1" />))}

        {/* Wordmark: PURE, the script M, then ICHIGAN. The three are positioned
            rather than set as one string so the M can overlap and oversail. */}
        <text
          x="411"
          y="94"
          textAnchor="end"
          fill={BLUE}
          fontFamily={SANS}
          fontWeight={400}
          fontSize="40"
          letterSpacing="6"
        >
          PURE
        </text>
        {/* The long hairline entrance and open, rising M are drawn as the logo's brush strokes. */}
        <path d="M374 129 C397 94 422 53 443 38 Q457 30 465 32
          C461 53 448 86 440 106 C458 91 478 54 494 46 L500 45
          C489 78 486 105 505 111 L495 115 C477 114 477 94 484 68
          C469 87 450 113 435 113 C431 111 434 103 437 96 L457 40
          C431 51 405 94 379 132 Z" fill={BLUE} />
        <text
          x="503"
          y="94"
          textAnchor="start"
          fill={BLUE}
          fontFamily={SANS}
          fontWeight={400}
          fontSize="40"
          letterSpacing="6"
          textLength="218" lengthAdjust="spacingAndGlyphs"
        >
          ICHIGAN
        </text>

        <text
          x="500"
          y="368"
          textAnchor="middle"
          fill={BLUE}
          fontFamily="var(--font-plate-ny, sans-serif)"
          fontSize={serialSize}
          filter={`url(#miEmboss-${id})`}
          letterSpacing="5"
        >
          {cleaned}
        </text>

        {/* michigan.org reversed out of the band, and set at the size the plate
            uses — it is a full line of type, not a footnote. */}
        <text
          x="500"
          y="462"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily={SANS}
          fontWeight={400}
          fontSize="54"
          textLength="299" lengthAdjust="spacingAndGlyphs"
        >
          michigan.org
        </text>
      </svg>
    </div>
  );
}
