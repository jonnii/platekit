"use client";

import { useId } from "react";
import BaselinePlate from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";

/** Reference-guided artwork; source and design caveats are in plate-compare/references.ts. */
export default function MississippiPlate(props: PlateProps) {
  const id = useId();
  return (
    <BaselinePlate {...props} state={props.state ?? "Mississippi"}
      name="Mississippi"
      colors={["#e9e9e6"]}
      heading="MISSISSIPPI"
      headingColor="#182c54"
      headingSize={80}
      headingWidth={431}
      headingY={84}
      ink="#172d54"
      separator={true}
      separatorWidth={235}
      serialInset={40}
      serialStroke="#fcfcf8"
      hardware="photo"
      shadedSlots={true}
      frame={false}
    >
      <defs><linearGradient id={`${id}-pressed-rim`} x2="0" y2="1"><stop stopColor="#fafbf8" /><stop offset=".75" stopColor="#f8f9f6" /><stop offset=".94" stopColor="#e2e3df" /><stop offset="1" stopColor="#a4a7a2" /></linearGradient></defs>
      <rect x="16" y="16" width="968" height="468" rx="28" fill="none" stroke={`url(#${id}-pressed-rim)`} strokeWidth="15" />
      <rect x="4" y="4" width="992" height="492" rx="34" fill="none" stroke="#efefeb" strokeWidth="6" />
      <g fill="none" stroke="#182c54" strokeWidth="4" strokeLinecap="round">
        <path d="M470 77 C428 52 384 79 398 105 C410 129 455 119 450 92 C444 69 471 58 500 84 C533 114 504 143 469 133 C446 126 456 98 475 95 M528 75 C552 54 588 69 592 94 C598 125 552 132 543 110 C532 86 558 76 562 94" />
      </g>
      <circle cx="501" cy="260" r="107" fill="#111d3b" />
      <g fill="#f5f5ef" stroke="#111d3b" strokeWidth="3" strokeLinejoin="round">
        <path d="M480 271 C448 250 445 224 469 200 L486 189 Q494 184 505 198 C531 214 535 235 513 268Z" />
        <path d="M516 270 Q520 216 550 205 Q578 195 572 220 Q590 250 552 274Z" />
        <path d="M464 271 C430 270 409 246 420 225 Q430 211 456 224 Q452 250 476 267Z" />
        <path d="M478 287 C460 299 435 307 413 296 C389 282 409 260 432 260 L465 265Z" />
        <path d="M518 287 C537 309 566 307 591 291 C608 265 581 255 557 263 L530 270Z" />
        <path d="M477 285 Q473 297 459 306 Q453 318 479 326 Q508 336 534 319 Q536 306 516 287Z" />
        <path d="M475 267 Q485 231 500 250 L511 267Z" fill="#d69e24" />
        <path d="M458 263 Q479 274 500 267 Q516 256 537 267 Q521 293 498 294 Q475 299 458 263Z" />
      </g>
      <path d="M462 221 L476 201 M506 225 Q515 244 504 258 M532 257 L552 236 M549 266 Q568 249 569 225 M456 263 L432 247 M462 280 L434 281 M472 289 Q455 302 436 297 M527 287 Q543 299 568 295 M493 295 L489 311 M503 295 L505 308 M470 319 L489 324 M501 326 L520 322" fill="none" stroke="#111d3b" strokeWidth="1.8" strokeLinecap="round" />
      {/* County remains unassigned; this base has no printed decal box. */}
    </BaselinePlate>
  );
}
