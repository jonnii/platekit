import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { readFile, writeFile } from "node:fs/promises";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  plugins: [react(), {
    name: "font-license-notices",
    async generateBundle() {
      const root = new URL("../src/fonts/", import.meta.url);
      const manifest = JSON.parse(await readFile(new URL("manifest.json", root), "utf8")) as { files: { path: string }[] };
      const notices = ["NOTICE.md", "manifest.json", ...manifest.files.map(({ path }) => path).filter((path) => path.endsWith(".txt"))];
      for (const path of notices) {
        this.emitFile({ type: "asset", fileName: `fonts/${path}`, source: await readFile(new URL(path, root), "utf8") });
      }
    },
  }, {
    name: "prerender",
    apply: "build",
    async writeBundle({ dir }) {
      // ponytail: relies on Bun (`bun --bun vite`) importing TSX directly; use ssrLoadModule if this ever runs under Node.
      const [{ renderToString }, { createElement }, { default: App }] = await Promise.all([
        import("react-dom/server"), import("react"), import("./src/App.tsx"),
      ]);
      const file = `${dir}/index.html`;
      const html = await readFile(file, "utf8");
      await writeFile(file, html.replace('<div id="root"></div>', `<div id="root">${renderToString(createElement(App))}</div>`));
    },
  }],
  server: {
    host: "127.0.0.1",
    port: Number(process.env.PORT ?? 3001),
    strictPort: true,
    fs: { allow: [fileURLToPath(new URL("../src", import.meta.url)), fileURLToPath(new URL(".", import.meta.url))] },
  },
});
