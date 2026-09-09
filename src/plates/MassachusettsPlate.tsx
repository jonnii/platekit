"use client";

import BaselinePlate from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";

/** Reference-guided artwork; source and design caveats are in plate-compare/references.ts. */
export default function MassachusettsPlate(props: PlateProps) {
  return (
    <BaselinePlate {...props} state={props.state ?? "Massachusetts"}
      name="Massachusetts"
      colors={["#f5f5f1"]}
      heading="Massachusetts"
      headingFont='Georgia, "Times New Roman", serif'
      headingStyle="italic"
      headingSize={88}
      headingWidth={510}
      headingY={88}
      headingColor="#155ea0"
      ink="#d31114"
      footer="The Spirit of America"
      footerColor="#155ea0"
      footerFont='Georgia, "Times New Roman", serif'
      footerStyle="italic"
      footerSize={60}
      footerTextLength={505}
    >
      <rect x="856" y="20" width="104" height="94" rx="3" fill="none" stroke="#c4c4ba" strokeWidth="2" />
    </BaselinePlate>
  );
}
