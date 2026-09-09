"use client";

import BaselinePlate, { PLATE_SANS } from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";

/** First artwork pass; source and design caveats are in plate-compare/references.ts. */
export default function IowaPlate(props: PlateProps) {
  return (
    <BaselinePlate {...props} state={props.state ?? "Iowa"}
      hardware="photo"
      rim={true}
      rimWidth={11}
      name="Iowa"
      colors={["#e8eaeb"]}
      stops={[0, 0.25]}
      heading="IOWA"
      ink="#070b09"
      headingFont={PLATE_SANS}
      headingColor="#efeeeb"
      headingSize={90}
      headingY={128}
    >
      <rect x="28" y="28" width="944" height="445" rx="25" fill="#426837" />
      <path d="M53 28 H947 Q972 28 972 53 V246 H28 V53 Q28 28 53 28Z" fill="#8bc4d1" />
      <path d="M63 46 H937 Q954 46 954 63 V146 H46 V63 Q46 46 63 46Z" fill="#25829e" />
      
      <path d="M29 140 H952 V397 H46 V140Z" fill="#e7e8e8" />
      <path d="M56 154 V102 L70 102 Q68 75 83 71 V60 H88 V71 Q101 76 104 102 H112 V154 M128 154 V59 H169 V154 M181 154 V112 H204 V121 H229 V87 H250 V154 M273 154 V107 H323 V154 M718 154 V106 L749 81 809 74 851 88 879 127 V154 M901 154 V78 L923 54 945 78 V154" fill="#e7e8e8" />
      <path d="M699 159 L705 81 M705 81 L672 66 699 85 720 60 706 83 727 113Z" stroke="#e7e8e8" strokeWidth="4" fill="#e7e8e8" />
      <rect x="46" y="393" width="908" height="62" fill="#9cab08" />
      {Array.from({length:110},(_,i)=><path key={i} d={`M${48+i*8.2} 410 l${i%2?5:-4} -${22+i%5*5}`} stroke={i%3?'#bcc53d':'#e4e5b8'} strokeWidth="3" />)}
      <rect x="349" y="420" width="300" height="45" rx="3" fill="#9cab08" />
    </BaselinePlate>
  );
}
