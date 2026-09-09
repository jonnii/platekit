"use client";

import BaselinePlate from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";

/** Reference-guided artwork; source and design caveats are in plate-compare/references.ts. */
export default function ConnecticutPlate(props: PlateProps) {
  return (
    <BaselinePlate {...props} state={props.state ?? "Connecticut"}
      name="Connecticut"
      colors={["#7ebee2", "#c7ddeb", "#fff", "#fff"]}
      stops={[0.045, 0.44, 0.67, 1]}
      heading="Connecticut"
      headingFont='"Times New Roman", Times, serif'
      headingWeight={400}
      headingWidth={450}
      headingSize={96}
      headingY={102}
      ink="#10175e"
      footer="Constitution State"
      footerFont='"Times New Roman", Times, serif'
      footerWeight={400}
      footerSize={70}
      footerTextLength={500}
      border="#15266e"
      edgeColor="#e4e6e1"
    >
      <path d="M43 36 L142 38 V94 L128 97 115 97 105 100 92 101 82 106 75 103 62 112 47 119 38 127 30 121 40 115Z" fill="#0c1d68" />
    </BaselinePlate>
  );
}
