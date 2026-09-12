"use client";

import PlateSvg, { PLATE_OUTLINE } from "../internal/PlateSvg.js";
import { useId } from "react";
import { PlateProps } from "../types.js";

/** Illinois' Land of Lincoln base: cropped portrait, white landmarks, blue sky. */
export default function IllinoisPlate({ plate, state = "Illinois", className, style, ...rest }: PlateProps) {
  const id = useId().replace(/:/g, "");
  const sky = `${id}-sky`;
  const clip = `${id}-clip`;
  const face = `${id}-face`;
  const coat = `${id}-coat`;
  const slot = `${id}-slot`;
  const cleaned = plate.replace(/[\s\-–—]/g, "").toUpperCase();
  const serialWidth = Math.min(860, cleaned.length * 112);

  return (
    <div
      className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }}
      aria-label={`License plate ${plate} from ${state}`} {...rest}
    >
      <PlateSvg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" role="img"
        preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
        <title>{`Illinois license plate: ${plate}`}</title>
        <defs>
          <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#29abe0" />
            <stop offset="24%" stopColor="#62bee0" />
            <stop offset="54%" stopColor="#b8e1ee" />
            <stop offset="80%" stopColor="#f8faf9" />
            <stop offset="100%" stopColor="#fafafa" />
          </linearGradient>
          <linearGradient id={face} x1="0" y1="0" x2="1" y2="0.4">
            <stop stopColor="#fcfcfa" />
            <stop offset="65%" stopColor="#f0f0ed" />
            <stop offset="100%" stopColor="#b7b9b5" />
          </linearGradient>
          <linearGradient id={coat} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#454746" />
            <stop offset="55%" stopColor="#555754" />
            <stop offset="100%" stopColor="#414342" />
          </linearGradient>
          <radialGradient id={slot} cx="50%" cy="35%" r="72%">
            <stop stopColor="#f4f4f2" />
            <stop offset="58%" stopColor="#dededc" />
            <stop offset="100%" stopColor="#989c9c" />
          </radialGradient>
          <clipPath id={clip}><rect {...PLATE_OUTLINE} /></clipPath>
        </defs>
        <rect {...PLATE_OUTLINE} fill="#fafbf9" />
        <g clipPath={`url(#${clip})`}>
          <rect width="1000" height="500" fill={`url(#${sky})`} />

          {/* Willis Tower and the stepped Chicago skyline. */}
          <g fill="#fbfcfb">
            <path d="M139 390V151H147V84H152V51H156V84H162V45H167V84H180V185H205V180H228V192H248V186H269V197H293V212H319V214H341V225H394V231H410V248H427V394Z" />
            <path d="M177 189H201V391H177Z" fill="#e8f6f8" />
            <path d="M316 226H341V396H316Z" fill="#edf7f8" />
          </g>

          {/* Capitol lantern, ribbed dome and low wings in Springfield. */}
          <g fill="#fcfdfb">
            <path d="M811 10H813V72H811Z M795 93Q796 77 808 70H817Q829 79 830 93Z" />
            <rect x="794" y="91" width="37" height="6" rx="2" />
            <path d="M799 96H803V129H799Z M809 96H813V129H809Z M820 96H824V129H820Z" />
            <path d="M790 134Q791 126 801 126H825Q839 129 838 139L831 148H798Q785 145 790 134Z" />
            <path d="M799 148H829Q856 176 873 204Q888 227 888 256V349H902V393H720V348H741V258Q742 227 759 203Q777 175 799 148Z" />
            <path d="M746 258Q759 197 807 155Q777 197 770 258V348H746Z" fill="#e8f4f6" />
            <path d="M808 152Q792 201 790 259M820 153Q845 201 850 259" fill="none" stroke="#eaf4f5" strokeWidth="3" />
            <path d="M713 349H922V361H713Z M767 315H865V329H767Z" />
            <path d="M541 319L557 306L674 294L686 338H541Z M553 337H679V385H553Z" />
            <g aria-label="Farm windmill" fill="none" stroke="#fcfdfb" strokeWidth="2">
              <path d="M523 281 L513 390 M528 281 L538 390 M519 314 H531 M517 340 H533 M515 368 H536 M519 314 L533 340 515 368 538 390 M531 314 L517 340 536 368 513 390 M526 281 H557" />
              <circle cx="526" cy="279" r="22" strokeWidth="1" />
              {Array.from({ length: 16 }, (_, i) => <path key={i} transform={`rotate(${i * 22.5} 526 279)`} d="M526 279 V260 L531 256 529 270Z" fill="#fcfdfb" strokeWidth=".6" />)}
              <path d="M548 279 L563 271 V285Z" fill="#fcfdfb" stroke="none" />
            </g>
          </g>

          {/* Lincoln's coat, shirt and overlapping lapels continue off the edge. */}
          <path d="M-15 355L40 332L86 310L110 324L125 349L166 365L217 397Q261 405 274 447L287 500H-15Z" fill={`url(#${coat})`} />
          <path d="M0 344L53 322L85 312L66 360L33 421L8 454L0 445Z" fill="#fafaf7" />
          <path d="M4 356Q21 355 44 369L61 351L77 361L60 386L39 384L20 407L8 401Z" fill="#414441" />
          <path d="M87 314L113 333L121 365L84 452L42 450L66 391Z" fill="#5b5d59" />
          <path d="M121 347L159 373L142 392L161 407L137 481L143 500H116L111 476L95 453Z" fill="#60625e" />
          <path d="M120 350L86 452L42 450M88 469L66 493" fill="none" stroke="#777973" strokeWidth="3" opacity="0.55" />
          <path d="M169 435Q189 415 224 408L211 424L191 440L195 489H175Z" fill="#343735" opacity="0.65" />
          <path d="M211 416Q185 437 186 471L193 500M174 456L165 494" fill="none" stroke="#787a73" strokeWidth="3" opacity="0.45" />

          {/* The half portrait is light on the forehead and angular at the cheek. */}
          <path d="M-18 80Q20 64 68 81L101 102L121 143L119 211L99 244L91 283L61 315L15 334L-18 339Z" fill={`url(#${face})`} />
          <path d="M-9 43Q9 31 30 29Q45 22 58 39Q67 26 80 36Q101 45 109 65L112 81L101 89Q124 91 132 123L136 151L145 171L138 176L149 183L139 190L146 196L132 199L131 219L119 227L113 208L115 186L103 155L100 124L89 105L86 92L71 89L60 95L50 91L39 97L31 94L21 100L15 96L10 100L4 96L-9 101Z" fill="#828580" />
          {/* Broken highlights follow swept hair, avoiding a solid cartoon outline. */}
          <g fill="none" stroke="#f2f2ee" strokeLinecap="round" strokeWidth="3">
            <path d="M19 40L30 51L25 39L43 52L38 38L53 57M16 54L29 65L22 51L39 69M46 43L60 65L54 46L65 56L69 74M68 48L82 67L77 51L87 62L88 76M88 43Q105 63 101 79" />
            <path d="M105 104L116 128L111 107L121 123L124 146M103 125L112 145L110 130L120 160M119 153L129 171L124 153M129 170L139 177M116 174L128 186L139 189M127 194L134 204" />
          </g>
          <g fill="#aaada7">
            <path d="M28 173L49 169L68 161L69 172L78 185L62 180L43 188L26 186Z" />
            <path d="M15 239L26 239L35 244L27 249L21 250L18 257L10 257L10 244Z" />
            <path d="M39 230Q47 248 67 265L75 259L70 273L55 269Z" />
            <path d="M10 269L23 266L35 269L51 267L58 271L44 275L25 273L10 274Z" />
            <path d="M13 283L38 282L29 287L13 288Z" />
          </g>
          <path d="M32 188L43 182L57 180L67 188L58 187L52 192L43 192L38 188Z" fill="#777c75" />
          <path d="M38 190Q48 183 58 190L53 195L44 195Z" fill="#eceee8" />
          <ellipse cx="49" cy="191" rx="3.3" ry="3.7" fill="#676d64" />
          <path d="M33 199L46 201L61 197M73 203L69 222L61 231" fill="none" stroke="#d3d6cf" strokeWidth="2.5" />
          <path d="M105 204Q119 190 124 204L119 225L110 234L108 248L101 251L103 235L113 220L111 210Z" fill="#d2d5cd" />
          <path d="M-5 297L10 291L18 299L28 293L37 299L44 290L53 298L62 288L70 282L83 258L97 244L105 246L98 277L90 291L87 310L73 324L51 336L29 341L13 350L-5 350Z" fill="#949891" />
          <g fill="none" strokeLinecap="round">
            <path d="M7 311L13 319L9 333M20 302L24 317L31 309L32 329M40 300L44 317L37 329M53 301L50 319L60 310L55 328M69 291L66 309L75 299L69 319M84 278L79 299L87 291M94 260L89 277" stroke="#c9cdc4" strokeWidth="3" />
            <path d="M3 341L20 330M29 335L40 325M52 332L66 323M77 312L84 301M17 305L17 315" stroke="#6f756d" strokeWidth="3" />
          </g>

          <rect {...PLATE_OUTLINE} fill="none" stroke="#fafbf9" strokeWidth="12" />
          <rect {...PLATE_OUTLINE} fill="none" stroke="#d2d6d5" strokeWidth="2" />
          {[38, 437].map((y) => [156, 765].map((x) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="84" height="21" rx="10.5"
              fill={`url(#${slot})`} stroke="#c0c4c2" strokeWidth="1" />
          )))}
        </g>

        <text x="506" y="85" textAnchor="middle" fill="#101412"
          fontFamily='"Times New Roman", Times, serif' fontWeight={400} fontSize="82"
          textLength="481" lengthAdjust="spacingAndGlyphs">ILLINOIS</text>

        <g fontFamily="var(--font-plate-ny, sans-serif)" fontSize="325" textAnchor="middle">
          <text x="525" y="371" fill="#707571" stroke="#707571" strokeWidth="4" opacity="0.5"
            textLength={serialWidth || undefined} lengthAdjust="spacingAndGlyphs">{cleaned}</text>
          <text x="522" y="368" fill="#aa252c" stroke="#f8f8f3" strokeWidth="3" paintOrder="stroke"
            textLength={serialWidth || undefined} lengthAdjust="spacingAndGlyphs">{cleaned}</text>
        </g>

        <text x="504" y="461" textAnchor="middle" fill="#111613"
          fontFamily='"Times New Roman", Times, serif' fontSize="62"
          style={{ fontVariant: "small-caps" }} textLength="438" lengthAdjust="spacingAndGlyphs">
          Land of Lincoln
        </text>
      </PlateSvg>
    </div>
  );
}
