# Changelog

## Unreleased

- Added `PLATE_LOADERS`, one dynamic import per state for `React.lazy`.
- `LicensePlate`'s `state` prop autocompletes state codes and still accepts any string.
- Removed the unused Playfair Display and Sanchez fonts and their CSS variables from `platekit/fonts.css`.
- Added oxlint to `bun run check` and an `engines` field (Node 20 or later).

## 0.1.0

Initial release: 50 states and the District of Columbia, server rendering, optional font stylesheet.
