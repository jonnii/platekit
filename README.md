# Platekit

SVG license plate components for React, covering all 50 US states and Washington, DC.

```sh
npm install platekit
```

```tsx
import { LicensePlate } from "platekit";
import "platekit/fonts.css";

<LicensePlate plate="ABC1234" state="NY" className="my-plate" />
```

Requires React 19. Plates scale to their container width. Import the optional [font defaults](#fonts) to match the documentation previews. No Next.js or Tailwind dependency is required; without the stylesheet, plates use system font fallbacks.

## API

`LicensePlate` requires `plate: string` and `state: string`. It also accepts standard div props, including `className`, `style`, accessible labels, event handlers, and `ref`, applied to its wrapping div. Children are reserved for the artwork. State codes and full state names are accepted, ignoring case and surrounding whitespace. Unknown states render a generic plate. Registration formatting varies by state.

Mounting holes and registration sticker areas are hidden by default. Use `mountingHoles` for a shared decorative overlay on any plate (`true` or `"slots"` for slots, `"round"` for round holes). The overlay is separate from the state artwork SVG. Set `registrationStickerAreas` to show the selected design's unassigned sticker areas; designs without them are unaffected.

```tsx
<LicensePlate state="FL" plate="ABC123" mountingHoles="round" registrationStickerAreas />
```

Import individual components to include only the states you need:

```tsx
import NewYorkPlate from "platekit/plates/NewYorkPlate";

<NewYorkPlate plate="ABC1234" style={{ width: 340 }} />
```

`LicensePlateProps`, `PlateProps`, `PlateState`, `PLATES`, and `PLATE_STATES` are also exported from the package root. Individual components infer their state; an optional `state` overrides the accessible state label. The dispatcher includes all states; individual imports avoid loading the full registry. Components support server rendering and carry Next.js client boundaries for their React hooks.

## Fonts

The artwork uses text as well as vector paths. Import the optional stylesheet once in your app's entry point or global layout:

```tsx
import "platekit/fonts.css";
```

This loads the same defaults as the documentation and workshop. The font files ship with the package; your bundler serves them from your app, with no Google Fonts dependency. Browsers load the faces used on the page. `font-display: swap` keeps text visible while fonts load; wait for `document.fonts.ready` before capturing screenshots.

To manage fonts yourself, omit that import, load your chosen faces, and set these inherited CSS variables on a parent element. Overrides also work with the default stylesheet:

| Variable | Purpose | With stylesheet | Without stylesheet |
| --- | --- | --- | --- |
| `--font-plate-ny` | Registration numbers (all states) | Bebas Neue | sans-serif |
| `--font-plate-script` | Script headings | Yellowtail | cursive |
| `--font-plate-place` | State headings | Playfair Display | Georgia, serif |
| `--font-plate-motto` | Motto lettering | Sanchez | Georgia, serif |
| `--font-geist-sans` | Sans-serif text | Geist | Arial, sans-serif |

Bebas Neue replaces the earlier previews' Zurich Extra Condensed, for which we could not establish font-file redistribution rights. The bundled fonts retain their own SIL OFL 1.1 or Apache 2.0 licenses. Full attribution, licenses, and pinned source checksums ship in `dist/fonts/`; see [font notices](src/fonts/NOTICE.md).

## Development

```sh
bun install --frozen-lockfile
bun run dev
```

Use Bun 1.3.14. Alternatively, `mise trust` followed by `mise run dev` installs dependencies and starts the same workflow with pinned tools.

Open http://localhost:3001 for the public documentation site: setup, live examples, API reference, fonts, and a searchable gallery. Build it with `bun run build:site`; the static output is in `site/dist/`.

The docs can deploy to GitHub Pages using the included workflow. See [GitHub Pages setup](docs/contributing.md#github-pages).

Run `bun run dev:workshop` (or `mise run dev:workshop`) separately for the internal artwork workshop at http://localhost:3002/compare. It includes reference pairs, scoring jobs, close-ups, registration samples, a contact sheet, and a font probe.

Both sites support React Fast Refresh and CSS hot updates. `PORT` overrides the port for either command. Both import the library's font stylesheet. The public site has no comparison API or reference photographs.

- [Contributing and repository structure](docs/contributing.md)
- [Artwork comparison and improvement workflow](docs/artwork-workflow.md)
- [Agent instructions](AGENTS.md)

```sh
bun run check
bun run build
npm pack --dry-run
```

The package is ESM with TypeScript declarations. Its runtime code and redistributable fonts live in `src/`; the public docs site lives in `site/`, the internal React workshop in `workshop/`, shared artwork tools in `tools/artwork/`, and preserved images and provenance in `references/`. Reference images, tools, and historical material are excluded from the npm package.

See [publishing](https://github.com/jonnii/platekit/blob/main/docs/publishing.md) for release checks and npm authentication.

## License

Source code: MIT. See [LICENSE](LICENSE). Bundled fonts retain their separate licenses; see [font notices](src/fonts/NOTICE.md).
