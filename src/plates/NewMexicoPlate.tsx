"use client";

import BaselinePlate, { PLATE_SANS } from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";

/** First artwork pass; source and design caveats are in plate-compare/references.ts. */
export default function NewMexicoPlate(props: PlateProps) {
  return (
    <BaselinePlate {...props} state={props.state ?? "New Mexico"}
      shadedSlots={true}
      hardware="photo"
      name="New Mexico"
      colors={["#239bb6", "#2595b7", "#0086aa", "#008db5", "#0083ac"]}
      stops={[0, 0.16, 0.19, 0.72, 1]}
      heading="LAND OF ENCHANTMENT"
      headingColor="#f9d32c"
      headingFont={PLATE_SANS}
      headingSize={40}
      headingWidth={520}
      headingY={77}
      ink="#ffdb24"
      footer="NEW MEXICO USA"
      footerColor="#fff"
      footerSize={55}
      footerY={418}
      separator={true}
      separatorWidth={230}
      frame={false}
      edgeColor="#168caa"
    >
      <g transform="translate(0 -25)">
      <rect x="466" y="221" width="68" height="68" rx="20" fill="#f8d742" />
      {[[-1,0],[1,0],[0,-1],[0,1]].map(([dx,dy])=><g key={dx+','+dy} stroke="#f8d742" strokeWidth="10" strokeLinecap="round">{[-22,-8,8,22].map((v,i)=><path key={v} d={dx?`M${500+dx*22} ${255+v} h${dx*(i===0||i===3?60:79)}`:`M${500+v} ${255+dy*22} v${dy*(i===0||i===3?60:79)}`} />)}</g>)}
      <circle cx="500" cy="255" r="28" fill="#ac350c" stroke="#f7d33b" strokeWidth="5" />
      </g>
      <rect x="16" y="15" width="967" height="468" rx="32" stroke="#165869" strokeWidth="19" fill="none"/>
      <rect x="16" y="15" width="967" height="468" rx="32" stroke="#e5d552" strokeWidth="10" fill="none"/>
      <rect x="16" y="15" width="967" height="468" rx="32" stroke="#fff378" strokeWidth="3" fill="none"/>
    </BaselinePlate>
  );
}
