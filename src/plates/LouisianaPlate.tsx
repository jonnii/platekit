"use client";

import PlateFrame from "../internal/PlateFrame.js";
import PlateSvg, { PLATE_INSET_RADIUS, PLATE_OUTLINE } from "../internal/PlateSvg.js";
import { useId } from "react";
import type { PlateProps } from "../types.js";

export default function LouisianaPlate({ plate, state = "Louisiana", className, style, registrationStickerAreas = false, ...rest }: PlateProps) {
  const id = useId().replace(/:/g, "");
  const cleaned = plate.replace(/[\s\-–—]/g, "").toUpperCase();
  const split = /^[A-Z0-9*]{6}$/.test(cleaned);
  return (
    <PlateFrame className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }} aria-label={`License plate ${plate} from ${state}`} {...rest}>
      <PlateSvg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
        <title>{`Louisiana license plate: ${plate}`}</title>
        <defs>
          <clipPath id={`laClip-${id}`}><rect x="15" y="12" width="970" height="475" rx={PLATE_INSET_RADIUS} /></clipPath>
          <linearGradient id={`laSky-${id}`} x2="0" y2="1"><stop stopColor="#f0f1ee" /><stop offset="0.34" stopColor="#f0f1eb" /><stop offset="0.67" stopColor="#dedbb0" /><stop offset="0.75" stopColor="#ded5a2" /><stop offset="0.91" stopColor="#c8806c" /><stop offset="1" stopColor="#c2675e" /></linearGradient>
          <linearGradient id={`laBody-${id}`} x1="0" y1="1" x2="0.9" y2="0"><stop stopColor="#655f4d" /><stop offset="0.4" stopColor="#a49e88" /><stop offset="0.8" stopColor="#c7c3ad" /><stop offset="1" stopColor="#8e8b79" /></linearGradient>
          <linearGradient id={`laWood-${id}`} x2="1" y2="0"><stop stopColor="#725046" /><stop offset="0.3" stopColor="#91695b" /><stop offset="0.65" stopColor="#79574c" /><stop offset="1" stopColor="#a07566" /></linearGradient>
          <linearGradient id={`laWell-${id}`} x2="1" y2="1"><stop stopColor="#a29176" /><stop offset="1" stopColor="#e9c3a5" /></linearGradient>
          <clipPath id={`laFeathers-${id}`}><path d="M477 260 C478 289 540 289 586 306 Q633 326 645 372 L666 414 Q644 402 621 407 C566 411 510 386 489 361 C469 337 462 302 477 260 Z" /></clipPath>
        </defs>
        <rect {...PLATE_OUTLINE} fill="#f4f4ef" />
        <g clipPath={`url(#laClip-${id})`}>
          <rect width="1000" height="500" fill={`url(#laSky-${id})`} />
          {/* Weathered piling, its uneven end grain and vertical cracks. */}
          <path d="M418 444 Q482 427 552 437 L596 449 L596 494 H412 Z" fill={`url(#laWood-${id})`} />
          <path d="M418 444 Q482 427 552 437 L596 449 Q550 458 479 450 Z" fill="#a08171" />
          <path d="M444 442 Q500 434 556 445 Q525 451 474 445 M470 439 Q511 435 536 444" fill="none" stroke="#6f5149" strokeWidth="1.4" />
          {Array.from({ length: 30 }, (_, i) => <path key={`wood-${i}`} d={`M${418 + i * 6} ${(446 + Math.sin(i * 7) * 4).toFixed(2)} l${(Math.sin(i) * 2).toFixed(2)} 48`} fill="none" stroke={i % 3 ? "#573b36" : "#b69581"} strokeWidth={i % 3 ? "1.2" : "2"} opacity="0.55" />)}
          {/* Legs and splayed toes behind the body. */}
          <g fill="none" strokeLinecap="round">
            <path d="M552 385 L544 413 L537 432 L528 436 M587 397 L582 422 L575 443 L565 445" stroke="#736f5c" strokeWidth="6" />
            <path d="M549 394 L539 429 M584 409 L577 438" stroke="#c0bba2" strokeWidth="2" />
            <path d="M537 432 L549 438 M537 432 L528 438 L519 437 M575 443 L584 449 M575 443 L558 447" stroke="#837965" strokeWidth="2.7" />
          </g>
          {/* The neck is a narrow S, the dark throat following the bill's pouch. */}
          <path d="M494 176 Q482 167 492 153 Q509 140 536 145 C552 164 540 188 528 209 C512 232 501 248 513 273
            L551 303 L497 303 C475 283 474 264 485 241 L500 207 Q514 187 494 176 Z" fill="#c8c7b5" stroke="#a5a594" strokeWidth="1" />
          <path d="M516 174 C534 181 523 204 511 224 C494 252 501 266 519 284 L495 282 C480 263 489 241 500 221 C515 197 519 187 510 181 Z" fill="#6c6f63" />
          <path d="M509 179 C512 194 496 218 484 249 L477 278" fill="none" stroke="#edecda" strokeWidth="5" />
          <path d="M477 260 C478 289 540 289 586 306 Q633 326 645 372 L666 414 Q644 402 621 407 C566 411 510 386 489 361 C469 337 462 302 477 260 Z" fill={`url(#laBody-${id})`} stroke="#8d8975" strokeWidth="1.5" />
          <g clipPath={`url(#laFeathers-${id})`} fill="none" strokeLinecap="round">
            {Array.from({ length: 95 }, (_, i) => {
              const x = 470 + (i % 19) * 9.5;
              const y = (273 + Math.floor(i / 19) * 23 + Math.sin(i * 2.7) * 7).toFixed(2);
              return <path key={`breast-${i}`} d={`M${x} ${y} q${-5 + (i % 5)} 12 ${7 + (i % 7)} ${21 + (i % 4) * 3}`} stroke={i % 3 ? "#dedbc5" : "#5d5c4e"} strokeWidth={i % 3 ? "0.9" : "1.1"} opacity="0.8" />;
            })}
          </g>
          <path d="M535 295 C579 298 616 318 633 353 L651 402 C621 390 594 378 575 355 C550 341 535 320 535 295 Z" fill="#c6c0aa" stroke="#827f6c" strokeWidth="1.3" />
          {Array.from({ length: 22 }, (_, i) => {
            const x = 540 + i * 3.7;
            const y = 303 + i * 1.1;
            return <path key={`wing-${i}`} d={`M${x} ${y} Q${x + 4} ${343 + i} ${602 + i * 2.5} ${376 + i * 1.3}`} fill="none" stroke={i % 3 ? "#898574" : "#ebe5cf"} strokeWidth={i % 3 ? "1.2" : "1.7"} />;
          })}
          <path d="M527 147 L528 137 L523 129 L532 131 L540 135 L543 147 Z" fill="#b39173" />
          <path d="M493 159 Q503 148 517 155 L516 173 Q501 181 490 173 Z" fill="#dcd8bc" />
          <ellipse cx="500" cy="163" rx="5.3" ry="6" fill="#bc977b" />
          <circle cx="501" cy="163" r="2.8" fill="#f5e1b6" /><circle cx="501" cy="163" r="1.5" fill="#393b31" />
          {/* Long bill, salmon edge, and the pale pouch running back to the throat. */}
          <path d="M491 174 L478 206 L443 327 Q443 332 448 328 L486 235 L507 181 L500 178 L477 253 L453 306 L481 203 L496 175 Z" fill="#d9d1ad" stroke="#a49c84" strokeWidth="1.1" />
          <path d="M489 183 L444 325" fill="none" stroke="#c69872" strokeWidth="2.2" />
          <path d="M487 205 L454 307" fill="none" stroke="#f0ead1" strokeWidth="2" />
        </g>
        <rect x="14" y="12" width="972" height="475" rx={PLATE_INSET_RADIUS} fill="none" stroke="#171b17" strokeWidth="5" />
        <rect x="18" y="17" width="964" height="465" rx={PLATE_INSET_RADIUS} fill="none" stroke="#b9bcb1" strokeWidth="1.3" />
        {registrationStickerAreas && <g data-plate-registration-sticker-area=""><rect x="853" y="380" width="113" height="84" rx="3" fill="none" stroke={`url(#laWell-${id})`} strokeWidth="2" opacity="0.75" /></g>}
        <text x="516" y="110" textAnchor="middle" fill="#b41516" fontFamily="var(--font-plate-script, cursive)" fontSize="108" textLength="442" lengthAdjust="spacingAndGlyphs">Louisiana</text>
        <path d="M720 103 Q737 100 757 103 L753 107 L718 110 Z" fill="#b41516" />
        <g fill="#080c09" fontFamily="var(--font-plate-ny, sans-serif)" fontSize="291">
          {split ? <>
            <text x="387" y="352" textAnchor="end" textLength="316" lengthAdjust="spacingAndGlyphs">{cleaned.slice(0, 3)}</text>
            <text x="556" y="352" textLength="372" lengthAdjust="spacingAndGlyphs">{cleaned.slice(3)}</text>
          </> : <text x="500" y="352" textAnchor="middle" fontSize={Math.min(291, 2050 / Math.max(cleaned.length, 1))} letterSpacing="5">{cleaned}</text>}
        </g>
        <text x="64" y="405" fill="#b21b19" fontFamily="Georgia, serif" fontWeight="700" fontSize="44" textLength="421" lengthAdjust="spacingAndGlyphs">Sportsman’s Paradise</text>
      </PlateSvg>
    </PlateFrame>
  );
}
