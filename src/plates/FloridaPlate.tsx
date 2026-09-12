"use client";

import PlateSvg, { PLATE_OUTLINE } from "../internal/PlateSvg.js";
import { useId } from "react";
import { PlateProps } from "../types.js";

/**
 * Stipple dots on an orange. The real artwork shades each fruit with a screen of
 * white dots that gets denser toward one shoulder, rather than with a gradient.
 * Generated in rings so the spacing stays even and the output is deterministic.
 */
function stipple(cx: number, cy: number, r: number, fromDeg: number, key: string) {
  const dots = [];
  const rings = 5;
  for (let ring = 0; ring < rings; ring++) {
    const rr = r * (0.42 + ring * 0.13);
    // Outer rings carry more dots, and the arc narrows as it approaches the edge.
    const count = 5 + ring * 2;
    const spreadDeg = 145 - ring * 7;
    for (let n = 0; n < count; n++) {
      const t = count === 1 ? 0.5 : n / (count - 1);
      const deg = fromDeg - spreadDeg / 2 + t * spreadDeg + Math.sin(n * 7 + ring) * 4;
      // Rounded on output: Math.sin/cos differ in the last ULP between Node and the browser, which breaks hydration.

      const rad = (deg * Math.PI) / 180;
      dots.push(
        <circle
          key={`${key}-${ring}-${n}`}
          cx={(cx + rr * Math.cos(rad)).toFixed(2)}
          cy={(cy + rr * Math.sin(rad)).toFixed(2)}
          r={1.65 + ((n + ring) % 3) * 0.2}
          fill="#ffffff"
        />,
      );
    }
  }
  return dots;
}

