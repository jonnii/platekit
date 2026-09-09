# Plate improvement workflow

From the repository root, run `mise run dev:workshop`, then open http://localhost:3002/compare. The gallery is at `/`; the workshop includes priorities, original and cleaned reference links, 340px/460px pairs, close-ups, canonical/anonymized/custom registrations, a contact sheet, and a font probe. `PORT` changes the local port; pass `--url=http://localhost:PORT` to browser capture when needed.

## Compare a change

```sh
bun run prepare-plate-reference --state=GA
bun run compare-plate --state=GA --reference=/tmp/ga-plate-reference.jpg --output-dir=/tmp/ga-before
# Save the working component and browser evidence before editing.
# After editing, use the same reference and settings:
bun run compare-plate --state=GA --reference=/tmp/ga-plate-reference.jpg --output-dir=/tmp/ga-after
bun run compare-plate:check --baseline=/tmp/ga-before/ga-plate-report.json --candidate=/tmp/ga-after/ga-plate-report.json
bun run compare-plates
mise run check
```

Choose fresh task-specific output directories. The comparator overwrites its output files. `compare-plates` refreshes all 51 states and publishes progress into `.plate-comparisons/latest.json`; the workshop's Refresh comparisons button runs the same batch. Stale, missing, and failed results remain visible and unranked.

Reference preparation uses checksummed original crops from this repository when their provenance matches current metadata. `--src=/path/to/full-source.jpg` crops a supplied full image; `--fetch` explicitly downloads the recorded source URL. Both validate the original dimensions and crop. Changing a reference requires updating its provenance and regenerating both before and after reports. Reconstructed cleaned images are never valid scoring inputs.

## Browser and complexity checks

```sh
bun run capture-plates --states=GA --output-dir=/tmp/ga-browser
bun run audit-plates --states=GA --output-dir=/tmp/ga-svg-before
# After the optimization:
bun run audit-plates --states=GA --baseline=/tmp/ga-svg-before --output-dir=/tmp/ga-svg-after --require-identical
```

Browser capture needs Chrome (`CHROME_BIN` or `--chrome=...` overrides detection). It saves screenshots, text bounds, and font-loading status. Fonts and original remote photos may need network access; preserved crops and cleaned images are local. The preview includes the originating serial font and loads the other faces from Google Fonts. React component and CSS changes update automatically through Vite. Server and configuration changes restart the development server.

The audit reports SVG bytes, gzip bytes, nodes, paths, and path-data length at the workshop widths plus 1000px. `--require-identical` checks decoded artwork pixels, excluding text. It does not establish browser typography equality or runtime performance.

Each command also has a matching mise task; pass script flags after `--`, for example `mise run compare-plate -- --state=GA --reference=/tmp/ga-plate-reference.jpg`.

## Reference material and history

- `tools/artwork/references.ts`: selected designs, source URLs, original dimensions, crop bounds, samples, notes, and close-ups.
- `references/originals/`: 51 unretouched scoring crops preserved from the source app's current cache. `original-references.json` records provenance and checksums.
- `references/cleaned/`: 51 reconstructed display copies, with source/crop provenance in `cleaned-references.json`.
- `workshop/public/ny-plate-bg.svg`: legacy New York background asset.
- `workshop/public/fonts/serial.otf`: originating serial font, development-only.
- `docs/history/reference-material/roasts-comparisons/`: complete historical comparison cache at extraction, including older crop variants and the previous summary. It is archival and never treated as current scores.
- [Historical plate work](history/plate-comparisons.md): historical plate work, calibration decisions, and known limitations. References to old `/tmp` evidence describe past work; those temporary artifacts are not guaranteed to exist.
- `.agents/skills/`: repository-local improvement and optimization skills, including measured findings; the audit CLI lives in `tools/artwork/cli/audit.ts`.

Source code uses the repository's MIT license. Reference photographs, reconstructed derivatives, and the preserved font retain their recorded external provenance; the source-code license does not establish their licensing. They are development material and are excluded from the npm tarball.

See [contributing](contributing.md) for repository boundaries and the React development workflow. Shared display widths are in `tools/artwork/config.ts`; development samples and source filenames are in `tools/artwork/metadata.ts`.
