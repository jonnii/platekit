"use client";

import { useId } from "react";
import { PlateProps } from "../types.js";

const INK = "#080b09";
const BARK = "#885540";
const LEAF = "#79a99a";

/** Small pointed leaves and five-petal blossoms, rather than a repeating garland. */
function leaf(x: number, y: number, size: number, rotation: number, key: string) {
  return (
    <g key={key} transform={`translate(${x} ${y}) rotate(${rotation})`}>
      <path d={`M0 0 Q${size * 0.25} ${-size * 0.5} ${size} 0 Q${size * 0.45} ${size * 0.4} 0 0 Z`} fill={LEAF} />
      <path d={`M0 0 L${size * 0.85} 0`} stroke="#437c6c" strokeWidth="0.8" opacity="0.6" />
    </g>
  );
}

function blossom(x: number, y: number, radius: number, rotation: number, key: string) {
  return (
    <g key={key} transform={`translate(${x} ${y}) rotate(${rotation})`}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <path key={angle} transform={`rotate(${angle}) scale(${radius})`}
          d="M0 0 C-.7 -.2 -.8 -.85 -.4 -1 C-.13 -1.2 .05 -.85 .23 -1 C.7 -.91 .65 -.28 0 0 Z"
          fill="#fffdf2" stroke="#d9e0d3" strokeWidth="0.09" />
      ))}
      <circle r={radius * 0.22} fill="#d3c7a0" />
      <path d={`M${-radius * 0.3} 0 H${radius * 0.3} M0 ${-radius * 0.3} V${radius * 0.3}`} stroke="#e6bfa3" strokeWidth="1" />
    </g>
  );
}

function peach(x: number, y: number, radius: number, rotation: number, id: string, key: string, red = false) {
  return (
    <g key={key} transform={`translate(${x} ${y}) rotate(${rotation}) scale(${radius})`}>
      <path d="M0 -.8 C-.28 -1.02 -.71 -.95 -.92 -.59 C-1.13 -.22 -.95 .39 -.61 .73 Q-.3 1.02 .06 1.05 C.36 .95 .82 .63 .98 .15 C1.19 -.4 .79 -.96 .39 -.94 Q.13 -.95 0 -.8 Z"
        fill={`url(#gaPeach${red ? "Red" : ""}-${id})`} stroke="#ab5636" strokeWidth="0.018" />
      <path d="M0 -.8 C.27 -.68 .43 -.24 .31 .28 Q.2 .75 .06 1.05 C.48 .83 .67 .3 .6 -.2 Q.54 -.66 .17 -.88 Z"
        fill={`url(#gaPeachBlush-${id})`} />
      <path d="M.02 -.79 Q.42 -.34 .21 .35 Q.12 .68 .08 .87" fill="none" stroke="#b94f31" strokeWidth="0.027" opacity="0.5" />
      <path d="M-.64 -.46 Q-.85 -.16 -.61 .31" fill="none" stroke="#ffe0a4" strokeWidth="0.055" strokeLinecap="round" opacity={red ? 0.08 : 0.35} />
      <path d="M-.1 -.83 Q.05 -.91 .2 -.82" fill="none" stroke="#704831" strokeWidth="0.04" />
    </g>
  );
}

