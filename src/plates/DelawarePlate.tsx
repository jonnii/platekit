"use client";

import { PLATE_INSET_RADIUS } from "../internal/PlateSvg.js";
import BaselinePlate from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";
import { BARLOW_CONDENSED_500 } from "../internal/registrationGlyphs.js";
import { DE_MOTTO, DE_NAME } from "../internal/traces/de.js";

/** Reference-guided artwork; source and design caveats are in plate-compare/references.ts. */
export default function DelawarePlate(props: PlateProps) {
  return (
    <BaselinePlate {...props} registrationFace={BARLOW_CONDENSED_500} state={props.state ?? "Delaware"}
      name="Delaware"
      colors={["#122442", "#05152e", "#06152e"]}
      stops={[0, 0.22, 1]}
      frame={false}
      edgeColor="#c29a4c"

      heading={{ text: "THE FIRST STATE", paths: [{ d: DE_MOTTO }] }}
      ink="#c29949"
      footer={{ text: "DELAWARE", paths: [{ d: DE_NAME }] }}
      border="#c29949"
    >
      <rect x="10" y="10" width="980" height="480" rx={PLATE_INSET_RADIUS} fill="none" stroke="#c59a49" strokeWidth="20" />
      <rect x="20" y="20" width="960" height="460" rx={PLATE_INSET_RADIUS} fill="none" stroke="#e3c084" strokeWidth="3" />
    </BaselinePlate>
  );
}
