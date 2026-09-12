"use client";

import PlateFrame from "../internal/PlateFrame.js";
import PlateSvg, { PLATE_OUTLINE } from "../internal/PlateSvg.js";
import { useId } from "react";
import { PlateProps } from "../types.js";

export default function CaliforniaPlate({ plate, state = "California", className, style, ...rest }: PlateProps) {
  const id = useId().replace(/:/g, "");
  // Sampled from a photo of a real plate rather than picked by eye: the script
  // is a dark brick red and the serial nearly black-navy, both a long way from
  // the bright #D32F2F / #003399 they replaced.
  const red = "#a21110";
  const blue = "#050a60";
  const ca = formatCaPlate(plate);

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
        <title>California</title>
        <defs>
          <linearGradient id={`caRim-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#d8d9d7" /><stop offset="0.1" stopColor="#fff" />
            <stop offset="0.9" stopColor="#fafafa" /><stop offset="1" stopColor="#9d9f9b" />
          </linearGradient>
        </defs>
        <rect {...PLATE_OUTLINE} fill="#fff" />
        <path d="M1 30 Q1 1 30 1 H970 Q999 1 999 30 M1 470 Q1 499 30 499 H970 Q999 499 999 470" fill="none" stroke={`url(#caRim-${id})`} strokeWidth="2.5" />

        {/* Brush script with the wide proportions and trailing swash of the white base */}
        <text
          x={500}
          y={109}
          textAnchor="middle"
          fill={red}
          fontFamily={"var(--font-plate-script, cursive)"}
          fontWeight={400}
          fontSize={118}
          textLength="500"
          lengthAdjust="spacingAndGlyphs"
        >
          California
        </text>

        <path d="M744 99 C747 111 779 113 808 111 L804 115 C777 118 742 116 739 108 Z" fill={red} />

        {/* A single fitted run keeps canonical groups within the pressed rim. */}
        {ca.isCanonical ? (
          <text
            id={`registration-${id}`}
            x={500}
            y={401}
            textAnchor="middle"
            fill={blue}
            fontFamily={"var(--font-plate-ny, sans-serif)"}
            fontSize={332}
            textLength="820"
            lengthAdjust="spacingAndGlyphs"
            letterSpacing={2}
          >
            {`${ca.leftDigit} ${ca.midLetters} ${ca.rightDigits}`}
          </text>
        ) : (
          <text
            x={500}
            y={401}
            textAnchor="middle"
            fill={blue}
            fontFamily={"var(--font-plate-ny, sans-serif)"}
            fontSize={Math.min(332, 2150 / Math.max(ca.centered.length, 1))}
            letterSpacing={6}
          >
            {ca.centered}
          </text>
        )}

        <text
          x={500}
          y={462}
          textAnchor="middle"
          fill={red}
          fontFamily={'var(--font-geist-sans, Arial, sans-serif), ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'}
          fontWeight={600}
          fontSize={42}
          textLength="470"
          lengthAdjust="spacingAndGlyphs"
          letterSpacing={1}
        >
          dmv.ca.gov
        </text>
      </PlateSvg>
    </PlateFrame>
  );
}

function formatCaPlate(input: string): {
  centered: string;
  isCanonical: boolean;
  leftDigit: string;
  midLetters: string;
  rightDigits: string;
} {
  const cleaned = input.replace(/[\s\-\u2013\u2014]/g, "").toUpperCase();
  // Match canonical format: 1 digit + 3 letters/asterisks + 3 digits
  const m = cleaned.match(/^([0-9*])([A-Z*]{3})([0-9*]{3})$/);
  if (m) {
    return {
      centered: cleaned,
      isCanonical: true,
      leftDigit: m[1],
      midLetters: m[2],
      rightDigits: m[3],
    };
  }
  return {
    centered: cleaned,
    isCanonical: false,
    leftDigit: "",
    midLetters: "",
    rightDigits: "",
  };
}
