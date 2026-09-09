---
name: plate-svg-optimization
description: Reduce SVG element counts, repeated geometry, coordinate data, and render-time work in Platekit while preserving reference fidelity. Use for plate complexity audits and optimization passes; use plate-improvements for visual redraws.
---

# Plate SVG Optimization

Optimize the existing editable React/SVG artwork. Preserve the user's chosen designs and accepted working-tree changes. An audit request calls for findings and temporary experiments; an implementation request authorizes retaining verified optimizations. Do not turn an optimization into a redraw.

## Find the actual cost

Run Bun from the active Platekit checkout root. Discover components through `src/registry.ts` and samples through `tools/artwork/metadata.ts`; include helper artwork such as `MaineIllustration.tsx`. Source file length is misleading because loops expand into hundreds of nodes or long coordinate strings.

Use [the shared audit CLI](../../../tools/artwork/cli/audit.ts) to snapshot rendered SVGs and measure bytes, gzip bytes, element count, path count, and path-data length. Run the package command from the repository root:

```bash
bun run audit-plates --states=IN,NH,MD --output-dir=/tmp/plate-opt-before
```

Omit `--states` to audit the registry. Choose a fresh task-specific output directory; the helper intentionally refuses to overwrite snapshots. It reads display widths from `tools/artwork/config.ts` and also checks 1000px. Element counts include definitions and do not expand the internal instances of `use`; reduced markup is not proof of less painting. Gzipped SVG savings are not JavaScript bundle savings or measured runtime gains.

Distinguish many elements (batching candidates), duplicated geometry (reuse candidates), long contours (geometric simplification candidates), and unnecessarily precise generated numbers. Small source loops can still do substantial work on every render. Move deterministic, prop-independent path generation to module constants when helpful; keep per-instance resource IDs separate.

## Choose transformations by their paint behavior

- Batch disjoint marks with identical paint into a compound path. Begin every component with an absolute `M` and preserve closures, fill rules, stroke width, caps, joins, and transforms. Retain meaningful visual groups for editing.
- Matching colors alone do not justify merging. Overlap, antialiasing, fill/stroke ordering, per-element opacity, masks, and filters can change compositing. Grouping by color can reorder differently colored marks. Explicitly inspect intersections.
- Reuse identical geometry with a path in `defs` and `use` instances. Preserve each instance's clipping, fill, opacity, transform, and drawing order. Keep resource IDs derived from per-instance `useId()`. Warped geometry may depend on absolute position; translated copies are not necessarily equivalent.
- Round generated coordinates only in their actual coordinate system. On a 1000-unit viewBox, two decimals can remove floating-point noise with tiny displacement; on a normalized fruit or leaf later scaled up, the same rounding can visibly change contours. Apply rounding to selected geometry, not a blanket regex over JSX, IDs, text, or arbitrary numeric attributes.
- Simplify long contours separately from reducing node count. Protect recognizable silhouettes, negative spaces, feathers, needles, and seals. Preserve strokes that encode outlines, relief, or hide seams between adjacent fills.

Read [references/findings.md](references/findings.md) for measured successes and rejected experiments. Treat its historical numbers as examples, not current rankings or automatic permission to apply a transformation.

## Prove preservation

1. Save current components, references, full comparison reports, SVG snapshots, and actual browser captures before editing. Use the working tree rather than assuming `HEAD` is the baseline. `tools/artwork/references.ts` records source dimensions, crop, and design limitations. Preserved original scoring crops are in `references/originals/`, with provenance and checksums in `references/original-references.json`. `bun run prepare-plate-reference --state=IN` selects the matching crop. The `.plate-comparisons/` cache contains prepared references; historical material in `docs/history/reference-material/` is not a current baseline.
2. Change a coherent visual group. Compare the actual edited component against its saved SVG:

   ```bash
   bun run audit-plates --states=IN,NH,MD --baseline=/tmp/plate-opt-before --output-dir=/tmp/plate-opt-after --require-identical
   ```

   The helper strips text for artwork-only raster comparison. Exact pixel equality is the preferred gate for geometry reuse and batching. A failed exact gate is evidence to investigate, not a reason to loosen a threshold. For intentionally approximate precision/contour changes, omit that flag to inspect changed pixel count, maximum channel delta, and mean delta, then evaluate the affected artwork against its reference. Whole-image averages can hide local damage.
3. Run `bun run compare-plate --state=IN --reference=/tmp/task/IN-reference.jpg --output-dir=/tmp/task/before/IN` before edits and the same command with an `after` output directory afterward. Use `bun run compare-plate:check --baseline=/tmp/task/before/IN/in-plate-report.json --candidate=/tmp/task/after/IN/in-plate-report.json`. Repeat for selected states. Keep source pixels, masks, threshold, alignment, and calibration fixed; never hide changed detail to get a pass. If settings need correction, remeasure both versions under the corrected settings.
4. Capture the real font-loaded page with `bun run capture-plates --states=IN,NH,MD --output-dir=/tmp/task/browser-before` and again after editing. Inspect reference/SVG pairs at both current display widths with canonical, anonymized, and relevant long registrations. Compare decoded screenshot pixels when claiming browser equality; PNG file hashes can differ solely because of metadata. Mask only unrelated dynamic UI if needed, and disclose it. Text-free raster results do not validate fonts or browser resource behavior.
5. Run `mise run check` and `git diff --check`. The existing `LicensePlate.test.tsx` covers resource uniqueness and reference resolution for multiple plates; use that coverage for added SVG resources. Avoid tests that merely assert decorative coordinates.
6. Refresh the dashboard with `bun run compare-plates` after final edits and check selected states have fresh results. Report actual retained savings, exact or approximate pixel differences, reference regression results, browser checks, and remaining fidelity limitations. Stop when the selected optimization is verified.

The audit helper does not change components, compare reference photographs, validate browser typography, benchmark runtime, or assert that an approximation is visually acceptable. Use the repository's comparison and browser tools for those separate checks.
