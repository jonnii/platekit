import { useState } from "react";
import { LicensePlate, PLATES, PLATE_STATES } from "../../src";
import { PLATE_METADATA } from "../../tools/artwork/metadata";
import componentSizes from "virtual:plate-component-sizes";

const formatSize = (bytes: number) => `${(bytes / 1000).toFixed(1)} kB`;

export default function Gallery({ initialPlate = "" }: { initialPlate?: string }) {
  const [plate, setPlate] = useState(initialPlate);
  return <main className="mx-auto max-w-[1500px] px-6 py-10">
    <h1 className="text-4xl font-semibold tracking-tight">Platekit</h1>
    <p className="mt-2 text-zinc-600">50 states and Washington, DC. Preview a registration across every plate.</p>
    <div className="my-7 flex flex-wrap items-end gap-3">
      <label className="grid gap-2 text-sm">Registration
        <input name="plate" value={plate} onChange={(event) => setPlate(event.target.value)}
          placeholder="Use each state's sample" maxLength={20} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base" />
      </label>
      <button type="button" onClick={() => setPlate("")} className="rounded-lg bg-zinc-900 px-4 py-2 text-white">Reset samples</button>
    </div>
    <p className="mb-4 text-xs text-zinc-500">Sizes are per-component minified JavaScript bundles, including shared helpers. React and font files are excluded.</p>
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-6">
      {[...PLATE_STATES].sort().map((state) => <article key={state} className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-4 flex justify-between text-sm font-semibold">{PLATES[state].name}<span className="font-normal text-zinc-500">{state}</span></h2>
        <LicensePlate plate={plate.trim() || PLATE_METADATA[state].sample} state={state} />
        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-zinc-100 pt-3 text-xs tabular-nums">
          <div className="flex gap-2"><dt className="text-zinc-500">JS</dt><dd className="font-medium text-zinc-700">{formatSize(componentSizes[state].bytes)}</dd></div>
          <div className="flex gap-2"><dt className="text-zinc-500">gzip</dt><dd className="font-medium text-zinc-700">{formatSize(componentSizes[state].gzipBytes)}</dd></div>
        </dl>
      </article>)}
    </div>
  </main>;
}
