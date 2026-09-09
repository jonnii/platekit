import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { workshopApi } from "./server/api.ts";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  plugins: [react(), tailwindcss(), workshopApi()],
  server: {
    host: "127.0.0.1",
    port: Number(process.env.PORT ?? 3002),
    strictPort: true,
    fs: { allow: [fileURLToPath(new URL("..", import.meta.url))] },
  },
  build: { outDir: "../.platekit-dev/workshop", emptyOutDir: true },
});
