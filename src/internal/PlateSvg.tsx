"use client";

import { Children, isValidElement, useId, type SVGProps } from "react";

// North Carolina's shared template defines the physical outline for every plate.
export const PLATE_OUTLINE = { x: 5, y: 5, width: 990, height: 490, rx: 29 } as const;
export const PLATE_INSET_RADIUS = 23;

export default function PlateSvg({ children, ...props }: SVGProps<SVGSVGElement>) {
  const clipId = `plate-outline-${useId()}`;
  const nodes = Children.toArray(children);
  const isMetadata = (node: (typeof nodes)[number]) =>
    isValidElement(node) && (node.type === "title" || node.type === "desc" || node.type === "defs");
  return (
    <svg {...props}>
      {nodes.filter(isMetadata)}
      <defs><clipPath id={clipId}><rect {...PLATE_OUTLINE} /></clipPath></defs>
      <g clipPath={`url(#${clipId})`}>{nodes.filter((node) => !isMetadata(node))}</g>
    </svg>
  );
}
