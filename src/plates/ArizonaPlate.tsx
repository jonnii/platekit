"use client";

import BaselinePlate, { PLATE_SANS } from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";

/** Reference-guided artwork; source and design caveats are in plate-compare/references.ts. */
export default function ArizonaPlate(props: PlateProps) {
  return (
    <BaselinePlate {...props} state={props.state ?? "Arizona"}
      hardware="photo"
      rim={true}
      rimWidth={11}
      name="Arizona"
      colors={["#349fbb", "#f6f9f4", "#fffff9", "#e89943"]}
      stops={[0, 0.34, 0.60, 0.9]}
      heading="ARIZONA"
      headingColor="#e4f5f7"
      headingFont={PLATE_SANS}
      headingSize={66}
      ink="#053e27"
      serialX={560}
      serialWidth={790}
      footer=""
      footerColor="#063a25"
      footerY={423}
      footerSize={32}
    >
      <text x="735" y="423" textAnchor="middle" fontSize="33" fontFamily={PLATE_SANS} fill="#063a25">GRAND CANYON STATE</text>
      <circle cx="398" cy="433" r="46" fill="#fffbe3" />
      <path d="M0 466 L35 460 57 426 92 431 112 412 146 377 171 393 189 371 212 387 240 364 258 384 278 377 300 400 332 418 362 430 390 434 422 444 460 449 520 446 550 451 620 452 674 457 726 454 752 460 820 460 865 458 925 463 1000 459 V500 H0Z" fill="#301237" />
      <path aria-label="Saguaro cactus" transform="translate(6 3)" d="M134,392 133,392 121,403 119,403 113,406 105,407 105,458 104,459 104,483 108,483 108,408 109,407 134,407Z M103,387 102,389 102,440 102,401 103,400Z M129,301 129,314 128,315 128,331 127,332 127,344 126,345 126,357 125,358 126,357 126,348 127,347 126,346 127,345 127,334 128,333 128,319 129,318Z M95,214 93,216 92,216 90,220 90,231 89,232 89,276 88,277 88,326 87,327 87,353 84,357 82,357 81,358 80,358 77,355 77,352 76,351 76,280 75,279 75,264 75,320 74,321 73,320 73,304 72,303 72,276 71,275 71,260 70,259 70,255 68,253 66,254 62,262 62,321 63,322 63,352 64,353 64,368 65,370 67,371 75,371 76,370 79,371 82,374 82,377 83,378 83,390 82,391 82,408 85,408 86,409 87,483 96,483 97,482 97,460 98,459 98,427 99,426 99,393 100,392 100,370 102,368 105,371 109,378 112,380 117,380 119,378 121,374 121,370 122,369 122,359 123,358 124,326 125,325 125,309 126,308 126,290 127,289 127,281 126,279 123,279 123,280 121,282 120,288 119,289 119,300 118,301 118,312 117,313 117,324 116,325 116,336 115,337 115,347 114,348 114,356 112,359 108,359 103,354 101,350 102,348 103,349 103,331 103,341 102,342 101,341 101,323 100,322 100,225 99,224 99,218Z" fill="#301237" fillRule="evenodd" />
      {[420,480,492,982].map((x,i)=><path key={x} d={`M${x} 479 v-${70+i%2*28} m0 52 q-11 0 -11 -14 v-25 m11 21 q10 0 10 -14 v-20`} fill="none" stroke="#301237" strokeWidth="4" />) }
    </BaselinePlate>
  );
}
