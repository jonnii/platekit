"use client";

import PlateSvg, { PLATE_INSET_RADIUS, PLATE_OUTLINE } from "../internal/PlateSvg.js";
import { useId } from "react";
import { PlateProps } from "../types.js";

const SERIAL = "#25274f";
const RIBBON = "#9d484b";

/** Repeatable irregularity keeps the illustration stable across server/client renders. */
function variation(n: number) {
  return ((n * 73 + 19) % 101) / 101;
}

const grain = Array.from({ length: 8 }, (_, n) => {
  const y = 34 + n * 4.5;
  return `M10 ${y} Q1 ${y - 1} 3 ${y - 8} Q10 ${y - 6} 10 ${y} M10 ${y} Q19 ${y - 1} 17 ${y - 8} Q10 ${y - 6} 10 ${y}`;
}).join(" ");

// Batch fine foliage into five reusable paths instead of hundreds of SVG nodes.
const canopy = Array.from({ length: 5 }, (_, shade) =>
  Array.from({ length: 140 }, (_, cluster) => {
    const n = cluster * 5 + shade;
    const angle = n * 2.399963;
    const radius = Math.sqrt((n + 0.5) / 700) * (0.96 + 0.04 * Math.sin(angle * 7));
    const x = 887 + Math.cos(angle) * radius * 138;
    const y = 169 + Math.sin(angle) * radius * 96;
    const size = 3 + variation(n) * 4;
    return `M${x - size} ${y} q${-size / 3} ${-size} ${size / 2} ${-size} q${size / 2} ${-size} ${size} ${-size / 3} q${size} ${-size / 2} ${size} ${size / 2} q${size / 2} ${size} ${-size / 2} ${size} q${-size / 2} ${size} ${-size} ${size / 2} Z`
      .replace(/-?\d+\.\d+/g, (value) => Number(value).toFixed(1));
  }).join(" "),
);

