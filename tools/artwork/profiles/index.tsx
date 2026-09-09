import { PLATES } from "../../../src/registry";
import { BASELINE_PLATE_STATES } from "./initial-states";
import { PLATE_REFERENCES } from "../references";
import NewYorkPlate from "../../../src/plates/NewYorkPlate";
import FloridaPlate from "../../../src/plates/FloridaPlate";
import CaliforniaPlate from "../../../src/plates/CaliforniaPlate";
import NewJerseyPlate from "../../../src/plates/NewJerseyPlate";
import TexasPlate from "../../../src/plates/TexasPlate";
import GeorgiaPlate from "../../../src/plates/GeorgiaPlate";
import IllinoisPlate from "../../../src/plates/IllinoisPlate";
import LouisianaPlate from "../../../src/plates/LouisianaPlate";
import MarylandPlate from "../../../src/plates/MarylandPlate";
import NevadaPlate from "../../../src/plates/NevadaPlate";
import MontanaPlate from "../../../src/plates/MontanaPlate";
import MichiganPlate from "../../../src/plates/MichiganPlate";
import MissouriPlate from "../../../src/plates/MissouriPlate";
import OhioPlate from "../../../src/plates/OhioPlate";
import PennsylvaniaPlate from "../../../src/plates/PennsylvaniaPlate";
import { PLATE_METADATA } from "../metadata";
import { ARTWORK_WIDTH as WIDTH, ARTWORK_HEIGHT as HEIGHT } from "../config";

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Per-state comparison profile.
 *
 * The region masks are the reason this is not one-size-fits-all: they encode
 * where each plate design puts its features, and the designs genuinely differ
 * (NY has broken top rules and a scenery band; FL has an arched wordmark, a
 * centre graphic and a text motto). Features a state does not have are omitted
 * and simply drop out of the report — the regression gate already treats
 * topFeatures and stripeZone as optional.
 */
export type PlateProfile = {
  slug: string;
  label: string;
  /** Value for the component's `state` prop. */
  stateProp: string;
  defaultPlate: string;
  render: (plate: string) => React.ReactElement;
  /** Rows above this are the "top band"; rows at/after bottomStart are the bottom. */
  topEnd: number;
  bottomStart: number;
  /** The busiest decorative rows — scored separately with SSIM and edge F1. */
  scenicCore: { y0: number; y1: number };
  features: {
    stripes?: Rect[];
    wordmark?: Rect[];
    frameAndBolts?: Rect[];
  };
  stripeZone?: Rect[];
  /**
   * Every region that holds text. Excluded from all scoring by default — see
   * ARTWORK-ONLY MODE at the top of this file.
   */
  textRects: Rect[];
  /** Areas expected to be plain white, used to calibrate rendered RGB. */
  whitePatches: Rect[];
  /** Fully illustrated designs may have no reliable neutral calibration patches. */
  calibrate?: boolean;
  /** Frame-first anchor: alignment should not chase typography. */
  alignmentAnchor: Rect[];
};

const FRAME_ANCHOR: Rect[] = [
  { x: 0, y: 0, width: WIDTH, height: 26 },
  { x: 0, y: HEIGHT - 26, width: WIDTH, height: 26 },
  { x: 0, y: 0, width: 26, height: HEIGHT },
  { x: WIDTH - 26, y: 0, width: 26, height: HEIGHT },
  { x: 16, y: 16, width: WIDTH - 32, height: 20 },
  { x: 16, y: HEIGHT - 36, width: WIDTH - 32, height: 20 },
  { x: 16, y: 16, width: 20, height: HEIGHT - 32 },
  { x: WIDTH - 36, y: 16, width: 20, height: HEIGHT - 32 },
];

/**
 * Most plates share one layout: wordmark across the top, serial through the
 * middle, slogan along the bottom. Rather than restate the same masks per state,
 * build them from the two numbers that actually differ.
 *
 * whitePatches is NOT defaulted on purpose. Calibration samples those regions
 * assuming they are blank, and New Jersey showed what happens otherwise: patches
 * placed over the yellow fade calibrated against yellow and reported 81% top-band
 * similarity for a gradient that was badly wrong. Each state has to say where it
 * is genuinely blank.
 */
