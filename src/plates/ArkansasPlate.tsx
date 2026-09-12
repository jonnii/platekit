"use client";

import { useId } from "react";
import BaselinePlate, { PLATE_SANS, PLATE_SERIF } from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";

/** Reference-guided artwork; source and design caveats are in plate-compare/references.ts. */
export default function ArkansasPlate(props: PlateProps) {
  const id = useId();
  return (
    <BaselinePlate {...props} state={props.state ?? "Arkansas"}
      name="Arkansas"
      colors={["#a4d1e4", "#eff0ef"]}
      stops={[0, 0.62]}
      heading="Arkansas"
      headingColor="#821710"
      headingFont={PLATE_SANS}
      headingSize={144}
      headingWidth={540}
      headingWeight={900}
      headingY={122}

      rim={true}
      rimWidth={12}
      serialStroke="#f8f8f2"
      ink="#080d0b"
      footer="The Natural State"
      footerColor="#73140d"
      footerFont={PLATE_SERIF}
      footerSize={57}
      footerTextLength={438}
      separator={true}
    >
      <defs>
        <linearGradient id={`${id}-facet-light`} x2="1" y2="1"><stop stopColor="#fafbf8" /><stop offset="1" stopColor="#babebb" /></linearGradient>
        <linearGradient id={`${id}-facet-shadow`} x2="1" y2="1"><stop stopColor="#969b98" /><stop offset="1" stopColor="#e7e9e5" /></linearGradient>
      </defs>
      <g transform="translate(-45 -7) scale(1.18 1.03)" stroke="#aeb1af" strokeWidth="1" strokeLinejoin="round">
        <path d="M330 230 L373 178 H552 L602 230 465 365Z" fill="#e1e2df" />
        <path d="M330 230 373 178 384 222Z" fill="#c1c4c2" /><path d="M373 178 421 181 384 222Z" fill={`url(#${id}-facet-light)`} />
        <path d="M421 181 461 178 439 228 384 222Z" fill="#b2b5b3" /><path d="M461 178 501 181 483 227 439 228Z" fill={`url(#${id}-facet-light)`} />
        <path d="M501 181 552 178 538 222 483 227Z" fill={`url(#${id}-facet-shadow)`} /><path d="M552 178 602 230 538 222Z" fill="#e4e7e4" />
        <path d="M330 230 384 222 409 295Z" fill={`url(#${id}-facet-light)`} /><path d="M330 230 409 295 465 365Z" fill="#aeb2b0" />
        <path d="M384 222 439 228 465 365Z" fill="#f9faf7" /><path d="M384 222 409 295 465 365Z" fill="#c2c5c2" />
        <path d="M439 228 483 227 465 365Z" fill={`url(#${id}-facet-light)`} /><path d="M483 227 538 222 465 365Z" fill={`url(#${id}-facet-light)`} />
        <path d="M538 222 521 295 465 365Z" fill="#c2c5c2" /><path d="M538 222 602 230 521 295Z" fill="#aeb2b0" />
        <path d="M602 230 521 295 465 365Z" fill="#ebeeeb" />
      </g>
      {props.registrationStickerAreas && <g data-plate-registration-sticker-area=""><rect x="32" y="22" width="105" height="95" rx="4" fill="none" stroke="#6d9fab" opacity=".4" /><rect x="859" y="22" width="105" height="95" rx="4" fill="none" stroke="#6d9fab" opacity=".4" /></g>}
    </BaselinePlate>
  );
}
