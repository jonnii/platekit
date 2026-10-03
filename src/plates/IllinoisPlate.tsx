"use client";

import PlateFrame from "../internal/PlateFrame.js";
import PlateSvg, { PLATE_OUTLINE } from "../internal/PlateSvg.js";
import { useId } from "react";
import { PlateProps } from "../types.js";
import Registration, { cleanRegistration } from "../internal/Registration.js";
import { BARLOW_CONDENSED_500 } from "../internal/registrationGlyphs.js";
import { TracedLettering } from "../internal/Lettering.js";
import { IL_MOTTO, IL_NAME } from "../internal/traces/il.js";

/** Illinois' Land of Lincoln base: cropped portrait, white landmarks, blue sky. */
export default function IllinoisPlate({ plate, state = "Illinois", className, style, ...rest }: PlateProps) {
  const id = useId().replace(/:/g, "");
  const sky = `${id}-sky`;
  const clip = `${id}-clip`;
  const cleaned = cleanRegistration(plate);
  const serialWidth = Math.min(860, cleaned.length * 112);

  return (
    <PlateFrame
      className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }}
      aria-label={`License plate ${plate} from ${state}`} {...rest}
    >
      <PlateSvg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" role="img"
        preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
        <title>{`Illinois license plate: ${plate}`}</title>
        <defs>
          <linearGradient id={sky} gradientUnits="userSpaceOnUse" x1="0" y1="28" x2="0" y2="345">
            <stop offset="0" stopColor="#309cdc" />
            <stop offset="0.45" stopColor="#3fa4e2" />
            <stop offset="0.63" stopColor="#80c3ef" />
            <stop offset="0.82" stopColor="#b6daf2" />
            <stop offset="1" stopColor="#d5e8f5" />
          </linearGradient>
          {/* The printed field sits inside a broad embossed rim. */}
          <clipPath id={clip}><rect x="28" y="28" width="943" height="438" rx="24" /></clipPath>
        </defs>
        <rect {...PLATE_OUTLINE} fill="#fafbf9" />
        <g clipPath={`url(#${clip})`}>
          <rect width="1000" height="500" fill={`url(#${sky})`} />

          <g fill="#fafbf9">
            {/* Low ground line shared by the skyline, farm and capitol. */}
            <path d="M0 318H440V340H1000V500H0Z" />
            {/* Willis Tower with twin masts, then the stepped Loop blocks. */}
            <path d="M177 75H180V106H184V75H187V106H199V165H205V218H220V268H245V330H145V290H162V218H166V165H171V106H177Z" />
            <path d="M278 205H285V197H314V205H322V241H370V235H400V245H412V255H428V345H278Z" />
            <path d="M565 345V320H600V298H655V345Z" />
            {/* Farm windmill: bladed wheel, tail vane and splayed tower. */}
            <g aria-label="Farm windmill">
              {Array.from({ length: 16 }, (_, i) => <path key={i} transform={`rotate(${i * 22.5} 513 257)`} d="M513 250L511.7 234 L514.3 234Z M511 249L509 234H517L515 249Z" />)}
              <circle cx="513" cy="257" r="5" />
              <path d="M513 255H536V259H513Z M533 251L569 246V270L533 264Z" />
              <path d="M509 266L499 342H505L512 270Z M517 266L527 342H521L514 270Z M503 300H523V304H503Z" />
            </g>
            {/* Springfield capitol: needle, lantern, ringed drum, dome and wings. */}
            <g aria-label="Illinois State Capitol">
              <path d="M781 25H783V90H781Z M767 112Q768 92 782 88Q796 92 797 112Z" />
              <rect x="764" y="110" width="36" height="6" rx="2" />
              <path d="M768 115H773V143H768Z M779.5 115H784.5V143H779.5Z M791 115H796V143H791Z" />
              <path d="M757 152Q757 143 766 142H798Q807 143 807 152Q806 160 798 161H766Q758 160 757 152Z M767 160H797V174H767Z" />
              <path d="M767 172Q742 192 730 222Q719 247 718 258H846Q845 247 834 222Q822 192 797 172Z" />
              <path d="M712 256H848V300H712Z M697 298H860V345H697Z" />
            </g>
          </g>

          {/* Lincoln's halftone portrait is printed pale, close to the plate white. */}
          <g aria-label="Abraham Lincoln portrait">
            <path d="M0 78Q30 71 60 73Q85 76 98 90Q110 104 112 118Q126 128 132 145Q136 162 140 182Q143 205 140 225Q136 245 130 262Q124 285 115 300L108 318L100 345L78 374L52 402L30 430L0 435Z" fill="#b4b4aa" />
            <path d="M0 128Q40 115 80 122Q100 128 110 145Q114 165 116 190Q118 215 115 240Q112 262 104 280Q95 298 80 305Q60 310 40 305L0 300Z" fill="#d8d8d0" />
                        <path d="M0 284Q20 296 45 300Q75 304 95 295Q105 288 110 276L115 300Q100 318 80 322Q50 326 0 320Z" fill="#c2c2ba" />
            <g fill="#9e9e96">
              <path d="M44 199Q60 191 78 197L77 204Q60 199 45 205Z M98 200Q110 195 123 201L121 207Q110 202 99 206Z" />
              <ellipse cx="62" cy="214" rx="10" ry="4" />
              <ellipse cx="110" cy="216" rx="8" ry="4" />
              <path d="M88 212Q92 234 97 250Q90 257 81 252L86 244Z M58 268Q84 261 106 269L104 276Q85 270 60 275Z M112 214Q121 240 113 276L106 262Q112 240 107 220Z" />
            </g>
            <path d="M20 86Q40 96 52 112M58 80Q80 92 92 112M96 104Q116 124 122 150M118 168Q132 190 130 214" fill="none" stroke="#a2a298" strokeWidth="4" strokeLinecap="round" />
            {/* Coat shoulders rise only to the motto line; folds stay faint. */}
            <path d="M0 470V448Q30 412 80 397Q110 386 150 384Q195 384 225 396Q252 410 262 440L270 470Z" fill="#75766e" />
            <path d="M60 470Q70 430 100 410M150 400Q160 430 150 470M205 400Q228 425 232 470" fill="none" stroke="#8a8b82" strokeWidth="3" strokeLinecap="round" />
            <path d="M112 392L100 430L92 470M182 390L178 430L186 470M40 440Q60 420 84 414M246 420L238 450" fill="none" stroke="#5f6058" strokeWidth="3" strokeLinecap="round" />
          </g>
        </g>
        <rect x="27" y="27" width="945" height="440" rx="25" fill="none" stroke="#8e9290" strokeWidth="2.5" />
        <rect {...PLATE_OUTLINE} fill="none" stroke="#a3a7a5" strokeWidth="2" />

        <TracedLettering text="ILLINOIS" fill="#1b2f5a" paths={[{ d: IL_NAME }]} />

        <g>
          <Registration face={BARLOW_CONDENSED_500} text={cleaned} x={525} y={371} fontSize={325} textAnchor="middle" fill="#707571" stroke="#707571" strokeWidth={4} opacity="0.5" width={serialWidth} />
          <Registration face={BARLOW_CONDENSED_500} text={cleaned} x={522} y={368} fontSize={325} textAnchor="middle" fill="#7a2f4f" stroke="#f8f8f3" strokeWidth={3} paintOrder="stroke" width={serialWidth} />
        </g>

        <TracedLettering text="Land of Lincoln" fill="#111613" paths={[{ d: IL_MOTTO }]} />
      </PlateSvg>
    </PlateFrame>
  );
}
