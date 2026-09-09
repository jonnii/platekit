import LicensePlate from "../../../src/LicensePlate";
import type { PlateReference } from "../../../tools/artwork/references";
import ReferencePlate from "./ReferencePlate";
import { cleanedReferenceSource } from "../../../tools/artwork/reference-assets";

/** Enlarge the displayed reference and live SVG at the same scale. */
export default function ArtworkDetails({ reference }: { reference: PlateReference }) {
  if (!reference.details?.length) return null;
  const zoom = 1.5;
  return (
    <details className="mt-5 rounded-lg border border-zinc-300 bg-white p-4" open>
      <summary className="cursor-pointer text-sm font-semibold">Artwork close-ups</summary>
      <p className="mt-2 max-w-2xl text-xs text-zinc-600">
        Compare feather edges, scale colors and pale halos at equal magnification.
        Cleaned reference images contain reconstructed areas; use the original
        photo to verify fine detail.
        Check the full plates below for how the details read at normal sizes.
      </p>
      <div className="mt-4 flex flex-wrap gap-8">
        {reference.details.map((detail) => (
          <div key={detail.label}>
            <h3 className="mb-2 text-sm font-medium">{detail.label}</h3>
            <div className="flex flex-wrap gap-3">
              <figure>
                <figcaption className="mb-1 text-xs text-emerald-700">{cleanedReferenceSource(reference) ? "Cleaned reference" : "Reference photo"}</figcaption>
                <ReferencePlate reference={reference} width={1000 * zoom} detail={detail} />
              </figure>
              <figure>
                <figcaption className="mb-1 text-xs text-zinc-600">Our artwork</figcaption>
                <div className="relative overflow-hidden" style={{ width: detail.w * zoom, height: detail.h * zoom }}>
                  <div className="absolute" style={{ width: 1000 * zoom, left: -detail.x * zoom, top: -detail.y * zoom }}>
                    <LicensePlate plate="" state={reference.state} />
                  </div>
                </div>
              </figure>
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}
