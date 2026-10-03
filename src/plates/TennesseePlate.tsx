"use client";

import { PLATE_INSET_RADIUS, PLATE_OUTLINE } from "../internal/PlateSvg.js";
import BaselinePlate, { Star } from "../internal/BaselinePlate.js";
import { TracedLettering } from "../internal/Lettering.js";
import type { PlateProps } from "../types.js";
import { BARLOW_CONDENSED_500 } from "../internal/registrationGlyphs.js";
import { TN_MOTTO, TN_NAME } from "../internal/traces/tn.js";

/** Reference-guided artwork; source and design caveats are in plate-compare/references.ts. */
export default function TennesseePlate(props: PlateProps) {
  return (
    <BaselinePlate {...props} registrationFace={BARLOW_CONDENSED_500} state={props.state ?? "Tennessee"}
      name="Tennessee"
      colors={["#172652"]}
      heading={{ text: "TENNESSEE", paths: [{ d: TN_NAME }] }}
      headingColor="#fff"
      ink="#fff"
      footer="TNVACATION.COM"
      footerSize={32}
      footerTextLength={446}
      footerWeight={500}
      footerY={400}
      separator={true}
      separatorWidth={135}
      serialInset={48}
      separatorX={436}
      frame={false}

    >
      <rect {...PLATE_OUTLINE} fill="#f5f5f2" />
      <rect x="23" y="23" width="954" height="454" rx={PLATE_INSET_RADIUS} fill="#172652" stroke="#8993a4" strokeWidth="6" />
      <rect x="31" y="31" width="938" height="438" rx={PLATE_INSET_RADIUS} fill="none" stroke="#f5f5f2" strokeWidth="5" />
      <path d="M315 29 Q311 46 300 54 L294 70 286 82 278 90 274 105 Q264 117 276 121 H658 Q665 121 670 110 L681 98 692 91 701 74 711 64 722 57 730 40 730 29Z" fill="none" stroke="#fff" strokeWidth="3" />
      <circle cx="437" cy="264" r="57" fill="none" stroke="#e43358" strokeWidth="7" />
      <circle cx="437" cy="264" r="53" fill="none" stroke="#fff" strokeWidth="4" />
      <Star x={419} y={243} size={44} fill="#fff" /><Star x={426} y={285} size={44} fill="#fff" /><Star x={460} y={256} size={44} fill="#fff" />
      <TracedLettering text="THE VOLUNTEER STATE" paths={[{ d: TN_MOTTO }]} fill="#fff" />
      {props.registrationStickerAreas && <g data-plate-registration-sticker-area=""><rect x="259" y="404" width="480" height="70" fill="#f2f2ee" /></g>}
    </BaselinePlate>
  );
}
