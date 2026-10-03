"use client";

import PlateFrame from "../internal/PlateFrame.js";
import PlateSvg, { PLATE_OUTLINE } from "../internal/PlateSvg.js";
import { useId } from "react";
import { PlateProps } from "../types.js";
import Registration, { cleanRegistration } from "../internal/Registration.js";
import { BEBAS_NEUE_400 } from "../internal/registrationGlyphs.js";

const NAVY = "#172651";
const RED = "#7e2d2b";
const SEAL = "#d4d4d1";
const SANS = 'var(--font-geist-sans, Arial, sans-serif), ui-sans-serif, system-ui, sans-serif';

// Measured on the reference: both stripe sets share one sine, ~136 units long, with a crest at x=160.
const PERIOD = 136;
const PHASE = 160;

/** A sine-like wave y = yc - a·cos(2π(x - PHASE) / PERIOD) across the plate, from cubic half-waves. */
function wave(yc: number, a: number) {
  const h = PERIOD / 2;
  const x0 = PHASE - PERIOD * 2;
  const pt = (x: number, y: number) => `${+x.toFixed(1)} ${y}`;
  let d = `M${pt(x0, yc - a)}C${pt(x0 + 0.364 * h, yc - a)} ${pt(x0 + 0.636 * h, yc + a)} ${pt(x0 + h, yc + a)}`;
  for (let i = 2; x0 + (i - 1) * h < 1000; i++) {
    const y = i % 2 ? yc + a : yc - a;
    d += `S${pt(x0 + (i - 0.364) * h, y)} ${pt(x0 + i * h, y)}`;
  }
  return d;
}

function stars(points: [number, number][], r: number) {
  return points.map(([cx, cy]) => "M" + Array.from({ length: 10 }, (_, i) => {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const radius = i % 2 ? r * 0.4 : r;
    return `${+(cx + radius * Math.cos(angle)).toFixed(1)} ${+(cy + radius * Math.sin(angle)).toFixed(1)}`;
  }).join("L") + "Z").join("");
}

/** The seal's 24 stars in two arcs above the helmet. */
const SEAL_STARS = stars([[13, 125], [11, 110]].flatMap(([count, radius]) =>
  Array.from({ length: count }, (_, i): [number, number] => {
    const angle = ((i / (count - 1)) * 2 - 1) * 0.85;
    return [radius * Math.sin(angle), -radius * Math.cos(angle)];
  })), 4.5);

/** A standing bear supporter facing the shield; the right one is mirrored. */
const BEAR = `M-95 -70Q-90 -82 -82 -76Q-72 -78 -66 -66L-57 -60Q-60 -52 -70 -50Q-66 -40 -58 -30L-53 -22Q-62 -14 -72 -24
  Q-75 -5 -72 15Q-66 40 -70 62L-58 70H-84Q-86 50 -96 40Q-110 58 -104 70H-122Q-127 30 -120 0Q-116 -40 -104 -56Q-100 -66 -95 -70Z
  M-78 -18Q-66 8 -55 16`;

/** Faint Great Seal of Missouri behind the registration: rope ring, motto band, stars, helmet, bears and shield. */
function Seal({ id }: { id: string }) {
  return (
    <g transform="translate(500 252) scale(1.12 1)" fill="none" stroke={SEAL} strokeWidth="1.6" aria-hidden="true">
      <path id={`moRing-${id}`} d="M0 131A131 131 0 1 1 0 -131A131 131 0 1 1 0 131" stroke="none" />
      <path id={`moBelt-${id}`} d="M0 82A60 60 0 1 1 0 -38A60 60 0 1 1 0 82" stroke="none" />
      <circle r="152" strokeWidth="9" strokeDasharray="2.5 3.5" />
      <circle r="157" /><circle r="147" /><circle r="127" />
      <path d={SEAL_STARS} fill={SEAL} stroke="none" />
      <path d="M-16 -62Q-16 -90 0 -91Q16 -90 16 -62ZM-8 -84V-66M0 -86V-66M8 -84V-66" />
      <path d="M-18 -62Q-45 -70 -52 -92Q-36 -78 -24 -84M18 -62Q45 -70 52 -92Q36 -78 24 -84" />
      <path d={BEAR} /><path d={BEAR} transform="scale(-1 1)" />
      <ellipse cy="22" rx="66" ry="72" /><ellipse cy="22" rx="50" ry="54" />
      <path d="M0 -32V76M-50 28H50" />
      <path d="M-30 -10A12 12 0 1 0 -10 -10A10 10 0 0 1 -30 -10Z" fill={SEAL} stroke="none" />
      <path d="M-38 48Q-30 38 -14 40Q-6 42 -6 52L-10 56M-34 50V58M-16 50V58" />
      <path d="M27 12Q20 18 12 14Q14 30 27 40Q40 30 42 14Q34 18 27 12ZM27 8A4 4 0 1 0 27 0A4 4 0 1 0 27 8Z" fill={SEAL} stroke="none" />
      <path d="M-95 78Q-60 70 -40 95Q0 112 40 95Q60 70 95 78L92 92Q60 86 40 108Q0 124 -40 108Q-60 86 -92 92Z" fill="#f6f6f4" />
      <g fill={SEAL} stroke="none" fontFamily={SANS} fontWeight={700}>
        <text fontSize="21" letterSpacing="2">
          <textPath href={`#moRing-${id}`} startOffset="50%" textAnchor="middle" textLength="700">THE GREAT SEAL OF THE STATE OF MISSOURI</textPath>
        </text>
        <text fontSize="11">
          <textPath href={`#moBelt-${id}`} startOffset="50%" textAnchor="middle" textLength="300">UNITED WE STAND DIVIDED WE FALL</textPath>
        </text>
        <text y="127" fontSize="13" textAnchor="middle" letterSpacing="2">MDCCCXX</text>
      </g>
    </g>
  );
}

