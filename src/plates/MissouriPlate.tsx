"use client";

import PlateSvg, { PLATE_INSET_RADIUS, PLATE_OUTLINE } from "../internal/PlateSvg.js";
import { useId } from "react";
import { PlateProps } from "../types.js";

const INK = "#093169";
const SANS = 'var(--font-geist-sans, Arial, sans-serif), ui-sans-serif, system-ui, sans-serif';

/** The bluebird Show Me State base, with a hawthorn sprig below the outline. */
export default function MissouriPlate({ plate, state = "Missouri", className, style, ...rest }: PlateProps) {
  const id = useId().replace(/:/g, "");
  const cleaned = plate.replace(/[\s\-–—]/g, "").toUpperCase();
  const split = cleaned.length === 6;
  const size = cleaned.length <= 7 ? 330 : Math.round(330 * 7 / cleaned.length);

  return (
    <div className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }}
      aria-label={`License plate ${plate} from ${state}`} {...rest}>
      <PlateSvg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" role="img"
        preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
        <title>{`Missouri license plate: ${plate}`}</title>
        <defs>
          <linearGradient id={`moSky-${id}`} x2="0" y2="1">
            <stop stopColor="#e9e9e9" /><stop offset="0.6" stopColor="#e7e9e8" />
            <stop offset="0.7" stopColor="#d3e0e5" /><stop offset="0.8" stopColor="#aed5e3" />
            <stop offset="0.94" stopColor="#80c5df" /><stop offset="1" stopColor="#6cb1ca" />
          </linearGradient>
          <linearGradient id={`moRim-${id}`} x2="0" y2="1">
            <stop stopColor="#f4f5f3" /><stop offset="0.65" stopColor="#e4e7e4" /><stop offset="1" stopColor="#c8d2d0" />
          </linearGradient>
          <linearGradient id={`moSlot-${id}`} x2="0" y2="1">
            <stop stopColor="#a6aaa7" /><stop offset="0.45" stopColor="#dedfdc" /><stop offset="0.65" stopColor="#e2e3df" /><stop offset="1" stopColor="#a3aaa5" />
          </linearGradient>
          <linearGradient id={`moBlue-${id}`} x1="0" y1="0" x2="1" y2="0.8">
            <stop stopColor="#7770a2" /><stop offset="0.45" stopColor="#4b5289" /><stop offset="1" stopColor="#304a74" />
          </linearGradient>
          <linearGradient id={`moBreast-${id}`} x1="0" y1="0" x2="0.5" y2="1">
            <stop stopColor="#945427" /><stop offset="0.5" stopColor="#b47842" /><stop offset="0.8" stopColor="#c79767" /><stop offset="1" stopColor="#e5d8c5" />
          </linearGradient>
          <clipPath id={`moClip-${id}`}><rect x="13" y="13" width="974" height="475" rx={PLATE_INSET_RADIUS} /></clipPath>
        </defs>
        <rect {...PLATE_OUTLINE} fill="#e5e5e3" />
        <g clipPath={`url(#moClip-${id})`}>
          <rect width="1000" height="500" fill={`url(#moSky-${id})`} />
          {/* Missouri's straight western edge and the Mississippi's eastern bends. */}
          <path d="M319 119 H542 L548 127 548 140 559 151 558 166 569 176 565 190
            L579 204 Q595 211 594 225 Q592 235 602 241 L609 236 617 238 627 245
            L624 258 616 278 614 285 621 293 630 300 633 311 645 319 651 333
            L659 339 660 351 670 356 674 368 680 371 682 381 677 393 672 392
            L669 401 661 400 665 409 658 412 663 416 655 420 658 426 650 428
            L647 438 H613 L615 430 629 416 630 411 623 404 H382 V222
            L374 220 369 213 366 203 358 201 360 191 350 187 349 176 341 172
            L341 161 333 155 335 148 326 144 326 136 322 132 Z"
            fill="none" stroke="#151714" strokeWidth="3.8" strokeLinejoin="round" />
          {/* Fine brown stems and lobed hawthorn leaves. No invented registration month. */}
          <g stroke="#655743" strokeWidth="2" strokeLinecap="round" fill="none">
            <path d="M465 493 Q480 471 511 454 M477 480 L488 450 M486 469 L521 462" />
          </g>
          <g fill="#5e6234" stroke="#777147" strokeWidth="0.8">
            <path d="M495 466 Q490 455 496 451 L500 454 505 447 508 452 516 449 515 458 522 457 Q520 470 499 470 Z" />
            <path d="M493 470 Q506 469 512 476 L505 478 507 482 499 479 495 483 Q487 479 488 473 Z" />
            <path d="M485 465 Q477 453 480 449 L486 453 490 447 493 453 491 463 Z" />
          </g>
          {/* Eastern bluebird: blue crown, folded flight feathers, rust breast and pale belly. */}
          <path d="M455 450 Q443 464 423 483 L413 484 441 455 447 438 Z" fill="#586489" />
          <path d="M455 446 Q443 468 422 479 L419 483 Q444 474 462 454 Z" fill="#444d78" />
          <path d="M446 449 Q450 433 461 416 Q468 399 477 393 Q487 384 498 391
            L505 398 502 412 Q498 431 488 446 Q481 458 467 462 Q452 466 446 449 Z" fill={`url(#moBreast-${id})`} />
          <path d="M453 450 Q458 447 462 451 L468 449 470 453 478 450 481 455 489 448
            Q481 464 467 468 Q456 465 453 450 Z" fill="#d9d1c4" />
          <path d="M446 450 Q449 428 463 408 Q466 398 477 391 Q488 385 498 392
            L505 398 495 399 Q488 394 480 401 Q472 411 468 423 Q465 440 452 451 Z" fill={`url(#moBlue-${id})`} />
          <path d="M472 406 Q477 413 471 428 Q467 442 453 453 L449 450 Q453 426 472 406 Z" fill="#62608f" />
          <g fill="none" strokeLinecap="round">
            <path d="M470 413 Q462 438 452 448 M466 416 Q456 437 450 444 M471 424 Q465 440 458 446" stroke="#8a7c9d" strokeWidth="1.5" />
            <path d="M453 444 L431 474 M449 449 L426 480" stroke="#8c86a0" strokeWidth="1" />
            <path d="M484 410 L480 419 M490 418 L485 430 M475 431 L472 440 M482 437 L478 443" stroke="#c38c55" strokeWidth="1.5" />
          </g>
          <path d="M498 395 L516 401 501 403 Z" fill="#453e34" />
          <circle cx="496" cy="395.5" r="2.1" fill="#161d22" /><circle cx="496.5" cy="395" r="0.65" fill="#d8d5c8" />
          <g fill="none" stroke="#796252" strokeWidth="2.2" strokeLinecap="round">
            <path d="M464 462 L471 475 466 481 M476 460 L480 470 490 471 M471 475 L480 477" />
          </g>
          <g fill="#e6dfd1" stroke="#c0b499" strokeWidth="0.7">
            {[{ x: 486, y: 459 }, { x: 495, y: 477 }].map(({ x, y }) => <g key={x}>
              <ellipse cx={x - 3} cy={y - 2} rx="3.5" ry="2.7" /><ellipse cx={x + 2} cy={y - 3} rx="3" ry="3.5" />
              <ellipse cx={x + 3} cy={y + 2} rx="3.5" ry="2.8" /><ellipse cx={x - 2} cy={y + 3} rx="3" ry="3" />
              <circle cx={x} cy={y} r="1.5" fill="#a28c52" />
            </g>)}
          </g>
        </g>
        <rect x="13" y="13" width="974" height="475" rx={PLATE_INSET_RADIUS} fill="none" stroke={`url(#moRim-${id})`} strokeWidth="4" />
        {[157, 764].flatMap((x) => [38, 437].map((y) =>
          <rect key={`${x}-${y}`} x={x} y={y} width="83" height="20" rx="10" fill={`url(#moSlot-${id})`} />))}
        <text x="500" y="84" textAnchor="middle" fill="#354e76" fontFamily={SANS}
          fontWeight={800} fontStyle="italic" fontSize="87" textLength="314" lengthAdjust="spacingAndGlyphs">Missouri</text>
        <text x="500" y="110" textAnchor="middle" fill="#223e67" fontFamily={SANS}
          fontWeight={700} fontSize="22" textLength="183" lengthAdjust="spacingAndGlyphs">SHOW ME STATE</text>
        <g fill={INK} stroke="#c8cfc7" strokeWidth="3" paintOrder="stroke" fontFamily="var(--font-plate-ny, sans-serif)" fontSize={size}>
          {split ? <>
            <text x="433" y="373" textAnchor="end" textLength="380" lengthAdjust="spacingAndGlyphs">{cleaned.slice(0, 3)}</text>
            <text x="550" y="373" textLength="397" lengthAdjust="spacingAndGlyphs">{cleaned.slice(3)}</text>
          </> : <text x="500" y={373 - (330 - size) * 0.35} textAnchor="middle"
            textLength={Math.min(900, cleaned.length * 126) || undefined} lengthAdjust="spacingAndGlyphs">{cleaned}</text>}
        </g>
      </PlateSvg>
    </div>
  );
}
