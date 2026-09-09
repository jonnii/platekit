"use client";

import BaselinePlate from "./internal/BaselinePlate.js";
import { PLATES, PLATE_STATES } from "./registry.js";
import type { LicensePlateProps } from "./types.js";

/**
 * Every jurisdiction the API emits has a component, so this only catches a state
 * string we do not recognise: a plain plate carrying whatever name we were given,
 * rather than a crash or a blank.
 */
function GenericPlate(props: LicensePlateProps) {
  const name = props.state.trim() || "United States";
  return (
    <BaselinePlate
      {...props}
      name={name}
      heading={name.toUpperCase()}
      colors={["#f9fbff", "#eef2f8"]}
      ink="#1b2a41"
      headingColor="#0b3b6f"
    />
  );
}

export default function LicensePlate(props: LicensePlateProps) {
  const normalized = props.state.trim().toUpperCase();
  const code = PLATE_STATES.find(
    (code) => code === normalized || PLATES[code].name.toUpperCase() === normalized,
  );
  const Component = code ? PLATES[code].component : GenericPlate;
  return <Component {...props} />;
}
