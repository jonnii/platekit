"use client";

import BaselinePlate, { PLATE_SANS } from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";

/** Reference-guided artwork; source and design caveats are in plate-compare/references.ts. */
export default function DelawarePlate(props: PlateProps) {
  return (
    <BaselinePlate {...props} state={props.state ?? "Delaware"}
      name="Delaware"
      colors={["#122442", "#05152e", "#06152e"]}
      stops={[0, 0.22, 1]}
      frame={false}
      edgeColor="#c29a4c"
      hardware="photo"
      slotYs={[37, 435]}
      heading="THE FIRST STATE"
      headingFont={PLATE_SANS}
      headingSize={49}
      headingWidth={475}
      headingY={76}
      ink="#c29949"
      footer="DELAWARE"
      footerSize={65}
      border="#c29949"
    >
      <rect x="10" y="10" width="980" height="480" rx="26" fill="none" stroke="#c59a49" strokeWidth="20" />
      <rect x="20" y="20" width="960" height="460" rx="20" fill="none" stroke="#e3c084" strokeWidth="3" />
    </BaselinePlate>
  );
}
