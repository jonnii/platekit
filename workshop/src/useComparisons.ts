import { useCallback, useEffect, useRef, useState } from "react";
import type { ComparisonRow } from "../../tools/artwork/comparison/data";

type Snapshot = {
  rows: ComparisonRow[];
  generatedAt?: string;
  refresh: { running: boolean; message: string; error: boolean };
};

export function useComparisons() {
  const [snapshot, setSnapshot] = useState<Snapshot>({ rows: [], refresh: { running: false, message: "Loading comparisons…", error: false } });
  const [refreshCount, setRefreshCount] = useState(0);
  const pending = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    async function load() {
      try {
        const response = await fetch("/api/comparisons", { signal: controller.signal });
        if (!response.ok) throw new Error("Could not load comparisons.");
        const data: Snapshot = await response.json();
        if (controller.signal.aborted) return;
        setSnapshot(data);
        if (data.refresh.running) timer = setTimeout(load, 2000);
      } catch (error) {
        if (!controller.signal.aborted) setSnapshot((previous) => ({ ...previous, refresh: { running: false, message: String(error), error: true } }));
      }
    }
    void load();
    const reload = () => setRefreshCount((count) => count + 1);
    import.meta.hot?.on("vite:afterUpdate", reload);
    return () => { controller.abort(); clearTimeout(timer); import.meta.hot?.off("vite:afterUpdate", reload); };
  }, [refreshCount]);

  const refresh = useCallback(async () => {
    if (pending.current) return;
    pending.current = true;
    setSnapshot((previous) => ({ ...previous, refresh: { running: true, message: "Starting comparisons…", error: false } }));
    try {
      const response = await fetch("/api/comparisons", { method: "POST" });
      if (!response.ok) throw new Error("Could not start comparisons.");
      setRefreshCount((count) => count + 1);
    } catch (error) {
      setSnapshot((previous) => ({ ...previous, refresh: { running: false, message: String(error), error: true } }));
    } finally { pending.current = false; }
  }, []);
  return { ...snapshot, onRefresh: refresh };
}
