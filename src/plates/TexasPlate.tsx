"use client";

import PlateFrame from "../internal/PlateFrame.js";
import PlateSvg, { PLATE_OUTLINE } from "../internal/PlateSvg.js";
import { useId } from "react";
import { PlateProps } from "../types.js";
import Registration, { cleanRegistration } from "../internal/Registration.js";
import { BEBAS_NEUE_400 } from "../internal/registrationGlyphs.js";
import { TracedLettering } from "../internal/Lettering.js";
import { TX_MOTTO, TX_NAME, TX_STAR, TX_STATE } from "../internal/traces/tx.js";

const INK = "#080808";

/** Each thread is two sine strands ~98° out of phase, so they cross alternately left and right of centre. */
function braid(cx: number, y0: number): string[] {
  const k = (2 * Math.PI) / 113, half = (98 * Math.PI) / 360;
  return [-half, half].map((phase) => {
    let d = "";
    for (let y = 0; y <= 500; y += 5) d += `${y ? "L" : "M"}${(cx + 15 * Math.sin(k * (y - y0) - Math.PI / 2 + phase)).toFixed(1)} ${y}`;
    return d;
  });
}
const BRAIDS = [...braid(187, 77), ...braid(820, 70)];

/** Texas Classic: flat black printing, a beveled star and a Texas separator. */
export default function TexasPlate({ plate, state = "Texas", className, style, ...rest }: PlateProps) {
  const id = useId().replace(/:/g, "");
  const tx = formatTxPlate(plate);
  const size = tx.centered.length <= 7 ? 300 : Math.round(300 * 7 / tx.centered.length);

  return (
    <PlateFrame className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }}
      aria-label={`License plate ${plate} from ${state}`} {...rest}>
      <PlateSvg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" role="img"
        preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
        <title>{`Texas license plate: ${plate}`}</title>
        <defs>
          {/* Plate units; the separator sits slightly higher on the sample scan than on issued plates. */}
          <symbol id={`txState-${id}`}><path d={TX_STATE} /></symbol>
          <clipPath id={`txClip-${id}`}><rect x="7" y="7" width="986" height="486" rx={PLATE_OUTLINE.rx} /></clipPath>
        </defs>
        {/* The sheeting runs flat to the edge (the scan clips the pressed rim); a hairline keeps the blank on light pages. */}
        <rect {...PLATE_OUTLINE} fill="#f5f5f2" stroke="#d2d2ce" strokeWidth="3" />
        {/* Two faint braided security threads run the full height outside the serial's centre. */}
        <g clipPath={`url(#txClip-${id})`} fill="none" stroke="#cdcecb" strokeWidth="1.8">
          {BRAIDS.map((d, i) => <path key={i} d={d} />)}
        </g>
        <path d={TX_STAR} fill={INK} fillRule="evenodd" />
        <TracedLettering text="TEXAS" fill={INK} paths={[{ d: TX_NAME }]} />
        <g id={`registration-${id}`} fill={INK}>
          <Registration face={BEBAS_NEUE_400} text={tx.left} x={363} y={388 - (300 - size) * 0.35} fontSize={size} textAnchor="end"
            width={Math.min(308, tx.left.length * 103)} />
          <use href={`#txState-${id}`} width="1000" height="500" />
          <Registration face={BEBAS_NEUE_400} text={tx.right} x={487} y={388 - (300 - size) * 0.35} fontSize={size}
            width={Math.min(445, tx.right.length * 111)} />
        </g>
        <TracedLettering text="The Lone Star State" fill={INK} paths={[{ d: TX_MOTTO }]} />
      </PlateSvg>
    </PlateFrame>
  );
}

function formatTxPlate(input: string): {
  centered: string;
  left: string;
  right: string;
} {
  const cleaned = cleanRegistration(input);
  // Standard registrations keep their 3/4 grouping; other lengths share the same symbol clearance.
  const cut = /^[A-Z*]{3}[0-9*]{4}$/.test(cleaned) ? 3 : Math.ceil(cleaned.length * 3 / 7);
  return { centered: cleaned, left: cleaned.slice(0, cut), right: cleaned.slice(cut) };
}
