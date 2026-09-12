/** Capture the real comparison page, with its fonts, using one isolated browser. */
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { PLATE_REFERENCES } from "../references.ts";
import { cleanedReferenceSource, originalReference } from "../reference-assets.ts";
import { FONT_PROBES } from "../font-probes.ts";

const args = process.argv.slice(2);
const option = (name: string, fallback: string) => args.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;
const states = option("states", "FL,CA").toUpperCase().split(",");
const fontProbe = option("page", "compare") === "font-probe";
const probeIds = option("probes", "").split(",");
const targets = fontProbe ? FONT_PROBES.filter((probe) => probeIds[0] === "all" || (probeIds[0]
  ? probeIds.includes(probe.id) : states.includes(probe.state) && probe.kind === option("kind", "registration")))
  .map((probe) => ({ state: probe.state, name: probe.id, route: `/font-probe?probe=${probe.id}` }))
  : states.map((state) => ({ state, name: state, route: `/compare?state=${state}` }));
const selector = fontProbe ? "#font-probe-detail" : "#plate-detail";
const trialCandidate = option("candidate", "current");
const fontMasks = args.includes("--font-masks");
const mountingHoles = option("mounting-holes", "none");
const stickerAreas = args.includes("--registration-sticker-areas");
const origin = option("url", "http://localhost:3002");
const directory = path.resolve(option("output-dir", "/tmp/plate-browser"));
const chrome = option("chrome", process.env.CHROME_BIN ?? (process.platform === "darwin"
  ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" : "google-chrome"));
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  if (!targets.length) throw new Error("No matching capture targets");
  if (fontProbe && probeIds[0] && probeIds[0] !== "all" && probeIds.some((id) => !FONT_PROBES.some((probe) => probe.id === id))) throw new Error("Unknown font probe ID");
  if (fontProbe && (mountingHoles !== "none" || stickerAreas)) throw new Error("Optional hardware capture flags apply to --page=compare");
  if (!["none", "slots", "round"].includes(mountingHoles)) throw new Error("--mounting-holes must be none, slots, or round");
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
    for (const { state, name, route } of targets) {
      const started = performance.now();
      await call("Page.navigate", { url: new URL(route, origin).href });
      let ready = false;
      for (let attempt = 0; attempt < 80; attempt++) {
        ready = await evaluate<boolean>(`location.search === ${JSON.stringify(new URL(route, origin).search)} && !!document.querySelector('${selector} svg')`);
        if (ready) break;
        await delay(250);
      }
      if (!ready) throw new Error(`${state}: comparison page did not load. Check the local server.`);
      if (mountingHoles !== "none" || stickerAreas) {
        await evaluate(`(() => {
          const select = document.querySelector('select[aria-label="Mounting holes"]');
          select.value = ${JSON.stringify(mountingHoles)};
          select.dispatchEvent(new Event('change', { bubbles: true }));
          if (${stickerAreas}) document.querySelector('fieldset input[type="checkbox"]').click();
          return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        })()`);
        if (mountingHoles !== "none") {
          const aligned = await evaluate<boolean>(`Array.from(document.querySelectorAll('[data-plate-mounting-holes]')).every(overlay => {
            const art = overlay.parentElement.querySelector('svg[role="img"]').getBoundingClientRect();
            const layer = overlay.getBoundingClientRect();
            return ['x', 'y', 'width', 'height'].every(key => Math.abs(art[key] - layer[key]) < 1);
          }) && document.querySelectorAll('[data-plate-mounting-holes]').length > 0`);
          if (!aligned) throw new Error(`${state}: mounting overlay is missing or misaligned`);
        }
      }
      const reference = PLATE_REFERENCES.find((ref) => ref.state === state)!;
      await evaluate(`Promise.all([document.fonts.ready, new Promise((resolve, reject) => {
        const image = new Image(); image.onload = resolve; image.onerror = () => reject(new Error('Reference image failed to load'));
        image.src = ${JSON.stringify(new URL((fontProbe ? originalReference(reference)?.src : cleanedReferenceSource(reference)) ?? reference.src, origin).href)};
      })]).then(() => true)`);
      if (fontProbe) {
        for (let attempt = 0; attempt < 80; attempt++) {
          if (await evaluate<boolean>(`!document.querySelector('[data-font-status="loading"]')`)) break;
          await delay(250);
        }
        await evaluate(`(() => {
          const radio = Array.from(document.querySelectorAll('input[name="candidate"]')).find(input => input.value === ${JSON.stringify(trialCandidate)});
          if (!radio || radio.disabled) throw new Error('Requested candidate is missing or unavailable');
          radio.click();
          return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        })()`);
        const probeStatus = await evaluate(`({ candidates: Array.from(document.querySelectorAll('[data-candidate]')).map(row => ({id: row.dataset.candidate, status: row.dataset.fontStatus})), targets: Array.from(document.querySelectorAll('[data-trial-font]')).map(row => ({font: row.dataset.trialFont, count: Number(row.dataset.targetCount)})) })`);
        await writeFile(path.join(directory, `${name}-probe.json`), `${JSON.stringify(probeStatus, null, 2)}\n`);
        if (fontMasks) {
          const probe = FONT_PROBES.find((entry) => entry.id === name)!;
          const glyphs = await evaluate(`(() => {
            const probe = ${JSON.stringify({ text: probe.text, kind: probe.kind })};
            return Array.from(document.querySelectorAll('[data-candidate]')).filter(row => row.dataset.fontStatus === 'loaded').map(row => {
              const target = row.querySelector('[data-probe-target]');
              if (!target) throw new Error('No target for '+row.dataset.candidate);
              const style = getComputedStyle(target);
              const samples = probe.kind === 'registration' ? Array.from(probe.text) : [probe.text];
              const font = style.fontStyle+' '+style.fontWeight+' 240px '+style.fontFamily;
              const images = samples.map(text => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d'); ctx.font = font;
                canvas.width = Math.ceil(ctx.measureText(text).width + 160); canvas.height = 480;
                ctx.font = font; ctx.fillStyle = 'black'; ctx.fillText(text,80,330);
                return {text, png:canvas.toDataURL('image/png').split(',')[1]};
              });
              const whole = probe.kind === 'registration' ? (() => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d'); ctx.font = font;
                canvas.width = Math.ceil(ctx.measureText(probe.text).width + 160); canvas.height = 480;
                ctx.font = font; ctx.fillStyle = 'black'; ctx.fillText(probe.text,80,330);
                return canvas.toDataURL('image/png').split(',')[1];
              })() : undefined;
              return {id:row.dataset.candidate,font,images,whole};
            });
          })()`);
          await writeFile(path.join(directory, `${name}-glyphs.json`), `${JSON.stringify(glyphs)}\n`);
          console.log(`${name}: captured loaded browser glyphs`);
          continue;
        }
      }
      // The asynchronously loaded priorities table sits above the plate. Wait
      // for it before measuring the screenshot crop so it cannot shift below us.
      let comparisonsReady = fontProbe;
      for (let attempt = 0; !comparisonsReady && attempt < 80; attempt++) {
        comparisonsReady = await evaluate<boolean>(`!!document.querySelector('#priorities tbody tr')`);
        if (comparisonsReady) break;
        await delay(250);
      }
      if (!comparisonsReady) throw new Error(`${state}: comparison table did not finish loading`);
      await evaluate(`document.fonts.ready.then(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))`);
      const bounds = await evaluate<{ x: number; y: number; width: number; height: number }>(`(() => {
        const rect = document.querySelector('${selector}').getBoundingClientRect();
        return {x: rect.x + scrollX, y: rect.y + scrollY, width: Math.min(rect.width, 980), height: rect.height};
      })()`);
      const textBounds = await evaluate(`Array.from(document.querySelectorAll('${selector} svg')).map(svg => ({
        width: svg.getBoundingClientRect().width,
        texts: Array.from(svg.querySelectorAll('text')).map(text => {
          const box = text.getBBox();
          return {text: text.textContent, font: getComputedStyle(text).fontFamily,
            x: box.x, y: box.y, width: box.width, height: box.height,
            horizontalOverflow: box.x < -1 || box.x + box.width > 1001};
        })
      }))`);
      const fontStatus = await evaluate(`Array.from(document.fonts).map(face => ({family: face.family, status: face.status}))`);
      const shot = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { ...bounds, scale: 1 } });
      await writeFile(path.join(directory, `${name}.png`), Buffer.from(shot.data as string, "base64"));
      await writeFile(path.join(directory, `${name}-text.json`), `${JSON.stringify(textBounds, null, 2)}\n`);
      await writeFile(path.join(directory, `${name}-fonts.json`), `${JSON.stringify(fontStatus, null, 2)}\n`);
      console.log(`${name}: ${((performance.now() - started) / 1000).toFixed(1)}s — ${path.join(directory, `${name}.png`)}`);
    }
    await call("Browser.close");
  } finally {
    socket?.close();
    browser.kill("SIGTERM");
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
