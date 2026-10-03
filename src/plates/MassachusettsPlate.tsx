"use client";

import BaselinePlate from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";
import { MA_MOTTO, MA_NAME } from "../internal/traces/ma.js";
import { BEBAS_NEUE_400 } from "../internal/registrationGlyphs.js";

/** Reference-guided artwork; source and design caveats are in plate-compare/references.ts. */
export default function MassachusettsPlate(props: PlateProps) {
  return (
    <BaselinePlate {...props} registrationFace={BEBAS_NEUE_400} state={props.state ?? "Massachusetts"}
      name="Massachusetts"
      colors={["#f5f5f1"]}
      heading={{ text: "Massachusetts", paths: [{ d: MA_NAME }] }}
      headingColor="#155ea0"
      ink="#d31114"
      footer={{ text: "The Spirit of America", paths: [{ d: MA_MOTTO }] }}
      footerColor="#155ea0"
    >
      {props.registrationStickerAreas && <g data-plate-registration-sticker-area=""><rect x="856" y="20" width="104" height="94" rx="3" fill="none" stroke="#c4c4ba" strokeWidth="2" /></g>}
    </BaselinePlate>
  );
}
