import AlabamaPlate from "./plates/AlabamaPlate.js";
import AlaskaPlate from "./plates/AlaskaPlate.js";
import ArizonaPlate from "./plates/ArizonaPlate.js";
import ArkansasPlate from "./plates/ArkansasPlate.js";
import ColoradoPlate from "./plates/ColoradoPlate.js";
import ConnecticutPlate from "./plates/ConnecticutPlate.js";
import DelawarePlate from "./plates/DelawarePlate.js";
import DistrictofColumbiaPlate from "./plates/DistrictofColumbiaPlate.js";
import HawaiiPlate from "./plates/HawaiiPlate.js";
import IdahoPlate from "./plates/IdahoPlate.js";
import IndianaPlate from "./plates/IndianaPlate.js";
import IowaPlate from "./plates/IowaPlate.js";
import KansasPlate from "./plates/KansasPlate.js";
import KentuckyPlate from "./plates/KentuckyPlate.js";
import MainePlate from "./plates/MainePlate.js";
import MassachusettsPlate from "./plates/MassachusettsPlate.js";
import MinnesotaPlate from "./plates/MinnesotaPlate.js";
import MississippiPlate from "./plates/MississippiPlate.js";
import NebraskaPlate from "./plates/NebraskaPlate.js";
import NewHampshirePlate from "./plates/NewHampshirePlate.js";
import NewMexicoPlate from "./plates/NewMexicoPlate.js";
import NorthCarolinaPlate from "./plates/NorthCarolinaPlate.js";
import NorthDakotaPlate from "./plates/NorthDakotaPlate.js";
import OklahomaPlate from "./plates/OklahomaPlate.js";
import OregonPlate from "./plates/OregonPlate.js";
import RhodeIslandPlate from "./plates/RhodeIslandPlate.js";
import SouthCarolinaPlate from "./plates/SouthCarolinaPlate.js";
import SouthDakotaPlate from "./plates/SouthDakotaPlate.js";
import TennesseePlate from "./plates/TennesseePlate.js";
import UtahPlate from "./plates/UtahPlate.js";
import VermontPlate from "./plates/VermontPlate.js";
import VirginiaPlate from "./plates/VirginiaPlate.js";
import WashingtonPlate from "./plates/WashingtonPlate.js";
import WestVirginiaPlate from "./plates/WestVirginiaPlate.js";
import WisconsinPlate from "./plates/WisconsinPlate.js";
import WyomingPlate from "./plates/WyomingPlate.js";
import CaliforniaPlate from "./plates/CaliforniaPlate.js";
import FloridaPlate from "./plates/FloridaPlate.js";
import GeorgiaPlate from "./plates/GeorgiaPlate.js";
import IllinoisPlate from "./plates/IllinoisPlate.js";
import LouisianaPlate from "./plates/LouisianaPlate.js";
import MarylandPlate from "./plates/MarylandPlate.js";
import MichiganPlate from "./plates/MichiganPlate.js";
import MissouriPlate from "./plates/MissouriPlate.js";
import MontanaPlate from "./plates/MontanaPlate.js";
import NevadaPlate from "./plates/NevadaPlate.js";
import NewJerseyPlate from "./plates/NewJerseyPlate.js";
import NewYorkPlate from "./plates/NewYorkPlate.js";
import OhioPlate from "./plates/OhioPlate.js";
import PennsylvaniaPlate from "./plates/PennsylvaniaPlate.js";
import TexasPlate from "./plates/TexasPlate.js";

/** Components and names used by the public dispatcher. */
export const PLATES = {
  AL: { name: "Alabama", component: AlabamaPlate },
  AK: { name: "Alaska", component: AlaskaPlate },
  AZ: { name: "Arizona", component: ArizonaPlate },
  AR: { name: "Arkansas", component: ArkansasPlate },
  CO: { name: "Colorado", component: ColoradoPlate },
  CT: { name: "Connecticut", component: ConnecticutPlate },
  DE: { name: "Delaware", component: DelawarePlate },
  DC: { name: "District of Columbia", component: DistrictofColumbiaPlate },
  HI: { name: "Hawaii", component: HawaiiPlate },
  ID: { name: "Idaho", component: IdahoPlate },
  IN: { name: "Indiana", component: IndianaPlate },
  IA: { name: "Iowa", component: IowaPlate },
  KS: { name: "Kansas", component: KansasPlate },
  KY: { name: "Kentucky", component: KentuckyPlate },
  ME: { name: "Maine", component: MainePlate },
  MA: { name: "Massachusetts", component: MassachusettsPlate },
  MN: { name: "Minnesota", component: MinnesotaPlate },
  MS: { name: "Mississippi", component: MississippiPlate },
  NE: { name: "Nebraska", component: NebraskaPlate },
  NH: { name: "New Hampshire", component: NewHampshirePlate },
  NM: { name: "New Mexico", component: NewMexicoPlate },
  NC: { name: "North Carolina", component: NorthCarolinaPlate },
  ND: { name: "North Dakota", component: NorthDakotaPlate },
  OK: { name: "Oklahoma", component: OklahomaPlate },
  OR: { name: "Oregon", component: OregonPlate },
  RI: { name: "Rhode Island", component: RhodeIslandPlate },
  SC: { name: "South Carolina", component: SouthCarolinaPlate },
  SD: { name: "South Dakota", component: SouthDakotaPlate },
  TN: { name: "Tennessee", component: TennesseePlate },
  UT: { name: "Utah", component: UtahPlate },
  VT: { name: "Vermont", component: VermontPlate },
  VA: { name: "Virginia", component: VirginiaPlate },
  WA: { name: "Washington", component: WashingtonPlate },
  WV: { name: "West Virginia", component: WestVirginiaPlate },
  WI: { name: "Wisconsin", component: WisconsinPlate },
  WY: { name: "Wyoming", component: WyomingPlate },

  CA: { name: "California", component: CaliforniaPlate },
  FL: { name: "Florida", component: FloridaPlate },
  GA: { name: "Georgia", component: GeorgiaPlate },
  IL: { name: "Illinois", component: IllinoisPlate },
  LA: { name: "Louisiana", component: LouisianaPlate },
  MD: { name: "Maryland", component: MarylandPlate },
  MI: { name: "Michigan", component: MichiganPlate },
  MO: { name: "Missouri", component: MissouriPlate },
  MT: { name: "Montana", component: MontanaPlate },
  NJ: { name: "New Jersey", component: NewJerseyPlate },
  NV: { name: "Nevada", component: NevadaPlate },
  NY: { name: "New York", component: NewYorkPlate },
  OH: { name: "Ohio", component: OhioPlate },
  PA: { name: "Pennsylvania", component: PennsylvaniaPlate },
  TX: { name: "Texas", component: TexasPlate },
} as const;

export type PlateState = keyof typeof PLATES;
export const PLATE_STATES = Object.keys(PLATES) as PlateState[];
