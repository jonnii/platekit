"use client";

import { PLATE_INSET_RADIUS, PLATE_OUTLINE } from "../internal/PlateSvg.js";
import { useId } from "react";
import BaselinePlate, { PLATE_SERIF } from "../internal/BaselinePlate.js";
import MaineIllustration from "../internal/MaineIllustration.js";
import type { PlateProps } from "../types.js";

/** Reference-guided artwork; source and design caveats are in plate-compare/references.ts. */
export default function MainePlate(props: PlateProps) {
  const id = useId();
  return (
    <BaselinePlate {...props} state={props.state ?? "Maine"}
      shadedSlots={true}
      hardware="photo"
      rim={true}
      rimWidth={5}
      name="Maine"
      colors={["#f7f8f4"]}
      heading="MAINE"
      headingSize={88}
      ink="#080c09"
      footer="Vacationland"
      footerColor="#061b14"
      footerFont={PLATE_SERIF}
      footerSize={59}
      serialX={570}
      serialWidth={730}
      frame={false}
    >
      <defs><linearGradient id={`me-rim-${id}`} x2="0" y2="1"><stop stopColor="#eef0ec" /><stop offset=".9" stopColor="#eef0ec" /><stop offset="1" stopColor="#999d9a" /></linearGradient></defs>
      <MaineIllustration />
      <rect x="17" y="17" width="966" height="466" rx={PLATE_INSET_RADIUS} fill="none" stroke="#242826" strokeWidth="10" />
      <rect x="23" y="23" width="954" height="454" rx={PLATE_INSET_RADIUS} fill="none" stroke="#9fa9a2" strokeWidth="4" />
      <rect x="9" y="9" width="982" height="482" rx={PLATE_OUTLINE.rx} fill="none" stroke={`url(#me-rim-${id})`} strokeWidth="5" />
    </BaselinePlate>
  );
}
