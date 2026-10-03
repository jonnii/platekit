"use client";

import PlateFrame from "../internal/PlateFrame.js";
import PlateSvg, { PLATE_INSET_RADIUS, PLATE_OUTLINE } from "../internal/PlateSvg.js";
import { useId } from "react";
import { PlateProps } from "../types.js";
import Registration, { cleanRegistration } from "../internal/Registration.js";
import { TEKO_500 } from "../internal/registrationGlyphs.js";
import { TracedLettering } from "../internal/Lettering.js";
import { MI_NAME, MI_URL } from "../internal/traces/mi.js";

/** Pure Michigan's open brush M, white reflective field, and curved blue footer. */
const BLUE = "#193f97";
/** The footer band is a brighter blue than the lettering ink (median of the 2017 scan's band). */
const BAND_BLUE = "#0b4bbf";

/** The faint security thread behind the M: two sine strands ~98° out of phase. */
const WAVE = [-1, 1].map((side) => {
  const k = (2 * Math.PI) / 120, half = (98 * Math.PI) / 360;
  let d = "";
  for (let y = 130; y <= 410; y += 5) d += `${y > 130 ? "L" : "M"}${(497 + 17 * Math.sin(k * (y - 120) - Math.PI / 2 + side * half)).toFixed(1)} ${y}`;
  return d;
});

export default function MichiganPlate({ plate, state = "Michigan", className, style, ...rest }: PlateProps) {
  const id = useId().replace(/:/g, "");
  const cleaned = cleanRegistration(plate);
  const serialSize = cleaned.length <= 7 ? 300 : Math.round((300 * 7) / cleaned.length);

  return (
    <PlateFrame
      className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }}
      aria-label={`License plate ${plate} from ${state}`} {...rest}
    >
      <PlateSvg
        viewBox="0 0 1000 500"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "auto" }}
      >
        <title>{`Michigan license plate: ${plate}`}</title>
        <defs>
          <clipPath id={`miClip-${id}`}><rect x="16" y="19" width="969" height="463" rx={PLATE_INSET_RADIUS} /></clipPath>
          <linearGradient id={`miRim-${id}`} x2="0" y2="1"><stop stopColor="#9eaaa8" /><stop offset="0.5" stopColor="#f6f7f2" /><stop offset="1" stopColor="#9bacae" /></linearGradient>
          <filter id={`miEmboss-${id}`} x="-5%" y="-5%" width="110%" height="115%"><feDropShadow dx="1" dy="1.8" stdDeviation="0.5" floodColor="#b4b7a4" /></filter>
        </defs>
        <rect {...PLATE_OUTLINE} fill="#f6f6f3" />
        <rect x="16" y="19" width="969" height="463" rx={PLATE_INSET_RADIUS} fill="#f4f5f2" />
        <g clipPath={`url(#miClip-${id})`}>
          <g fill="none" stroke="#c9cbcc" strokeWidth="2.6">{WAVE.map((d, i) => <path key={i} d={d} />)}</g>
          {/* Top edge measured on the 2017 scan: lowest near x≈300, highest near x≈860. */}
          <path d="M15 397 C110 418 230 422 330 422 C430 422 550 413 640 405 C730 397 850 391 986 397 V485 H15 Z" fill={BAND_BLUE} />
        </g>
        <rect x="16" y="19" width="969" height="463" rx={PLATE_INSET_RADIUS} fill="none" stroke={`url(#miRim-${id})`} strokeWidth="2.7" />

        <TracedLettering text="PURE MICHIGAN" fill={BLUE} paths={[{ d: MI_NAME }]} />

        <Registration face={TEKO_500} text={cleaned} x={500} y={368} textAnchor="middle" fill={BLUE} fontSize={serialSize} filter={`url(#miEmboss-${id})`} letterSpacing={5} width={900} />

        <TracedLettering text="michigan.org" fill="#ffffff" paths={[{ d: MI_URL }]} />
      </PlateSvg>
    </PlateFrame>
  );
}
