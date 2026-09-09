# Contributing

Run commands from the repository root. Install Bun 1.3.14, then:

```sh
bun install --frozen-lockfile
bun run dev
```

Open http://localhost:3001 for the public documentation site. Run `bun run dev:workshop` separately for the internal workshop at http://localhost:3002/compare. Vite provides React Fast Refresh and CSS hot updates on both sites. Use `PORT=3003` before either command to choose another port. Mise pins Bun and Node and wraps the same package scripts: `mise trust`, then `mise run dev`.

## Where changes belong

| Area | Responsibility |
| --- | --- |
| `src/` | Published React library: dispatcher, props, registry, state components, and internal artwork helpers. |
| `site/` | Public consumer documentation, installation, interactive examples, API reference, and state gallery. |
| `workshop/src/` | React gallery, comparison pages, contact sheet, font probe, and browser interactions. |
| `workshop/server/` | Development API for running comparisons and serving preserved reference assets. |
| `tools/artwork/` | Shared comparison engine, profiles, metadata, reference helpers, and command-line entry points. |
| `references/` | Original scoring crops, cleaned display copies, and unchanged provenance manifests. |
| `tests/` | Library, artwork tooling, and workshop tests. |
| `docs/history/` | Archived design decisions and previous comparison material, not current measurements. |
| `.agents/skills/` | Agent workflow instructions that use the same tools as contributors. |

The library never imports site code, workshop code, artwork tooling, or reference assets. The public site imports the library and owns its examples and styling; it must not import `tools/artwork`, workshop code, or preserved reference assets. Its Vite configuration has no comparison API. Build it with `bun run build:site`; `site/dist/` is the deployable static site. The workshop and CLI share `tools/artwork`; tooling never imports workshop UI. Keep browser-safe reference and metadata helpers separate from filesystem access. `tools/artwork/config.ts` owns the comparison widths. State source filenames and sample registrations live in `tools/artwork/metadata.ts`, outside the package.

Keep one component per state in `src/plates`. Put private helpers in `src/internal` so they cannot be imported through the public `platekit/plates/*` export. `src/registry.ts` contains only state names and components. Individual plates default their accessible state name and pass DOM props, styles, and refs to the wrapping div.

## Checks

```sh
bun run check
bun run build
npm pack --dry-run
```

`check` typechecks the package and development tools, then runs tests. `build` cleans and emits the ESM library and declarations. Only `dist/`, package metadata, README, and LICENSE belong in the tarball. Fonts, reference images, workshop code, tooling, and historical reports stay in the repository.

For UI changes, inspect the running workshop and check interactions and font loading. `tests/library/renderStability.test.tsx` tests server output under floating-point drift; it does not perform browser hydration. For artwork changes, follow [the artwork workflow](artwork-workflow.md), preserving current working-tree artwork and fixed scoring inputs.

The workshop uses React and Vite with a small server middleware for `/api/comparisons`. Page components have ordinary props; their filenames do not define routes. The route list is in `workshop/src/App.tsx`. Server and configuration edits restart Vite; plate, UI, and stylesheet edits update through HMR.

The workshop uses `/compare`, `/contact-sheet`, and `/font-probe`. Previous `/dev/plate-compare` URLs remain aliases within the workshop only. `bun run capture-plates` targets port 3002 by default.

## GitHub Pages

The public docs are a static site and can be hosted on GitHub Pages. The workshop requires its local server and is not deployed.

In the repository's **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. Once `.github/workflows/pages.yml` is on `main`, pushes to `main` deploy the docs; the workflow can also be started manually from the Actions tab. It installs the Bun version from `package.json`, runs checks, builds the public docs, and uploads only `site/dist/`.

The default URL for this repository is `https://jonnii.github.io/platekit/`. The workflow reads the base path from the Pages configuration and passes it to Vite, supporting both the repository subpath and a configured custom domain. Local development continues to use `/`.

To check the repository-subpath build locally:

```sh
bun run build:site --base /platekit/
bun --bun vite preview --config site/vite.config.ts --base /platekit/
```

Open `http://localhost:4173/platekit/`. Navigation uses page anchors, so no server-side route fallback is needed on Pages. See [Vite's GitHub Pages guide](https://vite.dev/guide/static-deploy.html#github-pages) for the hosting setup.

See [publishing](publishing.md) for package validation, the first npm release, and subsequent releases through GitHub Actions.
