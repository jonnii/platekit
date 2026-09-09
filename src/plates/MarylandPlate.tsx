"use client";

import { useId } from "react";
import { PlateProps } from "../types.js";

const GOLD = "#f4cd1a";
const BLACK = "#202222";
const RED = "#b31b35";
const WHITE = "#f7f7f4";
type Point = [number, number];

/** Project every heraldic shape through the same cloth folds, including its clips. */
function clothPoint([x, y]: Point): Point {
  return [
    x + 8 * Math.sin(y / 60 + x / 140),
    270 + y * 0.5 + 7 * Math.sin(x / 85) + 5 * Math.sin(x / 160 + y / 80),
  ];
}

function clothPath(vertices: Point[]) {
  const points: Point[] = [];
  vertices.forEach((start, n) => {
    const end = vertices[(n + 1) % vertices.length];
    const steps = Math.max(1, Math.ceil(Math.hypot(end[0] - start[0], end[1] - start[1]) / 16));
    for (let i = 0; i < steps; i++) {
      points.push(clothPoint([start[0] + (end[0] - start[0]) * i / steps, start[1] + (end[1] - start[1]) * i / steps]));
    }
  });
  return `${points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ")} Z`;
}

function block(x: number, y: number, width: number, height: number) {
  return clothPath([[x, y], [x + width, y], [x + width, y + height], [x, y + height]]);
}

function roundel(x: number, y: number, radius: number) {
  return clothPath(Array.from({ length: 32 }, (_, i): Point => [
    x + Math.cos(i * Math.PI / 16) * radius,
    y + Math.sin(i * Math.PI / 16) * radius,
  ]));
}

function cross(x: number, y: number) {
  const parts = [block(x + 226, y + 30, 48, 240), block(x + 70, y + 126, 360, 48)];
  for (const [cx, cy] of [[250, 36], [250, 264], [76, 150], [424, 150]]) {
    const vertical = cx === 250;
    parts.push(roundel(x + cx, y + cy, 27));
    parts.push(roundel(x + cx + (vertical ? -23 : 0), y + cy + (vertical ? 0 : -23), 22));
    parts.push(roundel(x + cx + (vertical ? 23 : 0), y + cy + (vertical ? 0 : 23), 22));
  }
  return parts.join(" ");
}

function Calvert({ x, y, id }: { x: number; y: number; id: string }) {
  const bend = clothPath([[x, y - 80], [x + 500, y + 220], [x + 500, y + 380], [x, y + 80]]);
  return (
    <g>
      <defs><clipPath id={id}><path d={bend} /></clipPath></defs>
      {Array.from({ length: 6 }, (_, n) => (
        <path key={n} d={block(x + n * 500 / 6, y, 500 / 6 + 0.2, 300)} fill={n % 2 ? BLACK : GOLD} />
      ))}
      <g clipPath={`url(#${id})`}>
        {Array.from({ length: 6 }, (_, n) => (
          <path key={n} d={block(x + n * 500 / 6, y, 500 / 6 + 0.2, 300)} fill={n % 2 ? GOLD : BLACK} />
        ))}
      </g>
    </g>
  );
}

function Crossland({ x, y, id }: { x: number; y: number; id: string }) {
  return (
    <g>
      {/* All four clips reveal the same warped cross; retain their paint order. */}
      <defs><path id={`${id}-cross`} d={cross(x + (y ? -30 : 30), y)} /></defs>
      {[0, 1, 2, 3].map((n) => {
        const red = n === 1 || n === 2;
        const bounds = block(x + n % 2 * 250, y + Math.floor(n / 2) * 150, 250, 150);
        return (
          <g key={n}>
            <defs><clipPath id={`${id}-${n}`}><path d={bounds} /></clipPath></defs>
            <path d={bounds} fill={red ? RED : WHITE} />
            <use href={`#${id}-cross`} fill={red ? WHITE : RED} clipPath={`url(#${id}-${n})`} />
          </g>
        );
      })}
    </g>
  );
}

