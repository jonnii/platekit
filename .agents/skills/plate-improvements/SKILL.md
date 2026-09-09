---
name: plate-improvements
description: Improve Platekit state license-plate SVGs using preserved references, artwork comparisons, and browser checks. Use when redrawing a plate, improving its realism, or choosing the next state from the comparison dashboard.
---

# Plate Improvements

Improve the existing SVG implementation and verify both its artwork and its browser appearance. Preserve the user's chosen state and plate design; do not switch to a newer or different base merely because another standard design exists.

## Locate the implementation

Work from the active Platekit checkout root. Run `mise run dev:workshop` for the workshop at `http://localhost:3002/compare` (or the configured PORT). Run all Bun commands from the repository root.

- `src/registry.ts`: runtime component registry. `tools/artwork/metadata.ts` holds filenames and sample registrations. Use this instead of a hardcoded list of states.
- `src/plates/<State>Plate.tsx`: state SVG components; `src/internal/BaselinePlate.tsx` provides shared artwork and the unknown-state fallback.
- `tools/artwork/references.ts`: source image URLs, original dimensions, crop bounds, samples, and reference notes.
- `tools/artwork/profiles/index.tsx`: state profiles, text masks, and calibration patches. `tools/artwork/comparison/compare.tsx` owns rendering and regional metrics.
- `tools/artwork/comparison/regression.ts`: before/after regression gates.
- `docs/history/plate-comparisons.md`: maintained details of the comparison workflow and known state-specific calibration issues.
- `references/originals/` and `references/original-references.json`: preserved, checksummed scoring crops and provenance. Reference preparation uses these offline when the source metadata matches; `--fetch` explicitly downloads the remote original.
- `references/cleaned/`: reconstructed display images, never scoring inputs.
- `workshop/src/styles.css` and `workshop/public/fonts/README.md`: preview font configuration. Inspect font-loading status before claiming typography fidelity.
- `/compare?state=GA`: priority overview and reference/SVG pairs at browser sizes. Read `COMPARISON_WIDTHS` in `tools/artwork/config.ts` rather than assuming a viewport size.

If the user names a state, improve that state. If asked to choose the next state, refresh the dashboard with **Refresh comparisons** or `bun run compare-plates`, then visually inspect the weakest fresh results. Missing references, failed measurements, and outdated scores do not participate in the ranking. Differences in reference photos, complexity, and excluded typography make scores across states a triage aid, not an absolute measure of realism.

## Establish an honest baseline

1. Inspect the actual component, reference crop, and browser render. Check an official DMV/DOR example of the same design when available. A larger novelty image can clarify geometry, but its typography, colors, holes, and printed watermarks may differ from an issued plate.
2. Prepare the cropped reference with `bun run prepare-plate-reference --state=GA`. Use `--src=/path/to/downloaded-image` for an existing local source. Validate the original dimensions and plate bounds in `references.ts`; the comparator stretches its input to 1000×500, so an uncropped product photo corrupts every score.
3. Inspect the comparison profile before trusting scores. Text masks should exclude the reference's complete lettering without hiding the artwork being improved. Calibration patches must be blank on the reference and rendered plate, away from serials, trees, stripes, and borders. A generic profile can mask the entire scenic region; an empty mask is not evidence of accuracy.
4. Run `bun run compare-plate --state=GA --reference=/tmp/ga-plate-reference.jpg`. The state profile determines output filenames; standard profiles write `/tmp/ga-plate-report.json` and related PNGs.
5. Preserve a task-specific copy of the original working component, report, reference, and browser preview before editing. Comparator runs overwrite their output files. Use the working tree as the baseline, which may already contain accepted uncommitted improvements; do not assume `HEAD` is the correct starting point.

Keep the reference, dimensions, threshold, alignment/calibration options, and masks fixed within a tuning cycle. If the reference or scoring settings need correction, make that explicit and regenerate **both** the original and candidate reports under the corrected settings. Do not compare a corrected candidate with a report from the previous setup. Do not loosen thresholds or hide mismatches to obtain a higher score.

## Refine the SVG

Choose a coherent visual group at a time and inspect the result. Start with mismatched proportions, placement, and missing artwork before adding fine detail. Typical high-impact groups include the frame and mounting holes, landmark silhouettes, foliage and fruit, horizon/gradient placement, and lettering.

Keep the output as editable SVG/React artwork. Use paths, restrained gradients, and deterministic variation to make repeated natural forms less mechanical. Preserve the plate's aspect ratio, responsive sizing, clipping, accessible label/title, and registration sanitization. Use per-instance `useId()` values for gradients, symbols, filters, and clip paths; the comparison page renders several plates together.

Use the workshop's existing fonts where appropriate and adjust width, spacing, size, or placement based on the browser render. Keep anonymized registrations and unusual lengths readable. Do not invent county data or other vehicle details to fill a printed field; retain an unassigned decal when no information is supplied.

Keep reference notes accurate after a redraw. Avoid embedding the reference photograph into the SVG or committing downloaded product photos as a shortcut to similarity. The existing reference workflow keeps those images outside tracked assets.

## Validate artwork and typography separately

For artwork, rerun the same comparator command and inspect the raw render, diff images, weakest columns, and largest mismatch regions. Compare structural similarity, bottom/scenic similarity, SSIM, and edge F1; do not optimize one number while ignoring visible damage elsewhere.

Run the existing gate against the saved report:

```bash
bun run compare-plate:check --baseline=/path/to/saved-baseline.json --candidate=/tmp/ga-plate-report.json
```

Replace GA and its paths for the selected state. If a gate fails, inspect the affected region and reference/profile assumptions before retaining the change. Only compare reports produced under identical settings.

The default rasterizer strips SVG `<text>` because Sharp/librsvg cannot resolve the app's CSS font variables. Consequently, artwork scores do **not** validate lettering; even a metric named “wordmark” can measure surrounding pixels after masking. `--with-text` does not fix missing fonts.

Inspect the actual local `/compare?state=GA` page with its fonts loaded. Check the reference/SVG pairs at both display sizes, canonical and anonymized samples, and any long/custom serial affected by layout changes. When no browser tool is available, headless Chrome/CDP with an isolated temporary profile can capture the running app. Avoid recreating its typography in an unrelated HTML mockup or treating a text-free PNG as the final plate preview.

Run `mise run check` (rendering/formatting and comparison tests plus package/tooling typechecks) and `git diff --check`. Add a targeted test when behavior changes, such as resource-ID collisions or serial formatting; do not write tests that merely assert decorative path coordinates. Stop once the meaningful visual improvement and relevant checks are verified, rather than chasing an arbitrary similarity target.

## Finish the selected plate

Refresh the priority report with `bun run compare-plates` or the page's button after the final edits. Component, reference, or comparator changes invalidate cached scores; a profile edit can invalidate every state's report. Confirm the selected state's result is fresh and show failures or missing coverage honestly.

Report the concrete visual changes, before/after artwork score with any baseline correction explained, browser/check results, and a link to the state's comparison page. Mention the next candidate when useful, but do not start another redraw without that being part of the user's request. Leave commits, stacked branches, and publishing to the workflow the user actually requested.
