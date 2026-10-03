import type { Plugin } from "vite";
import { fileURLToPath } from "node:url";
import { measureComponentSizes } from "../../tools/artwork/component-sizes.ts";

const moduleId = "virtual:plate-component-sizes";
const resolvedId = `\0${moduleId}`;

export function componentSizes(): Plugin {
  return {
    name: "platekit-component-sizes",
    resolveId(id) {
      if (id === moduleId) return resolvedId;
    },
    async load(id) {
      if (id !== resolvedId) return;
      const { sizes, inputs } = await measureComponentSizes();
      for (const input of inputs) this.addWatchFile(input);
      this.addWatchFile(fileURLToPath(new URL("../../tools/artwork/metadata.ts", import.meta.url)));
      return `export default ${JSON.stringify(sizes)};`;
    },
  };
}
