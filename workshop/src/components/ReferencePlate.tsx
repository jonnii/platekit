import { cleanedReferenceSource } from "../../../tools/artwork/reference-assets";
import type { CSSProperties } from "react";
import type { PlateReference } from "../../../tools/artwork/references";

export default function ReferencePlate({ reference, width, detail }: {
  reference: PlateReference;
  width: number;
  detail?: NonNullable<PlateReference["details"]>[number];
}) {
  const cleaned = cleanedReferenceSource(reference);
  const scale = width / reference.plate.w;
  const zoom = width / 1000;
  const offsetX = (detail?.x ?? 0) * zoom;
  const offsetY = (detail?.y ?? 0) * zoom;
  const style: CSSProperties = {
    width: detail ? detail.w * zoom : width,
    height: detail ? detail.h * zoom : reference.plate.h * scale,
    backgroundImage: `url("${cleaned ?? reference.src}")`,
    backgroundSize: cleaned
      ? `${width}px ${reference.plate.h * scale}px`
      : `${reference.image.w * scale}px ${reference.image.h * scale}px`,
    backgroundPosition: cleaned
      ? `${-offsetX}px ${-offsetY}px`
      : `${-reference.plate.x * scale - offsetX}px ${-reference.plate.y * scale - offsetY}px`,
    backgroundRepeat: "no-repeat",
  };
  return <div role="img" aria-label={`${reference.label}${detail ? ` — ${detail.label}` : ""}${cleaned ? ", sample registration removed" : ", reference photo"}`} style={style} />;
}
