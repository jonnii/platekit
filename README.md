# Platekit

SVG license plate components for React, covering all 50 US states and Washington, DC.

```sh
npm install platekit
```

```tsx
import { LicensePlate } from "platekit";

<LicensePlate plate="ABC1234" state="NY" className="my-plate" />
```

Requires React 19. Plates scale to their container width. The documentation previews use platform fallbacks; configure the [font variables](#fonts) to customize lettering. No Next.js or Tailwind dependency, CSS import, network request, or bundled font is required.

## API

`LicensePlate` requires `plate: string` and `state: string`. It also accepts standard div props, including `className`, `style`, accessible labels, event handlers, and `ref`, applied to its wrapping div. Children are reserved for the artwork. State codes and full state names are accepted, ignoring case and surrounding whitespace. Unknown states render a generic plate. Registration formatting varies by state.

Import individual components to include only the states you need:

```tsx
import NewYorkPlate from "platekit/plates/NewYorkPlate";

<NewYorkPlate plate="ABC1234" style={{ width: 340 }} />
```

`LicensePlateProps`, `PlateProps`, `PlateState`, `PLATES`, and `PLATE_STATES` are also exported from the package root. Individual components infer their state; an optional `state` overrides the accessible state label. The dispatcher includes all states; individual imports avoid loading the full registry. Components support server rendering and carry Next.js client boundaries for their React hooks.

## Fonts

The artwork uses text as well as vector paths. Supply fonts through these inherited CSS variables to customize lettering:

| Variable | Purpose | Default |
| --- | --- | --- |
| `--font-plate-ny` | Registration numbers | sans-serif |
| `--font-plate-script` | Script headings | cursive |
| `--font-plate-place` | State headings | Georgia, serif |
| `--font-plate-motto` | Motto lettering | Georgia, serif |
| `--font-geist-sans` | Sans-serif text | Arial, sans-serif |

Fonts are consumer-supplied. The originating app uses Zurich Extra Condensed, Yellowtail, Playfair Display, Sanchez, and Geist. This package does not redistribute those font files. Default fonts vary by platform and will not exactly match the originating app; load your chosen fonts before visual comparisons or screenshots.

## Development

```sh
bun install --frozen-lockfile
bun run dev
```

Use Bun 1.3.14. Alternatively, `mise trust` followed by `mise run dev` installs dependencies and starts the same workflow with pinned tools.

Open http://localhost:3001 for the public documentation site: setup, live examples, API reference, fonts, and a searchable gallery. Build it with `bun run build:site`; the static output is in `site/dist/`.

The docs can deploy to GitHub Pages using the included workflow. See [GitHub Pages setup](docs/contributing.md#github-pages).

Run `bun run dev:workshop` (or `mise run dev:workshop`) separately for the internal artwork workshop at http://localhost:3002/compare. It includes reference pairs, scoring jobs, close-ups, registration samples, a contact sheet, and a font probe.

Both sites support React Fast Refresh and CSS hot updates. `PORT` overrides the port for either command. The public site has no comparison API, reference photographs, or development fonts.

- [Contributing and repository structure](docs/contributing.md)
- [Artwork comparison and improvement workflow](docs/artwork-workflow.md)
- [Agent instructions](AGENTS.md)

```sh
bun run check
bun run build
npm pack --dry-run
```

The package is ESM with TypeScript declarations. Its runtime code lives in `src/`; the public docs site lives in `site/`, the internal React workshop in `workshop/`, shared artwork tools in `tools/artwork/`, and preserved images and provenance in `references/`. Development fonts, reference images, tools, and historical material are excluded from the npm package.

See [publishing](https://github.com/jonnii/platekit/blob/main/docs/publishing.md) for release checks and npm authentication.

## License

MIT. See [LICENSE](LICENSE).
