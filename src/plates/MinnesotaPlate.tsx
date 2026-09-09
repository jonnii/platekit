"use client";

import BaselinePlate, { Pine, PLATE_SERIF } from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";

/** First artwork pass; source and design caveats are in plate-compare/references.ts. */
export default function MinnesotaPlate(props: PlateProps) {
  return (
    <BaselinePlate {...props} state={props.state ?? "Minnesota"}
      hardware="photo"
      shadedSlots={true}
      name="Minnesota"
      colors={["#8dd3e9", "#8dd3e9", "#f6f6f4", "#f6f6f4", "#8dd2f0"]}
      stops={[0, 0.21, 0.235, 0.75, 1]}
      heading="Minnesota"
      headingColor="#07619a"
      headingSize={86}
      headingWidth={570}
      ink="#050b0d"
      footer="10,000 lakes"
      footerColor="#075f94"
      footerFont={PLATE_SERIF}
      footerSize={61}
      separator={true}
      separatorWidth={135}
      separatorX={466}
    >
      <path d="M15 112 H985 Q953 109 930 116 T878 124 Q833 133 878 142 T902 156 Q862 166 809 151 T707 138 L568 137 Q484 143 513 154 T536 169 Q566 181 530 182 Q500 188 423 166 L383 158 329 152 Q322 148 349 143 T372 129 L321 118 H15Z" fill="#8bcee4" />
      <path d="M15 111 Q140 105 242 104 L266 103 289 98 309 98 319 96 337 101 357 98 373 102 398 100 414 95 431 97 444 91 462 99 475 100 487 96 509 98 534 104 558 103 583 98 608 98 632 102 656 102 679 103 703 107 727 106 750 107 773 104 796 103 817 107 840 105 861 109 880 108 H985 V115 Q929 106 888 110 T731 114 T555 110 T344 111 H15Z" fill="#238e7b" />
      {Array.from({length:19},(_,i)=><Pine key={i} x={889+i*5} y={i===17?25:44+i%5*7} size={i===17?88:55+i%3*7} fill="#238e7b" />)}
      <path d="M455 125 Q477 127 513 124 L507 129 458 129Z M470 123 V118 M502 124 V116 M497 119 L507 121" fill="none" stroke="#238e7b" strokeWidth="3" />
      <path d="M422 218 H441 L444 211 449 220 464 220 470 226 479 223 486 229 494 227 502 235 511 234 499 245 488 250 478 263 475 284 476 292 491 303 494 314 H430 L427 267 429 259 424 249Z" fill="#07649e" />
      <text x="80" y="81" fontSize="29" fontFamily={PLATE_SERIF} fill="#075f94" fontWeight="700">EXPLORE</text><text x="794" y="80" fontSize="39" fontFamily={PLATE_SERIF} fill="#075f94" fontWeight="700">.com</text>
    </BaselinePlate>
  );
}
