"use client";

import { useId } from "react";
import { PlateProps } from "../types.js";

/** Pennsylvania's blue-and-yellow visitPA.com base, with a keystone separator. */
const NAVY = "#0e2c5e";
const YELLOW = "#dfca17";
const SERIAL = "#0d2857";

/** The keystone: narrow flat top, flared shoulders, tapering to a flat base. */
function keystone(x: number, y: number, w: number, h: number) {
  return (
    <g transform={`translate(${x} ${y}) scale(${w / 100} ${h / 100})`}>
      <path
        d="M22 2 Q20 2 20 5 V22 H9 Q4 22 5 28 L19 92 Q20 97 25 97 H77 Q81 97 82 92 L96 28 Q97 22 92 22 H80 V5 Q80 2 77 2 Z"
        fill="#16315f"
        stroke="#e5e6dd"
        strokeWidth="7"
        paintOrder="stroke"
      />
    </g>
  );
}

/** Pennsylvania issues LLL-DDDD, so split three letters from the rest. */
function splitSerial(input: string) {
  const cleaned = input.replace(/[\s\-–—]/g, "").toUpperCase();
  if (cleaned.length < 5) return { left: cleaned, right: "", split: false };
  const m = cleaned.match(/^([A-Z*]{3})([0-9*].*)$/);
  if (m) return { left: m[1], right: m[2], split: true };
  const at = Math.ceil(cleaned.length / 2);
  return { left: cleaned.slice(0, at), right: cleaned.slice(at), split: true };
}

export default function PennsylvaniaPlate({ plate, state = "Pennsylvania", className, style, ...rest }: PlateProps) {
  const id = useId().replace(/:/g, "");
  const { left, right, split } = splitSerial(plate);
  const total = left.length + right.length;
  const size = total <= 7 ? 306 : 280;
  const serialY = total <= 7 ? 362 : 351;

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
        <title>{`Pennsylvania license plate: ${plate}`}</title>
        <defs>
          <clipPath id={`paClip-${id}`}><rect x="15" y="13" width="970" height="475" rx="25" /></clipPath>
          <linearGradient id={`paTop-${id}`} x2="0" y2="1"><stop stopColor="#526b8b" /><stop offset="0.23" stopColor="#294571" /><stop offset="0.85" stopColor={NAVY} /></linearGradient>
          <linearGradient id={`paRim-${id}`} x2="0" y2="1"><stop stopColor="#b6c2cd" /><stop offset="0.16" stopColor="#6d819f" /><stop offset="0.85" stopColor="#6d819f" /><stop offset="1" stopColor="#123265" /></linearGradient>
          <linearGradient id={`paSlot-${id}`} x2="0" y2="1"><stop stopColor="#9c9f9e" /><stop offset="0.4" stopColor="#dedfdb" /><stop offset="0.7" stopColor="#e5e5e1" /><stop offset="1" stopColor="#a8aaa6" /></linearGradient>
          <linearGradient id={`paLowerSlot-${id}`} x2="0" y2="1"><stop stopColor="#afb0aa" /><stop offset="0.45" stopColor="#c6c7c0" /><stop offset="1" stopColor="#939892" /></linearGradient>
          <filter id={`paEmboss-${id}`} x="-5%" y="-5%" width="110%" height="115%"><feDropShadow dx="1.2" dy="1.6" stdDeviation="0.5" floodColor="#a9af9a" /></filter>
        </defs>
        <rect width="1000" height="500" rx="34" fill="#efefef" />
        <g clipPath={`url(#paClip-${id})`}>
          <rect width="1000" height="500" fill="#efefee" />
          <rect width="1000" height="118" fill={`url(#paTop-${id})`} />
          <rect y="383" width="1000" height="117" fill={YELLOW} />
          <path d="M15 455 V461 Q15 485 40 485 H960 Q985 485 985 461 V455" fill="none" stroke={NAVY} strokeWidth="9" />
          <rect x="15" y="13" width="970" height="475" rx="25" fill="none" stroke={`url(#paRim-${id})`} strokeWidth="5" />
        </g>
        <rect x="11" y="9" width="978" height="483" rx="28" fill="none" stroke="#fafafa" strokeWidth="3" />
        {[157, 764].flatMap((x) => [38, 437].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="83" height="20" rx="10" fill={`url(#${y === 38 ? "paSlot" : "paLowerSlot"}-${id})`} />))}

        <text
          x="500"
          y="96"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily='var(--font-geist-sans, Arial, sans-serif), ui-sans-serif, system-ui, sans-serif'
          fontWeight={800}
          fontSize="66"
          textLength="493" lengthAdjust="spacingAndGlyphs"
        >
          PENNSYLVANIA
        </text>

        {split ? (
          <>
            <text
              x="392"
              y={serialY}
              textAnchor="end"
              fill={SERIAL}
              stroke="#c8ccc5" strokeWidth="3" paintOrder="stroke"
              fontFamily="var(--font-plate-ny, sans-serif)"
              fontSize={size}
              filter={`url(#paEmboss-${id})`}
              letterSpacing="2"
              textLength={Math.min(330, left.length * 108)} lengthAdjust="spacingAndGlyphs"
            >
              {left}
            </text>
            {keystone(415, 219, 64, 64)}
            <text
              x="507"
              y={serialY}
              textAnchor="start"
              fill={SERIAL}
              stroke="#c8ccc5" strokeWidth="3" paintOrder="stroke"
              fontFamily="var(--font-plate-ny, sans-serif)"
              fontSize={size}
              filter={`url(#paEmboss-${id})`}
              letterSpacing="2"
              textLength={Math.min(425, right.length * 106)} lengthAdjust="spacingAndGlyphs"
            >
              {right}
            </text>
          </>
        ) : (
          <text
            x="500"
            y="362"
            textAnchor="middle"
            fill={SERIAL}
            fontFamily="var(--font-plate-ny, sans-serif)"
            fontSize={size}
            letterSpacing="4"
          >
            {left}
          </text>
        )}

        <text
          x="500"
          y="456"
          textAnchor="middle"
          fill="#111111"
          fontFamily='var(--font-geist-sans, Arial, sans-serif), ui-sans-serif, system-ui, sans-serif'
          fontWeight={700}
          fontSize="68"
          textLength="356" lengthAdjust="spacingAndGlyphs"
        >
          visitPA.com
        </text>
      </svg>
    </div>
  );
}
