"use client";

import BaselinePlate, { PLATE_SERIF } from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";

/** Reference-guided artwork; source and design caveats are in plate-compare/references.ts. */
export default function RhodeIslandPlate(props: PlateProps) {
  return (
    <BaselinePlate {...props} state={props.state ?? "Rhode Island"}
      name="Rhode Island"
      colors={["#f0f1ef"]}
      heading="Rhode Island"
      headingSize={97}
      headingWidth={538}
      headingWeight={400}
      headingY={96}
      hardware="photo"
      shadedSlots={true}
      rim={true}
      rimWidth={12}
      ink="#172b50"
      footer="Ocean State"
      footerFont={PLATE_SERIF}
      footerSize={96}
      footerTextLength={481}
      footerWeight={400}
      footerY={465}
    >
      <path aria-label="Breaking ocean wave" fill="#9dbdc7" fillRule="evenodd" d="M14,343 14,469 21,482 21,499 979,499 979,482 986,472 986,155 910,228 817,296 776,319 717,347 656,369 625,376 584,381 545,381 518,375 488,357 469,335 457,314 449,283 450,262 455,242 474,205 492,185 516,171 540,165 593,163 640,171 676,184 649,164 612,148 567,136 521,131 461,133 390,145 303,169 257,186 214,206 153,242 69,300Z" />
      <g transform="translate(16 0)" stroke="#172b50" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="90" cy="28" r="7" /><path d="M90 36 V98 M77 48 H103 M65 70 Q66 89 90 98 Q114 88 115 70 M59 72 L65 65 73 73 M108 73 L115 65 122 71" /><path d="M90 91 L79 81 V89 L90 98 100 89 V81Z" fill="#172b50" strokeWidth="1" /></g>
      <rect x="855" y="393" width="113" height="87" fill="none" stroke="#c3d0d1" strokeWidth="1.5" />
    </BaselinePlate>
  );
}
