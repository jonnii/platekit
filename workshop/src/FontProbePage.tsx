import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import LicensePlate from "../../src/LicensePlate";
import { COMPARISON_WIDTHS } from "../../tools/artwork/config";
import { FONT_PROBES, candidateStylesheet, fontReferenceKind, type FontCandidate, type FontProbe } from "../../tools/artwork/font-probes";
import { PLATE_METADATA } from "../../tools/artwork/metadata";
import { originalReference } from "../../tools/artwork/reference-assets";
import { PLATE_REFERENCES } from "../../tools/artwork/references";

type FontStatus = "loading" | "loaded" | "unavailable";
type Review = { verdict: "unreviewed" | "shortlisted" | "keep-current" | "needs-reference"; candidate: string; notes: string };
const STORAGE_KEY = "platekit-font-probes-v1";
const EMPTY_REVIEW: Review = { verdict: "unreviewed", candidate: "current", notes: "" };

function readReviews(): Record<string, Review> {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([id, review]) =>
      FONT_PROBES.some((probe) => probe.id === id) && review && typeof review.notes === "string"
      && typeof review.candidate === "string" && ["unreviewed", "shortlisted", "keep-current", "needs-reference"].includes(review.verdict)));
  } catch { return {}; }
}

/** A nonempty FontFaceSet.load result establishes that a named face exists and loaded. */
function useCandidateFonts(candidates: FontCandidate[]) {
  const [status, setStatus] = useState<Record<string, FontStatus>>({});
  useEffect(() => {
    let active = true;
    setStatus({});
    const update = (id: string, value: FontStatus) => { if (active) setStatus((old) => ({ ...old, [id]: value })); };
    const load = async (candidate: FontCandidate) => {
      try {
        const faces = await document.fonts.load(`${candidate.style ?? "normal"} ${candidate.weight} 64px "${candidate.family}"`, "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
        update(candidate.id, faces.length && faces.every((font) => font.status === "loaded") ? "loaded" : "unavailable");
      } catch { update(candidate.id, "unavailable"); }
    };
    Promise.all(["Bebas Neue", "Yellowtail", "Playfair Display", "Sanchez", "Geist"].map((family) =>
      document.fonts.load(`400 64px "${family}"`))).then((groups) => update("current", groups.every((faces) => faces.length && faces.every((font) => font.status === "loaded")) ? "loaded" : "unavailable"), () => update("current", "unavailable"));
    for (const candidate of candidates.filter((font) => !font.remote)) void load(candidate);
    const url = candidateStylesheet(candidates);
    const link = url ? document.createElement("link") : undefined;
    if (link) {
      link.rel = "stylesheet";
      link.href = url!;
      link.onload = () => { if (active) for (const candidate of candidates.filter((font) => font.remote)) void load(candidate); };
      link.onerror = () => { for (const candidate of candidates.filter((font) => font.remote)) update(candidate.id, "unavailable"); };
      document.head.append(link);
    }
    const timer = window.setTimeout(() => {
      if (active) setStatus((old) => Object.fromEntries(["current", ...candidates.map((font) => font.id)].map((id) => [id, old[id] ?? "unavailable"])));
    }, 15000);
    return () => { active = false; clearTimeout(timer); link?.remove(); };
  }, [candidates]);
  return status;
}

function probeTexts(root: HTMLElement, probe: FontProbe) {
  return [...root.querySelectorAll<SVGTextElement>("svg text")].filter((text) => {
    if (probe.kind === "wordmark") return text.textContent?.trim() === probe.text;
    const font = text.closest("[font-family]")?.getAttribute("font-family") ?? "";
    const bounds = text.getBBox();
    // Some headings and footers share the serial family. Restrict by position as well.
    return font.includes("--font-plate-ny") && bounds.y + bounds.height / 2 > 130 && bounds.y + bounds.height / 2 < 400;
  });
}

/** Apply trial typography only inside this actual component instance. No runtime SVG is rewritten. */
function TrialPlate({ probe, candidate, sample, ready }: { probe: FontProbe; candidate?: FontCandidate; sample: string; ready: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState<number>();
  useLayoutEffect(() => {
    if (!ready || !root.current) return;
    const texts = probeTexts(root.current, probe);
    setCount(texts.length);
    const canvas = document.createElement("canvas").getContext("2d")!;
    const saved = texts.map((text) => ({ text, style: text.getAttribute("style") }));
    for (const text of texts) {
      if (!candidate) continue;
      const current = getComputedStyle(text);
      const size = Number.parseFloat(current.fontSize);
      const sampleText = probe.kind === "registration" ? "H0123456789" : probe.text;
      canvas.font = `${current.fontStyle} ${current.fontWeight} ${size}px ${current.fontFamily}`;
      const before = canvas.measureText(sampleText);
      canvas.font = `${candidate.style ?? "normal"} ${candidate.weight} ${size}px "${candidate.family}"`;
      const after = canvas.measureText(sampleText);
      const oldHeight = before.actualBoundingBoxAscent + before.actualBoundingBoxDescent;
      const newHeight = after.actualBoundingBoxAscent + after.actualBoundingBoxDescent;
      text.style.fontFamily = `"${candidate.family}"`;
      text.style.fontWeight = String(candidate.weight);
      text.style.fontStyle = candidate.style ?? "normal";
      text.style.fontSynthesis = "none";
      text.style.fontSize = `${size * (newHeight > 0 ? oldHeight / newHeight : 1)}px`;
      text.dataset.probeTarget = "true";
    }
    return () => { for (const { text, style } of saved) { if (style === null) text.removeAttribute("style"); else text.setAttribute("style", style); delete text.dataset.probeTarget; } };
  }, [probe, candidate, sample, ready]);
  return <div ref={root} data-trial-font={candidate?.id ?? "current"} data-target-count={count}>
    <LicensePlate state={probe.state} plate={sample} />
    {ready && count === 0 && sample && <p role="alert" className="text-xs text-red-700">No matching lettering found.</p>}
  </div>;
}

function Crop({ crop, children }: { crop: FontProbe["crop"]; children: ReactNode }) {
  return <div className="relative w-full overflow-hidden" style={{ aspectRatio: `${crop.w} / ${crop.h}` }}>
    <div className="absolute" style={{ width: `${1000 / crop.w * 100}%`, left: `${-crop.x / crop.w * 100}%`, top: `${-crop.y / crop.h * 100}%` }}>{children}</div>
  </div>;
}

function ProbeDetail({ probe, review, save }: { probe: FontProbe; review: Review; save: (review: Review) => void }) {
  const [chosen, setChosen] = useState(probe.candidates.some((font) => font.id === review.candidate) ? review.candidate : "current");
  const [sample, setSample] = useState(probe.kind === "registration" ? probe.text : PLATE_METADATA[probe.state].sample);
  const statuses = useCandidateFonts(probe.candidates);
  const selected = probe.candidates.find((font) => font.id === chosen);
  const reference = PLATE_REFERENCES.find((ref) => ref.state === probe.state)!;
  const original = originalReference(reference);
  const ready = statuses[chosen] === "loaded";
  const samples = [...new Set([sample, PLATE_METADATA[probe.state].sample, "AB***34", "CUSTOM12345"])];
  return <section id="font-probe-detail" className="mt-6 max-w-5xl" data-probe-id={probe.id}>
    <h2 className="text-xl font-semibold">{probe.label}</h2>
    <p className="mt-2 text-sm">{probe.note}</p>
    <p className="mt-2 text-sm text-amber-800">{fontReferenceKind(probe.state)}. <a className="underline" href={reference.src} target="_blank" rel="noreferrer">Source</a>{original && <> · <a className="underline" href={original.src}>Preserved original</a></>}</p>
    <div className="sticky top-0 z-10 mt-4 max-w-[680px] border bg-white p-3 shadow-sm">
      <p className="mb-2 text-xs font-semibold text-emerald-800">Original lettering · fixed reference crop</p>
      {original ? <Crop crop={probe.crop}><img src={original.src} alt={`${reference.label}, original lettering`} className="block w-full" style={{ aspectRatio: "2 / 1", objectFit: "fill" }} /></Crop>
        : <p role="alert">Preserved original missing or stale. Update its provenance before judging lettering.</p>}
    </div>
    <p className="my-3 max-w-2xl text-xs text-zinc-600">Trials match the current render’s glyph height and retain its fitted width, baseline, outlines and artwork. These are visual comparisons; artwork scores exclude text. Remote candidates appear only after their font files load.</p>
    <div className="max-w-[680px] space-y-3" data-font-candidates="">
      {[undefined, ...probe.candidates].map((candidate) => {
        const id = candidate?.id ?? "current";
        const status = statuses[id] ?? "loading";
        return <div key={id} className={`border bg-white p-3 ${id === chosen ? "border-blue-600" : "border-zinc-200"}`} data-candidate={id} data-font-status={status}>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <label className="flex cursor-pointer items-center gap-2"><input type="radio" name="candidate" value={id} checked={chosen === id} disabled={status !== "loaded"} onChange={() => setChosen(id)} />{candidate ? `${candidate.family} ${candidate.weight}${candidate.style ? " italic" : ""}` : "Current implementation"}</label>
            <span className={status === "unavailable" ? "text-red-700" : "text-zinc-500"}>{status === "loaded" ? candidate?.remote ? "Loaded · Google Fonts" : "Loaded · bundled / current fonts" : status === "loading" ? "Loading…" : "Unavailable — no comparison"}</span>
          </div>
          {status === "loaded" ? <Crop crop={probe.crop}><TrialPlate probe={probe} candidate={candidate} sample={probe.kind === "registration" ? probe.text : PLATE_METADATA[probe.state].sample} ready /></Crop>
            : <div className="bg-zinc-50 p-4 text-xs text-zinc-500">{status === "unavailable" ? "Font could not be loaded. Check your connection and reload to retry." : "Waiting for the actual font face."}</div>}
        </div>;
      })}
    </div>
    <h3 className="mt-6 font-semibold">Selected candidate in the plate</h3>
    <p className="mt-1 text-sm">{selected ? `${selected.family} ${selected.weight}` : "Current implementation"} · <a className="underline" href={`/compare?state=${probe.state}`}>Artwork comparison</a></p>
    <label className="my-3 flex flex-wrap items-center gap-2 text-sm">Custom registration <input aria-label="Custom registration" className="border bg-white p-2" value={sample} maxLength={20} onChange={(event) => setSample(event.target.value)} /></label>
    {probe.kind === "registration" && ready && <div className="my-4 overflow-x-auto rounded border bg-white p-3">
      <p className="mb-1 text-xs text-zinc-500">Diagnostic glyphs · natural spacing, no width fitting</p>
      <p className="whitespace-nowrap text-4xl" style={{ fontFamily: selected ? `"${selected.family}"` : "var(--font-plate-ny)", fontWeight: selected?.weight ?? 400, fontSynthesis: "none" }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
      <p className="whitespace-nowrap text-4xl" style={{ fontFamily: selected ? `"${selected.family}"` : "var(--font-plate-ny)", fontWeight: selected?.weight ?? 400, fontSynthesis: "none" }}>0123456789 · B8 D0 O0 I1 S5 Z2 · AB***34</p>
    </div>}
    {COMPARISON_WIDTHS.map((width) => <div key={width} className="mt-4">
      <p className="mb-2 text-xs text-zinc-600">{width}px · original / selected candidate</p>
      <div className="flex flex-wrap items-start gap-4">
        {original && <img src={original.src} alt={`${reference.label}, full original`} style={{ width, maxWidth: "100%", aspectRatio: "2 / 1", objectFit: "fill" }} />}
        <div style={{ width, maxWidth: "100%" }}>{ready ? <TrialPlate probe={probe} candidate={selected} sample={sample} ready /> : <p className="p-4 text-sm">Selected font is {statuses[chosen] ?? "loading"}.</p>}</div>
      </div>
    </div>)}
    <details className="mt-5" open={probe.kind === "registration"}>
      <summary className="cursor-pointer text-sm font-semibold">Canonical, anonymized and long registrations</summary>
      <div className="mt-3 flex flex-wrap gap-4">{ready && COMPARISON_WIDTHS.flatMap((width) => samples.map((value) => <figure key={`${width}-${value}`} style={{ width, maxWidth: "100%" }}>
        <figcaption className="mb-1 text-xs text-zinc-600">{value || "Blank"} · {width}px</figcaption><TrialPlate probe={probe} candidate={selected} sample={value} ready />
      </figure>))}</div>
    </details>
    <fieldset className="mt-6 max-w-[680px] space-y-3 rounded border bg-white p-4">
      <legend className="px-1 font-semibold">Review notes</legend>
      <label className="block text-sm">Status <select aria-label="Review status" className="ml-2 border p-2" value={review.verdict} onChange={(event) => save({ ...review, candidate: chosen, verdict: event.target.value as Review["verdict"] })}>
        <option value="unreviewed">Unreviewed</option><option value="shortlisted">Candidate shortlisted</option><option value="keep-current">Keep current</option><option value="needs-reference">Needs issued reference</option>
      </select></label>
      <textarea aria-label="Review notes" className="block w-full border p-2 text-sm" rows={3} placeholder="Glyph differences, preferred candidate, remaining reference work…" value={review.notes} onChange={(event) => save({ ...review, candidate: chosen, notes: event.target.value })} />
      <button className="rounded bg-zinc-900 px-3 py-2 text-sm text-white" disabled={!ready} onClick={() => save({ ...review, candidate: chosen })}>Save selected candidate</button>
      <p className="text-xs text-zinc-500">Saved candidate: {review.candidate}. Notes stay in this browser and can be exported. Saving a review does not change the package fonts.</p>
    </fieldset>
  </section>;
}

export default function FontProbePage() {
  const query = new URLSearchParams(window.location.search);
  const initial = FONT_PROBES.find((probe) => probe.id === query.get("probe"))
    ?? FONT_PROBES.find((probe) => probe.state === query.get("state")?.toUpperCase() && probe.kind === (query.get("kind") ?? "wordmark"))
    ?? FONT_PROBES.find((probe) => probe.kind === query.get("kind")) ?? FONT_PROBES[0];
  const [probeId, setProbeId] = useState(initial.id);
  const [reviews, setReviews] = useState(readReviews);
  const [storageError, setStorageError] = useState(false);
  const probe = FONT_PROBES.find((entry) => entry.id === probeId)!;
  const queue = FONT_PROBES.filter((entry) => entry.kind === probe.kind);
  const select = (id: string) => {
    setProbeId(id);
    const next = FONT_PROBES.find((entry) => entry.id === id)!;
    history.replaceState(null, "", `${window.location.pathname}?kind=${next.kind}&state=${next.state}&probe=${id}`);
  };
  const save = (review: Review) => {
    const next = { ...reviews, [probe.id]: review };
    setReviews(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setStorageError(false); } catch { setStorageError(true); }
  };
  const exportReviews = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), reviews }, null, 2)], { type: "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = "platekit-font-probe-reviews.json"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <main className="min-h-screen bg-zinc-100 p-4 text-zinc-900 sm:p-8">
    <h1 className="text-2xl font-bold">Plate lettering probes</h1>
    <p className="mt-2 max-w-3xl text-sm text-zinc-600">Work through state names, mottos and all 51 registration designs against preserved original lettering. Select a candidate to inspect it in the actual plate.</p>
    <nav aria-label="Probe type" className="my-4 flex gap-3">{(["wordmark", "registration"] as const).map((kind) => <button key={kind} aria-pressed={probe.kind === kind} className={`rounded px-3 py-2 text-sm ${probe.kind === kind ? "bg-zinc-900 text-white" : "bg-white"}`} onClick={() => select(FONT_PROBES.find((entry) => entry.kind === kind && entry.state === probe.state)?.id ?? (kind === "registration" ? "ks-registration" : "la-name"))}>{kind === "wordmark" ? "State names & mottos" : "All registration lettering"}</button>)}</nav>
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <label>Probe <select aria-label="Probe" className="ml-2 max-w-full border bg-white p-2" value={probe.id} onChange={(event) => select(event.target.value)}>{queue.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}{reviews[entry.id]?.verdict && reviews[entry.id].verdict !== "unreviewed" ? ` · ${reviews[entry.id].verdict}` : ""}</option>)}</select></label>
      <button className="rounded border bg-white px-3 py-2" onClick={() => select(queue[(queue.findIndex((entry) => entry.id === probe.id) + 1) % queue.length].id)}>Next probe →</button>
      <button className="underline" onClick={exportReviews}>Export reviews</button>
      <span className="text-zinc-500">{queue.filter((entry) => reviews[entry.id] && reviews[entry.id].verdict !== "unreviewed").length}/{queue.length} reviewed</span>
    </div>
    {storageError && <p role="alert" className="mt-2 text-sm text-red-700">Browser storage is unavailable. Export your notes before leaving.</p>}
    <ProbeDetail key={probe.id} probe={probe} review={reviews[probe.id] ?? EMPTY_REVIEW} save={save} />
  </main>;
}