/** Missouri Bicentennial (2018–): red and navy wave stripes framing the faint state seal. */
export default function MissouriPlate({ plate, state = "Missouri", className, style, registrationStickerAreas = false, ...rest }: PlateProps) {
  const id = useId().replace(/:/g, "");
  const cleaned = cleanRegistration(plate);
  const split = cleaned.length === 6;
  const size = cleaned.length <= 7 ? 340 : Math.round(340 * 7 / cleaned.length);

  return (
    <PlateFrame className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }}
      aria-label={`License plate ${plate} from ${state}`} {...rest}>
      <PlateSvg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" role="img"
        preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
        <title>{`Missouri Bicentennial license plate: ${plate}`}</title>
        <defs>
          <clipPath id={`moField-${id}`}><rect x="10" y="10" width="980" height="480" rx="38" /></clipPath>
          <clipPath id={`moBands-${id}`}><rect x="46" y="19" width="907" height="461" rx="10" /></clipPath>
        </defs>
        <rect {...PLATE_OUTLINE} fill="#dadada" />
        <rect x="8.5" y="8.5" width="983" height="483" rx="40" fill="#f6f6f4" stroke="#979797" strokeWidth="3" />
        <Seal id={id} />
        <g clipPath={`url(#moField-${id})`} fill="none" strokeWidth="1.6">
          <g stroke="#9a5552">{[0, 1, 2, 3].map((k) => <path key={k} d={wave(38 + 10 * k, 7)} />)}</g>
          <g stroke="#56607e">{[0, 1, 2, 3].map((k) => <path key={k} d={wave(460 - 10 * k, -7)} />)}</g>
        </g>
        <g clipPath={`url(#moBands-${id})`}>
          <path d={`${wave(29, 7)}V0H-112Z`} fill={RED} />
          <path d={`${wave(471, -7)}V500H-112Z`} fill={NAVY} />
        </g>
        {/* The printed month (AUG on the reference) is not supplied, so the decal corner stays unassigned. */}
        {registrationStickerAreas && <g data-plate-registration-sticker-area=""><rect x="52" y="32" width="152" height="48" rx="6" fill="none" stroke="#c9ccd6" strokeWidth="1.5" /></g>}
        <g fill={NAVY} fontFamily={SANS} textAnchor="middle">
          <text x="500" y="71" fontWeight={800} fontSize="44" textLength="266" lengthAdjust="spacingAndGlyphs">MISSOURI</text>
          <text x="496" y="98" fontWeight={700} fontSize="26" textLength="213" lengthAdjust="spacingAndGlyphs">BICENTENNIAL</text>
          <text x="451" y="417" fontWeight={700} fontSize="25" textLength="60" lengthAdjust="spacingAndGlyphs">1821</text>
          <text x="557" y="417" fontWeight={700} fontSize="25" textLength="54" lengthAdjust="spacingAndGlyphs">2021</text>
          <path d={stars([[501, 408]], 10)} />
        </g>
        <g fill={NAVY} stroke="#c8cfd6" paintOrder="stroke">
          {split ? <>
            <Registration face={BEBAS_NEUE_400} text={cleaned.slice(0, 3)} x={52} y={370} fontSize={size} strokeWidth={3} width={377} />
            <Registration face={BEBAS_NEUE_400} text={cleaned.slice(3)} x={588} y={370} fontSize={size} strokeWidth={3} width={320} />
          </> : <Registration face={BEBAS_NEUE_400} text={cleaned} x={500} y={370 - (340 - size) * 0.35} fontSize={size} strokeWidth={3} textAnchor="middle"
            width={Math.min(890, cleaned.length * 128)} />}
        </g>
      </PlateSvg>
    </PlateFrame>
  );
}
