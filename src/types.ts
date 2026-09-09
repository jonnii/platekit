import type { ComponentPropsWithRef } from "react";

/** Props for an individual state plate. DOM props target the wrapping div. */
export type PlateProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  plate: string;
  /** Override the state used in accessible labels; defaults to the component's state. */
  state?: string;
};

/** The dispatcher requires a state code or full state name. */
export type LicensePlateProps = PlateProps & { state: string };
