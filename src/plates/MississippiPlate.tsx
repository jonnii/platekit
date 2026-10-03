"use client";

import { PLATE_OUTLINE } from "../internal/PlateSvg.js";
import BaselinePlate from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";
import { BARLOW_CONDENSED_500 } from "../internal/registrationGlyphs.js";
import { MS_NAME } from "../internal/traces/ms.js";

const NAVY = "#0a2140";

/** Reference-guided artwork; source and design caveats are in plate-compare/references.ts. */
export default function MississippiPlate(props: PlateProps) {
  return (
    <BaselinePlate {...props} registrationFace={BARLOW_CONDENSED_500} state={props.state ?? "Mississippi"}
      name="Mississippi"
      colors={["#ffffff"]}
      heading={{ text: "MISSISSIPPI", paths: [{ d: MS_NAME }] }}
      headingColor={NAVY}
      ink={NAVY}
      separator={true}
      separatorX={489}
      separatorWidth={214}
      serialInset={26}
      serialY={356}
      frame={false}
    >
      {/* The DOR flat art has a thin navy keyline at the plate edge. */}
      <rect {...PLATE_OUTLINE} fill="none" stroke="#1f3762" strokeWidth="3" />
      <circle cx="489" cy="248" r="106" fill={NAVY} />
      <g fill="#fff" stroke={NAVY} strokeWidth="3" strokeLinejoin="round">
        <path d="M466 258 C450 252 430 246 420 240 C406 232 402 220 410 214 C418 206 436 204 452 212Z" />
        <path d="M512 256 C526 252 540 250 548 246 C561 238 564 224 562 212 C561 200 558 192 554 190 C540 190 522 194 512 204Z" />
        <path d="M458 258 C440 251 420 247 405 252 C390 258 388 268 394 272 C404 282 430 287 456 282 C466 280 470 270 458 258Z" />
        <path d="M518 258 C536 251 556 248 572 253 C587 259 590 268 584 273 C574 283 548 289 524 287 C512 285 508 270 518 258Z" />
        <path d="M454 280 C446 290 446 304 458 313 C470 320 492 320 505 316 C519 311 527 298 522 282Z" />
        <path d="M480 262 C462 258 450 248 446 230 C442 208 458 186 477 171 C494 180 506 196 508 216 C511 238 500 256 480 262Z" />
        <path d="M450 246 C462 254 474 256 486 254 C500 252 512 250 524 251 C520 268 504 280 487 280 C468 280 454 266 450 246Z" />
        <path d="M467 248 C470 240 476 235 482 231 C489 235 495 241 498 247 C488 252 476 252 467 248Z" fill="#eec719" />
      </g>
      <path d="M455 208 Q451 225 458 242 M498 196 Q505 218 497 240 M540 214 L522 238 M476 284 L478 302 M500 284 L497 302 M420 268 L452 266 M528 268 L566 268" fill="none" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" />
      {/* County remains unassigned: the reference's OKTIBBEHA line is sample text, so the field is left blank. */}
    </BaselinePlate>
  );
}
