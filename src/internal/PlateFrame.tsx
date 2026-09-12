"use client";

import type { ComponentPropsWithRef } from "react";
import type { PlateProps } from "../types.js";

type Props = ComponentPropsWithRef<"div"> & Pick<PlateProps, "mountingHoles" | "registrationStickerAreas">;

/** Hardware is a separate, decorative layer shared by every plate design. */
export default function PlateFrame({ children, mountingHoles = false, registrationStickerAreas: _registrationStickerAreas, ...props }: Props) {
  return (
    <div {...props}>
      {children}
      {mountingHoles && (
        <svg
          data-plate-mounting-holes={mountingHoles === "round" ? "round" : "slots"}
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 1000 500"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        >
          {[200, 800].flatMap((x) => [50, 450].map((y) => mountingHoles === "round"
            ? <circle key={`${x}-${y}`} cx={x} cy={y} r="13" fill="#f3f4f2" stroke="#858c89" strokeWidth="2" />
            : <rect key={`${x}-${y}`} x={x - 40} y={y - 10} width="80" height="20" rx="10" fill="#d8dcd8" stroke="#858c89" strokeWidth="2" />))}
        </svg>
      )}
    </div>
  );
}
