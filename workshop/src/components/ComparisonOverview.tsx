import RefreshComparisons from "./RefreshComparisons";
import { PLATE_METADATA } from "../../../tools/artwork/metadata";
import type { PlateState } from "../../../src/registry";
import { useComparisons } from "../useComparisons";

const scoredStateName = (state: string) => PLATE_METADATA[state as PlateState]?.name ?? state;

const labels = {
  ready: "Measured", stale: "Outdated — refresh", "not-run": "Not measured",
  error: "Comparison failed", "missing-reference": "Reference needed",
};
const percent = (value: number | null | undefined) => value == null ? "—" : `${value.toFixed(1)}%`;

export default function ComparisonOverview() {
  const { rows, generatedAt, refresh, onRefresh } = useComparisons();
  const measured = rows.filter((row) => row.status === "ready");
  const ranked = measured.filter((row) => row.scores?.agreement.pixelAgreement != null);
  const next = ranked[0];
  return (
    <section id="priorities" className="mt-6 max-w-6xl rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">What to work on next</h2>
          <p className="mt-1 text-sm text-zinc-600">
            {measured.length} of {rows.length} plates measured; {ranked.length} ranked. Lowest feature pixel agreement first.
          </p>
        </div>
        <RefreshComparisons running={refresh.running} message={refresh.message} onRefresh={onRefresh} />
      </div>
      {next ? (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950">
          Start by inspecting <a className="font-semibold underline" href={`/compare?state=${next.state}#plate-detail`}>
            {scoredStateName(next.state)}
          </a>: {percent(next.scores?.agreement.pixelAgreement)} pixel agreement. Largest mismatch: {next.scores?.weakestRegion.toLowerCase()}.
        </p>
      ) : (
        <p className="mt-4 rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
          Refresh comparisons to identify the plates with the largest artwork differences.
        </p>
      )}
      <p className="mt-3 max-w-4xl text-xs leading-relaxed text-zinc-500">
        Pixel agreement balances detailed regions across all unmasked artwork; smooth areas have reduced weight and
        the frame contributes at most 20%. Shape measures matching edges. Color measures area-wide pixel agreement,
        while Background measures color in smooth reference areas, including gradients and solid shapes. Colors are not calibrated.
        These are comparison metrics, not percentages of visual accuracy. References and text masks affect coverage.
        Lettering is unscored: review it in the browser pairs below. A dash means no measurable coverage, not a perfect match.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full whitespace-nowrap text-left text-sm">
          <thead className="border-b border-zinc-200 text-xs text-zinc-500">
            <tr>{["Priority", "Plate", "Pixel agreement", "Shape", "Color", "Background", "Features / coverage", "Status"].map((label) => (
              <th key={label} className="px-3 py-2 font-medium" scope="col">{label}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((row, index) => (
              <tr key={row.state} className={row.status === "ready" ? "" : "text-zinc-500"}>
                <td className="px-3 py-3 tabular-nums">{row.status === "ready" && row.scores?.agreement.pixelAgreement != null ? index + 1 : "—"}</td>
                <th scope="row" className="px-3 py-3 font-medium">
                  <a href={`/compare?state=${row.state}#plate-detail`} className="underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900">
                    {scoredStateName(row.state)} <span className="text-xs text-zinc-400">{row.state}</span>
                  </a>
                </th>
                <td className="px-3 py-3 font-semibold tabular-nums">{percent(row.scores?.agreement.pixelAgreement)}</td>
                <td className="px-3 py-3 tabular-nums">{percent(row.scores?.agreement.shapeAgreement)}</td>
                <td className="px-3 py-3 tabular-nums">{percent(row.scores?.agreement.colorAgreement)}</td>
                <td className="px-3 py-3 tabular-nums">{percent(row.scores?.agreement.backgroundColorAgreement)}</td>
                <td className="px-3 py-3 text-xs">
                  {row.scores ? <details>
                    <summary className="cursor-pointer">{row.scores.weakestRegion}</summary>
                    <p className="my-2 max-w-sm whitespace-normal">
                      {percent(row.scores.agreement.coveragePct)} of plate unmasked;
                      {" "}{percent(row.scores.agreement.detailSharePct)} of that area has detail.
                      Regions marked “color only” have too few reference edges to rank.
                    </p>
                    <table className="text-xs tabular-nums">
                      <thead><tr>{["Feature", "Pixels", "Shape", "Color"].map((label) => <th key={label} scope="col" className="pr-3 text-left">{label}</th>)}</tr></thead>
                      <tbody>{row.scores.agreement.features.map((feature) => <tr key={feature.label}>
                        <th scope="row" className="pr-3 font-normal">{feature.label}{!feature.ranked && " (color only)"}</th>
                        <td className="pr-3">{percent(feature.pixelAgreement)}</td>
                        <td className="pr-3">{percent(feature.shapeAgreement)}</td>
                        <td>{percent(feature.colorAgreement)}</td>
                      </tr>)}</tbody>
                    </table>
                  </details> : "—"}
                </td>
                <td className="px-3 py-3 text-xs">
                  {row.status === "error" ? (
                    <details className="max-w-xs whitespace-normal text-red-700">
                      <summary className="cursor-pointer">{labels[row.status]}</summary>
                      <p className="mt-2 break-words">{row.message}</p>
                    </details>
                  ) : labels[row.status]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {generatedAt && <p className="mt-3 text-xs text-zinc-400">Last run: <time dateTime={generatedAt}>{new Date(generatedAt).toUTCString()}</time>. Outdated results are excluded from the ranking.</p>}
    </section>
  );
}
