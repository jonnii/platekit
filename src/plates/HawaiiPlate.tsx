"use client";

import { useId } from "react";
import BaselinePlate, { PLATE_SANS } from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";

/** Reference-guided artwork; source and design caveats are in plate-compare/references.ts. */
export default function HawaiiPlate(props: PlateProps) {
  const id = useId();
  return (
    <BaselinePlate {...props} state={props.state ?? "Hawaii"}
      name="Hawaii"
      colors={["#f4f5f2"]}
      heading="HAWAII"
      headingFont={PLATE_SANS}
      headingY={107}
      headingSize={76}
      ink="#080a09"
      footer="ALOHA STATE"
      footerSize={57}
    >
      <defs><filter id={`${id}-rainbow`} x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="3.5" /></filter></defs>
      <g transform="translate(4 2)" fill="none" filter={`url(#${id}-rainbow)`}>
        <path d="M50 282.6 A531.8 531.8 0 0 1 947 296.9" stroke="#e70ca8" strokeWidth="18" />
        <path d="M59 336.5 A501.4 501.4 0 0 1 931 341.5" stroke="#f4e211" strokeWidth="43" />
        <path d="M80 394.5 A457.7 457.7 0 0 1 905 388.6" stroke="#00a7f1" strokeWidth="20" />
      </g>
    </BaselinePlate>
  );
}
