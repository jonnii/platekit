"use client";

import PlateFrame from "../internal/PlateFrame.js";
import PlateSvg, { PLATE_INSET_RADIUS, PLATE_OUTLINE } from "../internal/PlateSvg.js";
import Registration, { cleanRegistration } from "../internal/Registration.js";
import { TracedLettering } from "../internal/Lettering.js";
import { BARLOW_CONDENSED_500 } from "../internal/registrationGlyphs.js";
import { DE_MOTTO, DE_NAME } from "../internal/traces/de.js";
import type { PlateProps } from "../types.js";

// Sampled from the official DMV artwork: flat navy field, one gold for rim and lettering.
const NAVY = "#010e38";
const GOLD = "#ba9753";

/** Official Delaware DMV sample; source and design caveats are in tools/artwork/references.ts. */
export default function DelawarePlate({ plate, state = "Delaware", className, style, registrationStickerAreas = false, ...rest }: PlateProps) {
  const cleaned = cleanRegistration(plate);
  // Measured on the DMV sample: SAMPLE inks x 118–880 with caps 245 tall on baseline 355.
  const size = 346 * Math.min(1, 7 / Math.max(7, cleaned.length));
  return (
    <PlateFrame className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }} aria-label={`License plate ${plate} from ${state}`} {...rest}>
      <PlateSvg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
        <title>{`Delaware license plate: ${plate}`}</title>
        <rect {...PLATE_OUTLINE} fill={GOLD} />
        {/* Embossed rim line 15 units in, then the navy field from 23 units in. */}
        <rect x="15" y="15" width="970" height="470" rx="19" fill="none" stroke="#8d7339" strokeWidth="2" />
        <rect x="23" y="23" width="954" height="454" rx={PLATE_INSET_RADIUS} fill={NAVY} />
        {registrationStickerAreas && <g data-plate-registration-sticker-area="">
          <path d="M862 374 H977 V454 Q977 477 954 477 H862Z" fill={GOLD} />
          <text x="918.5" textAnchor="middle" fill={NAVY} fontFamily="var(--font-plate-ny, sans-serif)" fontSize="25">
            <tspan x="918.5" y="411">PLACE</tspan><tspan x="918.5" y="436">STICKER</tspan><tspan x="918.5" y="461">HERE</tspan>
          </text>
        </g>}
        <TracedLettering text="THE FIRST STATE" fill={GOLD} paths={[{ d: DE_MOTTO }]} />
        <Registration face={BARLOW_CONDENSED_500} text={cleaned} x={499} y={355 - (346 - size) * .35} textAnchor="middle" fill={GOLD} fontSize={size} width={Math.min(790, cleaned.length * 135)} />
        <TracedLettering text="DELAWARE" fill={GOLD} paths={[{ d: DE_NAME }]} />
      </PlateSvg>
    </PlateFrame>
  );
}
