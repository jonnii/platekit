/** Capture the real comparison page, with its fonts, using one isolated browser. */
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { PLATE_REFERENCES } from "../app/dev/plate-compare/references";

const args = process.argv.slice(2);
const option = (name: string, fallback: string) => args.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;
const states = option("states", "FL,CA").toUpperCase().split(",");
const origin = option("url", "http://localhost:3000");
const directory = path.resolve(option("output-dir", "/tmp/plate-browser"));
const chrome = option("chrome", process.env.CHROME_BIN ?? (process.platform === "darwin"
  ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" : "google-chrome"));
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  for (const state of states) {
    if (!PLATE_REFERENCES.some((ref) => ref.state === state)) throw new Error(`Unknown reference: ${state}`);
  }
  await mkdir(directory, { recursive: true });
  const profile = await mkdtemp(path.join(os.tmpdir(), "plate-capture-"));
  const browser = spawn(chrome, ["--headless", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    "--disable-background-networking", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"],
  { stdio: ["ignore", "ignore", "pipe"] });
  let socket: WebSocket | undefined;
  try {
    const endpoint = await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Chrome did not start within 15 seconds")), 15_000);
      browser.once("error", (error) => { clearTimeout(timer); reject(error); });
      browser.once("exit", (code) => { clearTimeout(timer); reject(new Error(`Chrome exited: ${code}`)); });
      browser.stderr!.on("data", (chunk: Buffer) => {
        const match = chunk.toString().match(/DevTools listening on (ws:\/\/\S+)/);
        if (match) { clearTimeout(timer); resolve(match[1]); }
      });
    });
    const pages = await (await fetch(`http://${new URL(endpoint).host}/json/list`)).json() as { type: string; webSocketDebuggerUrl: string }[];
    const page = pages.find((entry) => entry.type === "page");
    if (!page) throw new Error("Chrome has no page target");
    socket = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise<void>((resolve, reject) => { socket!.onopen = () => resolve(); socket!.onerror = reject; });
    let id = 0;
    const pending = new Map<number, { resolve: (value: Record<string, unknown>) => void; reject: (error: Error) => void }>();
    socket.onmessage = (event) => {
      const message = JSON.parse(String(event.data));
      const request = pending.get(message.id);
      if (!request) return;
      pending.delete(message.id);
      if (message.error) request.reject(new Error(JSON.stringify(message.error)));
      else request.resolve(message.result);
    };
    const call = (method: string, params: Record<string, unknown> = {}) => new Promise<Record<string, unknown>>((resolve, reject) => {
      const requestId = ++id;
      const timer = setTimeout(() => { pending.delete(requestId); reject(new Error(`Timed out: ${method}`)); }, 20_000);
      pending.set(requestId, {
        resolve: (value) => { clearTimeout(timer); resolve(value); },
        reject: (error) => { clearTimeout(timer); reject(error); },
      });
      socket!.send(JSON.stringify({ id: requestId, method, params }));
    });
    const evaluate = async <T>(expression: string): Promise<T> => {
      const result = await call("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return (result.result as { value: T }).value;
    };
    await call("Page.enable");
    await call("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    for (const state of states) {
      const started = performance.now();
      await call("Page.navigate", { url: new URL(`/dev/plate-compare?state=${state}`, origin).href });
      let ready = false;
      for (let attempt = 0; attempt < 80; attempt++) {
        ready = await evaluate<boolean>(`location.search === '?state=${state}' && !!document.querySelector('#plate-detail svg')`);
        if (ready) break;
        await delay(250);
      }
      if (!ready) throw new Error(`${state}: comparison page did not load. Check the local server.`);
      const reference = PLATE_REFERENCES.find((ref) => ref.state === state)!;
      await evaluate(`Promise.all([document.fonts.ready, new Promise((resolve, reject) => {
        const image = new Image(); image.onload = resolve; image.onerror = () => reject(new Error('Reference image failed to load'));
        image.src = ${JSON.stringify(reference.src)};
      })]).then(() => true)`);
      const bounds = await evaluate<{ x: number; y: number; width: number; height: number }>(`(() => {
        document.querySelectorAll('#priorities tbody > tr').forEach(row => { if (row.querySelector('th')?.textContent.includes('Maine')) row.querySelector('details')?.setAttribute('open', ''); }); const rect = document.querySelector('#priorities').getBoundingClientRect();
        return {x: rect.x + scrollX, y: rect.y + scrollY, width: rect.width, height: Math.min(rect.height, 1050)};
      })()`);
      const textBounds = await evaluate(`Array.from(document.querySelectorAll('#plate-detail svg')).map(svg => ({
        width: svg.getBoundingClientRect().width,
        texts: Array.from(svg.querySelectorAll('text')).map(text => {
          const box = text.getBBox();
          return {text: text.textContent, font: getComputedStyle(text).fontFamily,
            x: box.x, y: box.y, width: box.width, height: box.height,
            horizontalOverflow: box.x < -1 || box.x + box.width > 1001};
        })
      }))`);
      const shot = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { ...bounds, scale: 1 } });
      await writeFile(path.join(directory, `${state}.png`), Buffer.from(shot.data as string, "base64"));
      await writeFile(path.join(directory, `${state}-text.json`), `${JSON.stringify(textBounds, null, 2)}\n`);
      console.log(`${state}: ${((performance.now() - started) / 1000).toFixed(1)}s — ${path.join(directory, `${state}.png`)}`);
    }
    await call("Browser.close");
  } finally {
    socket?.close();
    browser.kill("SIGTERM");
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