function simpleProfile(opts: {
  code: string;
  label: string;
  stateProp: string;
  defaultPlate: string;
  topEnd: number;
  bottomStart: number;
  whitePatches: Rect[];
  scenicCore?: { y0: number; y1: number };
}): Omit<PlateProfile, "render"> {
  const { topEnd, bottomStart } = opts;
  return {
    slug: `${opts.code.toLowerCase()}-plate`,
    label: opts.label,
    stateProp: opts.stateProp,
    defaultPlate: opts.defaultPlate,
    topEnd,
    bottomStart,
    scenicCore: opts.scenicCore ?? { y0: topEnd, y1: bottomStart },
    features: {
      wordmark: [{ x: 180, y: 6, width: 640, height: topEnd - 6 }],
      frameAndBolts: [
        { x: 0, y: 0, width: WIDTH, height: 26 },
        { x: 0, y: 0, width: 30, height: HEIGHT },
        { x: WIDTH - 30, y: 0, width: 30, height: HEIGHT },
        { x: 0, y: HEIGHT - 26, width: WIDTH, height: 26 },
      ],
    },
    textRects: [
      { x: 140, y: 0, width: 720, height: topEnd },
      { x: 0, y: topEnd, width: WIDTH, height: bottomStart - topEnd },
      { x: 150, y: bottomStart, width: 700, height: HEIGHT - bottomStart },
    ],
    whitePatches: opts.whitePatches,
    alignmentAnchor: FRAME_ANCHOR,
  };
}