export default function MarylandPlate({ plate, state = "Maryland", className, style, ...rest }: PlateProps) {
  const id = useId();
  const cleaned = plate.replace(/[\s\-–—]/g, "").toUpperCase();
  return (
    <div className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }}
      aria-label={`License plate ${plate} from ${state}`} {...rest}>
      <svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" role="img"
        preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
        <title>{`Maryland license plate: ${plate}`}</title>
        <defs>
          <clipPath id={`mdFace-${id}`}><rect x="13" y="13" width="974" height="474" rx="26" /></clipPath>
          <linearGradient id={`mdRim-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fafbf8" /><stop offset="0.5" stopColor="#e3e6df" /><stop offset="1" stopColor="#fafbf8" />
          </linearGradient>
          <linearGradient id={`mdFade-${id}`} x1="0" y1="265" x2="0" y2="395" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#000000" /><stop offset="0.35" stopColor="#555555" /><stop offset="0.8" stopColor="#eeeeee" /><stop offset="1" stopColor="#ffffff" />
          </linearGradient>
          <mask id={`mdFlagFade-${id}`} maskUnits="userSpaceOnUse" x="0" y="250" width="1000" height="250">
            <rect x="0" y="250" width="1000" height="250" fill={`url(#mdFade-${id})`} />
          </mask>
          <linearGradient id={`mdFolds-${id}`} x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="0.12" stopColor="#000000" stopOpacity="0.06" />
            <stop offset="0.22" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="0.32" stopColor="#000000" stopOpacity="0.24" />
            <stop offset="0.44" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="0.56" stopColor="#000000" stopOpacity="0.18" />
            <stop offset="0.69" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="0.83" stopColor="#000000" stopOpacity="0.17" />
            <stop offset="0.95" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id={`mdSlot-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b0b3b2" /><stop offset="0.45" stopColor="#e4e5e3" /><stop offset="1" stopColor="#c5c8c5" />
          </linearGradient>
          <filter id={`mdEmboss-${id}`} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feDropShadow dx="2" dy="2" stdDeviation="1.2" floodColor="#272d25" floodOpacity="0.35" />
            <feDropShadow dx="-1" dy="-1" stdDeviation="0.6" floodColor="#ffffff" floodOpacity="0.85" />
          </filter>
        </defs>
        <rect x="1" y="1" width="998" height="498" rx="30" fill={`url(#mdRim-${id})`} stroke="#d9ded4" strokeWidth="2" />
        <g clipPath={`url(#mdFace-${id})`}>
          <rect width="1000" height="500" fill={WHITE} />
          {/* Maryland's four quarters, counterchanged consistently through each fold. */}
          <g mask={`url(#mdFlagFade-${id})`}>
            <Calvert x={0} y={0} id={`mdCalvertLeft-${id}`} />
            <Crossland x={500} y={0} id={`mdCrossRight-${id}`} />
            <Crossland x={0} y={300} id={`mdCrossLeft-${id}`} />
            <Calvert x={500} y={300} id={`mdCalvertRight-${id}`} />
            <rect x="0" y="250" width="1000" height="250" fill={`url(#mdFolds-${id})`} />
          </g>
        </g>
        <g aria-label="Maryland" fill="#951c24">
          {/* The calligraphic M has a curled entry stroke and upright hairlines. */}
          <path d="M365 48 C350 33 324 49 335 67 C343 79 363 72 375 54 L395 22 H407 L400 67 L434 22 H447 L426 78 H413 L432 29 L397 78 H386 L391 33 L376 60 C360 89 332 84 326 66 C317 41 349 29 365 43Z" />
          <path d="M365 47 C375 38 354 33 368 26 C380 20 393 24 405 22" fill="none" stroke="#951c24" strokeWidth="6" strokeLinecap="round" />
          <text x="442" y="78" fontFamily='"Times New Roman", Times, serif' fontWeight="700" fontStyle="italic"
            fontSize="89" textLength="244" lengthAdjust="spacingAndGlyphs">aryland</text>
        </g>
        <text x="500" y="374" textAnchor="middle" fill="#060907" fontFamily="var(--font-plate-ny, sans-serif)"
          fontSize={Math.min(334, 2338 / Math.max(cleaned.length, 1))} textLength={cleaned.length ? Math.min(890, cleaned.length * 127) : undefined}
          lengthAdjust="spacingAndGlyphs" filter={`url(#mdEmboss-${id})`}>{cleaned}</text>
        <rect x="13" y="13" width="974" height="474" rx="26" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
        {[199, 805].flatMap((x) => [47, 447].map((y) => (
          <rect key={`${x}-${y}`} x={x - 41} y={y - 10} width="82" height="20" rx="10"
            fill={`url(#mdSlot-${id})`} stroke="#c5cbc0" strokeWidth="1.5" />
        )))}
      </svg>
    </div>
  );
}
