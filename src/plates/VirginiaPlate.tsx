"use client";

import BaselinePlate from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";

/** Reference-guided artwork; source and design caveats are in plate-compare/references.ts. */
export default function VirginiaPlate(props: PlateProps) {
  return (
    <BaselinePlate {...props} state={props.state ?? "Virginia"}
      name="Virginia"
      colors={["#eeeeec"]}
      heading="VIRGINIA"
      headingColor="#194f91"
      headingSize={96}
      headingWidth={470}
      headingY={102}
      ink="#0a204e"

      rim={true}
      rimWidth={12}
      serialStroke="#fafaf8"
    >
      <g fill="#111" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="32" aria-label="Virginia is for Lovers">
        <text x="302" y="452" textLength="291" lengthAdjust="spacingAndGlyphs">VIRGINIA IS FOR LO</text>
        <path d="M612 434 C601 418 584 433 595 444 L612 459 629 444 C640 431 622 418 612 434Z" fill="#c82030" transform="translate(0 -7) scale(1 1)" />
        <text x="633" y="452" textLength="65" lengthAdjust="spacingAndGlyphs">ERS</text>
      </g>
    </BaselinePlate>
  );
}
