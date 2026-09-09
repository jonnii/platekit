import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: Number(process.env.PORT ?? 3001),
    strictPort: true,
    fs: { allow: [fileURLToPath(new URL("../src", import.meta.url)), fileURLToPath(new URL(".", import.meta.url))] },
  },
});
