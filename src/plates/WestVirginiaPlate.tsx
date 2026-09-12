"use client";

import BaselinePlate, { PLATE_SERIF } from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";

/** First artwork pass; source and design caveats are in plate-compare/references.ts. */
export default function WestVirginiaPlate(props: PlateProps) {
  return (
    <BaselinePlate {...props} state={props.state ?? "West Virginia"}
      name="West Virginia"

      rim={true}
      rimWidth={12}
      colors={["#efefec"]}
      heading="West Virginia"
      headingColor="#efb854"
      headingSize={76}
      headingWidth={500}
      headingY={100}
      ink="#172856"
      footer="Wild, Wonderful"
      footerColor="#172856"
      footerFont={PLATE_SERIF}
      footerSize={57}
      footerWidth={440}
    >
      <rect x="25" y="25" width="950" height="97" rx="16" fill="#1e2b59" /><path d="M25 137 H975 M25 444 H271 M730 444 H975" stroke="#e4aa46" strokeWidth="13" /><path d="M25 425 H271 M730 425 H975 M25 462 H271 M730 462 H975" stroke="#243b76" strokeWidth="7" />
      <circle cx="450" cy="265" r="32" fill="none" stroke="#d1d3c9" strokeWidth="3" /><circle cx="450" cy="265" r="24" fill="none" stroke="#d1d3c9" strokeWidth="2" /><path d="M429 282 L440 255 453 275 464 250 472 282Z" fill="#d1d3c9" />
    </BaselinePlate>
  );
}