/** One five-petal orange blossom: white petals, green edge, orange stamens. */
function blossom(cx: number, cy: number, scale: number, rotate: number, green: string, orange: string, key: string) {
  const petals = [0, 72, 144, 216, 288].map((a, i) => (
    <path key={`${key}-p-${a}`} transform={`rotate(${a + i * 3})`}
      d="M-5 -2 C-10 -7 -17 -18 -13 -23 C-15 -29 -6 -32 -2 -29 C4 -33 12 -27 11 -21 C13 -15 6 -8 4 -2 Z"
      fill="#fff" stroke={green} strokeWidth={1.7} />
  ));
  const stamens = [0, 60, 120, 180, 240, 300].map((a, i) => {
    const rad = (a * Math.PI) / 180;
    const rr = i % 2 === 0 ? 5.5 : 8;
    return (
      <circle
        key={`${key}-s-${a}`}
        cx={(rr * Math.cos(rad)).toFixed(2)}
        cy={(rr * Math.sin(rad)).toFixed(2)}
        r={2.4}
        fill={orange}
      />
    );
  });
  return (
    <g key={key} transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${scale})`}>
      {petals}
      {stamens}
    </g>
  );
}

export default function FloridaPlate({ plate, state = "Florida", className, style, ...rest }: PlateProps) {
  const id = useId().replace(/:/g, "");
  const green = "#31684e";
  const serialGreen = "#00672b";
  const orange = "#ff7910";
  const fl = formatFlPlate(plate);

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
        <title>Florida</title>
        <defs>
          <path id={`flTopArc-${id}`} d="M180 120 C500 30 500 30 820 120" fill="none" />
          {/* Keep the screen in plate coordinates so the state does not enlarge its dots. */}
          <pattern id={`flHalftone-${id}`} width="3" height="3" patternUnits="userSpaceOnUse">
            <rect width="3" height="3" fill="#d5e1d9" />
            <path d="M-1 1 L1 -1 M0 3 L3 0 M2 4 L4 2" fill="none" stroke={green} strokeWidth="0.8" opacity="0.55" />
          </pattern>
          <linearGradient id={`flRim-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#868986" /><stop offset="0.5" stopColor="#eeeeec" /><stop offset="1" stopColor="#b4b7b3" />
          </linearGradient>
          <filter id={`flEmboss-${id}`} x="-5%" y="-5%" width="110%" height="115%">
            <feDropShadow dx="0" dy="2.2" stdDeviation="0.55" floodColor="#747b71" floodOpacity="0.55" />
          </filter>
        </defs>
        <rect {...PLATE_OUTLINE} fill="#fff" />
        <rect x="7" y="6" width="986" height="487" rx={PLATE_OUTLINE.rx} fill="none" stroke={`url(#flRim-${id})`} strokeWidth="2.4" />
        <rect x="842" y="19" width="130" height="91" rx="6" fill="#fff" stroke={`url(#flRim-${id})`} strokeWidth="2.6" />
        {[202, 799].flatMap((x) => [55, 442].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="13" fill="#fff" stroke={`url(#flRim-${id})`} strokeWidth="1.4" />
        )))}

        {/* Arc header: MYFLORIDA.COM */}
        <g transform="translate(0,25)">
          <text fill={green} fontFamily={'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'} fontWeight={800} fontSize={60} letterSpacing={0}>
            <textPath href={`#flTopArc-${id}`} startOffset="50%" textAnchor="middle">MYFLORIDA.COM</textPath>
          </text>
        </g>

        {/* Panhandle, Atlantic coast, Everglades, and the small arc of the Keys. */}
        <path d="M274 114 L286 108 L410 104 L416 119 L553 122 L555 134 L560 131 L558 110 L566 105 L579 110 L590 111
          L592 130 L599 150 L605 177 L612 199 L621 219 L633 227 L628 230 L638 262 L651 287 L674 350
          L677 399 L667 421 L657 444 L641 451 L628 448 L620 431 L613 416 L606 406 L593 402
          L584 382 L582 369 L572 355 L565 338 L557 320 L550 297 L540 272 L533 244 L518 217
          L504 195 L483 179 L470 171 L452 160 L438 153 L421 170 L407 182 L394 185 L378 175
          L364 156 L350 149 L330 142 L315 146 L286 147 L284 135 Z
          M618 462 L612 466 L605 467 L600 474 L590 477 L598 477 L610 471 L622 467 Z"
          fill={`url(#flHalftone-${id})`} opacity="0.8" />

        <g>
          <circle cx="545" cy="218" r="60" fill={orange} stroke={green} strokeWidth="2.5" />
          {stipple(545, 218, 60, -35, "far")}
          <g fill={green} stroke={green} strokeWidth="1.5">
            <path d="M400 177 Q401 164 410 170 L440 192 L483 215 L518 252 L512 261 L475 222 L433 202 Z" />
            <path d="M444 190 C436 166 448 149 468 153 C485 157 501 155 514 145 C506 165 493 185 476 193 Z" />
            <path d="M447 194 C468 179 489 176 505 185 C512 190 518 199 520 210 C494 203 475 217 454 207 Z" />
            <path d="M452 207 C431 198 422 210 419 228 C415 239 409 249 400 257 C423 263 452 247 465 225 Z" />
          </g>
          <g fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round">
            <path d="M444 190 C458 171 489 180 514 145" />
            <path d="M454 199 C478 198 503 193 520 210" />
            <path d="M452 209 C436 226 431 249 401 257" />
          </g>
          <ellipse cx="474" cy="319" rx="76" ry="74" fill={orange} stroke={green} strokeWidth="2.5" />
          {stipple(474, 319, 74, -155, "near")}
          <path d="M469 252 L463 244 L475 247 L483 239 L484 249 L497 255 L483 255 L471 266 L475 256 L458 259 Z" fill={green} />
          {/* Leaves lie behind the irregular petals, with a few white midribs. */}
          <g fill={green} stroke={green} strokeWidth="1.5">
            <path d="M530 294 C515 278 523 253 519 240 C533 249 538 258 542 268 C555 254 572 255 581 255 C568 268 549 280 548 296 Z" />
            <path d="M516 310 C492 305 484 309 468 312 C480 325 497 325 510 323 Z" />
            <path d="M520 332 C499 334 491 349 494 364 C503 351 516 352 528 350 Z" />
            <path d="M553 330 C572 329 576 342 586 355 C569 351 562 360 551 357 Z" />
          </g>
          <g fill="none" stroke="#fff" strokeWidth="1.5">
            <path d="M519 242 Q529 254 529 264 M552 279 Q564 263 579 257 M469 312 Q484 319 497 317 M495 364 Q508 350 519 347" />
          </g>
          {blossom(514, 298, 0.94, -15, green, orange, "b1")}
          {blossom(565, 309, 0.95, 24, green, orange, "b2")}
          {blossom(541, 341, 0.98, 8, green, orange, "b3")}
        </g>

        {fl.isCanonical ? (
          <g id={`registration-${id}`} filter={`url(#flEmboss-${id})`}>
            <text
              x={365}
              y={376}
              textAnchor="end"
              fill={serialGreen}
              fontFamily={'var(--font-plate-ny, sans-serif)'}
              fontSize={320}
              letterSpacing={2}
              textLength="322" lengthAdjust="spacingAndGlyphs"
            >
              {fl.leftLetters}
            </text>
            <text
              x={635}
              y={376}
              textAnchor="start"
              fill={serialGreen}
              fontFamily={'var(--font-plate-ny, sans-serif)'}
              fontSize={320}
              letterSpacing={2}
              textLength="322" lengthAdjust="spacingAndGlyphs"
            >
              {fl.rightDigits}
            </text>
          </g>
        ) : (
          <text
            x={500}
            y={376}
            textAnchor="middle"
            fill={serialGreen}
            fontFamily={'var(--font-plate-ny, sans-serif)'}
            fontSize={Math.min(320, 2050 / Math.max(fl.centered.length, 1))}
            letterSpacing={6}
          >
            {fl.centered}
          </text>
        )}

        <text
          x={500}
          y={468}
          textAnchor="middle"
          fill={serialGreen}
          fontFamily="var(--font-plate-ny, sans-serif)"
          fontWeight={400}
          fontSize={78}
          textLength="552" lengthAdjust="spacingAndGlyphs"
          filter={`url(#flEmboss-${id})`}
          letterSpacing={2}
        >
          SUNSHINE STATE
        </text>
      </PlateSvg>
    </div>
  );
}

function formatFlPlate(input: string): {
  centered: string;
  isCanonical: boolean;
  leftLetters: string;
  rightDigits: string;
} {
  const cleaned = input.replace(/[\s\-\u2013\u2014]/g, "").toUpperCase();
  // Florida canonical: any 6 alphanumeric characters or asterisks
  if (/^[A-Z0-9*]{6}$/.test(cleaned)) {
    return {
      centered: cleaned,
      isCanonical: true,
      leftLetters: cleaned.slice(0, 3),
      rightDigits: cleaned.slice(3),
    };
  }
  return {
    centered: cleaned,
    isCanonical: false,
    leftLetters: "",
    rightDigits: "",
  };
}
