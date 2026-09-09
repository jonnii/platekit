"use client";

import { useId } from "react";
import type { PlateProps } from "../types.js";

const INK = "#334550";

/** To the Stars: the Kansas outline and Capitol's Ad Astra statue. */
export default function KansasPlate({ plate, state = "Kansas", className, style, ...rest }: PlateProps) {
  const id = useId();
  const cleaned = plate.replace(/[\s\-–—]/g, "").toUpperCase();
  const serialSize = Math.min(270, 1890 / Math.max(7, cleaned.length));
  return (
    <div className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }} aria-label={`License plate ${plate} from ${state}`} {...rest}>
      <svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
        <title>{`Kansas license plate: ${plate}`}</title>
        <defs>
          <linearGradient id={`ks-sky-${id}`} x1="0" y1="0" x2="0" y2="500" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7bafbf" /><stop offset=".46" stopColor="#dfe1e4" /><stop offset=".53" stopColor="#e7e5df" /><stop offset=".83" stopColor="#f4cd71" /><stop offset="1" stopColor="#f7c960" />
          </linearGradient>
          <clipPath id={`ks-clip-${id}`}><rect width="1000" height="500" rx="49" /></clipPath>
        </defs>
        <g clipPath={`url(#ks-clip-${id})`}>
          <rect width="1000" height="500" fill={INK} />
          <path d="M51 10 H908 C918 12 915 34 931 27 C941 20 941 29 951 32 Q964 36 956 45 Q947 52 951 64 L962 67 969 77 975 79 990 98 V451 Q990 489 949 491 H51 Q11 491 11 451 V52 Q11 12 51 10Z" fill={`url(#ks-sky-${id})`} />
          <g fill="#fff">
            <rect x="54" y="41" width="125" height="112" /><rect x="822" y="41" width="125" height="112" />
            {[202, 799].flatMap((x) => [57, 443].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="16" />))}
          </g>
          <g fill={INK}>
            <path d="M0 434 Q18 419 43 407 L45 399 49 393 Q43 385 47 377 L49 369 Q60 358 63 356 V347 H61 L59 344 V329 H64 Q67 312 76 307 L80 302 76 298 75 294 79 286 V282 L82 279 V274 H91 V279 L95 282 94 287 99 294 96 301 93 304 Q105 313 108 328 H114 V345 L109 347 V357 Q120 361 121 374 Q126 386 120 394 L124 407 Q174 430 200 500 H0Z" />
            <path d="M82 275 L82 267 84 255 82 248 83 240 80 237 77 240 76 238 81 232 82 229 85 229 88 233 94 229 101 220 105 217 106 219 102 224 97 230 91 239 90 247 93 260 95 267 92 276 90 276 91 267 87 257 85 269 86 276Z" />
            <path d="M80 232 L76 228 80 229 77 224 81 227 79 221 83 226 83 220 85 226 87 223 87 230Z" />
          </g>
          <g fill="none" stroke={INK}>
            <path d="M85 222 Q119 211 106 244 M91 220 L106 219 107 218 M106 219 L109 216" strokeWidth="1" />
            <path d="M50 376 Q48 360 65 359 M109 359 Q124 362 121 376" strokeWidth="1.2" />
            {[51, 54, 57, 60, 113, 116, 119].map((x, i) => <path key={x} d={`M${x} 372 v${-9 - i % 3} m-2 8 4 -7`} strokeWidth=".7" />)}
          </g>
          <g fill={`url(#ks-sky-${id})`}>
            <ellipse cx="33" cy="460" rx="7" ry="5" transform="rotate(-30 33 460)" />
            <ellipse cx="82" cy="456" rx="7" ry="5.5" />
            <ellipse cx="129" cy="461" rx="7" ry="5" transform="rotate(33 129 461)" />
            <ellipse cx="168" cy="473" rx="6.5" ry="3.5" transform="rotate(57 168 473)" />
          </g>
          <text x="500" y="133" textAnchor="middle" fill={INK} stroke={INK} strokeWidth="3" fontFamily="var(--font-plate-ny, sans-serif)" fontSize="135" textLength="438" lengthAdjust="spacingAndGlyphs">KANSAS</text>
          <text x="558" y={383 - (270 - serialSize) * .35} textAnchor="middle" fill="#030404" fontFamily="var(--font-plate-ny, sans-serif)" fontSize={serialSize} textLength={Math.min(724, cleaned.length * 104)} lengthAdjust="spacingAndGlyphs">{cleaned}</text>
          <text x="511" y="467" textAnchor="middle" fill={INK} fontFamily="var(--font-plate-script, cursive), cursive" fontSize="84" textLength="326" lengthAdjust="spacingAndGlyphs">to the stars</text>
        </g>
      </svg>
    </div>
  );
}
