import type { ComponentType } from "react";
import type { PlateState } from "./registry.js";
import type { PlateProps } from "./types.js";

export type PlateLoader = () => Promise<{ default: ComponentType<PlateProps> }>;

/**
 * One dynamic import per state for React.lazy: `lazy(PLATE_LOADERS.NY)`.
 * Importing this map loads no artwork, so bundlers emit one chunk per plate.
 */
export const PLATE_LOADERS: Record<PlateState, PlateLoader> = {
  AL: () => import("./plates/AlabamaPlate.js"),
  AK: () => import("./plates/AlaskaPlate.js"),
  AZ: () => import("./plates/ArizonaPlate.js"),
  AR: () => import("./plates/ArkansasPlate.js"),
  CO: () => import("./plates/ColoradoPlate.js"),
  CT: () => import("./plates/ConnecticutPlate.js"),
  DE: () => import("./plates/DelawarePlate.js"),
  DC: () => import("./plates/DistrictofColumbiaPlate.js"),
  HI: () => import("./plates/HawaiiPlate.js"),
  ID: () => import("./plates/IdahoPlate.js"),
  IN: () => import("./plates/IndianaPlate.js"),
  IA: () => import("./plates/IowaPlate.js"),
  KS: () => import("./plates/KansasPlate.js"),
  KY: () => import("./plates/KentuckyPlate.js"),
  ME: () => import("./plates/MainePlate.js"),
  MA: () => import("./plates/MassachusettsPlate.js"),
  MN: () => import("./plates/MinnesotaPlate.js"),
  MS: () => import("./plates/MississippiPlate.js"),
  NE: () => import("./plates/NebraskaPlate.js"),
  NH: () => import("./plates/NewHampshirePlate.js"),
  NM: () => import("./plates/NewMexicoPlate.js"),
  NC: () => import("./plates/NorthCarolinaPlate.js"),
  ND: () => import("./plates/NorthDakotaPlate.js"),
  OK: () => import("./plates/OklahomaPlate.js"),
  OR: () => import("./plates/OregonPlate.js"),
  RI: () => import("./plates/RhodeIslandPlate.js"),
  SC: () => import("./plates/SouthCarolinaPlate.js"),
  SD: () => import("./plates/SouthDakotaPlate.js"),
  TN: () => import("./plates/TennesseePlate.js"),
  UT: () => import("./plates/UtahPlate.js"),
  VT: () => import("./plates/VermontPlate.js"),
  VA: () => import("./plates/VirginiaPlate.js"),
  WA: () => import("./plates/WashingtonPlate.js"),
  WV: () => import("./plates/WestVirginiaPlate.js"),
  WI: () => import("./plates/WisconsinPlate.js"),
  WY: () => import("./plates/WyomingPlate.js"),
  CA: () => import("./plates/CaliforniaPlate.js"),
  FL: () => import("./plates/FloridaPlate.js"),
  GA: () => import("./plates/GeorgiaPlate.js"),
  IL: () => import("./plates/IllinoisPlate.js"),
  LA: () => import("./plates/LouisianaPlate.js"),
  MD: () => import("./plates/MarylandPlate.js"),
  MI: () => import("./plates/MichiganPlate.js"),
  MO: () => import("./plates/MissouriPlate.js"),
  MT: () => import("./plates/MontanaPlate.js"),
  NJ: () => import("./plates/NewJerseyPlate.js"),
  NV: () => import("./plates/NevadaPlate.js"),
  NY: () => import("./plates/NewYorkPlate.js"),
  OH: () => import("./plates/OhioPlate.js"),
  PA: () => import("./plates/PennsylvaniaPlate.js"),
  TX: () => import("./plates/TexasPlate.js"),
};
