# Font probes

Start the workshop with `mise run dev:workshop`, then open [the wordmark queue](http://localhost:3002/font-probe?probe=la-name) or [Kansas registration lettering](http://localhost:3002/font-probe?probe=ks-registration). The queue contains 15 state-name/motto probes and registration probes for all 50 states plus DC. Probe definitions and transcribed reference serials live in `tools/artwork/font-probes.ts`; fixed-reference selections live in `tools/artwork/font-selections.ts`.

## Comparing candidates

The reference is the preserved original crop, normalized to the plate's 1000×500 coordinates. Cleaned references are never used for lettering. Each candidate renders inside the real React plate component; the trial changes only the selected text while preserving fitted widths, baselines, outlines, artwork, and registration grouping. Wordmark close-ups omit the runtime serial for visibility, while full-plate previews retain it.

Candidates load on demand from Google Fonts. A row only becomes selectable once its named font face loads. The current implementation remains a candidate, and no probe font has been added to the published package.

The shared selected candidate is the workshop starting point. Personal review notes are stored in browser local storage and may override it locally; exporting reviews downloads JSON. Neither action changes runtime plate artwork.

## Fixed-reference pass — 2026-09-12

All 66 probes were captured with actual browser-loaded fonts. The scorer masks the appropriate-color lettering in the preserved original, normalizes each glyph (or the complete word/run when glyphs cannot be separated), and ranks foreground Dice overlap plus symmetric edge agreement. A candidate needs a two-point improvement over the current face to become the selection.

The clearest wordmark leaders are Mr Dafoe for Louisiana, Satisfy for South Dakota, Grand Hotel / Marcellus for Georgia's motto/name, Lora Bold Italic for Maryland, Bevan / Roboto Slab for Nevada's name/motto, Kaushan Script for Kansas's motto, Playfair Display for New Hampshire "HAMPSHIRE", and PT Serif for New York's name. The current implementation remained the selected candidate for Massachusetts's name, New Hampshire "New", New York "EXCELSIOR", and California.

Twenty-eight registration probes have a measured replacement. Barlow Condensed 500 leads most clean, separable serials; Teko, Roboto Condensed, Antonio, and Barlow 700 lead selected designs where their shape better agrees. The exact candidates and scores are in `tools/artwork/font-selections.ts`.

“Whole-run” results in the workshop are lower confidence: source letters touch or include plate detail, so individual glyph extraction was not trustworthy. They are useful visual leads but need individual-glyph verification before an adoption. Selections are leads for a future fitted-artwork change, not runtime font adoptions.

## Repeatable browser evidence

```sh
mise run capture-plates -- --page=font-probe --probes=all --output-dir=/tmp/font-probes
mise run capture-plates -- --page=font-probe --probes=ga-name --candidate=marcellus-400 --output-dir=/tmp/ga-font
mise run capture-plates -- --page=font-probe --probes=all --font-masks --output-dir=/tmp/font-glyphs
bun run compare-fonts -- --input-dir=/tmp/font-glyphs --output-dir=/tmp/font-scores
```

Captures include screenshots, browser font status, text bounds, and `*-probe.json` with candidate availability and matched target counts. The masked capture additionally supplies candidate glyph images for the comparator. Temporary screenshots and score reports are not durable project assets; rerun the commands against the current working tree.