/** Georgia's illustrated Peach Orchard base, with an unassigned county decal. */
export default function GeorgiaPlate({ plate, state = "Georgia", className, style, ...rest }: PlateProps) {
  const id = useId();
  const cleaned = plate.replace(/[\s\-–—]/g, "").toUpperCase();
  const serialSize = Math.min(310, Math.round(2170 / Math.max(cleaned.length, 1)));

  return (
    <div className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }}
      aria-label={`License plate ${plate} from ${state}`} {...rest}>
      <svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" role="img"
        preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
        <title>{`Georgia license plate: ${plate}`}</title>
        <defs>
          <linearGradient id={`gaSky-${id}`} x1="0" y1="0" x2="0" y2="500" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#81cce2" />
            <stop offset="0.13" stopColor="#b8e1e8" />
            <stop offset="0.29" stopColor="#f5f6f2" />
            <stop offset="0.61" stopColor="#f5f5f0" />
            <stop offset="0.71" stopColor="#fbb28c" />
            <stop offset="0.8" stopColor="#f7af87" />
          </linearGradient>
          <linearGradient id={`gaRim-${id}`} x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0" stopColor="#fdfdfb" />
            <stop offset="0.5" stopColor="#f1f2ee" />
            <stop offset="1" stopColor="#e6e9e4" />
          </linearGradient>
          <linearGradient id={`gaSlot-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b0b5af" />
            <stop offset="0.45" stopColor="#e6e8e1" />
            <stop offset="1" stopColor="#c9d0c6" />
          </linearGradient>
          <linearGradient id={`gaField-${id}`} x1="0" y1="0" x2="0.8" y2="1">
            <stop offset="0" stopColor="#77ada5" />
            <stop offset="0.45" stopColor="#386f60" />
            <stop offset="1" stopColor="#164b34" />
          </linearGradient>
          <linearGradient id={`gaFieldHaze-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a2c5ae" stopOpacity="0" />
            <stop offset="1" stopColor="#a2c5ae" stopOpacity="0.65" />
          </linearGradient>
          <radialGradient id={`gaPeach-${id}`} cx="0.34" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#ffe0a3" />
            <stop offset="0.32" stopColor="#f9b17a" />
            <stop offset="0.67" stopColor="#ed8054" />
            <stop offset="0.88" stopColor="#ce5834" />
            <stop offset="1" stopColor="#9b422b" />
          </radialGradient>
          <radialGradient id={`gaPeachRed-${id}`} cx="0.67" cy="0.76" r="0.85">
            <stop offset="0" stopColor="#f99a66" />
            <stop offset="0.45" stopColor="#ef8050" />
            <stop offset="0.75" stopColor="#c95733" />
            <stop offset="1" stopColor="#823b29" />
          </radialGradient>
          <linearGradient id={`gaPeachBlush-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#a64028" stopOpacity="0.35" />
            <stop offset="0.4" stopColor="#e67145" stopOpacity="0.05" />
            <stop offset="1" stopColor="#ffc58a" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id={`gaFruitLeaf-${id}`} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor="#719775" />
            <stop offset="0.5" stopColor="#286450" />
            <stop offset="1" stopColor="#123b2f" />
          </linearGradient>
          <clipPath id={`gaPlateClip-${id}`}>
            <rect x="18" y="18" width="964" height="464" rx="20" />
          </clipPath>
        </defs>

        <rect x="1" y="1" width="998" height="498" rx="36" fill={`url(#gaRim-${id})`} stroke="#d5d9d2" strokeWidth="2" />
        <g clipPath={`url(#gaPlateClip-${id})`}>
          <rect width="1000" height="500" fill={`url(#gaSky-${id})`} />

          {/* Distant blue tree line and orchard rows converging at the horizon. */}
          <path aria-label="Distant orchard tree line" transform="translate(1 0)" fill="#85b8c8" fillRule="evenodd" d="M306,401 310,401 311,399 307,399Z M159,388 159,390 164,396 165,404 169,409 222,409 221,408 223,405 228,408 224,409 249,409 256,403 275,403 276,402 280,403 298,403 301,402 301,400 299,401 294,398 295,395 307,396 308,397 310,396 329,396 333,395 337,398 333,400 338,402 348,402 349,403 364,403 365,402 369,403 384,403 385,402 386,403 387,402 397,402 398,401 406,403 407,402 412,402 414,399 417,401 424,401 425,402 442,402 446,401 449,403 740,403 748,409 813,409 817,402 813,398 791,399 790,400 789,399 768,399 764,397 759,399 750,399 743,397 736,399 715,399 714,400 712,400 708,397 702,397 697,400 693,397 679,398 664,390 640,389 636,388 633,385 620,386 608,394 593,394 592,393 581,392 576,390 556,392 555,393 503,393 502,392 482,391 479,388 471,385 467,385 460,388 450,388 439,393 434,391 427,393 426,392 420,392 417,390 406,391 397,387 396,385 375,385 374,384 362,384 361,383 355,383 350,386 346,385 340,390 327,390 322,393 316,393 310,391 296,392 293,390 283,389 280,387 261,387 260,388 255,388 252,386 251,387 246,387 245,386 234,387 223,384 220,386 202,385 197,388 187,387 183,385 160,387Z M240,400 241,399 243,400 242,401Z M238,399 239,398 240,400 239,401Z M240,398 241,397 248,397 249,398 248,399 241,399Z M357,397 358,396 364,396 366,399 365,400 358,399Z" />
          <path d="M18 400 Q153 390 285 395 Q463 392 621 397 Q804 401 982 396 V500 H18 Z" fill={`url(#gaField-${id})`} />
          <g fill="#a2c8bb">
            <path d="M182 394 L221 395 Q257 414 284 482 H236 Q215 424 182 394 Z" />
            <path d="M265 395 H300 Q351 420 428 482 H375 Q316 429 265 395 Z" opacity="0.65" />
            <path d="M283 396 H300 Q449 429 686 482 H627 Q422 427 283 396 Z" opacity="0.4" />
            <path d="M382 397 H405 Q641 425 982 448 V454 Q627 426 382 397 Z" opacity="0.25" />
          </g>
          <g fill="none" stroke="#154d36">
            <path d="M165 392 Q224 426 229 482 M233 395 Q294 426 356 482 M350 395 Q422 433 532 482" strokeWidth="5" opacity="0.6" />
            <path d="M401 397 Q689 409 982 423 M457 400 Q752 425 982 437 M489 406 Q766 442 982 466" strokeWidth="3" opacity="0.45" />
            <path d="M98 470 Q459 483 821 473 M111 481 Q478 490 832 483" strokeWidth="3" opacity="0.6" />
          </g>
          <rect x="18" y="450" width="964" height="32" fill={`url(#gaFieldHaze-${id})`} />

          {/* The trunk runs to the orchard; forks taper into fine flowering twigs. */}
          <g fill={BARK}>
            <path d="M18 18 H50 L42 51 L52 75 L41 112 L33 144 L42 184 L41 228 L49 268 L43 305 L51 355 L58 410 L19 431 Z" />
            <path d="M28 223 Q40 193 72 181 Q112 167 135 145 Q150 121 186 113 L194 120 Q170 129 160 153 Q132 184 86 199 Q49 214 36 249 Z" />
            <path d="M26 105 Q64 86 93 76 Q133 63 170 76 Q209 89 256 78 L278 73 L273 79 Q207 100 168 87 Q121 74 100 89 Q62 111 28 124 Z" />
            <path d="M37 53 Q68 42 76 18 H86 Q80 45 53 68 Z M91 80 Q110 45 121 39 L132 40 Q114 51 100 82 Z" />
            <path d="M174 83 Q208 109 251 115 Q293 113 323 128 Q346 139 372 131 L387 124 L390 127 Q358 148 325 137 Q290 123 254 123 Q203 119 169 89 Z" />
            <path d="M338 131 Q399 113 441 119 Q487 127 551 118 L574 113 L567 118 Q491 135 441 125 Q390 121 347 137 Z" />
          </g>
          <g stroke="#bb8060" fill="none" strokeLinecap="round">
            <path d="M25 23 L32 51 L23 87 M30 132 Q20 166 33 191 M27 223 L31 258 L27 283 L34 331 L33 369 L40 406" strokeWidth="5" />
            <path d="M44 212 Q77 187 108 178 L142 148 M56 97 Q111 61 150 79 M191 113 Q227 126 263 119 L311 129" strokeWidth="3" />
          </g>
          <g fill="#533e30" opacity="0.6">
            <path d="M18 49 L25 61 L20 92 L31 107 L25 133 L18 138 Z M35 277 L40 295 L33 308 L38 348 L30 325 Z M24 346 L31 374 L25 402 L34 416 L19 422 Z" />
            <path d="M34 183 L46 171 L39 196 L56 199 L37 215 L26 232 Z M28 28 L39 21 L35 45 Z" />
          </g>
          <path aria-label="Broken peach bark" fill="#704634" fillRule="evenodd" d="M18,186 19,187 18,188 18,199 19,200 18,202 19,207 18,216 22,220 18,226 19,228 19,242 18,243 19,245 18,247 19,275 22,283 20,291 19,290 19,283 19,290 18,291 19,293 18,295 19,296 18,297 18,314 20,321 20,331 19,332 18,327 19,334 18,344 19,342 20,346 22,346 23,344 25,346 28,345 33,348 30,351 26,361 26,372 25,373 26,379 25,380 26,381 24,382 25,383 24,385 25,386 24,387 25,393 24,394 26,396 25,402 28,412 30,411 35,412 38,410 40,412 42,411 53,412 50,411 53,404 53,388 51,393 49,391 48,393 47,392 48,393 47,394 44,393 42,390 43,388 44,389 45,384 49,377 48,376 48,369 49,368 53,381 52,380 53,376 51,374 51,370 49,365 47,365 45,362 45,359 47,357 46,330 48,326 47,325 47,317 44,311 44,306 41,299 43,294 43,287 41,280 43,267 40,262 42,251 51,243 49,242 50,238 53,237 53,221 50,221 51,222 49,225 45,224 41,221 39,213 41,210 47,219 49,218 53,219 53,197 47,197 38,192 34,202 31,204 27,201 20,187Z M43,409 44,407 48,408 44,410Z M43,402 44,403 43,406 42,405Z M51,401 52,403 51,406 49,407 48,405 49,402Z M44,401 45,400 47,401 46,402Z M43,397 45,395 47,397 46,398Z M51,394 52,397 50,398 49,397Z M36,395 37,394 38,396 37,397Z M36,385 38,386 37,392 35,390Z M36,383 37,382 38,384 37,385Z M25,382 26,381 28,382 27,383Z M37,375 38,376 37,381 35,379Z M40,355 41,354 42,356 41,357Z M44,345 45,344 46,346 45,347Z M36,343 39,344 38,348 40,350 40,352 38,353 37,359 35,358 36,356 35,355 36,350 35,344Z M23,339 24,340 23,343 22,342Z M36,338 38,340 37,343 34,341Z M42,330 43,329 44,331 43,332Z M21,329 22,328 23,330 22,331Z M39,325 40,324 42,327 40,328Z M25,307 26,306 27,308 26,309Z M34,305 35,306 34,313 33,312Z M20,294 21,293 22,295 21,296Z M20,270 21,271 20,275 19,274Z M23,268 25,270 24,272 28,279 27,282 25,281 22,274Z M40,250 41,251 40,267 38,268 35,264 34,258 32,256 31,258 30,257 30,253 32,251 39,251Z M37,201 38,200 40,202 38,203Z M67,118 64,120 66,120Z M76,111 82,112 84,109 79,109Z M24,87 21,90 21,96 22,94 23,95 22,94 24,92 23,89Z M21,92 22,91 23,93 22,94Z M88,77 84,80 82,79 79,82 81,81 84,84 85,83 84,80 88,79Z M166,69 165,68 153,69 148,73 146,72 141,73 140,74 144,76 143,77 138,76 136,78 141,79 145,77 147,73 151,72 153,73 159,70 166,72Z M138,78 139,77 141,78 140,79Z M141,74 144,73 146,75 144,76Z M21,34 18,39 19,42 22,40Z M38,19 36,20 31,19 26,21 27,26 25,28 22,28 30,36 31,33 33,35 33,39 35,44 34,48 37,53 36,54 37,56 41,54 47,45 50,48 48,53 49,54 45,61 39,66 36,66 37,67 35,68 38,70 38,73 38,70 39,69 40,70 39,75 40,74 41,75 40,77 41,79 40,80 37,76 39,79 38,82 35,81 38,83 37,84 35,84 33,86 32,84 31,85 28,84 35,88 34,89 32,88 33,90 31,94 31,98 33,102 32,103 29,100 25,100 23,109 22,110 20,108 20,106 18,107 19,120 21,122 27,115 30,115 32,113 37,112 38,113 39,112 47,112 48,110 53,110 57,112 60,117 62,117 59,116 57,110 51,105 52,104 51,103 54,100 55,95 60,89 65,86 66,82 59,81 56,83 54,81 55,80 53,70 53,61 54,60 53,57 55,53 51,52 49,47 49,35 53,34 57,31 58,27 54,27 46,30 40,22 38,22 36,25 34,24 35,21Z M43,110 44,109 47,110 46,111Z M19,110 20,109 22,112 20,113Z M40,105 41,107 39,108 38,107Z M31,102 32,106 30,107 29,104Z M24,103 25,102 27,103 26,104Z M37,101 38,100 40,101 39,102Z M48,99 49,98 50,100 49,101Z M39,96 40,97 37,99 36,98Z M51,90 52,89 53,91 52,92Z M36,85 38,87 37,91 35,89Z M45,71 47,72 47,75 49,78 47,81 44,80 46,78 43,75Z M36,46 37,47 36,50 35,49Z M39,38 39,35 42,34 43,36 40,39Z M33,30 34,29 35,31 34,32Z M30,27 33,30 31,32 28,31 28,29Z" />
          <g stroke="#6e7355" strokeWidth="1.5" fill="none">
            <path d="M43 120 Q70 127 77 148 L76 169 M90 78 Q90 57 102 45 L99 30 M149 78 Q153 52 142 37 L128 27 M184 115 Q203 103 218 104 L226 111 M257 119 L268 102 L281 94 M366 136 L363 110 L378 97 M452 125 L467 143 L485 141 M533 120 L543 98" />
            <path d="M34 241 L55 238 L71 216 M39 287 L23 277 M54 69 L68 51 L68 40 M106 179 L108 157 L117 149" />
          </g>
          {[
            [39, 42, 18, -70], [62, 27, 15, 15], [82, 48, 17, -110], [90, 39, 20, -60],
            [109, 27, 14, 140], [132, 28, 16, 25], [145, 42, 18, -60], [160, 55, 14, 120],
            [26, 123, 16, 85], [43, 127, 19, 120], [57, 132, 17, 68], [71, 147, 13, 25],
            [80, 170, 17, -30], [99, 173, 18, -70], [120, 156, 16, 40], [151, 140, 15, -25],
            [184, 127, 15, 75], [207, 123, 15, 28], [229, 105, 12, -50], [254, 127, 17, 90],
            [278, 104, 15, -50], [293, 127, 14, 55], [323, 142, 15, 50], [350, 128, 15, -90],
            [366, 116, 12, 25], [385, 135, 17, 55], [416, 128, 14, 83], [435, 125, 14, -65],
            [475, 140, 18, 75], [500, 125, 13, -45], [522, 132, 15, 40], [552, 121, 13, 100],
            [50, 216, 18, 20], [64, 226, 13, 110], [52, 254, 13, -35], [32, 160, 13, -70],
          ].map(([x, y, size, rotation], n) => leaf(x, y, size, rotation, `leaf-${n}`))}
          {[
            [71, 23, 13, 20], [160, 25, 11, 35], [29, 78, 8, 0], [44, 108, 10, 30],
            [59, 141, 13, 10], [31, 153, 11, 50], [73, 165, 12, 0], [62, 191, 14, 25],
            [43, 205, 11, 60], [76, 220, 9, 0], [91, 193, 10, 10], [148, 136, 9, 40],
            [190, 112, 10, 15], [210, 105, 8, 0], [233, 126, 9, 40], [278, 51, 8, 25],
            [285, 112, 9, 40], [327, 140, 8, 10], [370, 60, 12, 0], [380, 105, 10, 20],
            [432, 136, 8, 35], [461, 122, 9, 0], [535, 119, 10, 15], [550, 126, 8, 60],
          ].map(([x, y, radius, rotation], n) => blossom(x, y, radius, rotation, `blossom-${n}`))}

          {/* Fruit overlaps the orchard, with paired lobes, blush and a curved seam. */}
          <path d="M921 382 Q928 343 982 332 L993 371 Q958 368 921 382 Z" fill={`url(#gaFruitLeaf-${id})`} />
          <path d="M924 378 Q954 357 987 352 M941 365 L938 350 M953 360 L952 340 M966 356 L966 337 M941 366 L951 374 M960 358 L972 371"
            stroke="#a0b596" strokeWidth="1.5" fill="none" opacity="0.7" />
          {peach(105, 428, 62, 8, id, "back-left")}
          {peach(903, 459, 88, -10, id, "right", true)}
          {peach(42, 462, 53, -12, id, "front-left")}
          {peach(116, 489, 57, 25, id, "front-center")}
          <path d="M54 383 Q71 374 88 377 L104 381 Q74 380 62 393 Z" fill="#255741" />
          <path d="M93 477 Q122 469 145 480" stroke="#bd5634" strokeWidth="2" opacity="0.7" fill="none" />

          <g aria-label="Peach blush contours">
          <path fill="#a94d2b" fillRule="evenodd" opacity="1" d="M154,449 158,459 157,463 160,464 159,469 165,471 170,478 170,473 165,462Z M128,378 128,380 137,383 144,391 148,401 148,408 152,423 159,433 159,436 164,435 166,413 161,394 158,392 156,387 157,385 146,378 138,376Z M19,422 25,419 31,420 37,417 44,421 43,419 47,415 56,413 57,404 62,396 76,382 82,379 91,378 97,380 110,378 100,376 82,379 80,377 78,381 72,383 59,394 55,383 51,379 55,374 51,371 20,371Z" />
          <path fill="#dc7950" fillRule="evenodd" opacity="1" d="M89,456 77,469 74,480 80,479 78,478 78,475 85,460Z M19,423 19,430 24,423 37,420 39,423 54,430 49,419 52,417 64,417 78,425 88,435 93,446 93,450 116,439 129,439 144,444 153,454 152,459 146,459 144,461 152,464 157,468 158,472 164,473 167,476 165,479 162,479 170,479 165,472 158,469 159,464 156,463 157,459 153,449 160,437 149,418 147,401 144,393 137,384 128,381 127,378 133,375 146,377 156,384 170,382 157,383 146,376 138,374 124,377 110,376 103,373 89,376 81,374 68,376 52,371 56,374 60,373 66,376 80,376 82,378 105,375 111,378 109,380 103,379 97,381 91,379 82,380 76,383 63,396 58,404 56,414 47,416 44,419 44,422 37,418 31,421 25,420Z M59,404 63,398 79,384 87,382 92,384 88,394 100,387 105,381 116,381 118,384 131,386 136,389 141,397 146,419 155,437 155,442 151,444 142,438 134,436 119,436 110,438 96,445 87,428 73,415 64,413 59,408Z" />
          <path fill="#f3bd9d" fillRule="evenodd" opacity="1" d="M141,464 133,459 121,460 106,467 93,480 88,480 99,478 104,472 113,466 118,467 112,471 108,476 109,478 116,480 138,479 117,480 112,478 127,468Z M25,451 23,465 24,471 23,472 19,467 24,475 32,478 59,480 63,478 64,470 70,467 72,469 72,473 68,477 73,480 73,459 65,440 58,434 51,431 49,432 51,437 50,446 45,446 44,443 33,443Z M58,463 62,471 62,477 59,480 52,480 48,476 54,465Z M34,458 40,458 43,462 43,471 39,475 28,470 28,467 33,462Z M81,402 76,416 92,430 97,441 123,434 127,431 124,414 118,405 109,402 102,402 93,408 91,396 85,398Z M111,418 114,422 114,427 110,431 105,431 103,427 100,427 100,422Z M61,371 68,375 99,372 123,375 132,372 147,373 158,382 170,381 170,371Z" />
          </g>
          {/* No county is supplied by the app, so the decal stays blank. */}
          <rect x="250" y="405" width="498" height="59" rx="11" fill="#fffffc" stroke="#d2dfca" strokeWidth="1.5" />
        </g>

        <g fill={INK}>
          <text x="70" y="122" fill="#fffefa" stroke={INK} strokeWidth="7" strokeLinejoin="round" paintOrder="stroke"
            fontFamily="var(--font-plate-script, cursive)" fontSize="96" textLength="325" lengthAdjust="spacingAndGlyphs">
            Peach State
          </text>
          <text x="663" y="123" textAnchor="middle" fontFamily='Georgia, "Times New Roman", serif'
            fontWeight={400} fontSize="92" textLength="530" lengthAdjust="spacingAndGlyphs">
            GEORGIA
          </text>
          <text x="500" y="374" textAnchor="middle" fontFamily="var(--font-plate-ny, sans-serif)" fontSize={serialSize}
            textLength={cleaned.length ? Math.min(886, cleaned.length * 126) : undefined} lengthAdjust="spacingAndGlyphs">
            {cleaned}
          </text>
        </g>
        <rect x="18" y="18" width="964" height="464" rx="20" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.75" />
        <g>
          {[198, 806].flatMap((x) => [46, 447].map((y) => (
            <g key={`${x}-${y}`}>
              <rect x={x - 42} y={y - 11} width="84" height="23" rx="11" fill="#e7ede3" opacity="0.75" />
              <rect x={x - 40} y={y - 10} width="80" height="20" rx="10" fill={`url(#gaSlot-${id})`} stroke="#c2c8be" strokeWidth="1" />
            </g>
          )))}
        </g>
      </svg>
    </div>
  );
}
