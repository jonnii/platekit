"use client";

import BaselinePlate, { PLATE_SANS } from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";
import { ROBOTO_CONDENSED_700 } from "../internal/registrationGlyphs.js";

const BLUE = "#053bb7";

/** Official Virginia DMV sample; source and design caveats are in tools/artwork/references.ts. */
export default function VirginiaPlate(props: PlateProps) {
  return (
    <BaselinePlate {...props} registrationFace={ROBOTO_CONDENSED_700} state={props.state ?? "Virginia"}
      name="Virginia"
      colors={["#f8fafb"]}
      // Measured on the DMV sample: caps 28–105 across x 248–768.
      heading="VIRGINIA"
      headingColor={BLUE}
      headingSize={111}
      headingWidth={520}
      headingX={508}
      headingY={105}
      ink="#0a204e"
      serialStroke="#fafaf8"
    >
      {/* Optional decal tabs printed in the top corners. */}
      {props.registrationStickerAreas && <g data-plate-registration-sticker-area="" fontFamily={PLATE_SANS} fontSize="16" textAnchor="middle" fill="#fff">
        <rect x="35" y="50" width="100" height="29" fill={BLUE} /><text x="85" y="70">MONTH</text>
        <rect x="882" y="49" width="101" height="29" fill={BLUE} /><text x="932.5" y="69">YEAR</text>
      </g>}
      {/* Caps 408–442 across x 234–788; the outlined heart replaces the V of LOVERS. */}
      <g fill="#050505" fontFamily={PLATE_SANS} fontWeight="700" fontSize="46" aria-label="Virginia is for Lovers">
        <text x="234" y="442" textLength="436" lengthAdjust="spacingAndGlyphs">VIRGINIA IS FOR LO</text>
        <path d="M691.5 418C688 410 676 408 676 418.5C676 427 685 433 691.5 440C698 433 707 427 707 418.5C707 408 695 410 691.5 418Z" fill="#d41a33" stroke="#050505" strokeWidth="5" strokeLinejoin="round" />
        <text x="713" y="442" textLength="60" lengthAdjust="spacingAndGlyphs">ERS</text>
        <text x="775" y="415" fontSize="11" fontWeight="400">®</text>
      </g>
      <text x="605" y="474" fill="#242526" fontFamily={PLATE_SANS} fontWeight="500" fontSize="29" textLength="175" lengthAdjust="spacingAndGlyphs">Virginia.org</text>
    </BaselinePlate>
  );
}
