"use client";

import PlateFrame from "../internal/PlateFrame.js";
import PlateSvg, { PLATE_OUTLINE } from "../internal/PlateSvg.js";
import { useId } from "react";
import { PlateProps } from "../types.js";
import Registration, { cleanRegistration } from "../internal/Registration.js";
import { TEKO_500 } from "../internal/registrationGlyphs.js";
import { TracedLettering } from "../internal/Lettering.js";
import { CA_NAME, CA_URL } from "../internal/traces/ca.js";

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
        <rect {...PLATE_OUTLINE} fill="#fff" stroke="#c9cbcd" strokeWidth="2.5" />
        {/* Stamped ridge about 32 units inside the edge on the issued plate. */}
        <rect x="32" y="32" width="936" height="436" rx="22" fill="none" stroke="#d5d6d8" strokeWidth="2" />

        {/* Traced in place from the issued-plate reference; the script sits above the registration. */}
        <TracedLettering text="California" fill={red} paths={[{ d: CA_NAME }]} />

        {/* Measured on the issued-plate reference: glyphs 200–412 tall across x 82–920, with no spaces between groups. */}
        {ca.isCanonical ? (
          <Registration face={TEKO_500} text={`${ca.leftDigit}${ca.midLetters}${ca.rightDigits}`} id={`registration-${id}`} x={501} y={410} textAnchor="middle" fill={blue} fontSize={304} width={838} letterSpacing={2} />
        ) : (
          <Registration face={TEKO_500} text={ca.centered} x={500} y={410} textAnchor="middle" fill={blue} fontSize={Math.min(304, 2150 / Math.max(ca.centered.length, 1))} letterSpacing={6} width={900} />
        )}

        <TracedLettering text="dmv.ca.gov" fill={red} paths={[{ d: CA_URL }]} />
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
  const cleaned = cleanRegistration(input);
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
