"use client";

import { useId } from "react";
import { PlateProps } from "../types.js";

const INK = "#080808";
const SANS = 'var(--font-geist-sans, Arial, sans-serif), ui-sans-serif, system-ui, sans-serif';

/** Texas Classic: flat black printing, a beveled star and a Texas separator. */
export default function TexasPlate({ plate, state = "Texas", className, style, ...rest }: PlateProps) {
  const id = useId().replace(/:/g, "");
  const tx = formatTxPlate(plate);
  const size = tx.centered.length <= 7 ? 300 : Math.round(300 * 7 / tx.centered.length);

  return (
    <div className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }}
      aria-label={`License plate ${plate} from ${state}`} {...rest}>
      <svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" role="img"
        preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
        <title>{`Texas license plate: ${plate}`}</title>
        <defs>
          <symbol id={`txState-${id}`} viewBox="0 0 110 106">
            <path d="M31 1 H56 V21 L62 24 71 24 75 26 81 24 88 26 92 24 104 26 104 43 108 51 108 63 99 72 87 78 83 87 80 94 82 103 75 105 65 101 59 90 54 84 49 76 43 70 34 70 29 78 19 74 14 66 9 60 1 48 31 48 Z" fill={INK} />
          </symbol>
          <linearGradient id={`txRim-${id}`} x2="0" y2="1">
            <stop stopColor="#ddddda" /><stop offset="0.18" stopColor="#eeeeec" />
            <stop offset="0.85" stopColor="#e5e5e2" /><stop offset="1" stopColor="#cecfca" />
          </linearGradient>
          <linearGradient id={`txSlot-${id}`} x2="0" y2="1">
            <stop stopColor="#bfc1bd" /><stop offset="0.3" stopColor="#fafaf8" /><stop offset="1" stopColor="#ffffff" />
          </linearGradient>
          <clipPath id={`txClip-${id}`}><rect x="7" y="7" width="986" height="486" rx="30" /></clipPath>
        </defs>
        <rect width="1000" height="500" rx="34" fill="#f3f3f0" />
        <rect x="12" y="15" width="976" height="470" rx="28" fill="#f5f5f2" stroke={`url(#txRim-${id})`} strokeWidth="9" />
        {/* The two security threads run vertically through the reflective sheet. */}
        <g clipPath={`url(#txClip-${id})`} fill="none" stroke="#dbdcd8" strokeWidth="1.5" opacity="0.5">
          {[285, 715].map((x) => <path key={x} d={`M${x} 18 C${x - 28} 65 ${x + 25} 95 ${x} 142 S${x - 25} 222 ${x} 269 S${x + 25} 345 ${x} 391 S${x - 24} 454 ${x} 486`} />)}
        </g>
        {[183, 772].flatMap((x) => [38, 438].map((y) =>
          <rect key={`${x}-${y}`} x={x} y={y} width="43" height="24" rx="12" fill={`url(#txSlot-${id})`} />))}
        {/* Alternate black facets meet at the star's centre. */}
        <g transform="translate(49 54) scale(1.13 1.08)">
          <path d="M50 0 L62 36 H100 L69 58 81 95 50 72 19 95 31 58 0 36 H38 Z" fill="#fafaf8" stroke={INK} strokeWidth="2.6" />
          <path d="M50 0 L62 36 50 52 Z M100 36 L69 58 50 52 Z M81 95 L50 72 50 52 Z M19 95 L31 58 50 52 Z M0 36 L38 36 50 52 Z" fill={INK} />
        </g>
        <text x="495" y="126" textAnchor="middle" fill={INK} fontFamily={SANS}
          fontWeight={900} fontSize="112" textLength="386" lengthAdjust="spacingAndGlyphs">TEXAS</text>
        <g id={`registration-${id}`} fill={INK} fontFamily="var(--font-plate-ny, sans-serif)" fontSize={size}>
          <text x="363" y={388 - (300 - size) * 0.35} textAnchor="end"
            textLength={tx.left.length ? Math.min(308, tx.left.length * 103) : undefined}
            lengthAdjust="spacingAndGlyphs">{tx.left}</text>
          <use href={`#txState-${id}`} x="390" y="248" width="81" height="79" />
          <text x="487" y={388 - (300 - size) * 0.35}
            textLength={tx.right.length ? Math.min(445, tx.right.length * 111) : undefined}
            lengthAdjust="spacingAndGlyphs">{tx.right}</text>
        </g>
        <text x="495" y="464" textAnchor="middle" fill={INK} fontFamily={SANS}
          fontWeight={900} fontSize="45" textLength="464" lengthAdjust="spacingAndGlyphs">The Lone Star State</text>
      </svg>
    </div>
  );
}

function formatTxPlate(input: string): {
  centered: string;
  left: string;
  right: string;
} {
  const cleaned = input.replace(/[\s\-\u2013\u2014]/g, "").toUpperCase();
  // Standard registrations keep their 3/4 grouping; other lengths share the same symbol clearance.
  const cut = /^[A-Z*]{3}[0-9*]{4}$/.test(cleaned) ? 3 : Math.ceil(cleaned.length * 3 / 7);
  return { centered: cleaned, left: cleaned.slice(0, cut), right: cleaned.slice(cut) };
}
