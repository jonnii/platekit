"use client";

import PlateFrame from "../internal/PlateFrame.js";
import PlateSvg, { PLATE_INSET_RADIUS, PLATE_OUTLINE } from "../internal/PlateSvg.js";
import { useId } from "react";
import { PlateProps } from "../types.js";
import Registration, { cleanRegistration } from "../internal/Registration.js";
import { BARLOW_CONDENSED_500 } from "../internal/registrationGlyphs.js";
import { TracedLettering } from "../internal/Lettering.js";
import { PA_NAME, PA_URL } from "../internal/traces/pa.js";

/** Pennsylvania's blue-and-yellow visitPA.com base, with a keystone separator. */
const NAVY = "#06104e";
const YELLOW = "#e4ba03";
const SERIAL = "#0b1a6b";

/** The keystone: wide flat cap, short flared shoulders, tapering to a flat base. */
function keystone(x: number, y: number, w: number, h: number) {
  return (
    <g transform={`translate(${x} ${y}) scale(${w / 100} ${h / 100})`}>
      <path
        d="M20 0 H80 Q83 0 83 3 V20 H97 Q100 20 100 24 V36 L83 97 Q82 100 79 100 H24 Q21 100 20 97 L0 36 V24 Q0 20 3 20 H17 V3 Q17 0 20 0 Z"
        fill="#06136a"
        stroke="#e2e2e6"
        strokeWidth="5"
        paintOrder="stroke"
      />
    </g>
  );
}

/** Pennsylvania issues LLL-DDDD, so split three letters from the rest. */
function splitSerial(input: string) {
  const cleaned = cleanRegistration(input);
  if (cleaned.length < 5) return { left: cleaned, right: "", split: false };
  const m = cleaned.match(/^([A-Z*]{3})([0-9*].*)$/);
  if (m) return { left: m[1], right: m[2], split: true };
  const at = Math.ceil(cleaned.length / 2);
  return { left: cleaned.slice(0, at), right: cleaned.slice(at), split: true };
}

export default function PennsylvaniaPlate({ plate, state = "Pennsylvania", className, style, ...rest }: PlateProps) {
  const id = useId().replace(/:/g, "");
  const { left, right, split } = splitSerial(plate);
  const total = left.length + right.length;
  const size = total <= 7 ? 306 : 280;
  const serialY = total <= 7 ? 362 : 351;

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
        <title>{`Pennsylvania license plate: ${plate}`}</title>
        <defs>
          <clipPath id={`paClip-${id}`}><rect x="27" y="27" width="947" height="449" rx="18" /></clipPath>
          <filter id={`paEmboss-${id}`} x="-5%" y="-5%" width="110%" height="115%"><feDropShadow dx="1.2" dy="1.6" stdDeviation="0.5" floodColor="#a9af9a" /></filter>
        </defs>
        <rect {...PLATE_OUTLINE} fill="#d6d5da" />
        <rect x="11" y="9" width="978" height="483" rx={PLATE_INSET_RADIUS} fill="none" stroke="#e8e8ec" strokeWidth="3" />
        {/* The printed design is an inset, navy-outlined panel inside a plain embossed margin. */}
        <g clipPath={`url(#paClip-${id})`}>
          <rect width="1000" height="500" fill="#dcdce0" />
          <rect width="1000" height="122" fill={NAVY} />
          <rect y="381" width="1000" height="119" fill={YELLOW} />
        </g>
        <rect x="27" y="27" width="947" height="449" rx="18" fill="none" stroke={NAVY} strokeWidth="6" />
        <TracedLettering text="PENNSYLVANIA" fill="#ffffff" paths={[{ d: PA_NAME }]} />

        {split ? (
          <>
            <Registration face={BARLOW_CONDENSED_500} text={left} x={392} y={serialY} textAnchor="end" fill={SERIAL} stroke="#c8ccc5" strokeWidth={3} paintOrder="stroke" fontSize={size} filter={`url(#paEmboss-${id})`} letterSpacing={2} width={Math.min(330, left.length * 108)} />
            {keystone(415, 224, 56, 59)}
            <Registration face={BARLOW_CONDENSED_500} text={right} x={507} y={serialY} textAnchor="start" fill={SERIAL} stroke="#c8ccc5" strokeWidth={3} paintOrder="stroke" fontSize={size} filter={`url(#paEmboss-${id})`} letterSpacing={2} width={Math.min(425, right.length * 106)} />
          </>
        ) : (
          <Registration face={BARLOW_CONDENSED_500} text={left} x={500} y={362} textAnchor="middle" fill={SERIAL} fontSize={size} letterSpacing={4} width={900} />
        )}

        <TracedLettering text="visitPA.com" fill="#111111" paths={[{ d: PA_URL }]} />
      </PlateSvg>
    </PlateFrame>
  );
}
