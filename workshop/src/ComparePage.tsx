import { PLATE_METADATA } from "../../tools/artwork/metadata";
import { COMPARISON_WIDTHS as WIDTHS } from "../../tools/artwork/config";
import LicensePlate from "../../src/LicensePlate";
import { PLATES, PLATE_STATES, type PlateState } from "../../src/registry";
import ComparisonOverview from "./components/ComparisonOverview";
import ArtworkDetails from "./components/ArtworkDetails";
import ReferencePlate from "./components/ReferencePlate";
import { cleanedReferenceSource } from "../../tools/artwork/reference-assets";
import { PLATE_REFERENCES } from "../../tools/artwork/references";
import { originalReference } from "../../tools/artwork/reference-assets";
import { useState } from "react";

// Card-grid width and plate-page width. Kept narrow enough that a reference and
// a render sit side by side on a laptop.


export default function ComparePage({ state, plate }: { state?: string; plate?: string }) {
  const [mountingHoles, setMountingHoles] = useState<false | "slots" | "round">(false);
  const [registrationStickerAreas, setRegistrationStickerAreas] = useState(false);
  const features = { mountingHoles, registrationStickerAreas };
  const selected = state?.toUpperCase();
  const custom = PLATE_STATES.includes(selected as PlateState)
    ? PLATES[selected as PlateState] : undefined;
  const shown = selected
    ? PLATE_REFERENCES.filter((r) => r.state === selected)
    : PLATE_REFERENCES;

  return (
    <div className="min-h-screen bg-zinc-100 p-8 text-zinc-900">
      <h1 className="text-2xl font-bold">Plate redraws — reference vs ours</h1>
      <p className="mt-1 max-w-2xl text-sm text-zinc-600">
        Left is the cleaned reference with sample registrations, mounting holes,
        and sticker areas removed using AI where a cleaned copy is available.
        Right is our artwork at the same width. Scores use the original photos,
        excluding lettering and optional features. Check lettering in the
        registration samples below.
      </p>

      <fieldset className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <legend className="mb-2 font-semibold">Optional plate features</legend>
        <label>Mounting holes <select aria-label="Mounting holes" className="rounded border bg-white p-2" value={mountingHoles || "none"} onChange={(event) => setMountingHoles(event.target.value === "none" ? false : event.target.value as "slots" | "round")}><option value="none">None</option><option value="slots">Slots</option><option value="round">Round</option></select></label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={registrationStickerAreas} onChange={(event) => setRegistrationStickerAreas(event.target.checked)} />Registration sticker areas</label>
      </fieldset>

      <ComparisonOverview />

      <nav aria-label="Plate comparisons" className="mt-6 flex flex-wrap items-center gap-2 text-xs">
        <a
          href="/compare"
          className={`rounded px-2 py-1 ${!selected ? "bg-zinc-800 text-white" : "bg-zinc-200 hover:bg-zinc-300"}`}
        >
          All
        </a>
        {PLATE_REFERENCES.map((r) => (
          <a
            key={r.state}
            href={`/compare?state=${r.state}`}
            className={`rounded px-2 py-1 ${selected === r.state ? "bg-zinc-800 text-white" : "bg-zinc-200 hover:bg-zinc-300"}`}
          >
            {r.state}
          </a>
        ))}
        {PLATE_STATES.filter((code) => !PLATE_REFERENCES.some((ref) => ref.state === code)).map((code) => (
          <a key={code} href={`/compare?state=${code}#plate-detail`}
            className={`rounded px-2 py-1 ${selected === code ? "bg-zinc-800 text-white" : "bg-zinc-200 hover:bg-zinc-300"}`}>
            {code}
          </a>
        ))}
      </nav>

      {shown.length === 0 && custom ? (
        <section id="plate-detail" className="mt-8 scroll-mt-6">
          <h2 className="font-semibold">{custom.name}</h2>
          <p className="my-3 text-sm text-zinc-600">Reference needed. This custom plate is not scored yet.</p>
          <div className="max-w-[460px]"><LicensePlate plate={PLATE_METADATA[selected as PlateState].sample} state={selected!} {...features} /></div>
        </section>
      ) : shown.length === 0 ? (
        <p id="plate-detail" className="mt-8 text-sm text-red-700">
          No reference for &ldquo;{selected}&rdquo;. Known:{" "}
          {PLATE_REFERENCES.map((r) => r.state).join(", ")}.
        </p>
      ) : null}

      {shown.map((ref, index) => (
        <section id={index === 0 ? "plate-detail" : undefined} key={ref.state} className="mt-12 max-w-[980px] scroll-mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wider">{ref.label}</h2>
          <p className="mt-1 text-xs text-zinc-600">
            Compare artwork, state name and slogan at both sizes. Both sides are blank of a registration, so only the artwork differs.{" "}
            <a href={ref.src} target="_blank" rel="noreferrer" className="underline">View original reference photo</a>
            {originalReference(ref) && <> · <a href={originalReference(ref)!.src} target="_blank" rel="noreferrer" className="underline">View preserved scoring crop</a></>}
          </p>
          {ref.notes ? (
            <p className="mt-1 max-w-2xl text-xs text-zinc-500">{ref.notes}</p>
          ) : null}

          <ArtworkDetails reference={ref} />

          {WIDTHS.map((width) => (
            <div key={width} className="mt-5">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                {width}px {width === 340 ? "(card grid)" : "(plate page)"}
              </div>
              <div className="flex flex-wrap items-start gap-5">
                <div>
                  <div className="mb-1 text-[10px] uppercase tracking-wider text-emerald-700">
                    {cleanedReferenceSource(ref) ? "reference — cleaned artwork" : "reference photo"}
                  </div>
                  <ReferencePlate reference={ref} width={width} />
                </div>
                <div>
                  <div className="mb-1 text-[10px] uppercase tracking-wider text-zinc-400">ours — no registration</div>
                  <div style={{ width }}>
                    <LicensePlate plate="" state={ref.state} {...features} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <h3 className="mt-6 font-semibold">Registration samples</h3>
          <form className="my-3 flex gap-3" method="get">
            <input type="hidden" name="state" value={ref.state} />
            <label>Custom registration <input className="border bg-white p-2" name="plate" defaultValue={plate ?? ""} maxLength={20} /></label>
            <button className="rounded bg-zinc-900 px-3 text-white">Preview</button>
          </form>
          {WIDTHS.map((width) => (
            <div key={`samples-${width}`} className="mt-4 flex flex-wrap gap-5">
              {[...new Set([...ref.samples, "AB***34", "CUSTOM12345", ...(plate ? [plate] : [])])].map((sample) => (
                <figure key={sample}>
                  <figcaption className="mb-1 text-xs text-zinc-500">{sample} — {width}px</figcaption>
                  <div style={{ width }}><LicensePlate plate={sample} state={ref.state} {...features} /></div>
                </figure>
              ))}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
