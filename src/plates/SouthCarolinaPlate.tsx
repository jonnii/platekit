"use client";

import { PLATE_INSET_RADIUS } from "../internal/PlateSvg.js";
import BaselinePlate, { PLATE_SERIF, Star } from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";

/** First artwork pass; source and design caveats are in plate-compare/references.ts. */
export default function SouthCarolinaPlate(props: PlateProps) {
  return (
    <BaselinePlate {...props} state={props.state ?? "South Carolina"}
      name="South Carolina"
      colors={["#fff"]}
      heading="Where the Revolutionary War Was Won"
      headingSize={33}
      headingY={85}
      headingWidth={840}
      ink="#030303"
      footer="South Carolina"
      footerFont={PLATE_SERIF}
      footerSize={76}
      footerY={459}
      serialX={627}
      serialWidth={650}
      frame={false}
      hardware="round"
      rim={true}
      rimWidth={10}
    >
      <rect x="12" y="12" width="976" height="476" rx={PLATE_INSET_RADIUS} fill="none" stroke="#a4edf0" strokeWidth="3" />
      <path d="M24 20 H976" stroke="#205c97" strokeWidth="7" />
      <rect x="836" y="386" width="120" height="80" rx="4" fill="none" stroke="#171717" strokeWidth="2" />
      <path d="M21 108 H982" stroke="#c83436" strokeWidth="8" />
      <g transform="translate(-4 -4) scale(1.05)">
      <rect x="42" y="133" width="207" height="210" fill="#d73a49" stroke="#1b4c8f" strokeWidth="2" /><path d="M43 264 Q128 117 248 190 V342 H43Z" fill="#f4f4f1" />
      <path d="M45 244 Q104 147 187 155 L186 245 Q108 245 48 293Z" fill="#234e8e" /><path d="M163 166 A28 28 0 1 0 178 199 A22 22 0 1 1 163 166" fill="#fff" />
      {[[52, 225], [70, 210], [92, 195], [198, 178], [222, 185], [244, 195]].map(([x, y]) => <Star key={x} x={x} y={y} size={15} fill="#fff" />)}
      <path d="M194 137 V336" stroke="#a28351" strokeWidth="4" /><path d="M137 337 L154 313 184 321 207 335Z" fill="#8d8c80" />
      <circle cx="168" cy="238" r="9" fill="#c8b691" /><path d="M157 247 L174 246 179 270 165 284 149 268Z" fill="#2a4f85" /><path d="M154 251 L139 230 144 216 M173 252 L194 221 M164 279 L148 316 M174 280 L185 316" stroke="#bba787" strokeWidth="9" fill="none" />
      <text x="119" y="255" transform="rotate(-24 119 255)" textAnchor="middle" fontFamily={PLATE_SERIF} fontSize="22" fontWeight="700" fill="#fff">LIBERTY</text>
      </g>
    </BaselinePlate>
  );
}
