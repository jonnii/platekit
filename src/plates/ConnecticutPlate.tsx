"use client";

import BaselinePlate from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";
import { CT_NAME, CT_STATE } from "../internal/traces/ct.js";
import { BARLOW_CONDENSED_500 } from "../internal/registrationGlyphs.js";

/** Reference-guided artwork; source and design caveats are in plate-compare/references.ts. */
export default function ConnecticutPlate(props: PlateProps) {
  return (
    <BaselinePlate {...props} registrationFace={BARLOW_CONDENSED_500} state={props.state ?? "Connecticut"}
      name="Connecticut"
      colors={["#7ebee2", "#c7ddeb", "#fff", "#fff"]}
      stops={[0.045, 0.44, 0.67, 1]}
      heading={{ text: "Connecticut", paths: [{ d: CT_NAME }] }}
      ink="#10175e"
      footer="Constitution State"
      footerFont='"Times New Roman", Times, serif'
      footerWeight={400}
      footerSize={70}
      footerTextLength={500}
      border="#15266e"
      edgeColor="#e4e6e1"
    >
      <path d={CT_STATE} fill="#0c1d68" fillRule="evenodd" />
    </BaselinePlate>
  );
}