export const PLATE_PROFILES: Record<string, PlateProfile> = {
  TX: {
    ...simpleProfile({
      code: "TX", label: "Texas (Texas Classic)", stateProp: "Texas",
      defaultPlate: "ABC1234", topEnd: 150, bottomStart: 410,
      // One patch only: the serial is set large enough to reach into every other
      // blank-looking region of the reference, and the top corners hold the star
      // and a mounting screw.
      whitePatches: [{ x: 40, y: 420, width: 120, height: 50 }],
    }),
    render: (plate) => <TexasPlate plate={plate} state="Texas" />,
    scenicCore: { y0: 165, y1: 405 },
    textRects: [
      { x: 295, y: 37, width: 400, height: 97 },
      { x: 45, y: 170, width: 327, height: 225 },
      { x: 480, y: 169, width: 458, height: 226 },
      { x: 259, y: 432, width: 472, height: 38 },
    ],
  },
  // Masks expose the pelican, mountain facets, and state-outline artwork around
  // the novelty samples.
  LA: {
    ...simpleProfile({
      code: "LA", label: "Louisiana (Sportsman's Paradise)", stateProp: "Louisiana",
      defaultPlate: "123ABC", topEnd: 120, bottomStart: 405,
      whitePatches: [
        { x: 30, y: 35, width: 130, height: 70 },
        { x: 840, y: 35, width: 130, height: 70 },
      ],
    }),
    render: (plate) => <LouisianaPlate plate={plate} state="Louisiana" />,
    scenicCore: { y0: 125, y1: 488 },
    textRects: [
      { x: 285, y: 20, width: 480, height: 95 },
      { x: 55, y: 135, width: 335, height: 227 },
      { x: 504, y: 135, width: 446, height: 227 },
      { x: 54, y: 372, width: 440, height: 49 },
    ],
  },
  MO: {
    ...simpleProfile({
      code: "MO", label: "Missouri (Show Me State)", stateProp: "Missouri",
      // Wordmark and slogan are stacked at the top, so the top band runs deeper.
      defaultPlate: "AB1C2D", topEnd: 140, bottomStart: 400,
      whitePatches: [
        { x: 840, y: 70, width: 120, height: 40 },
        { x: 30, y: 83, width: 100, height: 30 },
      ],
    }),
    render: (plate) => <MissouriPlate plate={plate} state="Missouri" />,
    scenicCore: { y0: 115, y1: 490 },
    textRects: [
      { x: 10, y: 20, width: 145, height: 64 },
      { x: 337, y: 10, width: 325, height: 81 },
      { x: 405, y: 90, width: 195, height: 23 },
      { x: 20, y: 122, width: 357, height: 258 },
      { x: 504, y: 122, width: 478, height: 258 },
    ],
  },
  MT: {
    ...simpleProfile({
      code: "MT", label: "Montana (Treasure State)", stateProp: "Montana",
      defaultPlate: "123456A", topEnd: 120, bottomStart: 395,
      // Retained for explicit calibration probes; calibration is disabled below.
      whitePatches: [{ x: 45, y: 230, width: 55, height: 150 }],
    }),
    // The blue field is not a neutral white calibration target.
    calibrate: false,
    render: (plate) => <MontanaPlate plate={plate} state="Montana" />,
    scenicCore: { y0: 90, y1: 488 },
    textRects: [
      { x: 245, y: 30, width: 510, height: 50 },
      { x: 207, y: 105, width: 305, height: 240 },
      { x: 583, y: 105, width: 362, height: 240 },
      { x: 288, y: 351, width: 580, height: 64 },
    ],
  },
  NV: {
    ...simpleProfile({
      code: "NV", label: "Nevada (Home Means Nevada)", stateProp: "Nevada",
      defaultPlate: "123A45", topEnd: 120, bottomStart: 405,
      whitePatches: [
        { x: 30, y: 35, width: 130, height: 70 },
        { x: 840, y: 35, width: 130, height: 70 },
      ],
    }),
    // Preserve the sky's colour and expose mountains below the sample serial.
    calibrate: false,
    render: (plate) => <NevadaPlate plate={plate} state="Nevada" />,
    scenicCore: { y0: 275, y1: 488 },
    textRects: [
      { x: 245, y: 28, width: 512, height: 90 },
      { x: 25, y: 155, width: 367, height: 225 },
      { x: 533, y: 155, width: 440, height: 225 },
      { x: 240, y: 417, width: 525, height: 62 },
    ],
  },
  MD: {
    ...simpleProfile({
      code: "MD", label: "Maryland (Maryland Proud)", stateProp: "Maryland",
      defaultPlate: "1AB2345", topEnd: 120, bottomStart: 384,
      scenicCore: { y0: 280, y1: 488 },
      whitePatches: [
        { x: 40, y: 70, width: 180, height: 40 },
        { x: 780, y: 70, width: 180, height: 40 },
      ],
    }),
    // No footer lettering: retain the complete flag beneath the sample serial.
    textRects: [
      { x: 320, y: 8, width: 390, height: 104 },
      { x: 40, y: 118, width: 933, height: 266 },
    ],
    render: (plate) => <MarylandPlate plate={plate} state="Maryland" />,
  },

  MI: {
    ...simpleProfile({
      code: "MI", label: "Michigan (Pure Michigan)", stateProp: "Michigan",
      defaultPlate: "ABC1234", topEnd: 120, bottomStart: 386,
      whitePatches: [
        { x: 45, y: 80, width: 160, height: 35 },
        { x: 800, y: 90, width: 140, height: 40 },
      ],
    }),
    scenicCore: { y0: 380, y1: 488 },
    textRects: [
      { x: 278, y: 22, width: 448, height: 113 },
      { x: 40, y: 138, width: 920, height: 242 },
      { x: 347, y: 421, width: 311, height: 60 },
      { x: 880, y: 455, width: 104, height: 24 },
    ],
    render: (plate) => <MichiganPlate plate={plate} state="Michigan" />,
  },

  IL: {
    ...simpleProfile({
      code: "IL", label: "Illinois (Land of Lincoln)", stateProp: "Illinois",
      defaultPlate: "AB12345", topEnd: 100, bottomStart: 400,
      scenicCore: { y0: 95, y1: 488 },
      whitePatches: [
        { x: 440, y: 475, width: 150, height: 12 },
        { x: 600, y: 380, width: 120, height: 22 },
      ],
    }),
    // Mask the novelty sample's lettering individually so the portrait and
    // skyline between letters remain measurable. REPLICA is a product watermark.
    textRects: [
      { x: 265, y: 26, width: 486, height: 68 },
      { x: 45, y: 132, width: 110, height: 246 },
      { x: 164, y: 132, width: 117, height: 246 },
      { x: 289, y: 132, width: 112, height: 246 },
      { x: 473, y: 132, width: 116, height: 246 },
      { x: 595, y: 132, width: 118, height: 246 },
      { x: 723, y: 132, width: 113, height: 246 },
      { x: 841, y: 132, width: 115, height: 246 },
      { x: 278, y: 411, width: 451, height: 61 },
      { x: 850, y: 438, width: 140, height: 49 },
    ],
    render: (plate) => <IllinoisPlate plate={plate} state="Illinois" />,
  },

  OH: {
    ...simpleProfile({
      code: "OH", label: "Ohio (Birthplace of Aviation)", stateProp: "Ohio",
      defaultPlate: "ABC1234", topEnd: 145, bottomStart: 403,
      scenicCore: { y0: 250, y1: 488 },
      whitePatches: [],
    }),
    // The old "white" patches sampled the skyline and tree on this colored base.
    calibrate: false,
    textRects: [
      { x: 393, y: 39, width: 104, height: 72 },
      { x: 528, y: 30, width: 204, height: 43 },
      { x: 58, y: 151, width: 884, height: 252 },
    ],
    render: (plate) => <OhioPlate plate={plate} state="Ohio" />,
  },

  GA: {
    ...simpleProfile({
      code: "GA", label: "Georgia (Peach State)", stateProp: "Georgia",
      defaultPlate: "ABC1234", topEnd: 145, bottomStart: 378,
      scenicCore: { y0: 378, y1: 482 },
      whitePatches: [
        // Clear of the trunk and the reference's ANY TEXT lettering.
        { x: 440, y: 185, width: 40, height: 105 },
        { x: 954, y: 185, width: 20, height: 105 },
      ],
    }),
    // The generic profile hid the whole scenic core, including the orchard.
    // Mask only lettering and the county decal; keep the fruit and tree visible.
    textRects: [
      { x: 60, y: 53, width: 334, height: 80 },
      { x: 396, y: 53, width: 540, height: 79 },
      { x: 50, y: 140, width: 902, height: 238 },
      { x: 248, y: 402, width: 504, height: 64 },
    ],
    render: (plate) => <GeorgiaPlate plate={plate} state="Georgia" />,
  },

  PA: {
    ...simpleProfile({
      code: "PA", label: "Pennsylvania (visitPA.com)", stateProp: "Pennsylvania",
      defaultPlate: "ABC1234", topEnd: 122, bottomStart: 378,
      whitePatches: [
        { x: 22, y: 140, width: 34, height: 220 },
        { x: 944, y: 140, width: 34, height: 220 },
      ],
    }),
    scenicCore: { y0: 130, y1: 488 },
    textRects: [
      { x: 245, y: 41, width: 509, height: 61 },
      { x: 53, y: 135, width: 338, height: 237 },
      { x: 501, y: 135, width: 445, height: 237 },
      { x: 320, y: 395, width: 375, height: 72 },
    ],
    render: (plate) => <PennsylvaniaPlate plate={plate} state="Pennsylvania" />,
  },

  NY: {
    slug: "ny-plate",
    label: "New York (Excelsior)",
    stateProp: "New York",
    defaultPlate: "ABC1234",
    render: (plate) => <NewYorkPlate plate={plate} state="New York" />,
    topEnd: 110,
    bottomStart: 335,
    scenicCore: { y0: 380, y1: 448 },
    features: {
      stripes: [
        { x: 20, y: 70, width: 224, height: 35 },
        { x: 756, y: 70, width: 224, height: 35 },
      ],
      wordmark: [{ x: 250, y: 42, width: 500, height: 80 }],
      frameAndBolts: [
        { x: 0, y: 0, width: WIDTH, height: 34 },
        { x: 0, y: 0, width: 42, height: 130 },
        { x: WIDTH - 42, y: 0, width: 42, height: 130 },
        { x: 172, y: 38, width: 64, height: 36 },
        { x: 764, y: 38, width: 64, height: 36 },
      ],
    },
    stripeZone: [
      { x: 24, y: 74, width: 220, height: 28 },
      { x: 756, y: 74, width: 220, height: 28 },
    ],
    // Text bounds on the official DMV Excelsior reference (including embossing).
    // Keep the scenery visible while excluding all of the reference's serial.
    textRects: [
      { x: 250, y: 42, width: 500, height: 80 },
      { x: 80, y: 140, width: 830, height: 252 },
      { x: 278, y: 396, width: 446, height: 68 },
    ],
    whitePatches: [
      // Below the top rules, outside the serial and inside the inset border.
      { x: 35, y: 160, width: 40, height: 80 },
      { x: 925, y: 160, width: 40, height: 80 },
      { x: 400, y: 145, width: 110, height: 55 },
    ],
    alignmentAnchor: [
      ...FRAME_ANCHOR,
      { x: 172, y: 38, width: 64, height: 36 },
      { x: 764, y: 38, width: 64, height: 36 },
    ],
  },

  CA: {
    slug: "ca-plate",
    label: "California (white base)",
    stateProp: "California",
    defaultPlate: "1ABC234",
    render: (plate) => <CaliforniaPlate plate={plate} state="California" />,
    // No scenery at all — script wordmark up top, serial in the middle, a small
    // red URL at the bottom. Everything of interest is text, so artwork-only
    // scoring here is really measuring the background and the frame.
    topEnd: 130,
    bottomStart: 400,
    scenicCore: { y0: 100, y1: 400 },
    features: {
      wordmark: [{ x: 300, y: 20, width: 400, height: 110 }],
      frameAndBolts: [
        { x: 0, y: 0, width: WIDTH, height: 30 },
        { x: 0, y: 0, width: 34, height: HEIGHT },
        { x: WIDTH - 34, y: 0, width: 34, height: HEIGHT },
        { x: 0, y: HEIGHT - 30, width: WIDTH, height: 30 },
      ],
    },
    // Script wordmark, serial, and the dmv.ca.gov line.
    textRects: [
      { x: 240, y: 10, width: 520, height: 130 },
      { x: 750, y: 75, width: 70, height: 65 },
      { x: 10, y: 160, width: 980, height: 254 },
      { x: 250, y: 420, width: 500, height: 60 },
    ],
    // Blank shoulders above the reference serial, clear of script and slots.
    whitePatches: [
      { x: 45, y: 100, width: 100, height: 35 },
      { x: 850, y: 100, width: 100, height: 35 },
    ],
    alignmentAnchor: FRAME_ANCHOR,
  },

  NJ: {
    slug: "nj-plate",
    label: "New Jersey (Garden State)",
    stateProp: "New Jersey",
    defaultPlate: "ABC12D",
    render: (plate) => <NewJerseyPlate plate={plate} state="New Jersey" />,
    // The yellow-to-white fade is the only artwork, so unlike the other states
    // the background IS the thing being scored — scenicCore spans the fade.
    topEnd: 130,
    bottomStart: 390,
    scenicCore: { y0: 0, y1: 400 },
    features: {
      wordmark: [{ x: 260, y: 20, width: 480, height: 110 }],
      frameAndBolts: [
        { x: 0, y: 0, width: WIDTH, height: 30 },
        { x: 0, y: 0, width: 34, height: HEIGHT },
        { x: WIDTH - 34, y: 0, width: 34, height: HEIGHT },
        { x: 0, y: HEIGHT - 30, width: WIDTH, height: 30 },
      ],
    },
    // New Jersey wordmark, the serial, and the Garden State footer.
    textRects: [
      { x: 240, y: 10, width: 520, height: 120 },
      { x: 42, y: 134, width: 344, height: 257 },
      { x: 510, y: 134, width: 454, height: 257 },
      { x: 220, y: 390, width: 560, height: 100 },
    ],
    // Only the very bottom of this plate is genuinely white — the rest is the
    // yellow fade. Sampling mid-plate would calibrate against yellow and skew
    // every colour in the report.
    whitePatches: [
      { x: 40, y: 440, width: 80, height: 50 },
      { x: 880, y: 440, width: 80, height: 50 },
    ],
    alignmentAnchor: FRAME_ANCHOR,
  },

  FL: {
    slug: "fl-plate",
    label: "Florida (Sunshine State)",
    stateProp: "Florida",
    defaultPlate: "ABC234",
    render: (plate) => <FloridaPlate plate={plate} state="Florida" />,
    // No stripes and no scenery band. The top holds an arched MYFLORIDA.COM,
    // the bottom a SUNSHINE STATE motto, and the middle a centre graphic over a
    // state-silhouette watermark — so "scenic core" here is that middle graphic.
    topEnd: 130,
    bottomStart: 380,
    scenicCore: { y0: 150, y1: 400 },
    features: {
      wordmark: [{ x: 180, y: 10, width: 640, height: 120 }],
      frameAndBolts: [
        { x: 0, y: 0, width: WIDTH, height: 30 },
        { x: 0, y: 0, width: 38, height: HEIGHT },
        { x: WIDTH - 38, y: 0, width: 38, height: HEIGHT },
        { x: 0, y: HEIGHT - 30, width: WIDTH, height: 30 },
      ],
    },
    // Arched MYFLORIDA.COM, the registration, and the SUNSHINE STATE motto.
    // The registration is split either side of centre on purpose: the orange
    // graphic and the state watermark sit between the letters and the digits,
    // and they are the main thing worth scoring on this plate. A single
    // full-width band would mask them out along with the text.
    textRects: [
      { x: 150, y: 0, width: 700, height: 130 },
      { x: 0, y: 130, width: 370, height: 250 },
      { x: 630, y: 130, width: 370, height: 250 },
      { x: 200, y: 380, width: 600, height: 110 },
    ],
    // Clear of the serial, arched header, watermark, and upper-right decal well.
    whitePatches: [
      { x: 45, y: 110, width: 100, height: 30 },
      { x: 850, y: 115, width: 100, height: 25 },
    ],
    alignmentAnchor: FRAME_ANCHOR,
  },
};

