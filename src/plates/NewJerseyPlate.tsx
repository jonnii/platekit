"use client";

import PlateFrame from "../internal/PlateFrame.js";
import PlateSvg, { PLATE_OUTLINE } from "../internal/PlateSvg.js";
import { useId } from "react";
import { PlateProps } from "../types.js";
import Registration, { cleanRegistration } from "../internal/Registration.js";
import { BEBAS_NEUE_400 } from "../internal/registrationGlyphs.js";
import { TracedLettering } from "../internal/Lettering.js";
import { NJ_MOTTO, NJ_NAME, NJ_STATE } from "../internal/traces/nj.js";

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
          {/* Sampled down clear side columns of the MVC sample: a pale lemon yellow
              that fades almost linearly to cream at the bottom edge, never pure white. */}
          <linearGradient id={`${id}-njBg`} gradientUnits="userSpaceOnUse" x1="0" y1="30" x2="0" y2="470">
            <stop offset="0" stopColor="#ffe761" />
            <stop offset="1" stopColor="#fff8d4" />
          </linearGradient>
          {/* Traced in place: the symbol's viewBox and its use share the outline's plate-unit bounds. */}
          <symbol id={`${id}-njState`} viewBox="466.5 186.9 66.5 125.1">
            <path d={NJ_STATE} fill={textColor} fillRule="evenodd" />
          </symbol>
        </defs>

        <g>
          {/* A wide white rim around the printed field, which has a hairline grey edge. */}
          <rect {...PLATE_OUTLINE} fill="#868c8b" />
          <rect x="3" y="3" width="994" height="494" rx={PLATE_OUTLINE.rx} fill="#fff" />
          <rect x="24" y="23" width="950" height="453" rx="18" fill={`url(#${id}-njBg)`} stroke="#8f8b7c" strokeWidth="1.2" />
        </g>

        <TracedLettering text="New Jersey" fill={textColor} paths={[{ d: NJ_NAME }]} />

        <g>
          {nj.isCanonical ? (
            <>
              <Registration face={BEBAS_NEUE_400} text={nj.leadingLetters} x={419} y={371} textAnchor="end" fill={textColor} fontSize={326} letterSpacing={2} width={350} />
              <use href={`#${id}-njState`} x={466.5} y={186.9} width={66.5} height={125.1} />
              <Registration face={BEBAS_NEUE_400} text={rightChunk} x={580} y={371} textAnchor="start" fill={textColor} fontSize={326} letterSpacing={2} width={351} />
            </>
          ) : (
            <Registration face={BEBAS_NEUE_400} text={cleanRegistration(plate)} x={500} y={371} textAnchor="middle" fill={textColor} fontSize={324} letterSpacing={4} width={Math.min(880, cleanRegistration(plate).length * 116)} />
          )}
        </g>

        <TracedLettering text="Garden State" fill={textColor} paths={[{ d: NJ_MOTTO }]} />
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
  const cleaned = cleanRegistration(input);
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

