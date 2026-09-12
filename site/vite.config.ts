import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

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
  }],
  server: {
    host: "127.0.0.1",
    port: Number(process.env.PORT ?? 3001),
    strictPort: true,
    fs: { allow: [fileURLToPath(new URL("../src", import.meta.url)), fileURLToPath(new URL(".", import.meta.url))] },
  },
});