/**
 * Initial profiles for the nationwide baseline. Serial masks follow the source
 * samples, leaving the margins, separators and scenery visible. No white-balance
 * calibration: these illustrated bases do not share reliable neutral patches.
 * Typography and fine replica watermarks still need browser review.
 */
for (const code of BASELINE_PLATE_STATES) {
  const custom = PLATES[code];
  const Component = custom.component;
  const ref = PLATE_REFERENCES.find((entry) => entry.state === code)!;
  const serialMasks: Rect[] = code === "AL"
    ? [{ x: 44, y: 133, width: 360, height: 245 }, { x: 478, y: 133, width: 469, height: 245 }]
    : code === "KY"
    ? [{ x: 64, y: 149, width: 343, height: 211 }, { x: 472, y: 149, width: 465, height: 211 }]
    : code === "ME"
    ? [{ x: 178, y: 120, width: 301, height: 244 }, { x: 568, y: 120, width: 391, height: 244 }]
    : code === "VA"
    ? [{ x: 35, y: 125, width: 929, height: 240 }]
    : code === "SC"
      ? [{ x: 295, y: 123, width: 679, height: 244 }]
      : code === "KS"
        ? [{ x: 190, y: 188, width: 734, height: 198 }]
        : code === "ND"
          ? [{ x: 61, y: 131, width: 341, height: 209 }, { x: 479, y: 131, width: 460, height: 209 }]
        : code === "VT"
          ? [{ x: 70, y: 125, width: 316, height: 252 }, { x: 509, y: 125, width: 421, height: 252 }]
        : code === "WY"
          ? [{ x: 27, y: 125, width: 229, height: 282 }, { x: 379, y: 125, width: 579, height: 282 }]
          : code === "OK"
            ? [{ x: 40, y: 130, width: 354, height: 252 }, { x: 625, y: 130, width: 335, height: 252 }]
            : [[24, 123], [155, 121], [279, 125], [539, 116], [666, 127], [800, 156]]
              .map(([x, width]) => ({ x, y: 122, width, height: 266 }));
  const header: Rect = { x: 174, y: 8, width: 654, height: 114 };
  if (code === "KY") Object.assign(header, { x: 259, y: 28, width: 494, height: 106 });
  if (code === "KS") Object.assign(header, { x: 278, y: 32, width: 443, height: 106 });
  if (code === "ND") Object.assign(header, { x: 235, y: 32, width: 545, height: 86 });
  if (code === "VT") Object.assign(header, { x: 290, y: 12, width: 411, height: 78 });
  if (code === "WI") Object.assign(header, { x: 25, width: 561, height: 95 });
  if (code === "WA") Object.assign(header, { x: 45, y: 64, width: 713, height: 82 });
  if (code === "MN") Object.assign(header, { x: 24, width: 862, height: 98 });
  if (code === "SC") Object.assign(header, { x: 140, y: 59, width: 748, height: 37 });
  if (code === "VA") Object.assign(header, { x: 260, y: 22, width: 485, height: 88 });
  if (code === "CO") Object.assign(header, { x: 240, y: 379, width: 528, height: 91 });
  if (code === "NH") Object.assign(header, { x: 321, y: 374, width: 382, height: 117 });
  const extras: Rect[] = [];
  if (code === "VA") extras.push({ x: 585, y: 425, width: 180, height: 35 }, { x: 850, y: 425, width: 125, height: 52 });
  if (code === "AL") extras.push({ x: 868, y: 432, width: 62, height: 23 });
  if (code === "MA") extras.push({ x: 12, y: 0, width: 136, height: 118 }, { x: 844, y: 0, width: 151, height: 119 });
  if (code === "DC") extras.push({ x: 27, y: 15, width: 107, height: 93 }, { x: 869, y: 15, width: 107, height: 93 });
  if (code === "TN") extras.push({ x: 35, y: 33, width: 207, height: 80 });
  if (code === "ND") extras.push({ x: 865, y: 18, width: 107, height: 85 });
  if (code === "WY") extras.push({ x: 8, y: 9, width: 132, height: 65 }, { x: 811, y: 422, width: 189, height: 70 });
  if (code === "OK") extras.push({ x: 24, y: 16, width: 101, height: 47 }, { x: 863, y: 16, width: 107, height: 47 }, { x: 469, y: 231, width: 64, height: 39 });
  if (code === "SC") extras.push(
    // Agency sample's printer barcode, decal instruction and layout label.
    { x: 27, y: 0, width: 291, height: 18 },
    { x: 850, y: 404, width: 94, height: 43 },
    { x: 480, y: 483, width: 41, height: 17 },
    // Lettering on the diagonal flag, preserving its illustrated margins.
    ...[[74, 264, 18, 23], [91, 258, 14, 20], [106, 249, 15, 23],
      [120, 243, 17, 23], [138, 237, 17, 23], [153, 229, 23, 24]]
      .map(([x, y, width, height]) => ({ x, y, width, height })),
  );
  const footer: Rect = { x: 225, y: 402, width: 568, height: 87 };
  if (code === "KS") Object.assign(footer, { x: 340, y: 404, width: 341, height: 74 });
  if (code === "ND") Object.assign(footer, { x: 45, y: 447, width: 231, height: 29 });
  if (code === "VT") Object.assign(footer, { x: 237, y: 434, width: 526, height: 44 });
  if (code === "DC") Object.assign(footer, { x: 24, y: 407, width: 952, height: 81 });
  if (code === "NC") Object.assign(footer, { x: 76, y: 398, width: 848, height: 77 });
  if (code === "SC") Object.assign(footer, { x: 238, y: 395, width: 530, height: 65 });
  if (code === "AZ") Object.assign(footer, { x: 555, y: 368, width: 394, height: 61 });
  if (code === "NM") Object.assign(footer, { x: 150, y: 362, width: 690, height: 72 });
  if (code === "NH") Object.assign(footer, { x: 147, y: 8, width: 728, height: 80 });
  if (code === "AL") Object.assign(footer, { x: 342, y: 427, width: 354, height: 43 });
  if (code === "VA") Object.assign(footer, { x: 193, y: 380, width: 611, height: 47 });
  PLATE_PROFILES[code] = {
    slug: `${code.toLowerCase()}-plate`, label: ref.label, stateProp: custom.name,
    defaultPlate: PLATE_METADATA[code].sample, render: (plate) => <Component plate={plate} state={code} />,
    topEnd: 122, bottomStart: 388, scenicCore: { y0: 100, y1: 485 },
    features: { frameAndBolts: FRAME_ANCHOR },
    textRects: [header, ...serialMasks, footer, ...extras,
      // Tiny seller marks are not printed artwork.
      { x: 857, y: 453, width: 128, height: 33 }],
    whitePatches: [], calibrate: false, alignmentAnchor: FRAME_ANCHOR,
  };
}

