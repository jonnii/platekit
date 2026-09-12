"use client";

import PlateSvg, { PLATE_INSET_RADIUS, PLATE_OUTLINE } from "../internal/PlateSvg.js";
import { useId } from "react";
import type { PlateProps } from "../types.js";

/** Sunrise over the Badlands, wheat heads and a shaggy plains bison. */
export default function NorthDakotaPlate({ plate, state = "North Dakota", className, style, ...rest }: PlateProps) {
  const id = useId();
  const paint = (name: string) => `url(#nd-${name}-${id})`;
  const cleaned = plate.replace(/[\s\-–—]/g, "").toUpperCase();
  const size = Math.min(281, 1967 / Math.max(7, cleaned.length));
  return (
    <div className={className} style={{ userSelect: "none", display: "flex", position: "relative", alignItems: "stretch", justifyContent: "center", ...style }} aria-label={`License plate ${plate} from ${state}`} {...rest}>
      <PlateSvg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto" }}>
        <title>{`North Dakota license plate: ${plate}`}</title>
        <defs>
          <linearGradient id={`nd-sky-${id}`} x2="0" y2="1">
            <stop stopColor="#dcdcca" /><stop offset=".15" stopColor="#76b6c5" /><stop offset=".5" stopColor="#329cb4" /><stop offset=".62" stopColor="#77a8ad" /><stop offset=".68" stopColor="#a5a88e" /><stop offset=".72" stopColor="#ac815f" /><stop offset=".8" stopColor="#d5601b" /><stop offset=".92" stopColor="#d74f0d" /><stop offset="1" stopColor="#de7514" />
          </linearGradient>
          <linearGradient id={`nd-west-${id}`}><stop stopColor="#402310" stopOpacity=".5" /><stop offset=".55" stopColor="#813919" stopOpacity="0" /></linearGradient>
          <radialGradient id={`nd-sunrise-${id}`} cx=".76" cy=".8" r=".4" gradientTransform="translate(0 .4) scale(1 .5)"><stop stopColor="#f7ba00" /><stop offset=".4" stopColor="#f5a500" stopOpacity=".95" /><stop offset="1" stopColor="#ef7b09" stopOpacity="0" /></radialGradient>
          <filter id={`nd-haze-${id}`} x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="3" /></filter>
          <linearGradient id={`nd-rim-${id}`} x2=".15" y2="1"><stop stopColor="#f4eee5" /><stop offset=".5" stopColor="#d6c7b6" /><stop offset="1" stopColor="#f3ebe0" /></linearGradient>
          <linearGradient id={`nd-slot-${id}`} x2="0" y2="1"><stop stopColor="#b3b3ab" /><stop offset=".45" stopColor="#eeeae1" /><stop offset="1" stopColor="#b4bfc0" /></linearGradient>
          <linearGradient id={`nd-fur-${id}`} x1=".2" y1="0" x2=".5" y2="1"><stop stopColor="#ad691b" /><stop offset=".45" stopColor="#87501b" /><stop offset="1" stopColor="#382718" /></linearGradient>
          <clipPath id={`nd-clip-${id}`}><rect x="21" y="20" width="958" height="460" rx={PLATE_INSET_RADIUS} /></clipPath>
          <path id={`nd-bison-${id}`} d="M822 370 Q820 354 837 353 Q850 350 875 359 L901 368 Q929 373 948 385 Q966 395 963 416 L958 434 955 457 950 478 936 479 940 463 935 441 Q915 444 902 438 L886 439 875 432 866 449 864 478 848 480 849 454 839 449 838 477 826 478 824 446 813 434 808 420 811 395Z" />
          <clipPath id={`nd-fur-clip-${id}`}><use href={`#nd-bison-${id}`} /></clipPath>
        </defs>
        <rect {...PLATE_OUTLINE} fill={paint("rim")} stroke="#d6d0c8" strokeWidth="2" />
        <rect x="12" y="12" width="976" height="476" rx={PLATE_INSET_RADIUS} fill="none" stroke="#fff7eb" strokeWidth="3" />
        <g clipPath={paint("clip")}>
          <rect width="1000" height="500" fill={paint("sky")} />
          <rect width="1000" height="500" fill={paint("sunrise")} />
          <g fill="#f2e8d4" opacity=".5" filter={paint("haze")}>
            <path d="M20 29 Q47 8 91 21 L77 31 54 31 48 43 22 48Z M20 56 L37 48 60 48 55 57 29 67 20 67Z M258 23 Q282 17 311 25 L329 30 307 33 279 29Z M466 27 Q486 19 516 25 L520 31 480 33Z M945 38 L980 43 V98 L964 81 963 63 938 56Z M20 150 Q38 141 48 151 L56 148 73 151 72 159 41 158 26 167 20 163Z M80 148 l14 2 3 7 -21 -1Z M20 311 L34 316 46 313 61 321 51 332 29 333 20 327Z" />
          </g>
          <g fill="#f2b95d" opacity=".33" filter={paint("haze")}>
            <path d="M21 365 Q150 354 251 370 T466 366 L565 361 519 375 Q310 390 159 375 L20 377Z M250 398 Q390 387 480 395 L528 387 669 391 601 399 472 403 337 408Z M564 423 Q709 409 812 418 L860 423 743 425 675 422 591 431Z M610 452 Q729 439 810 448 L850 453 744 452 645 460Z" />
          </g>
          <g fill="#a14422" opacity=".48" filter={paint("haze")}>
            <path d="M21 398 Q128 385 230 404 L322 401 414 409 309 416 249 411 183 419 20 410Z M365 427 L433 420 481 423 539 417 584 424 651 422 684 427 560 432 441 430Z M684 462 L727 457 788 460 858 454 884 462 809 466Z" />
          </g>
          <path d="M20 368 Q250 365 500 381 T979 365 V500 H20Z" fill={paint("west")} />
          <path d="M20 421 L48 426 66 433 83 435 100 446 131 447 162 444 193 445 218 446 247 445 275 447 294 442 309 449 339 451 365 451 380 448 394 452 426 450 448 448 468 451 485 448 507 448 534 446 552 449 567 447 588 454 606 459 624 462 639 472 660 470 677 472 696 468 713 470 730 468 748 472 769 470 791 474 812 469 836 472 857 469 878 473 895 467 914 470 937 464 954 449 979 439 V500 H20Z" fill="#251e17" />
          <g fill="#845034">
            <path d="M289 444 L301 449 308 460 333 477 345 480 318 480 304 467 297 463Z M371 451 L382 451 387 463 403 477 414 480 392 480 380 464Z M478 451 L489 450 482 460 498 476 484 475 476 465 465 471 459 480 448 480 457 464Z M541 448 L549 451 557 469 579 480 561 480 548 463Z M601 460 L610 463 628 477 632 480 620 480Z" />
          </g>
          {Array.from({ length: 43 }, (_, i) => {
            const x = 42 + i * 13;
            return <path key={i} d={`M${x} ${453 + i % 7} l${9 + i % 11} 3 -${7 + i % 8} 2 14 4 -8 1`} fill="none" stroke={i % 3 ? "#574032" : "#b06e41"} strokeWidth="1" opacity=".65" />;
          })}
          <use href={`#nd-bison-${id}`} fill={paint("fur")} />
          <g clipPath={paint("fur-clip")}>
            {Array.from({ length: 240 }, (_, i) => {
              // Rounded on output: Math.sin differs in the last ULP between Node and the browser, which breaks hydration.
              const x = (810 + ((Math.sin(i * 127.1 + 7) * 43758.5453) % 1 + 1) % 1 * 156).toFixed(2);
              const y = (352 + ((Math.sin(i * 311.7 + 13) * 23761.234) % 1 + 1) % 1 * 130).toFixed(2);
              return <path key={i} d={`M${x} ${y} q${i % 3 - 2} 3 ${i % 4 - 2} ${3 + i % 5}`} stroke={i % 3 ? "#4c311b" : "#cd8d34"} strokeWidth={i % 4 ? 1 : 1.8} opacity=".42" fill="none" />;
            })}
          </g>
          <path d="M958 405 Q968 428 960 439 L957 444 954 439 Q962 430 958 420" fill="#39291a" />
          <path d="M807 368 L817 361 831 361 843 367 850 380 852 396 845 410 841 432 832 441 822 432 820 418 811 415 808 405 801 396 804 386 801 378Z" fill="#302217" />
          <path d="M815 369 Q832 360 841 378 L836 387 831 380 820 386 809 383Z M819 403 L826 399 836 402 840 414 831 421 820 415Z" fill="#49321e" />
          <path d="M807 389 Q797 384 800 378 Q802 387 811 386Z M848 386 Q861 385 856 375 Q856 381 847 383Z" fill="#d0b57d" />
          <path d="M819 414 Q831 419 839 413 L836 421 825 423Z" fill="#1e1b16" />
          <path d="M811 398 l5 -1 M838 397 l5 -2 M825 429 l7 3" stroke="#9c8554" strokeWidth="1.8" fill="none" />
          {Array.from({ length: 38 }, (_, i) => <path key={i} d={`M${806 + i * 7 % 39} ${369 + i * 13 % 63} l2 3 -1 3`} stroke="#8b6540" strokeWidth="1" opacity=".45" fill="none" />)}
          {[false, true].map((right) => <g key={String(right)} transform={right ? "translate(1000 0) scale(-1 1)" : undefined}>
            <g fill="none" stroke="#d5c59b" strokeWidth="2">
              <path d="M211 125 Q177 105 177 50 M211 125 Q188 99 193 56 M211 125 Q189 97 229 64" />
            </g>
            {[0, 1, 2].map((stem) => <g key={stem} transform={`translate(${177 + stem * 15} ${53 + stem * 4}) rotate(${stem === 2 ? 54 : stem * 16 - 5})`}>
              <path d="M0 0 V40" stroke="#ad793e" strokeWidth="1.5" />
              {Array.from({ length: 8 }, (_, j) => <g key={j} transform={`translate(0 ${j * 4})`} fill={j % 2 ? "#a65725" : "#b96a30"}>
                <path d="M0 5 Q-7 1 -5 -4 Q0 -2 0 5Z M0 7 Q7 3 5 -2 Q0 0 0 7Z" />
                <path d="M-4 -2 L-8 -10 M4 0 L8 -8" stroke="#cba361" strokeWidth=".65" />
              </g>)}
            </g>)}
          </g>)}
          <rect x="847" y="30" width="96" height="62" fill="#10272b" />
          <text x="895" y="49" textAnchor="middle" fill="#99c2c9" fontFamily="Arial, sans-serif" fontSize="15"><tspan x="895">PLACE</tspan><tspan x="895" dy="18">STICKER</tspan><tspan x="895" dy="18">HERE</tspan></text>
          <text x="503" y="52" textAnchor="middle" fill="#243b3b" fontFamily='Georgia, "Times New Roman", serif' fontWeight="700" fontSize="22" letterSpacing="16">LEGENDARY</text>
          <text x="507" y="112" textAnchor="middle" fill="#93532f" stroke="#1d231f" strokeWidth="4" paintOrder="stroke" fontFamily="var(--font-geist-sans, Arial, sans-serif), Arial, sans-serif" fontWeight="800" fontSize="68" textLength="535" lengthAdjust="spacingAndGlyphs">NORTH DAKOTA</text>
          <text x="500" y={339 - (281 - size) * .35} textAnchor="middle" fill="#061b1d" fontFamily="var(--font-plate-ny, sans-serif)" fontSize={size} textLength={Math.min(873, cleaned.length * 123)} lengthAdjust="spacingAndGlyphs">{cleaned}</text>
          <text x="158" y="470" textAnchor="middle" fill="#efe9dc" fontFamily='Rockwell, Georgia, serif' fontWeight="900" fontSize="24" textLength="220" lengthAdjust="spacingAndGlyphs">PEACE GARDEN STATE</text>
        </g>
        {[158, 760].flatMap((x) => [38, 439].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="82" height="20" rx="9" fill={paint("slot")} />))}
      </PlateSvg>
    </div>
  );
}
