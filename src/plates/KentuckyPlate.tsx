"use client";

import { useId } from "react";
import BaselinePlate, { PLATE_SANS } from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";

/** First artwork pass; source and design caveats are in plate-compare/references.ts. */
export default function KentuckyPlate(props: PlateProps) {
  const id = useId();
  return (
    <BaselinePlate {...props} state={props.state ?? "Kentucky"}
      shadedSlots={true}
      name="Kentucky"
      frame={false}
      hardware="photo"
      colors={["#5291a7", "#c4d4de", "#d7e6e8"]}
      stops={[0, 0.48, 1]}
      heading="Kentucky"
      headingY={90}
      headingSize={88}
      headingColor="#101a21"
      ink="#142853"
    >
      <defs><filter id={`ky-hills-${id}`} x="-1%" y="-3%" width="102%" height="106%"><feGaussianBlur stdDeviation=".8" /></filter></defs>
      <path d="M75 350 L89 322 84 310 94 292 102 286 102 272 124 267 124 254 141 250 157 230 181 224 190 214 208 216 226 203 244 206 262 195 278 205 301 200 321 214 339 202 352 195 365 209 382 200 394 197 402 189 416 187 418 177 431 167 444 166 453 185 465 195 479 186 491 184 496 166 508 154 521 148 534 132 548 134 563 115 579 108 589 89 608 81 607 70 601 54 Q605 38 619 40 L642 35 658 39 678 53 692 67 705 85 729 87 751 99 778 95 801 100 825 97 849 95 869 104 882 119 892 132 886 148 908 174 916 201 939 224 964 238 944 260 934 275 914 285 895 311 904 344 L753 354 654 359 501 354 352 350 199 350Z" fill="#eaeef0" />
      <g filter={`url(#ky-hills-${id})`}>
      <path d="M0 354 Q18 348 31 356 T64 355 T97 360 T130 359 T164 357 T201 364 T236 363 T272 359 T307 365 T342 365 T374 363 T409 360 T442 354 T477 361 T512 365 T545 364 T580 368 T615 365 T650 365 T685 359 T720 353 T755 349 T790 347 T825 352 T860 350 T895 354 T930 351 T965 360 T1000 366 V500 H0Z" fill="#789f99" />
      <path d="M0 393 Q17 387 27 381 L44 391 56 387 69 391 83 400 97 399 109 389 124 392 138 398 150 394 163 393 175 403 190 406 204 402 220 405 236 400 252 400 274 387 296 390 317 393 338 390 359 390 380 387 401 388 422 390 444 382 465 390 488 387 511 391 536 383 560 385 584 392 609 387 635 388 660 383 686 385 711 382 733 378 751 390 774 386 793 395 812 394 835 405 859 406 883 409 907 405 931 406 953 402 976 403 1000 400 V500 H0Z" fill="#3d7d6b" />
      <path d="M0 430 Q28 425 48 433 L65 435 79 445 92 442 107 448 121 442 133 433 147 429 161 429 175 416 190 414 205 408 220 420 235 426 253 414 280 419 307 420 335 412 364 415 391 418 420 416 449 417 478 412 507 417 536 414 565 416 594 420 623 418 652 412 681 414 710 416 739 409 756 411 760 420 775 418 789 428 804 426 820 432 835 431 850 438 866 436 882 447 896 441 911 449 928 441 944 445 962 445 980 437 1000 437 V500 H0Z" fill="#003b2b" />
      </g>
      <rect x="254" y="386" width="489" height="67" rx="3" fill="#033d40" stroke="#76a59c" strokeWidth="4" />
      <path d="M0 0 H1000 V500 H0Z M42 16 Q14 16 14 43 V460 Q14 486 40 486 H960 Q986 486 986 460 V43 Q986 16 960 16Z" fill="#f4f6f5" fillRule="evenodd" />
      <text x="500" y="115" textAnchor="middle" fontFamily={PLATE_SANS} fontSize="19" fill="#142d3c">BLUEGRASS STATE</text>
    </BaselinePlate>
  );
}
