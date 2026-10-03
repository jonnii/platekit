"use client";

import PlateFrame from "../internal/PlateFrame.js";
import PlateSvg, { PLATE_INSET_RADIUS, PLATE_OUTLINE } from "../internal/PlateSvg.js";
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
          {/* The source's separator is larger and further right than this layout's, so its traced bounds are
              refitted to the existing 88-unit-tall slot centred at x 434. */}
          <symbol id={`${id}-njState`} viewBox="463.8 177.7 68 128.7">
            <path d={NJ_STATE} fill={textColor} fillRule="evenodd" />
          </symbol>
        </defs>

        <g>
          {/* No drawn border — the real plate's edge is just the pressed rim. */}
          <rect {...PLATE_OUTLINE} fill="#868c8b" />
          <rect x="3" y="3" width="994" height="494" rx={PLATE_OUTLINE.rx} fill="#fff" />
          <rect x="12" y="12" width="976" height="476" rx={PLATE_INSET_RADIUS} fill={`url(#${id}-njBg)`} />
        </g>

        <TracedLettering text="New Jersey" fill={textColor} paths={[{ d: NJ_NAME }]} />

        <g>
          {nj.isCanonical ? (
            <>
              <Registration face={BEBAS_NEUE_400} text={nj.leadingLetters} x={380} y={379} textAnchor="end" fill={textColor} fontSize={324} letterSpacing={2} width={340} />
              <use href={`#${id}-njState`} x={410.75} y={226} width={46.5} height={88} />
              <Registration face={BEBAS_NEUE_400} text={rightChunk} x={520} y={379} textAnchor="start" fill={textColor} fontSize={324} letterSpacing={2} width={440} />
            </>
          ) : (
            <Registration face={BEBAS_NEUE_400} text={cleanRegistration(plate)} x={500} y={379} textAnchor="middle" fill={textColor} fontSize={324} letterSpacing={4} width={Math.min(880, cleanRegistration(plate).length * 116)} />
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

