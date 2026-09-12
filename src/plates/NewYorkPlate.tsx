"use client";

import PlateSvg, { PLATE_INSET_RADIUS, PLATE_OUTLINE } from "../internal/PlateSvg.js";
import { useId } from "react";
import { PlateProps } from "../types.js";

/** An irregular, tiered conifer silhouette that stays legible at card size. */
function fir(x: number, base: number, h: number, w: number, key: string) {
  return (
    <path
      key={key}
      d={`M${x - w * 0.08} ${base} v${-h * 0.1}
        l${-w * 0.42} ${h * 0.02} l${w * 0.23} ${-h * 0.22}
        l${-w * 0.13} ${h * 0.02} l${w * 0.22} ${-h * 0.26}
        l${-w * 0.12} ${h * 0.03} L${x} ${base - h}
        l${w * 0.25} ${h * 0.47} l${-w * 0.1} ${-h * 0.02}
        l${w * 0.24} ${h * 0.24} l${-w * 0.13} ${-h * 0.02}
        l${w * 0.24} ${h * 0.23} l${-w * 0.42} ${-h * 0.01} V${base} Z`}
    />
  );
}

export default function NewYorkPlate({ plate, state = "New York", className, style, ...rest }: PlateProps) {
  const id = useId();
  const navy = "#092b60";
  const gold = "#f5ad32";
  const sceneryFar = "#e7f5fa";
  const sceneryMid = "#9dd6ed";
  const sceneryNear = "#0a3567";
  const formatted = formatNyPlate(plate);
  const combinedReg = `${formatted.left}${formatted.right}`;

  return (
    <div
      className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }}
      aria-label={`License plate ${plate} from ${state}`} {...rest}
    >
      <PlateSvg
        viewBox="0 0 1000 500"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "auto" }}
      >
        <title>{`${state} license plate: ${plate}`}</title>
        <defs>
          <linearGradient id={`rim-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fdfdfc" />
            <stop offset="0.45" stopColor="#dce0df" />
            <stop offset="0.55" stopColor="#f7f8f6" />
            <stop offset="1" stopColor="#e0e3e3" />
          </linearGradient>
          <linearGradient id={`plateSheen-${id}`} x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#f8faf8" />
          </linearGradient>
          <linearGradient id={`slot-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b7baba" />
            <stop offset="0.4" stopColor="#e9ebea" />
            <stop offset="1" stopColor="#ffffff" />
          </linearGradient>
          <linearGradient id={`bandGradient-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.85" stopColor="#edf7fa" stopOpacity="0.15" />
            <stop offset="0.9" stopColor="#bee8f7" />
            <stop offset="1" stopColor="#bee8f7" />
          </linearGradient>
          <linearGradient id={`falls-${id}`} x1="0" y1="0" x2="1" y2="0.2">
            <stop offset="0" stopColor="#7ec9eb" />
            <stop offset="0.45" stopColor="#a9e6f6" />
            <stop offset="1" stopColor="#72bfe3" />
          </linearGradient>
          <filter id={`emboss-${id}`} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feDropShadow dx="2" dy="2" stdDeviation="1" floodColor="#263f57" floodOpacity="0.28" />
            <feDropShadow dx="-1" dy="-1" stdDeviation="0.5" floodColor="#ffffff" floodOpacity="0.9" />
          </filter>
          <clipPath id={`plateClip-${id}`}>
            <rect x="24" y="24" width="952" height="454" rx={PLATE_INSET_RADIUS} />
          </clipPath>
          {/* State outline and Long Island, in a shared 100 × 78 coordinate space. */}
          <symbol id={`nyState-${id}`} viewBox="0 0 100 78">
            <path
              d="M0 47.3 L11.1 36.6 L8.9 30.2 L20 30.8 L27.3 29.8 L36 28 L41.3 26.7 L43.4 15.1 L54 5 L63.4 0 L81.1 0 L80.1 24.6 L82 39 L79.3 51.1 L77.2 66 L74.2 72.8 L70.4 78 L64.1 63 L55.7 52 L0 52 Z M74 70.5 L84 70 L92 66.5 L100 65 L96 70 L86 73 L74 75 Z"
              fill={navy}
            />
          </symbol>
        </defs>

        {/* Rolled aluminum edge around the inset printed face. */}
        <g id={`canvas-${id}`}>
          <rect {...PLATE_OUTLINE} fill={`url(#rim-${id})`} stroke="#363e40" strokeWidth="1.5" />
          <rect x="8" y="8" width="984" height="484" rx={PLATE_OUTLINE.rx} fill={`url(#plateSheen-${id})`} stroke="#ffffff" strokeWidth="3" />
        </g>
        <g clipPath={`url(#plateClip-${id})`}>
          <g id={`accent-top-${id}`} fill={navy}>
            <path d="M24 74 H248 V77 H24 Z M752 74 H976 V77 H752 Z" />
            <path d="M24 83 H248 V97 H24 Z M752 83 H976 V97 H752 Z" fill={gold} />
          </g>

          {/* Niagara, the Adirondacks, New York Harbor, and Montauk, west to east.
              Reference: https://dmv.ny.gov/plates/excelsior-plates */}
          <g id={`landscape-${id}`}>
            <rect x="20" y="372" width="960" height="106" fill={`url(#bandGradient-${id})`} />
            <g fill={sceneryFar}>
              <path d="M20 426 L74 416 L104 421 L132 413 L160 420 L184 410 L206 415 L229 407 L257 417 L282 413 L307 424 L340 419 L381 433 L410 442 L20 467 Z" />
              <path d="M95 461 L140 420 L168 428 L195 428 L219 423 L250 413 L279 423 L305 433 L344 442 L379 460 L406 467 H95 Z" fill="#d4f0fa" />
              <path d="M160 408 l12 -7 8 3 9 -8 7 4 9 -3 13 11 Z M355 407 l16 -8 11 2 9 -6 16 4 14 -2 17 10 Z" />
              <path d="M668 409 l15 -7 10 2 8 -6 9 5 10 -1 17 7 Z M805 414 l12 -8 8 3 9 -6 12 3 8 -1 13 9 Z" />
            </g>

            <g id={`niagara-${id}`}>
              <path d="M20 399 Q56 394 95 398 L120 400 Q126 414 128 437 L135 461 L112 465 L20 474 Z" fill={`url(#falls-${id})`} />
              <path d="M20 394 Q45 391 64 392 Q84 390 103 397 Q62 397 20 401 Z" fill={sceneryNear} />
              <g fill={sceneryNear}>
                {Array.from({ length: 15 }, (_, n) => {
                  const heights = [24, 16, 32, 23, 28, 19, 25];
                  return fir(19 + n * 6.3, 398 + Math.max(0, n - 7) * 0.6, heights[n % heights.length], 9 + n % 4, `head-${n}`);
                })}
              </g>
              <path d="M20 419 Q26 411 42 411 L62 407 L50 405 Q91 397 120 400 L122 405 Q92 407 74 412 L45 419 L20 438 Z" fill="#c7f1fb" />
              {/* Uneven dark channels and narrow foam streaks turn over the curved lip. */}
              {Array.from({ length: 16 }, (_, n) => {
                const x = 23 + n * 6.2;
                const top = 432 - n * 1.8 + [4, -4, 1, -7, 3][n % 5];
                const bottom = 461 + [5, -1, 3, -5, 2, -2][n % 6];
                const width = [3.8, 1.6, 5.5, 2.2, 4.2][n % 5];
                return (
                  <path key={n}
                    d={`M${x} ${top} Q${x + 2} ${top - 3} ${x + width} ${top + 6} L${x + width + 5} ${bottom} L${x + 3} ${bottom + 1} Q${x + 2} ${top + 15} ${x} ${top} Z`}
                    fill={n % 3 === 1 ? "#f4fcfd" : sceneryNear}
                    opacity={n % 3 === 1 ? 0.95 : 0.9}
                  />
                );
              })}
              <path d="M20 474 Q31 464 43 469 Q54 460 67 465 Q78 454 92 461 Q105 455 117 465 Q129 461 146 474 Z" fill="#eef8fa" />
            </g>

            <g id={`nearTrees-${id}`} fill={sceneryNear} transform="translate(0 -10)">
              <path d="M133 467 Q151 455 171 465 Q207 463 236 474 L283 478 H125 Z" />
              {Array.from({ length: 22 }, (_, n) => {
                const heights = [33, 23, 40, 28, 21, 31, 19];
                return fir(138 + n * 6.4, 467 + n * 0.5, heights[n % heights.length] * (1 - n / 36), 10 + n % 4, `near-${n}`);
              })}
            </g>
            <path d="M20 476 Q178 474 302 476 T584 475 T808 474 T980 473 V480 H20 Z" fill={sceneryMid} opacity="0.35" />

            {/* Liberty's raised torch, crown, tablet, robe folds, and pedestal. */}
            <g id={`liberty-${id}`} transform="translate(756 393)" fill={sceneryNear}>
              <path d="M-8 55 L-5 44 L-4 32 L-3 25 L1 23 L4 27 L4 42 L7 53 L5 57 H-8 Z" />
              <path d="M-3 30 L-7 21 L-8 9 L-6 8 L-4 19 L0 25 Z M2 28 L6 26 L8 30 L5 36 L2 37 Z" />
              <path d="M-8 10 L-9 5 L-8 2 L-7 -2 L-6 2 L-5 5 L-6 10 Z" />
              <path d="M-3 23 L-5 20 L-2 21 L-3 17 L0 20 L1 16 L2 20 L5 18 L4 22 L6 22 L3 25 H-2 Z" />
              <path d="M-7 56 H6 V62 L10 73 H13 V79 H19 L30 85 H-31 L-19 80 H-14 V75 H-10 L-8 63 Z" />
              <path d="M-2 36 L-4 51 M1 39 L3 52 M-4 59 V62 M2 59 V62 M0 71 V75" fill="none" stroke={sceneryMid} strokeWidth="1.2" />
            </g>

            <g id={`skyline-${id}`} transform="translate(812 397)" fill={sceneryNear}>
              <path d="M0 70 V64 H7 V56 H12 V51 H17 V45 Q20 40 25 45 V41 Q29 37 33 41 V56 H37 V8 Q38 1 43 1 Q48 1 49 8 V54 H52 V37 L56 22 L60 37 V61 H64 V25 L68 15 V6 H69 V15 L73 25 V58 H78 V40 L82 29 L86 40 V58 H91 V54 H102 V59 H108 V65 H113 V70 Z" />
              <path d="M42 8 V54 M46 11 V55 M56 39 V60 M68 28 V58 M82 43 V61 M22 51 V63 M30 49 V63" stroke={sceneryMid} strokeWidth="1" fill="none" />
              <path d="M7 66 H18 V60 H26 V66 M36 67 V58 H46 V67 M61 68 V62 H72 V68 M89 67 H104" stroke="#7ab0d0" strokeWidth="2" fill="none" />
            </g>
            <g id={`lighthouse-${id}`} transform="translate(932 431) scale(0.8)">
              <path d="M7 -4 V-17 M1 -2 L-7 -12 M-3 5 L-17 1 M17 5 L31 1 M13 -2 L21 -12" stroke="#d7edf5" strokeWidth="1.2" />
              <path d="M-9 42 Q3 33 20 41 L30 45 H-14 Z" fill={sceneryNear} />
              <path d="M0 38 L3 11 H11 L14 38 Z" fill="#f8faf8" stroke={sceneryNear} strokeWidth="1.3" />
              <path d="M2 23 H12 L13 29 H1 Z M2 8 H12 V12 H2 Z M3 4 L7 0 L11 4 Z" fill={sceneryNear} />
              <path d="M4 5 H10 V8 H4 Z M6 33 H9 V38 H6 Z" fill={sceneryNear} />
            </g>
          </g>
        </g>

        <g id={`wordmark-${id}`}>
          <text x="500" y="116" textAnchor="middle" fill={navy}
            fontFamily="var(--font-plate-place, Georgia, serif)" fontWeight={700} fontSize={86}
            textLength={488} lengthAdjust="spacingAndGlyphs">
            NEW YORK
          </text>
        </g>

        <g id={`registration-${id}`} fill={navy} fontFamily="var(--font-plate-ny, sans-serif)" filter={`url(#emboss-${id})`}>
          {formatted.isCanonical ? (
            <>
              <text x={382} y={382} textAnchor="end" fontSize={310} textLength={284} lengthAdjust="spacingAndGlyphs">
                {formatted.left}
              </text>
              <use href={`#nyState-${id}`} x={405} y={236} width={96} height={75} />
              <text x={524} y={382} textAnchor="start" fontSize={310} textLength={374} lengthAdjust="spacingAndGlyphs">
                {formatted.right}
              </text>
            </>
          ) : (
            <text x={500} y={382} textAnchor="middle"
              fontSize={Math.min(310, 2200 / Math.max(combinedReg.length, 1))} letterSpacing={2}>
              {combinedReg}
            </text>
          )}
        </g>

        <g id={`motto-${id}`}>
          <text x={500} y={457} textAnchor="middle" fill={gold} stroke={navy}
            strokeWidth={3.5} strokeLinejoin="round" paintOrder="stroke"
            fontFamily="var(--font-plate-motto, Georgia, serif)" fontWeight={700} fontSize={68}
            textLength={440} lengthAdjust="spacingAndGlyphs">
            EXCELSIOR
          </text>
        </g>

        <rect x="24" y="24" width="952" height="454" rx={PLATE_INSET_RADIUS} fill="none" stroke={navy} strokeWidth="3" />
        {/* Recessed mounting slots, above the artwork just like the stamped plate. */}
        <g id={`mounts-${id}`}>
          {[208, 794].flatMap((x) => [57, 444].map((y) => (
            <g key={`${x}-${y}`}>
              <rect x={x - 22} y={y - 9} width="44" height="21" rx="10" fill="#ffffff" opacity="0.9" />
              <rect x={x - 21} y={y - 10} width="42" height="20" rx="10" fill={`url(#slot-${id})`} stroke="#929b9e" strokeWidth="1" />
            </g>
          )))}
        </g>
      </PlateSvg>
    </div>
  );
}

function formatNyPlate(input: string): { left: string; right: string; isCanonical: boolean } {
  const cleaned = input.replace(/[\s\-\u2013\u2014]/g, "").toUpperCase();
  const letters = cleaned.replace(/[^A-Z*]/g, "").slice(0, 3);
  const digits = cleaned.replace(/[^0-9*]/g, "").slice(-4);
  if (letters.length === 3 && digits.length === 4) {
    return { left: letters, right: digits, isCanonical: true };
  }
  const mid = Math.ceil(cleaned.length / 2);
  return { left: cleaned.slice(0, mid), right: cleaned.slice(mid), isCanonical: false };
}
