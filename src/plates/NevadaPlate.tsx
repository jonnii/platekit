"use client";

import PlateSvg, { PLATE_INSET_RADIUS, PLATE_OUTLINE } from "../internal/PlateSvg.js";
import { useId } from "react";
import type { PlateProps } from "../types.js";

// The printed desert is faceted: pale peaks above olive foothills at left and
// ochre, amber, and rust at right. Shared vertices keep the facets joined.
const ridge = [331, 358, 326, 280, 317, 355, 371, 389, 396, 398, 394, 370, 375, 347, 361, 371, 368, 303, 278, 311, 330];
const middle = [422, 385, 380, 405, 418, 398, 425, 409, 450, 427, 437, 407, 453, 416, 427, 458, 425, 385, 417, 373, 416];
const palettes = [
  ["#a9ac90", "#c9c8aa", "#8f916f", "#b6b99b", "#777e58", "#969571"],
  ["#e1ce91", "#edd995", "#c6ad77", "#d6b078", "#b98c51", "#e4b760"],
  ["#f1d986", "#edd16d", "#dca649", "#e6ba5c", "#bc7138", "#c78a3d"],
];

export default function NevadaPlate({ plate, state = "Nevada", className, style, ...rest }: PlateProps) {
  const id = useId().replace(/:/g, "");
  const cleaned = plate.replace(/[\s\-–—]/g, "").toUpperCase();
  const split = /^[A-Z0-9*]{6}$/.test(cleaned);
  // Rounded on output: Math.sin differs in the last ULP between Node and the browser, which breaks hydration.
  const rows = [ridge.map((y, i) => [i * 50, y]), middle.map((y, i) => [i === 0 || i === 20 ? i * 50 : +(i * 50 + Math.sin(i * 9) * 12).toFixed(2), y]),
    ridge.map((_, i) => [i * 50, 492])];
  return (
    <div className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }} aria-label={`License plate ${plate} from ${state}`} {...rest}>
      <PlateSvg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
        <title>{`Nevada license plate: ${plate}`}</title>
        <defs>
          <clipPath id={`nvClip-${id}`}><rect x="13" y="13" width="974" height="475" rx={PLATE_INSET_RADIUS} /></clipPath>
          <linearGradient id={`nvSky-${id}`} x2="0" y2="1"><stop stopColor="#66b1c9" /><stop offset="1" stopColor="#83bbca" /></linearGradient>
          <linearGradient id={`nvRim-${id}`} x2="0" y2="1"><stop stopColor="#d1dcdb" /><stop offset="0.2" stopColor="#f8f8f4" /><stop offset="1" stopColor="#adb9b4" /></linearGradient>
          <linearGradient id={`nvSlots-${id}`} x2="0" y2="1"><stop stopColor="#c1ccca" /><stop offset="0.5" stopColor="#f6f7f2" /><stop offset="1" stopColor="#b6c1bc" /></linearGradient>
        </defs>
        <rect {...PLATE_OUTLINE} fill="#f4f5f2" />
        <g clipPath={`url(#nvClip-${id})`}>
          <rect width="1000" height="500" fill={`url(#nvSky-${id})`} />
          {rows.slice(0, -1).flatMap((row, band) => row.slice(0, -1).flatMap((point, i) => {
            const palette = palettes[i < 5 ? 0 : i < 13 ? 1 : 2];
            const next = rows[band + 1];
            return [[point, row[i + 1], next[i]], [row[i + 1], next[i + 1], next[i]]].map((points, side) => {
              const fill = palette[(i * 7 + band * 3 + side * 2) % palette.length];
              return <polygon key={`${band}-${i}-${side}`} points={points.map((p) => p.join(",")).join(" ")} fill={fill} stroke={fill} strokeWidth="0.6" />;
            });
          }))}
          <path d="M89 335 L150 280 L199 318 L229 353 L193 363 L170 313 L122 328 Z" fill="#d5d5c9" />
          <path d="M124 313 L150 280 L181 304 L166 300 L159 312 L151 298 L141 310 Z" fill="#f5f5ef" />
          <path d="M801 365 L836 304 L869 274 L907 290 L984 331 L984 351 L937 330 L904 322 L878 330 L857 366 Z" fill="#d2d1bf" />
          <path d="M836 304 L869 274 L907 290 L888 288 L880 300 L873 286 L867 298 L858 291 Z" fill="#f7f7f1" />
          <path d="M838 306 L857 297 L864 330 L850 357 L813 376 Z" fill="#bcbeb1" />
          <path d="M878 330 L904 322 L937 330 L915 358 L942 370 L913 391 L893 419 L875 387 L844 368 Z" fill="#eddd8a" />
          <path d="M909 454 L943 418 L987 421 L987 490 L907 490 L895 470 Z" fill="#b7642d" />
        </g>
        <rect x="13" y="13" width="974" height="475" rx={PLATE_INSET_RADIUS} fill="none" stroke={`url(#nvRim-${id})`} strokeWidth="3" />
        <rect x="852" y="29" width="118" height="89" rx="2" fill="none" stroke="#c0dae0" strokeWidth="1.5" opacity="0.7" />
        {[157, 765].flatMap((x) => [38, 438].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="83" height="20" rx="10" fill={`url(#nvSlots-${id})`} />))}
        <text x="500" y="114" textAnchor="middle" fill="#080b0c" fontFamily="var(--font-plate-motto, Georgia, serif), Georgia, serif" fontWeight="900" fontSize="110" textLength="500" lengthAdjust="spacingAndGlyphs" stroke="#080b0c" strokeWidth="3">NEVADA</text>
        <g fill="#080b0c" fontFamily="var(--font-plate-ny, sans-serif)" fontSize="305">
          {split ? <>
            <text x="399" y="376" textAnchor="end" textLength="330" lengthAdjust="spacingAndGlyphs">{cleaned.slice(0, 3)}</text>
            <path d="M440 239 H486 V315 L440 277 Z" />
            <text x="548" y="376" textLength="380" lengthAdjust="spacingAndGlyphs">{cleaned.slice(3)}</text>
          </> : <text x="500" y="376" textAnchor="middle" fontSize={Math.min(305, 2050 / Math.max(cleaned.length, 1))} textLength={Math.min(880, cleaned.length * 122)} lengthAdjust="spacingAndGlyphs">{cleaned}</text>}
        </g>
        <text x="500" y="466" textAnchor="middle" fill="#080a08" fontFamily="var(--font-plate-motto, Georgia, serif), Georgia, serif" fontWeight="800" fontSize="58" textLength="510" lengthAdjust="spacingAndGlyphs">Home Means Nevada</text>
      </PlateSvg>
    </div>
  );
}