// Reviewed against the actual reference crops. These replace the nationwide
// ten-character placeholders: most of these samples say ANY TEXT. Keep scenic
// margins and separators visible, and exclude complete glyphs and their relief.
const reviewedTextMasks: Record<string, number[][]> = {
  // These sources use seven-character serials, not the initial ten-character
  // placeholder. Preserve the magnolia, wave curl, portraits and mural between
  // groups; include the complete state wordmarks and their decorative swashes.
  AR: [[210, 14, 552, 132], [31, 152, 349, 240], [502, 152, 466, 240], [269, 414, 447, 65]],
  MS: [[283, 19, 437, 120], [35, 145, 355, 231], [613, 145, 351, 231], [338, 393, 321, 79]],
  NE: [[240, 39, 519, 85], [80, 149, 368, 233], [486, 149, 434, 233], [43, 426, 92, 45]],
  NH: [[242, 28, 518, 61], [55, 97, 333, 245], [505, 97, 445, 245], [357, 346, 280, 57], [281, 399, 435, 82]],
  RI: [[236, 13, 535, 86], [52, 128, 333, 241], [506, 129, 444, 240], [252, 383, 483, 95]],
  SD: [[283, 12, 429, 123], [25, 130, 413, 222], [484, 130, 483, 222], [249, 423, 518, 58], [62, 481, 114, 19]],
  TN: [[326, 50, 350, 48], [45, 49, 198, 80], [43, 144, 327, 222], [508, 144, 447, 222], [281, 368, 441, 34], [376, 405, 254, 65], [843, 419, 118, 49], [969, 150, 19, 211], [831, 49, 118, 84],
    // The optional motto curves around the ring; its small separate masks leave
    // the complete tristar medallion measured.
    [358, 215, 22, 37], [367, 199, 25, 23], [384, 185, 30, 23], [411, 179, 34, 21], [446, 182, 28, 22], [472, 192, 24, 26], [490, 211, 21, 40]],
  // Complete source serials, including relief; NM says ANY TXT and exposes the full Zia.
  NM: [[244, 43, 512, 44], [35, 122, 348, 237], [615, 122, 349, 237], [145, 358, 700, 65]],
  CT: [[174, 8, 654, 114], [73, 134, 325, 232], [499, 134, 428, 232], [225, 402, 568, 87], [857, 453, 128, 33]],
  MN: [[24, 8, 862, 98], [30, 146, 364, 243], [536, 146, 435, 243], [225, 402, 568, 87], [857, 453, 128, 33]],
  WI: [[25, 8, 561, 95], [63, 136, 327, 244], [501, 136, 434, 244], [225, 402, 568, 87], [857, 453, 128, 33]],
  AK: [[245, 24, 520, 90], [39, 128, 337, 257], [553, 128, 425, 257], [236, 419, 531, 56]],
  AZ: [[242, 39, 516, 61], [130, 116, 340, 247], [515, 116, 469, 247], [567, 376, 353, 53], [798, 484, 130, 16]],
  CO: [[250, 380, 500, 77], [37, 135, 372, 240], [468, 136, 500, 237], [414, 240, 55, 56]],
  DE: [[254, 28, 496, 59], [36, 122, 375, 255], [455, 125, 515, 253], [270, 395, 458, 72]],
  HI: [[356, 39, 286, 72], [49, 121, 409, 258], [510, 121, 443, 258], [266, 395, 467, 67]],
  ID: [[110, 40, 568, 107], [104, 144, 378, 216], [492, 144, 410, 216], [245, 424, 514, 61], [847, 484, 105, 16]],
  IN: [[253, 28, 479, 81], [111, 122, 345, 228], [491, 122, 401, 228], [852, 406, 84, 74]],
  NC: [[230, 44, 542, 64], [74, 136, 358, 251], [472, 137, 456, 250], [76, 398, 848, 77]],
  OR: [[302, 8, 380, 109], [34, 113, 352, 282], [502, 113, 472, 283]],
  UT: [[321, 26, 350, 94], [27, 153, 354, 253], [503, 154, 476, 254], [247, 432, 507, 42]],
  WA: [[70, 74, 550, 75], [51, 159, 332, 251], [510, 159, 443, 251], [262, 423, 481, 55]],
  WY: [[241, 18, 527, 88], [58, 125, 211, 253], [490, 123, 451, 252], [8, 17, 111, 62], [252, 444, 550, 30], [811, 419, 189, 69], [385, 373, 20, 21]],
};
for (const [state, rects] of Object.entries(reviewedTextMasks)) {
  PLATE_PROFILES[state].textRects = rects.map(([x, y, width, height]) => ({ x, y, width, height }));
}
