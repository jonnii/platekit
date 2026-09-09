export default function RefreshComparisons({ running, message, onRefresh }: {
  running: boolean;
  message: string;
  onRefresh: () => void;
}) {
  return <div id="refresh-comparisons" className="flex flex-col items-start gap-2">
    <button type="button" disabled={running} onClick={onRefresh}
      className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-wait disabled:opacity-60">
      Refresh comparisons
    </button>
    <p id="refresh-status" aria-live="polite" className="max-w-sm text-xs text-zinc-500">{message}</p>
  </div>;
}
