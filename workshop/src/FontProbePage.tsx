import type { CSSProperties } from "react";
type FontCandidate = { name: string; cls?: string; style?: CSSProperties; weight: number };

const SCRIPTS: FontCandidate[] = [
  { name: "Yellowtail", style: { fontFamily: '"Yellowtail"' }, weight: 400 },
  { name: "Grand Hotel", style: { fontFamily: '"Grand Hotel"' }, weight: 400 },
  { name: "Kaushan Script", style: { fontFamily: '"Kaushan Script"' }, weight: 400 },
  { name: "Satisfy", style: { fontFamily: '"Satisfy"' }, weight: 400 },
  { name: "Courgette", style: { fontFamily: '"Courgette"' }, weight: 400 },
  { name: "Damion", style: { fontFamily: '"Damion"' }, weight: 400 },
  { name: "Brush Script MT (current)", style: { fontFamily: '"Brush Script MT", cursive' }, weight: 700 },
];

const CA_REF =
  "https://signsandtagsonline.com/cdn/shop/products/california-custom-license-plate-1234567890-red-text-white.jpg?v=1736861799&width=1946";

const SLABS: FontCandidate[] = [
  { name: "Sanchez 400 (Clarendon-ish)", style: { fontFamily: '"Sanchez"' }, weight: 400 },
  { name: "Bitter 800", style: { fontFamily: '"Bitter"' }, weight: 800 },
  { name: "Zilla Slab 700", style: { fontFamily: '"Zilla Slab"' }, weight: 700 },
  { name: "Roboto Slab 800", style: { fontFamily: '"Roboto Slab"' }, weight: 800 },
  { name: "Aleo 800", style: { fontFamily: '"Aleo"' }, weight: 800 },
  { name: "Crete Round 400", style: { fontFamily: '"Crete Round"' }, weight: 400 },
];

// A real 1200x1200 photo of the plate — far more legible than the DMV's 450px asset.
const REF =
  "https://signsandtagsonline.com/cdn/shop/files/custom-text-new-york-excelsior-novelty-license-plate_d9e92763-ee79-47c7-9e81-163e36e7f4b4.jpg?v=1742256392&width=1946";

const CANDIDATES: FontCandidate[] = [
  { name: "Playfair Display 700", style: { fontFamily: '"Playfair Display"' }, weight: 700 },
  { name: "Bodoni Moda 700", style: { fontFamily: '"Bodoni Moda"' }, weight: 700 },
  { name: "Libre Bodoni 700", style: { fontFamily: '"Libre Bodoni"' }, weight: 700 },
  { name: "Source Serif 4 700", style: { fontFamily: '"Source Serif 4"' }, weight: 700 },
  { name: "PT Serif 700", style: { fontFamily: '"PT Serif"' }, weight: 700 },
  { name: "Noto Serif 700", style: { fontFamily: '"Noto Serif"' }, weight: 700 },
  { name: "Times New Roman (current-ish)", style: { fontFamily: '"Times New Roman", Times, serif' }, weight: 700 },
  { name: "Georgia (current stack head)", style: { fontFamily: "Georgia, serif" }, weight: 700 },
];

export default function FontProbePage() {
  return (
    <div className="min-h-screen bg-zinc-100 p-8 text-zinc-900">
      <h1 className="text-2xl font-bold">Wordmark typeface probe</h1>
      <p className="mt-1 max-w-2xl text-sm text-zinc-600">
        Top row is the real plate, cropped to the wordmark and scaled up. Each row
        below renders the same words in a candidate face at matched cap height.
        Compare serif shape, stroke contrast, and the E&rsquo;s middle bar.
      </p>

      {/* Reference stays stuck to the top so every candidate can be compared
          against it without scrolling back up. */}
      <div className="sticky top-0 z-10 bg-zinc-100 pt-4 pb-3">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
          real plate (reference)
        </div>
        <div
          className="border border-emerald-600"
          style={{
            width: 620,
            height: 93,
            backgroundImage: `url("${REF}")`,
            // 1200px source; wordmark sits at ~x320..848, y389..468.
            backgroundSize: `${1200 * 1.175}px ${1200 * 1.175}px`,
            backgroundPosition: `-${320 * 1.175}px -${389 * 1.175}px`,
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        {CANDIDATES.map((c) => (
          <div key={c.name} className="flex items-baseline gap-4">
            <div className="w-56 shrink-0 text-right text-[10px] uppercase tracking-wider text-zinc-400">
              {c.name}
            </div>
            <div
              className={c.cls}
              style={{
                ...c.style,
                fontWeight: c.weight,
                fontSize: 62,
                lineHeight: 1.1,
                color: "#0b2265",
                letterSpacing: 1,
              }}
            >
              NEW YORK
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-sm font-bold uppercase tracking-wider">Excelsior</h2>
      <div className="mb-2 mt-2">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
          real plate (reference)
        </div>
        <div
          className="border border-emerald-600"
          style={{
            width: 560,
            height: 70,
            backgroundImage: `url("${REF}")`,
            // EXCELSIOR sits at ~x388..818, y747..800 in the 1200px source.
            backgroundSize: `${1200 * 1.3}px ${1200 * 1.3}px`,
            backgroundPosition: `-${388 * 1.3}px -${747 * 1.3}px`,
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>
      <div className="mt-2 flex flex-col gap-1">
        {[...SLABS, ...CANDIDATES].map((c) => (
          <div key={c.name} className="flex items-baseline gap-4">
            <div className="w-56 shrink-0 text-right text-[10px] uppercase tracking-wider text-zinc-400">
              {c.name}
            </div>
            <div
              className={c.cls}
              style={{
                ...("style" in c ? c.style : {}),
                fontWeight: c.weight,
                fontSize: 40,
                lineHeight: 1.2,
                color: "#e8a33d",
                letterSpacing: 4,
                WebkitTextStroke: "1.2px #0b2265",
              }}
            >
              EXCELSIOR
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-14 text-sm font-bold uppercase tracking-wider">
        California script
      </h2>
      <div className="mb-2 mt-2">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
          real plate (reference)
        </div>
        <div
          className="border border-emerald-600"
          style={{
            width: 612,
            height: 126,
            backgroundImage: `url("${CA_REF}")`,
            // Plate occupies x97..1104, y348..856 of the 1200px source, and the
            // wordmark sits at x351..907, y374..488 within that.
            backgroundSize: `${1200 * 1.1}px ${1200 * 1.1}px`,
            backgroundPosition: `-${351 * 1.1}px -${374 * 1.1}px`,
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>
      <div className="mt-2 flex flex-col gap-1">
        {SCRIPTS.map((c) => (
          <div key={c.name} className="flex items-baseline gap-4">
            <div className="w-56 shrink-0 text-right text-[10px] uppercase tracking-wider text-zinc-400">
              {c.name}
            </div>
            <div
              className={"cls" in c ? (c as { cls: string }).cls : undefined}
              style={{
                ...("style" in c ? c.style : {}),
                fontWeight: c.weight,
                fontSize: 72,
                lineHeight: 1.25,
                color: "#a21110",
              }}
            >
              California
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
