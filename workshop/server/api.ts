import type { Plugin } from "vite";
import { readFile } from "node:fs/promises";
import { referencePath } from "../../tools/artwork/paths.ts";
import { loadComparisons } from "../../tools/artwork/comparison/store.ts";
import { refreshComparisons, refreshStatus } from "./comparisons.ts";

export function workshopApi(): Plugin {
  return {
    name: "platekit-workshop-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
        const isReference = url.pathname.startsWith("/plate-references/");
        if (url.pathname !== "/api/comparisons" && !isReference) return next();
        response.setHeader("Cache-Control", "no-store");
        try {
          if (isReference) {
            if (request.method !== "GET" && request.method !== "HEAD") {
              response.writeHead(405, { Allow: "GET, HEAD" }).end();
              return;
            }
            let file: string;
            try { file = referencePath(url.pathname); }
            catch { response.writeHead(404).end("Not found"); return; }
            const data = await readFile(file);
            response.setHeader("Content-Type", file.endsWith(".jpg") ? "image/jpeg" : "image/webp");
            response.end(request.method === "HEAD" ? undefined : data);
            return;
          }
          response.setHeader("Content-Type", "application/json");
          if (request.method === "POST") {
            if (request.headers.origin && request.headers.origin !== url.origin) {
              response.writeHead(403).end(JSON.stringify({ message: "Forbidden" }));
              return;
            }
            response.end(JSON.stringify(refreshComparisons()));
          } else if (request.method === "GET") {
            response.end(JSON.stringify({ ...await loadComparisons(), refresh: refreshStatus() }));
          } else {
            response.writeHead(405, { Allow: "GET, POST" }).end(JSON.stringify({ message: "Method not allowed" }));
          }
        } catch (error) {
          response.writeHead(500).end(JSON.stringify({ message: error instanceof Error ? error.message : "Workshop request failed" }));
        }
      });
    },
  };
}
