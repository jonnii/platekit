# Measured findings: September 6, 2026

These measurements describe the working artwork at the time of the first optimization pass. Rerun the audit before choosing new candidates. All sizes below are rendered standalone SVG bytes, not TSX source sizes or production JavaScript bundle sizes.

## Retained changes

| State | Change | SVG bytes before → after | Gzip bytes before → after | SVG elements before → after |
| --- | --- | ---: | ---: | ---: |
| IN | 37 disjoint bridge-board paths become one module-level compound path | 11,359 → 9,451 (−16.8%) | 1,661 → 1,632 | 105 → 69 |
| NH | 30 disjoint granite marks become two module-level paths, one per ink | 6,051 → 4,287 (−29.2%) | 1,279 → 1,263 | 69 → 41 |
| MD | Define each warped Crossland cross once, reuse it in four clipped color regions | 95,821 → 53,744 (−43.9%) | 16,011 → 15,357 | 130 → 134 |

Maryland reduces duplicated geometry and cross generation, while adding definitions and instance elements. Its element count increases slightly; do not describe it as a DOM reduction. The two crosses have different absolute coordinates in the cloth warp, so each has its own geometry. IDs derive from the parent plate's `useId()`. Clips, paint order, fills, and flag fade remain intact.

All three edited components produced exactly identical artwork-only raster pixels at 340, 460, and 1000px. All applicable reference regression gates passed with zero metric changes:

| State | Feature pixel agreement, before and after |
| --- | ---: |
| IN | 71.4995% |
| NH | 76.1428% |
| MD | 74.2865% |

Font-loaded Chromium captures covered canonical/anonymized samples for all three states and long samples for IN/NH, at 340px and 460px. All text bounds were unchanged, with no horizontal overflow. IN and MD had exactly identical decoded screenshots. NH changed 269 pixels across the complete 980×1572 comparison screenshot, with a maximum channel difference of 7/255; visual review found only slight raster edge/antialiasing differences. Reference scores and geometry were unchanged. Do not infer browser pixel equality solely from Sharp/librsvg equality.

The dashboard was refreshed successfully for all 51 states. Typecheck, edited-component lint, whitespace checks, and 86 plate rendering/comparison tests passed. The broader formatting suite had 17 passes and three pre-existing New Jersey failures expecting a removed `registration` ID; those are unrelated to these three components. Temporary evidence for this run was saved under `/tmp/plate-svg-optimize/`; future runs must create their own evidence because temporary files are not durable.

## Experiments not retained

- **Iowa grass:** Combining 110 paths into two by color reduced markup but changed up to 123/255 in individual channels. Differently colored strokes overlap and batching changes the paint order. This is not an exact-preservation optimization.
- **North Carolina sand:** Combining 260 paths into two looked nearly unchanged at display sizes, but changed 0.3592% of artwork pixels at 1000px, with maximum channel difference 17/255. Small-scale agreement alone did not establish exact equivalence.
- **Numeric precision:** A temporary experiment rounded only rendered `d` and `transform` values to two decimals. Gzip sizes fell from 9,460 to 6,391 bytes for North Dakota, 5,798 to 3,310 for Vermont, and 19,864 to 17,975 for Ohio. There were small nonzero raster differences. These candidates were not retained or given full reference/browser validation; they remain leads, not approved recipes. Apply precision changes to the original generators with attention to local scale, rather than copying the exploratory regex into a source optimizer.

## Where complexity lives

- North Dakota expanded to 558 SVG elements, North Carolina to 518, and Georgia to 424. Texture loops and repeated motifs deserve inspection, but opacity and overlapping strokes can prevent exact batching.
- Ohio already batches 700 canopy clusters into five paths and reuses wheat through a symbol. Its large SVG (about 148 KB uncompressed) primarily needs path-data and generated-precision analysis, not indiscriminate element merging.
- Maine had only 12 paths but roughly 65,000 characters of path data. Simplifying its contours is a separate, approximate artwork task; check bird silhouette, feather boundaries, pine needles, and negative spaces against the reference.
- Repeated Pine components (for example Idaho's treeline) duplicate geometry. Symbols can reduce markup, but do not eliminate the cost of painting instances; unioning the silhouette can change antialiasing or overlaps.

No runtime benchmark was performed. Report measured markup/geometry reductions separately from potential render-time benefits.
