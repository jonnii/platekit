"use client";

import { useId } from "react";
import type { PlateProps } from "../types.js";

const GREEN = "#075442";
const WHITE = "#e4e8de";

/** Vermont's white serial panel and finely branched sugar maple. */
export default function VermontPlate({ plate, state = "Vermont", className, style, ...rest }: PlateProps) {
  const id = useId();
  const cleaned = plate.replace(/[\s\-–—]/g, "").toUpperCase();
  const size = Math.min(329, 2303 / Math.max(7, cleaned.length));
  return (
    <div className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }} aria-label={`License plate ${plate} from ${state}`} {...rest}>
      <svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
        <title>{`Vermont license plate: ${plate}`}</title>
        <defs>
          <linearGradient id={`vt-green-${id}`} x2=".1" y2="1"><stop stopColor="#216657" /><stop offset=".07" stopColor={GREEN} /><stop offset=".5" stopColor="#045e4d" /><stop offset=".78" stopColor="#075947" /><stop offset="1" stopColor="#064837" /></linearGradient>
          <linearGradient id={`vt-silver-${id}`} x2="0" y2="1"><stop stopColor="#b9babc" /><stop offset=".07" stopColor="#d0d2d1" /><stop offset=".5" stopColor="#b7b9bb" /><stop offset=".94" stopColor="#c7c9c9" /><stop offset="1" stopColor="#b6b8b9" /></linearGradient>
          <linearGradient id={`vt-rim-${id}`} x2=".1" y2="1"><stop stopColor="#7fada3" /><stop offset=".13" stopColor="#285e50" /><stop offset=".85" stopColor="#124f40" /><stop offset="1" stopColor="#367764" /></linearGradient>
          <linearGradient id={`vt-slot-${id}`} x2="0" y2="1"><stop stopColor="#aabcb5" /><stop offset=".3" stopColor="#f0f2eb" /><stop offset="1" stopColor="#cbd9d1" /></linearGradient>
          <clipPath id={`vt-clip-${id}`}><rect x="2" y="2" width="996" height="496" rx="30" /></clipPath>
        </defs>
        <g clipPath={`url(#vt-clip-${id})`}>
          <rect width="1000" height="500" fill={`url(#vt-green-${id})`} />
          <path d="M0 94 H1000 V405 H0Z M26 126 V373 Q26 386 39 386 H961 Q973 386 973 373 V126 Q973 114 961 114 H39 Q26 114 26 126Z" fill={`url(#vt-silver-${id})`} fillRule="evenodd" />
          <rect x="26" y="114" width="947" height="272" rx="12" fill="none" stroke="#174b3a" strokeWidth="2" />
          <path d="M29 127 Q29 117 40 117 H958" fill="none" stroke="#548b79" strokeWidth="2" opacity=".65" />
          <path d="M173 438 V433 Q173 426 183 426 H814 Q825 426 825 435 V438" fill="none" stroke="#327a60" strokeWidth="2" opacity=".65" />
          <path d="M173 462 V474 Q173 482 184 482 H812 Q825 482 825 474 V463" fill="none" stroke="#073d2d" strokeWidth="3" />
          <rect x="4" y="4" width="992" height="492" rx="28" fill="none" stroke={`url(#vt-rim-${id})`} strokeWidth="6" />
          <path d="M121 99 L120 40 M121 82 Q106 66 99 53 M120 72 Q133 60 139 42 M120 56 L107 37 M119 47 L124 22 M107 68 L96 69 M132 59 L143 61 M112 46 L97 44" fill="none" stroke={WHITE} strokeWidth="2.2" />
          {Array.from({ length: 185 }, (_, i) => {
            // A stable elliptical crown, with open spaces between leaf clusters.
            // Rounded on output: Math.sin/cos differ in the last ULP between Node and the browser, which breaks hydration.

            const angle = i * 2.399963;
            const radius = Math.sqrt((i + .5) / 185);
            const x = 120 + Math.cos(angle) * 32 * radius;
            const y = 48 + Math.sin(angle) * 37 * radius;
            return <path key={i} transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${i * 47 % 360})`} d="M0 -3 1 -1 3 -2 2 0 3 1 1 2 0 3 -1 1 -3 1 -2 -1 -1 -1Z" fill={WHITE} opacity={.55 + (i % 4) * .12} />;
          })}
          {[158, 763].flatMap((x) => [39, 438].map((y) => <g key={`${x}-${y}`}>
            <rect x={x - 1} y={y + 2} width="85" height="23" rx="10" fill="#173f31" opacity=".65" />
            <rect x={x} y={y} width="83" height="20" rx="9" fill={`url(#vt-slot-${id})`} stroke="#b7ccc2" strokeWidth="1" />
          </g>))}
          <text x="500" y="85" textAnchor="middle" fill={WHITE} stroke={WHITE} strokeWidth=".7" fontFamily='Georgia, "Times New Roman", serif' fontWeight="700" fontSize="98" textLength="410" lengthAdjust="spacingAndGlyphs">Vermont</text>
          <text x="500" y={373 - (329 - size) * .35} textAnchor="middle" fill={WHITE} fontFamily="var(--font-plate-ny, sans-serif)" fontSize={size} textLength={Math.min(858, cleaned.length * 122)} lengthAdjust="spacingAndGlyphs">{cleaned}</text>
          <text x="500" y="474" textAnchor="middle" fill={WHITE} fontFamily='Georgia, "Times New Roman", serif' fontSize="47" textLength="523" lengthAdjust="spacingAndGlyphs">Green Mountain State</text>
        </g>
      </svg>
    </div>
  );
}
