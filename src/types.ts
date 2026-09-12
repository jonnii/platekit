import type { ComponentPropsWithRef } from "react";

/** Props for an individual state plate. DOM props target the wrapping div. */
export type PlateProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  plate: string;
  /** Override the state used in accessible labels; defaults to the component's state. */
  state?: string;
  /** Optional shared mounting-hole overlay. true selects slots; hidden by default. */
  mountingHoles?: boolean | "slots" | "round";
  /** Show the design's unassigned registration sticker areas; hidden by default. */
  registrationStickerAreas?: boolean;
};

/** The dispatcher requires a state code or full state name. */
export type LicensePlateProps = PlateProps & { state: string };
