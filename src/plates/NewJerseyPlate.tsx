"use client";

import PlateFrame from "../internal/PlateFrame.js";
import PlateSvg, { PLATE_INSET_RADIUS, PLATE_OUTLINE } from "../internal/PlateSvg.js";
import { useId } from "react";
import { PlateProps } from "../types.js";

export default function NewJerseyPlate({ plate, state = "New Jersey", className, style, ...rest }: PlateProps) {
  const id = useId();
  const textColor = "#171918";
  const nj = formatNjPlate(plate);
  const rightChunk = nj.middleDigits + nj.trailingLetter;

  return (
    <PlateFrame
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
        <title>{`New Jersey license plate: ${plate}`}</title>
        <defs>
          {/* Sampled down a clear column of the reference: white at the rim, then
              strong yellow from y~30, easing lighter to y~120, and fully white by
              y~390. The stops it replaces were a pale sand that barely changed top
              to bottom — the plate read as cream rather than Garden State yellow. */}
          <linearGradient id={`${id}-njBg`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#edc83f" />
            <stop offset="5%" stopColor="#f0c542" />
            <stop offset="24%" stopColor="#ffd95e" />
            <stop offset="73%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          {/* New Jersey, traced from the reference by measuring the ink span of
              every fourth scanline through the silhouette and joining the left
              and right edges. That is more faithful here than projecting lon/lat,
              because the plate carries a stylised outline rather than a survey —
              and it captures the features that make the shape readable: the
              narrow northern nub, the Hudson bulge, the waist around Trenton, the
              Delaware Bay flare, and the taper to Cape May.

              viewBox is 52x88, the shape's true measured proportions. */}
          <symbol id={`${id}-njState`} viewBox="0 0 52 88">
            <path
              d="M21 2 L27 2
                 L34 6 L41 10 L46 14 L45 18 L43 22 L41 26 L43 30 L44 34 L44 38
                 L43 42 L42 46 L42 50 L41 54 L40 58 L38 62 L35 66 L31 70 L27 74
                 L25 78 L22 82
                 L15 82
                 L16 78 L11 74 L6 70 L2 66 L1 62 L0 58 L3 54 L6 50 L12 46 L18 42
                 L17 38 L13 34 L11 30 L10 26 L10 22 L12 18 L12 14 L15 10 L18 6
                 Z"
              fill={textColor}
            />
          </symbol>
        </defs>

        <g>
          {/* No drawn border — the real plate's edge is just the pressed rim. */}
          <rect {...PLATE_OUTLINE} fill="#868c8b" />
          <rect x="3" y="3" width="994" height="494" rx={PLATE_OUTLINE.rx} fill="#fff" />
          <rect x="12" y="12" width="976" height="476" rx={PLATE_INSET_RADIUS} fill={`url(#${id}-njBg)`} />
        </g>

        {/* Sizes and baselines measured off the reference rather than guessed:
            wordmark spans y20..113, serial y144..379, motto y413..489. All three
            were undersized and sitting high. */}
        <text
          x={500}
          y={108}
          textAnchor="middle"
          fill={textColor}
          fontFamily={'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}
          fontWeight={700}
          fontSize={104}
          letterSpacing={1}
        >
          New Jersey
        </text>

        <g>
          {nj.isCanonical ? (
            <>
              <text
                x={380}
                y={379}
                textAnchor="end"
                fill={textColor}
                fontFamily={'var(--font-plate-ny, sans-serif)'}
                fontSize={324}
                letterSpacing={2}
              >
                {nj.leadingLetters}
              </text>
              <use href={`#${id}-njState`} x={408} y={226} width={52} height={88} />
              <text
                x={520}
                y={379}
                textAnchor="start"
                fill={textColor}
                fontFamily={'var(--font-plate-ny, sans-serif)'}
                fontSize={324}
                letterSpacing={2}
              >
                {rightChunk}
              </text>
            </>
          ) : (
            <text
              x={500}
              y={379}
              textAnchor="middle"
              fill={textColor}
              fontFamily={'var(--font-plate-ny, sans-serif)'}
              fontSize={324}
              letterSpacing={4}
              textLength={Math.min(880, plate.replace(/[\s\-–—]/g, "").length * 116)}
              lengthAdjust="spacingAndGlyphs"
            >
              {plate.replace(/[\s\-–—]/g, "").toUpperCase()}
            </text>
          )}
        </g>

        {/* Garden State footer */}
        <text
          x={500}
          y={486}
          textAnchor="middle"
          fill={textColor}
          fontFamily={'var(--font-geist-sans, Arial, sans-serif), ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'}
          fontWeight={800}
          fontSize={86}
          letterSpacing={0}
        >
          Garden State
        </text>
      </PlateSvg>
    </PlateFrame>
  );
}

function formatNjPlate(input: string): {
  leadingLetters: string;
  middleDigits: string;
  trailingLetter: string;
  isCanonical: boolean;
} {
  const cleaned = input.replace(/[\s\-\u2013\u2014]/g, "").toUpperCase();
  const canonical = cleaned.match(/^[A-Z0-9*]{6}$/);
  if (canonical) {
    return {
      leadingLetters: cleaned.slice(0, 3),
      middleDigits: cleaned.slice(3, 5),
      trailingLetter: cleaned.slice(5),
      isCanonical: true,
    };
  }
  const mid = Math.ceil(cleaned.length / 2);
  return {
    leadingLetters: cleaned.slice(0, mid),
    middleDigits: "",
    trailingLetter: cleaned.slice(mid),
    isCanonical: false,
  };
}

