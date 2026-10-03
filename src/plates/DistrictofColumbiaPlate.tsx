"use client";

import PlateFrame from "../internal/PlateFrame.js";
import PlateSvg, { PLATE_INSET_RADIUS, PLATE_OUTLINE } from "../internal/PlateSvg.js";
import Registration, { cleanRegistration } from "../internal/Registration.js";
import { Star } from "../internal/BaselinePlate.js";
import { BARLOW_CONDENSED_700, UNITS_PER_EM } from "../internal/registrationGlyphs.js";
import type { PlateProps } from "../types.js";

const NAVY = "#0b1f66";
const RED = "#d21f2b";
const CONDENSED = "var(--font-plate-ny, sans-serif)";
// Measured on the official DMV sample: SA|MPLE fills x 50–979 (kept inside the 960 frame limit) with caps 241 tall on baseline 377,
// and the flag starts at the left group's ink (its last advance includes side bearing).
const LEFT = 50, RIGHT = 960, GAP = 167, FLAG = -2, FLAG_WIDTH = 112, SIZE = 346, BASELINE = 377;

const advance = (text: string) => [...text].reduce((sum, char) => sum + (BARLOW_CONDENSED_700.glyphs[char]?.[0] ?? 500), 0);

/** Official DC DMV sample; source and design caveats are in tools/artwork/references.ts. */
export default function DistrictofColumbiaPlate({ plate, state = "District of Columbia", className, style, ...rest }: PlateProps) {
  const cleaned = cleanRegistration(plate);
  // Standard issue is two letters then four digits (AB 1234), split by the flag; longer runs split in half.
  const cut = cleaned.length <= 6 ? Math.min(2, cleaned.length) : Math.ceil(cleaned.length / 2);
  const left = cleaned.slice(0, cut), right = cleaned.slice(cut);
  const size = SIZE * Math.min(1, 7 / Math.max(7, cleaned.length));
  const baseline = BASELINE - (SIZE - size) * .35;
  const em = size / UNITS_PER_EM;
  // Groups keep their measured spacing around the flag and narrow together when the run is long.
  const squeeze = Math.min(1, (RIGHT - LEFT - GAP) / Math.max(1, (advance(left) + advance(right)) * em));
  const leftWidth = advance(left) * em * squeeze, rightWidth = advance(right) * em * squeeze;
  const start = LEFT + (RIGHT - LEFT - (leftWidth + GAP + rightWidth)) / 2;
  // With no registration the flag keeps its sample position.
  const flag = cleaned ? start + leftWidth + FLAG + FLAG_WIDTH / 2 : 355;

  return (
    <PlateFrame className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }} aria-label={`License plate ${plate} from ${state}`} {...rest}>
      <PlateSvg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
        <title>{`District of Columbia license plate: ${plate}`}</title>
        <rect {...PLATE_OUTLINE} fill="#f6f6f4" />
        <rect x="12" y="12" width="976" height="476" rx={PLATE_INSET_RADIUS} fill="none" stroke="#777" strokeOpacity=".25" strokeWidth="3" />
        <path d="M20 106.5 H985 M16 404 H986" stroke={RED} strokeWidth="7" />
        <text x="498.5" y="79.5" textAnchor="middle" fill={NAVY} fontFamily={CONDENSED} fontSize="82" textLength="507" lengthAdjust="spacingAndGlyphs">WASHINGTON, DC</text>
        <text x="503" y="481" textAnchor="middle" fill={NAVY} fontFamily={CONDENSED} fontSize="86" textLength="964" lengthAdjust="spacingAndGlyphs">END TAXATION WITHOUT REPRESENTATION</text>
        <g data-dc-flag="" fill={RED}>
          {[-39.5, 0, 40].map((dx) => <Star key={dx} x={flag + dx} y={211} size={31} fill={RED} />)}
          <rect x={flag - FLAG_WIDTH / 2} y="244" width={FLAG_WIDTH} height="21" />
          <rect x={flag - FLAG_WIDTH / 2} y="286" width={FLAG_WIDTH} height="21" />
        </g>
        <g fill={NAVY}>
          <Registration face={BARLOW_CONDENSED_700} text={left} x={start} y={baseline} fontSize={size} width={leftWidth} />
          {right && <Registration face={BARLOW_CONDENSED_700} text={right} x={start + leftWidth + GAP} y={baseline} fontSize={size} width={rightWidth} />}
        </g>
      </PlateSvg>
    </PlateFrame>
  );
}