/** The illustrated Sunrise in Ohio base, retaining its skyline, river and farm scene. */
export default function OhioPlate({ plate, state = "Ohio", className, style, ...rest }: PlateProps) {
  const id = useId();
  const cleaned = plate.replace(/[\s\-–—]/g, "").toUpperCase();
  return (
    <div className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }}
      aria-label={`License plate ${plate} from ${state}`} {...rest}>
      <PlateSvg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" role="img"
        preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
        <title>{`Ohio license plate: ${plate}`}</title>
        <defs>
          <linearGradient id={`ohSky-${id}`} x1="0" y1="0" x2="0" y2="330" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#a3b4d4" /><stop offset="1" stopColor="#e8edf1" />
          </linearGradient>
          <linearGradient id={`ohField-${id}`} x1="0" y1="320" x2="0" y2="488" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f2e3b2" /><stop offset="0.45" stopColor="#e9cd91" />
            <stop offset="0.65" stopColor="#c6a17a" /><stop offset="1" stopColor="#b99874" />
          </linearGradient>
          <linearGradient id={`ohSlot-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d8dbd4" /><stop offset="0.45" stopColor="#f7f8f3" /><stop offset="1" stopColor="#cdd1c9" />
          </linearGradient>
          <linearGradient id={`ohLowerSlot-${id}`} x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0" stopColor="#c6c6c3" /><stop offset="0.45" stopColor="#b7b8b5" /><stop offset="1" stopColor="#879493" />
          </linearGradient>
          <clipPath id={`ohClip-${id}`}><rect x="14" y="14" width="972" height="472" rx={PLATE_INSET_RADIUS} /></clipPath>
          <clipPath id={`ohHills-${id}`}>
            <path d="M14 261 Q46 249 89 265 Q150 268 193 260 Q221 253 248 267 Q291 251 335 270 Q382 267 420 282 L459 291 Q515 260 561 268 Q602 250 645 259 Q690 241 725 250 Q759 241 795 258 Q850 249 896 257 Q951 251 986 270 V375 H14 Z" />
          </clipPath>
          <symbol id={`ohWheat-${id}`} viewBox="0 0 20 100">
            <path d="M10 100 Q14 69 10 24 M10 70 Q2 57 0 61 M11 79 Q20 63 20 69" fill="none" stroke="#f7e0a1" strokeWidth="1.2" />
            <path d={grain} fill="#f7e0a1" />
            <path d="M10 31 L10 20 M5 34 L2 23 M15 34 L18 23" fill="none" stroke="#f7e0a1" strokeWidth="0.8" />
          </symbol>
        </defs>
        <rect {...PLATE_OUTLINE} fill="#f9faf5" stroke="#d3d8d0" strokeWidth="2" />
        <g clipPath={`url(#ohClip-${id})`}>
          <rect width="1000" height="500" fill={`url(#ohSky-${id})`} />
          {/* Pale sky facets widen behind the white rays toward the horizon. */}
          <path d="M191 14 H698 L875 290 H14 Z" fill="#bbc6e4" />
          <path d="M331 14 H556 L874 290 H14 Z" fill="#dde3f1" />
          <circle cx="447" cy="273" r="213" fill="#f3d991" />
          <g fill="#ffffff" opacity="0.94">
            {[
              [[40, 14], [14, 43]], [[14, 148], [14, 191]], [[14, 244], [14, 265]],
              [[190, 14], [231, 14]], [[331, 14], [359, 14]],
              [[430, 14], [457, 14]], [[528, 14], [556, 14]],
              [[662, 14], [698, 14]], [[850, 14], [926, 14]],
              [[986, 89], [986, 135]], [[986, 203], [986, 235]],
            ].map(([a, b], n) => <path key={n} d={`M447 290 L${a[0]} ${a[1]} L${b[0]} ${b[1]} Z`} />)}
          </g>

          {/* A muted skyline stays behind the registration at the left horizon. */}
          <g fill="#aab1b1">
            <path d="M14 263 V153 H22 V141 H28 V130 H34 V118 H39 V104 H41 V118 H48 V132 H55 V145 H61 V170 H68 V197 H74 V207 H84 V181 H94 V193 H104 V205 H112 V194 H124 V207 H137 V190 H152 V185 H165 V202 H178 V214 H190 V206 H201 V226 H212 V217 H224 V245 H235 V263 Z" />
            <path d="M25 151 V240 M43 145 V247 M57 180 V243 M148 199 V253" fill="none" stroke="#c4c9c3" strokeWidth="2" />
          </g>
          <circle cx="447" cy="290" r="50" fill="#e9a17c" stroke="#fff7db" strokeWidth="3" />
          <g clipPath={`url(#ohHills-${id})`}>
            <rect x="14" y="240" width="972" height="140" fill="#bdd795" />
            {Array.from({ length: 9 }, (_, row) => (
              <path key={row} fill={row % 2 ? "#a8c585" : "#d1e1a5"} opacity="0.85"
                d={Array.from({ length: 35 }, (_, col) => {
                  const x = col * 29 + variation(row * 35 + col) * 20;
                  const y = 253 + row * 12 + variation(col * 3 + row) * 12;
                  return `M${x} ${y} q8 -7 18 -2 l9 2 -3 4 -13 -1 -5 4 -12 -2 Z`;
                }).join(" ")} />
            ))}
          </g>

          {/* River bends toward the viewer, between the hill and the wheat. */}
          <path d="M366 317 Q294 319 222 328 Q118 346 14 333 V406 Q68 402 108 374 Q146 353 239 341 Q312 329 366 321 Z" fill="#85a3ca" />
          <g fill="none" stroke="#f6f8ed" strokeWidth="2.3">
            <path d="M14 355 Q63 360 108 346 Q207 328 317 322" />
            <path d="M14 379 Q67 374 98 360 Q151 346 221 341" />
            <path d="M14 407 Q41 405 60 387 Q79 374 114 367" />
          </g>
          <path d="M14 409 Q103 395 172 353 Q236 323 364 321 Q520 317 654 323 Q787 319 885 340 L986 354 V500 H14 Z" fill={`url(#ohField-${id})`} />
          {Array.from({ length: 10 }, (_, row) => (
            <path key={row} fill={row < 5 ? "#fff4ce" : "#f3dda5"} opacity={row < 5 ? 0.9 : 0.65}
              d={Array.from({ length: 40 }, (_, col) => {
                const x = 160 - row * 14 + col * (22 + row * 0.3) + variation(col * 7 + row) * 13;
                const y = 324 + row * 9 + variation(col + row * 13) * 7;
                return `M${x} ${y} q4 -5 11 -3 l9 3 -2 3 -9 -2 -6 2 Z`;
              }).join(" ")} />
          ))}
          <g>
            {Array.from({ length: 55 }, (_, n) => {
              const x = 8 + n * 18;
              const height = 78 + variation(n) * 31;
              return <use key={n} href={`#ohWheat-${id}`} x={x} y={497 - height} width="17" height={height}
                transform={`rotate(${(variation(n * 3) - 0.5) * 38} ${x + 8.5} 497)`} />;
            })}
          </g>

          {/* Oak canopy, branching trunk, child on a rope swing, and dog. */}
          <g fill="#8fa18c">
            <path d="M858 340 Q888 324 883 285 L875 229 L854 197 L830 184 L808 165 L834 179 L864 193 L864 168 L872 201 L886 222 L899 183 L914 161 L902 194 L894 230 L900 272 L920 236 L951 214 L930 238 L909 284 L908 320 L925 338 Z" />
            <path d="M852 322 Q885 319 914 330 Q955 336 986 333 V371 Q931 375 890 357 L860 352 Z" fill="#a5c586" />
            {canopy.map((d, shade) => <path key={shade} d={d} opacity={0.75 + shade * 0.05} />)}
          </g>
          <g stroke="#80987b" fill="#80987b">
            <path d="M976 230 L950 294 M962 228 L940 291" fill="none" strokeWidth="1.5" />
            <circle cx="949" cy="274" r="5" />
            <path d="M946 280 L941 291 L949 296 L948 304 L942 313 M944 292 L938 303 L939 313 M946 283 L954 272" fill="none" strokeWidth="4" strokeLinecap="round" />
            <path d="M938 293 L952 298" strokeWidth="3" />
            <path d="M960 324 L968 317 L980 320 L986 316 L990 320 L985 329 L979 329 L978 339 L975 339 L975 329 L968 328 L966 337 L963 337 L964 328 L957 326 Z" stroke="none" />
          </g>

          {/* Wright Flyer: two cambered wings, struts and fine cross-bracing. */}
          <g fill={SERIAL} stroke={SERIAL} strokeLinejoin="round">
            <path d="M233 75 Q271 56 328 47 Q342 46 344 53 L339 61 Q283 66 241 87 Z" strokeWidth="1" />
            <path d="M229 91 Q276 89 329 77 Q342 77 344 84 Q330 96 278 104 Q247 106 229 97 Z" strokeWidth="1" />
            <path d="M227 66 L238 59 L246 61 L245 76 L228 84 Z" strokeWidth="1" />
            <g fill="none" strokeWidth="1">
              {[246, 262, 278, 294, 310, 329, 339].map((x, n) => (
                <path key={x} d={`M${x} ${77 - n * 3} L${x} ${101 - n * 2.8} L${x + 13} ${74 - n * 3} M${x} ${77 - n * 3} L${x + 13} ${98 - n * 2.8}`} />
              ))}
              <path d="M231 80 L273 103 L330 88 M229 68 L279 98 M250 97 L233 78 M275 90 L274 105" />
            </g>
            <path d="M241 78 Q280 70 339 56 M244 94 Q292 89 338 82" fill="none" stroke="#ccd4df" strokeWidth="1" />
          </g>

          <path d="M342 94 L395 77 L402 91 L371 97 Z" fill={RIBBON} />
          <path d="M496 49 Q562 30 596 27 Q621 25 628 34 L610 51 Q569 52 497 76 Z" fill={RIBBON} />
          <path d="M608 43 Q629 42 626 34 L608 51 L609 65 L625 59 Z" fill="#713a40" />
          <path d="M608 50 Q654 36 711 27 L747 34 L730 48 L751 67 Q704 56 648 76 Q615 85 608 71 Z" fill={RIBBON} />
          <path d="M392 28 L426 28 L432 33 L438 31 L444 38 L454 40 L471 36 L484 27 L505 21 L504 65 L500 79 L498 98 L493 111 L481 112 L477 122 L469 120 L463 126 L460 139 L452 143 L443 134 L436 132 L431 127 L423 134 L416 130 L407 131 L401 124 L394 124 L391 113 Z"
            fill="#fffdf0" stroke={RIBBON} strokeWidth="4" strokeLinejoin="round" />
        </g>
        <text x="447" y="107" textAnchor="middle" fill="#434745" fontFamily="var(--font-plate-ny, sans-serif)" fontSize="86"
          textLength="96" lengthAdjust="spacingAndGlyphs">OhiO</text>
        <text x="570" y="53" textAnchor="middle" fill="#fff3df" fontFamily="var(--font-plate-ny, sans-serif)" fontSize="28"
          textLength="77" lengthAdjust="spacingAndGlyphs" transform="rotate(-11 570 53)">Birthplace</text>
        <text x="676" y="61" textAnchor="middle" fill="#fff3df" fontFamily="var(--font-plate-ny, sans-serif)" fontSize="28"
          textLength="99" lengthAdjust="spacingAndGlyphs" transform="rotate(-11 676 61)">of Aviation</text>
        <text x="500" y="400" textAnchor="middle" fill={SERIAL} fontFamily="var(--font-plate-ny, sans-serif)"
          fontSize={Math.min(331, 2317 / Math.max(cleaned.length, 1))}
          textLength={cleaned.length ? Math.min(886, cleaned.length * 126) : undefined} lengthAdjust="spacingAndGlyphs">{cleaned}</text>
        <rect x="13" y="13" width="974" height="474" rx={PLATE_INSET_RADIUS} fill="none" stroke={RIBBON} strokeWidth="3.5" />
        {[199, 805].flatMap((x) => [47, 447].map((y) => (
          <rect key={`${x}-${y}`} x={x - 41} y={y - 10} width="82" height="20" rx="10"
            fill={`url(#${y === 47 ? "ohSlot" : "ohLowerSlot"}-${id})`} stroke={y === 47 ? "#d7d9d3" : "#929c97"} strokeWidth="1" />
        )))}
      </PlateSvg>
    </div>
  );
}
