"use client";

import PlateSvg, { PLATE_INSET_RADIUS, PLATE_OUTLINE } from "../internal/PlateSvg.js";
import { useId } from "react";
import type { PlateProps } from "../types.js";

export default function MontanaPlate({ plate, state = "Montana", className, style, ...rest }: PlateProps) {
  const id = useId().replace(/:/g, "");
  const cleaned = plate.replace(/[\s\-–—]/g, "").toUpperCase();
  const split = /^[A-Z0-9*]{6,7}$/.test(cleaned);
  return (
    <div className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }} aria-label={`License plate ${plate} from ${state}`} {...rest}>
      <PlateSvg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
        <title>{`Montana license plate: ${plate}`}</title>
        <defs>
          <linearGradient id={`mtField-${id}`} x2="0" y2="1"><stop stopColor="#244b82" /><stop offset="0.16" stopColor="#073579" /><stop offset="1" stopColor="#06367e" /></linearGradient>
          <linearGradient id={`mtSlots-${id}`} x2="0" y2="1"><stop stopColor="#b6c1bd" /><stop offset="0.5" stopColor="#eef0e8" /><stop offset="1" stopColor="#a9b4ac" /></linearGradient>
          <linearGradient id={`mtRim-${id}`} x2="0" y2="1"><stop stopColor="#c7d2d3" /><stop offset="0.4" stopColor="#fafaf4" /><stop offset="1" stopColor="#a6b7bb" /></linearGradient>
        </defs>
        <rect {...PLATE_OUTLINE} fill="#f5f5f0" />
        <rect x="12" y="12" width="976" height="476" rx={PLATE_INSET_RADIUS} fill={`url(#mtField-${id})`} stroke={`url(#mtRim-${id})`} strokeWidth="3" />
        {/* State outline follows the Idaho border; the eastern three edges are straight. */}
        <path d="M35 28 H969 V418 H423 V470 Q415 450 403 443 Q390 435 386 455 L366 460 L351 462 L341 459
          Q332 458 325 466 L300 467 Q289 464 286 474 Q284 487 276 476 L272 462 L264 451 L260 438
          Q248 430 239 428 Q229 425 234 415 L230 399 L220 389 L218 372 L208 364 L200 348
          Q191 339 184 352 L168 370 L156 364 L154 355 L158 349 L149 342 Q144 335 156 332
          Q165 331 157 321 Q150 313 160 307 Q167 304 160 287 L161 273 Q173 257 168 253
          Q162 249 149 254 L141 251 L137 246 L126 246 L118 237 L112 223 L102 215 L94 210
          L88 197 L81 194 L70 188 L62 181 Q55 176 55 164 L49 145 L38 129 L35 114 Z"
          fill="none" stroke="#fbfcf5" strokeWidth="7.5" strokeLinejoin="round" strokeLinecap="round" />
        <rect x="865" y="31" width="103" height="68" fill="none" stroke="#e6ebe4" strokeWidth="1" />
        {[157, 765].flatMap((x) => [38, 438].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="83" height="20" rx="10" fill={`url(#mtSlots-${id})`} />))}
        <text x="501" y="71" fill="#fff" textAnchor="middle" fontFamily="var(--font-geist-sans, Arial, sans-serif), sans-serif" fontWeight="800" fontSize="46" textLength="494" lengthAdjust="spacingAndGlyphs">TREASURE STATE</text>
        <g fill="#fff" fontFamily="var(--font-plate-ny, sans-serif)">
          {split ? <>
            <text x="505" y="336" textAnchor="end" fontSize="309" textLength="294" lengthAdjust="spacingAndGlyphs">{cleaned.slice(0, 3)}</text>
            <path d="M543 211 Q531 202 525 208 Q518 209 524 198 L521 196 Q509 211 524 216 L535 219
              Q529 223 535 229 L541 244 L546 257 L550 246 L557 233 Q564 225 559 219
              Q582 216 576 203 L571 196 L568 198 Q576 211 564 209 Q553 203 543 211 Z" />
            <text x="588" y="336" fontSize="309" textLength="343" lengthAdjust="spacingAndGlyphs">{cleaned.slice(3)}</text>
          </> : <text x="568" y="336" textAnchor="middle" fontSize={Math.min(300, 1800 / Math.max(cleaned.length, 1))} letterSpacing="4">{cleaned}</text>}
        </g>
        {/* “10” identifies this blue base's issue year, not a vehicle's county. */}
        <text x="576" y="409" fill="#fff" textAnchor="middle" fontFamily="var(--font-geist-sans, Arial, sans-serif), sans-serif" fontWeight="800" fontSize="65" textLength="554" lengthAdjust="spacingAndGlyphs">MONTANA - 10</text>
      </PlateSvg>
    </div>
  );
}
