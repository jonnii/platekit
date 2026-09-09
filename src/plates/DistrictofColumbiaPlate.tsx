"use client";

import BaselinePlate, { Star, PLATE_SANS } from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";

/** First artwork pass; source and design caveats are in plate-compare/references.ts. */
export default function DistrictofColumbiaPlate(props: PlateProps) {
  return (
    <BaselinePlate {...props} state={props.state ?? "District of Columbia"}
      name="District of Columbia"
      colors={["#f5f5f4"]}
      heading="DISTRICT OF COLUMBIA"
      headingFont={PLATE_SANS}
      headingSize={65}
      headingWidth={560}
      headingY={86}
      ink="#063580"
      footer="END TAXATION WITHOUT REPRESENTATION"
      footerSize={62}
      footerWidth={940}
      footerY={472}
      footerFont="var(--font-plate-ny, sans-serif)"
      separator={true}
    >
      <path d="M28 111 H972 M32 395 H968" stroke="#e11e2b" strokeWidth="8" />
      <path d="M427 263 H535 M427 302 H535" stroke="#e11222" strokeWidth="20" />
      {[441,481,521].map(x=><Star key={x} x={x} y={218} size={31} fill="#e11222" />)}
    </BaselinePlate>
  );
}
