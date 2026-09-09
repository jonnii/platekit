import { PLATE_METADATA } from "../../tools/artwork/metadata";
import LicensePlate from "../../src/LicensePlate";
import { PLATES, PLATE_STATES } from "../../src/registry";

export default function ContactSheetPage() {
  return (
    <div className="min-h-screen bg-zinc-100 p-6 text-zinc-900">
      <h1 className="text-2xl font-bold">All state plates</h1>
      <p className="mt-1 max-w-3xl text-sm text-zinc-600">
        {PLATE_STATES.length} bespoke components — every jurisdiction the API emits.
      </p>

      <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
        {PLATE_STATES.map((code) => (
          <div key={code} className="rounded-lg bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-baseline justify-between text-[10px] uppercase tracking-wider">
              <span className="font-semibold">{code}</span>
              <span className="text-zinc-400">{PLATES[code].name}</span>
            </div>
            <LicensePlate plate={PLATE_METADATA[code].sample} state={code} />
          </div>
        ))}
      </div>
    </div>
  );
}
