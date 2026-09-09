# Plate Artwork Comparison

This document preserves the source app's artwork history and measured tradeoffs. Use [WORKFLOW.md](WORKFLOW.md) for current Platekit commands, offline references, and paths. Historical scores and temporary evidence paths below are not current baselines. The copied New Jersey assertions have since been corrected in Platekit. Refresh the workshop for current results.

## Nine-state corrections from visual feedback

MA, CT, IL, MD, TX, AL, CO, ID and IN were refined from the existing working
components, preserving earlier uncommitted work. The comparison page was inspected
at 340px and 460px before and after. The final components were also mounted in
that page with loaded app fonts for canonical, anonymized, single-character and
long registrations; none of the 106 inspected SVGs had horizontal text overflow.

- Massachusetts uses narrower blue italic serif lettering for both lines;
  Connecticut uses regular serif lettering with corrected height and width.
- Maryland replaces the brush-script name with a curled calligraphic M and
  italic serif lowercase. Idaho has fine handwritten Scenic strokes, upright
  Idaho capitals and a less slanted Famous Potatoes footer.
- Illinois replaces the solid windmill tower with a spoked wheel, tail vane,
  and open lattice legs.
- Texas renders its state separator even when the registration is blank or
  noncanonical. Both groups preserve every supplied character and leave space
  for the symbol; standard registrations retain their three/four grouping.
- Alabama has rounded, irregular cloud banks, pale lit edges and rose shadows.
- Colorado restores the full mountain slopes below the former horizontal cutoff,
  with reference-fitted summits and broken gray gullies fading into the snowfield.
- Indiana gains an overhanging roof, open trusses, siding, windows, stone piers,
  split rail fences, creek ripples, tree branches and two birds. Its county
  decal stays unassigned.

All artwork remains editable SVG. Colorado's contours and Alabama's cloud banks
use simplified vector contours from the existing cleaned comparison references;
no reference image or new font binary is embedded in a component.

Reference pixels, crop bounds, masks, thresholds and calibration settings were
held fixed for the before/after comparator runs. Notes were refreshed afterward.

| State | Before | After feature pixel agreement |
| --- | ---: | ---: |
| MA | 75.77% | 75.77% |
| CT | 82.68% | 82.68% |
| IL | 87.55% | 87.55% |
| MD | 75.11% | 75.11% |
| TX | 87.93% | 87.93% |
| AL | 87.72% | 87.74% |
| CO | 85.91% | 90.75% |
| ID | 90.69% | 90.69% |
| IN | 83.44% | 83.32% |

Seven states pass every regression gate. Alabama retains a 2.33-point shape
agreement drop, concentrated in the exposed right cloud fragments; broad serial
masks exclude most clouds, so the browser comparison is essential. Indiana retains
local lower-scene pixel, shape, color and SSIM regressions as the additional bridge,
fence and creek details replace simpler geometry. Its scenic edge F1 improves
0.006. These two are reviewed visual changes with remaining metric regressions,
not an all-gates-passing result. Colorado improves shape agreement by 21.79 points
and passes every gate. Lettering is excluded from scores; the masks also exclude
Illinois's windmill, and the old Texas canonical comparator sample already had a
separator. Their unchanged scores do not measure those fixes.

The rendering/formatting checks have 94 passing tests and the same three previously
documented New Jersey failures. Texas has a regression test for blank/custom
separator visibility and lossless character handling. Typecheck, changed-file lint
and whitespace checks pass. The nationwide dashboard is refreshed, with all nine
results fresh. Temporary original components, reports, references, gate logs and
browser captures are under `/tmp/plate-nine/`.


## Seventeen-state artwork and lettering refinement

AL, VA, IN, NE, OK, NV, RI, ID, SD, MS, WA, WI, NH, UT, AR, NC and TN
have been reviewed against their selected references at 340px and 460px.
The starting point was the existing working tree, including prior uncommitted
redraws. Editable SVG remains the implementation; no photograph is embedded.

Seven source-specific masks were corrected: AR, MS, NE, NH, RI, SD and TN.
Their generic ten-character exclusions leaked portions of the actual seven-character
serials and hid artwork between the groups. Arkansas's full wordmark,
Mississippi's swashes, Nebraska's sample year, and Tennessee's optional motto and
seller marks also needed explicit exclusions. Both original and candidate reports
were regenerated in an isolated snapshot under the final comparator. Reference
pixels, crop bounds, threshold, feature weights and alignment/calibration options
were unchanged. The first column below uses the earlier masks; only the corrected
original and final columns are directly comparable.

| State | Earlier masks | Corrected original | Final artwork agreement |
| --- | ---: | ---: | ---: |
| AL | 87.66% | 87.66% | 87.72% |
| VA | 85.68% | 85.68% | 94.15% |
| IN | 83.61% | 83.61% | 83.44% |
| NE | 81.70% | 88.00% | 94.39% |
| OK | 81.18% | 81.18% | 86.27% |
| NV | 80.89% | 80.89% | 80.89% |
| RI | 77.85% | 85.57% | 92.73% |
| ID | 77.66% | 77.66% | 90.69% |
| SD | 77.31% | 79.85% | 92.52% |
| MS | 76.97% | 73.04% | 92.11% |
| WA | 76.51% | 76.51% | 87.99% |
| WI | 76.19% | 76.19% | 79.25% |
| NH | 76.14% | 82.73% | 90.16% |
| UT | 76.00% | 76.00% | 80.00% |
| AR | 75.97% | 82.56% | 87.67% |
| NC | 75.92% | 75.92% | 75.86% |
| TN | 75.58% | 70.99% | 82.89% |

The largest changes are Nebraska's seated Creative Energy figure and flowing
mural, Rhode Island's connected curling wave, Idaho's snow gullies and fir canopy,
South Dakota's distinct Rushmore profiles, Mississippi's cupped magnolia and
pressed rim, Washington's broken snowfields, and New Hampshire's granite profile.
Oklahoma gains the small bison, wind turbine, scissortail, derricks and rancher;
Wisconsin gains a more accurate hill and barn vignette. Arkansas has a centered,
shaded diamond, Utah has weathered sandstone ledges, and Tennessee has a corrected
inset frame, state outline and tristar placement. Alabama restores the sun and
widens the URL. Indiana and North Carolina retain their accepted illustrations
while improving the lettering proportions and placement. Nevada uses slab-serif
lettering and bounds long registrations.

Typography review also separates Idaho's Scenic script, gives Rhode Island regular
serif lettering, restores Wisconsin's italic heading, and correctly spaces mottos.
Mississippi reserves the full magnolia between serial groups. New shared lettering
options preserve the previous defaults; explicit motto widths apply only to the
requested states. County, month and year information remains unassigned.

All seventeen headline artwork scores are improved or unchanged under matching
settings. **Ten plates pass every regression gate. Seven retain reviewed local
regressions**, so this is not an all-gates-passing pass:

- VA: legacy scenic edge F1 drops 0.028; the selected Lovers heart differs from
  the novelty seller's footer, while the frame and overall shape scores improve.
- NE: middle-left/right and lower-center pixel agreement falls by up to 3.53
  points as pale figure and drapery detail replaces the nearly blank mural.
- RI: curl-region pixel agreement drops by up to 7.04 points and lower-right
  shape by 1.55; the connected wave greatly improves overall contour agreement.
- WA: three outer grid regions lose 0.42–0.91 pixel-agreement points with the
  new snow silhouette and its different frame-based alignment.
- NH: smooth-area color drops 1.77 points; local frame/rock shape and top-band
  metrics also flag the coarser granite palette and changed silhouette alignment.
- UT: local arch/pedestal pixels drop by up to 1.96 points and lower-right shape
  by 1.70; the new shadow ledges improve overall shape and pixel agreement.
- AR: gem-center shape drops 10.18 points, lower-center pixels 2.83, background
  color 0.92 and the top composite 1.51; facet shading and reflective hardware
  remain approximations despite better overall pixel and shape agreement.

Browser captures include canonical, anonymized and available long samples at both
sizes. No horizontal lettering overflow was found; Mississippi's symbol clearance
and Nevada's long registration width also have targeted tests. Typecheck,
changed-file lint and whitespace checks pass. The plate rendering/formatting and
comparison suites have 113 passing tests and the same three pre-existing New Jersey
formatting failures expecting the removed registration ID.

Before/after components, original and corrected baseline reports, fixed reference
images, final diagnostics, individual gate logs and browser captures are saved in
`/tmp/plate-17/` (temporary artifacts). The nationwide dashboard was refreshed under
the final settings. These are artwork agreement measurements, not human realism
percentages; lettering and fine photographic textures still need visual judgment.


## Nationwide 75% feature pixel agreement pass

All 50 states and DC exceed **75% feature pixel agreement** under scoring version 2.
Maryland is lowest at **75.11%** (75.1052% unrounded), followed by Wyoming at 75.12%.
The sixteen previously sub-75% plates are listed below. These artwork scores
exclude lettering and are not human fidelity percentages.

Four source-specific serial masks were corrected before comparing original and
candidate artwork. Connecticut, Minnesota and Wisconsin had incomplete generic
serial masks. New Mexico's source says ANY TXT: its old masks missed lettering
relief and hid the right-hand Zia rays. The corrected masks exclude complete
serials and expose the full Zia. Original working components were remeasured in
an isolated snapshot. Reference pixels, crop bounds, score weights, thresholds,
and alignment/calibration options stayed fixed. The comparison key includes the
comparator source, so all 51 baseline reports were regenerated under the final
settings. Wisconsin clears the target with its original artwork under the
corrected mask; its experimental redraw was discarded.

| State | Previous score | Corrected original | Final |
| --- | ---: | ---: | ---: |
| AK | 71.61% | 71.61% | 83.68% |
| CO | 73.47% | 73.47% | 85.91% |
| CT | 73.44% | 80.03% | 82.68% |
| DE | 73.01% | 73.01% | 75.32% |
| IN | 71.50% | 71.50% | 83.61% |
| ME | 73.92% | 73.92% | 75.49% |
| MN | 71.09% | 79.36% | 81.76% |
| NM | 70.12% | 80.02% | 81.21% |
| NC | 70.36% | 70.36% | 75.92% |
| OR | 73.50% | 73.50% | 79.94% |
| SC | 73.80% | 73.80% | 81.51% |
| TN | 73.26% | 73.26% | 75.58% |
| WA | 73.64% | 73.64% | 76.51% |
| WI | 74.06% | 76.19% | 76.19% |
| GA | 71.14% | 71.14% | 75.53% |
| MD | 74.29% | 74.29% | 75.11% |

The retained artwork refines Alaska's gold rim and recesses; Colorado's rounded
summits, rock shadows and green frame; Connecticut's state silhouette and edge;
Delaware's gold edge; Indiana's foliage and bridge; Maine's needle ink and fir
branch silhouette; Minnesota's recesses; New Mexico's connected Zia rays;
North Carolina's aircraft, grass and sand; Oregon's distant fir stands; South
Carolina's panel and stars; Tennessee's tristar and county panel; Washington's
summit; Georgia's bark, peaches and orchard horizon; and Maryland's cross
placement, rounded rim and neutral recesses. Tennessee's footer was repositioned
to stay above the county panel. County and registration decals remain unassigned.

Artwork stays editable SVG with restrained palettes and simplified contours.
Browser review removed stray serial-relief contours from Colorado and North
Carolina; hand-drawn stems complete grass behind the source lettering. No
reference photograph is embedded in the plate components. Typography, fine
illustrations and photographic surface effects remain approximation limits.

All 51 final reports pass every applicable regression gate against the matching
baseline, including individual feature checks. Browser captures cover all sixteen
reviewed states at 340px and 460px with app fonts, canonical/anonymized samples
and the available long samples; there is no horizontal lettering overflow.
The rendering, formatting and comparison suites have 109 passing tests and three
pre-existing New Jersey failures that still expect the removed registration ID.
The New Jersey component is unchanged in this pass. Typecheck, changed-file lint
and whitespace checks pass. Before/after components, references, reports, gate logs
and browser captures are preserved under `/tmp/plate-75/` (temporary artifacts).
The development dashboard contains the refreshed nationwide scores.

## Nationwide 70% agreement pass

All 51 plates now have fresh feature pixel agreement scores above 70%. The
lowest is New Mexico at 70.1%. Fourteen plates began below the target.

Before editing artwork, reference-specific text masks replaced generic masks
for AK, AZ, CO, DE, HI, ID, IN, NC, OR, UT, WA and WY. The old masks leaked parts
of ANY TEXT, Idaho's script and Indiana's numbered decal, and hid portions of
Indiana's bridge. Original artwork was remeasured with the corrected masks;
CO, IN and WA exceeded 70% at this step without an artwork change. The table
separates this measurement correction from actual redraw improvements.

| State | Previous score | Corrected baseline | Final |
| --- | ---: | ---: | ---: |
| AK | 69.9% | 68.3% | 71.6% |
| AZ | 64.0% | 69.0% | 77.0% |
| CO | 68.0% | 73.5% | 73.5% |
| DE | 58.8% | 66.3% | 73.0% |
| HI | 67.4% | 65.7% | 87.3% |
| ID | 58.4% | 60.8% | 77.7% |
| IN | 69.1% | 71.5% | 71.5% |
| ME | 52.7% | 52.7% | 72.4% |
| NC | 60.1% | 69.3% | 70.4% |
| NJ | 61.9% | 61.9% | 86.7% |
| OR | 64.4% | 65.6% | 73.5% |
| UT | 61.2% | 66.5% | 76.0% |
| WA | 67.4% | 73.6% | 73.6% |
| WY | 53.4% | 62.2% | 75.1% |

The 11 redraws improve Maine's bird, cone, needles and forest; Wyoming's bison,
seal linework and rider; New Jersey's rim, mounting slots and separator; Alaska's
flag; Arizona's saguaro; Hawaii's circular rainbow and recesses; Idaho's header
fade and treeline; Oregon's irregular fir branches; Utah's western arch column
and red pedestal; North Carolina's wing surfaces and bracing; and Delaware's
mounting slots. Detailed printed symbols use simplified, editable vector
contours and small color palettes. No reference photographs are embedded.

The original image bytes, score weights, pixel threshold, and alignment and
calibration options stayed fixed. The corrected masks stayed fixed throughout
all redraws. All 51 final reports pass the regression checker against the
corrected baseline, including every individual feature gate. Browser captures
cover the 11 redraws at 340px and 460px, including anonymized and long samples,
with no horizontal text overflow. Alaska and Oregon reserve space around their
fixed symbols; Arizona keeps its serial clear of the saguaro. New Jersey now
uses unique SVG resources and includes a long browser sample.

Lettering and photographic surface effects remain approximation limits. These
are artwork agreement scores, not human fidelity percentages. Before/after
reports, mask diagnostics, browser captures and gate output for this pass are
saved under `/tmp/plate-70/`; the dashboard's latest cache is authoritative.

## Scoring version 2

The dashboard now ranks **feature pixel agreement**, not visual accuracy. The old
headline counted matching pixels only in the top and bottom bands. That excluded
most of Maine's bird and pinecone, and rewarded matching blank backgrounds.
Version 2 measures all unmasked artwork, including the middle. California,
New Jersey and Virginia also have tighter serial masks; New Jersey's state
separator is now exposed. Lettering remains excluded and must be reviewed in
the actual browser pairs at 340px and 460px.

`scripts/plate-agreement.ts` defines the algorithm and its fixed constants:

- Blur with sigma 1.2 before detecting RGB Sobel edges at magnitude 40. Thin
  gradient ridges with nonmaximum suppression. Exclude a 5px neighborhood of
  lettering masks from edge detection so ignored lettering and artificial mask
  boundaries cannot count as artwork.
- Pixels within 8px of reference edges have weight 1. Smooth reference pixels
  have weight at most 0.05, capped collectively at 10% of each detailed region's
  weight. These weights depend only on the reference, so removing an illustration
  cannot turn its scored area into an ignored background. There is no white-only
  exclusion: solid colors and gradients retain their own color measurements.
- **Pixel agreement:** apply Pixelmatch's existing 0.15 threshold to the original
  aligned images, with antialiasing ignored. Average eligible non-frame features
  equally, then give the frame at most 20%. A feature needs 32 reference edges to
  participate. No detailed interior coverage means no ranking, not a perfect score.
- **Shape:** the same balanced aggregation of edge F1, matching thin edges within
  2px. Precision and recall count matches independently. Extra rendered edges in
  otherwise smooth regions also participate, penalizing invented artwork.
- **Color:** unweighted pixel agreement over all unmasked pixels.
  **Background:** pixel agreement over smooth reference pixels only. This includes
  smooth interiors of colored shapes and gradients, not just the plate's base.
  These measurements use actual aligned colors without white-balance calibration.
- **Features / coverage:** expandable dashboard rows show each feature's pixel,
  shape and color measurements, the fraction of the plate left unmasked, and the
  fraction of that area near reference detail. Empty metrics display a dash.

Maine has disjoint named regions for the chickadee, pinecone, pine branch, forest,
frame/mounting slots and remaining artwork. Other states use a 3×3 interior grid
plus a frame region. Those are spatial diagnostics, not semantic identification;
they can be replaced with reference-defined features as profiles are refined.
Every unmasked pixel belongs to one region. Smooth regions without enough edges
still contribute to the Color and Background measurements, but cannot inflate
the detailed-feature ranking. The reference photographs and hand-drawn text
masks remain limitations; the scores are not calibrated human realism ratings.

Each comparator run also writes `*-scoring-mask.png`: cyan is detailed reference
area, light gray is reduced-weight smooth area, and dark gray is excluded
lettering. The full report includes settings, coverage and per-feature metrics.
Legacy pixel/SSIM diagnostics remain in the report; `structural` now covers all
unmasked artwork and is no longer the dashboard headline.

Regression checks gate the new metrics and individual measured features as well
as legacy diagnostics. Version 1 baselines are rejected. Both version 2 reports
must have the same comparison key, derived from the reference pixels, masks,
feature definitions and comparison settings. Regenerate both baseline and
candidate when those change. Cached dashboard reports also require version 2;
changes to the scoring module invalidate every state's cached result.

The first complete version 2 rescore measured all 51 plates successfully. Maine
now has 52.7% feature pixel agreement, 66.8% shape agreement, 73.5% area-wide color
agreement and 96.6% smooth-area color agreement. Its chickadee measures 35.3% pixel
agreement and pinecone 33.0%. The earlier 80.0% headline used different coverage
and weighting; this is a scoring correction, not an artwork regression. Browser
captures for ME, NJ, CA and VA loaded their fonts and references at both display
sizes, with canonical, anonymized and long samples and no horizontal text overflow.

The historical results and tuning notes below describe the earlier metric and
must not be compared directly with version 2 scores.

## Goal

Build an SVG New York plate that visually matches a photo reference with a repeatable, objective process.

This process is optimized for:
- **Accuracy**: alignment + color calibration + masked metrics.
- **Speed**: targeted edits guided by worst-region and blob diagnostics.
- **Safety**: hard regression checks against a saved baseline report.

## Canonical Tools

### Custom plate priority dashboard

Open `/dev/plate-compare` (or any `?state=FL` detail view) and click **Refresh comparisons**. The overview ranks plates by ascending feature pixel agreement, links to each state's visual comparison, and shows shape, color, background and feature measurements. Missing references and failed, outdated or unrankable measurements remain visible but are excluded from the ranking. Typography is excluded from automated scoring, so use the ranking to guide visual review rather than as an absolute fidelity score across different designs.

The same batch is available from the frontend directory with `bun run compare-plates`. Both the button and CLI compare up to four states concurrently, retain per-state failures, and publish the complete report atomically when all workers finish. Cropped references and the latest report are cached in the git-ignored `.plate-comparisons/` directory. Refresh uses the cached reference for repeatable measurements; remove that cache when you intentionally want to re-download an unchanged reference URL. SVG, reference metadata, and comparison-tool changes invalidate the relevant scores. The browser refresh action runs only in local development.

### 1) Comparator

`scripts/compare-plate.tsx`

Renders `NewYorkPlate`, aligns and normalizes it against a reference, computes region metrics, and writes diagnostics.

Run:

```bash
cd /path/to/platekit
bun run prepare-plate-reference --state=NY
bun run compare-plate --reference=/tmp/ny-plate-reference.jpg --plate=ABC1234
```

The NY reference is the [official DMV Excelsior artwork](https://dmv.ny.gov/plates/excelsior-plates), cropped using the bounds in `dev/plate-compare/references.ts`. It replaces a novelty plate photo whose lettering, mounting slots, and scenery differ from the issued plate. The NY text masks cover the official sample's complete lettering, and calibration patches sit clear of the gold rules and serial.

The subsequent NY refinement corrected the inset frame and gold rules, lightened the mounting recesses and mountain backdrop, and redrew Niagara's spillway, Liberty's pose and pedestal, the skyline, and Montauk's beacon. Under the same official crop, masks, threshold, calibration, and automatic alignment settings, structural artwork similarity improved from 79.8% to 86.4%, bottom-band similarity from 74.1% to 83.4%, scenic SSIM from 0.505 to 0.688, and scenic edge F1 from 0.691 to 0.833. All applicable regression gates pass. The wordmark feature mask is fully excluded by the text mask, so lettering must be checked in the browser. When the DMV host fails to load there, the identical downloaded 660×343 source can be supplied to the page's reference backgrounds without changing their crop or scale.

When changing the reference or comparison masks, rerun **both** the original component and the candidate with the same new settings before comparing reports. Old reports are not comparable. The default artwork-only mode strips SVG text because Sharp cannot resolve the app's font variables; inspect `/dev/plate-compare` in a browser at 340px and 460px to validate typography separately.

Georgia has dedicated text masks and an orchard scenic region at y=378–482. Its previous generic profile excluded the entire scenic core and sampled part of the tree/serial for white calibration. Recreate Georgia baselines with these corrected settings; the high-resolution reference photo and pixel threshold are unchanged.

Illinois uses individual masks for the novelty reference's ANY TEXT letters, header, footer, and REPLICA watermark. The previous generic mask hid the entire central illustration. Its scenic region now spans y=95–488, and neutral calibration patches avoid the footer. The original and redrawn components were both measured with these corrected settings: structural artwork similarity improved from 75.6% to 94.0%, scenic similarity from 82.5% to 96.0%, and all regression gates passed. The reference URL, crop, alignment option, and pixel threshold are unchanged. Lincoln's portrait and coat, the skyline and Capitol, mounting slots, and lettering follow the existing base, also checked against the [Secretary of State's illustrated plate history](https://www.ilsos.gov/content/dam/publications/pdf_publications/vsd934.pdf). Typography is checked in the browser separately from artwork scores.

Maryland's masks cover the script and complete ten-digit reference serial, leaving the lower flag visible to scoring. Its calibration patches are clear of the registration, and its scenic region spans y=280–488. Under these corrected settings, the flag redraw improved artwork similarity from 59.3% to 83.2%.

Ohio's masks cover the header lettering and complete reference serial while preserving the wheat below y=403. Its scenic region spans y=250–488. Color calibration is disabled by default for Ohio because the illustrated design has no reliable neutral patches; the old patches sampled the skyline and tree. With calibration disabled for both the original and candidate, the scenery redraw improved artwork similarity from 52.1% to 73.7%. Both states retain their existing source images, crop bounds, and pixel threshold, and pass the before/after regression gates. These artwork scores exclude lettering, which was checked separately in the browser.

Ohio's subsequent wheat refinement reached 75.1%. A further pass corrected the white ray count and convergence, restored the pale blue sky facets, refined the oak crown with smaller foliage clusters, and distinguished the light upper slots from the shaded lower slots. Against that working-tree baseline, structural artwork similarity rose from 75.1% to 86.0%, top-band similarity from 74.1% to 91.6%, and scenic similarity from 77.6% to 79.7%. The reference crop, masks, threshold, alignment, and calibration settings are unchanged; all applicable regression gates pass. The generic stripes mask is empty and does not provide a separate ray score.

Useful flags:
- `--threshold=0.15` pixelmatch threshold (default `0.15`)
- `--no-align` disable translational alignment
- `--no-calibrate` disable color calibration

### 2) Regression Gate Checker

`scripts/check-plate-regression.ts`

Compares a candidate report to a baseline report and fails on metric regressions beyond configured limits.

Run:

```bash
cd /path/to/platekit
bun run compare-plate:check \
  --baseline=/tmp/ny-plate-baseline-report.json \
  --candidate=/tmp/ny-plate-report.json
```

## Standard Outputs

Comparator outputs are written to `/tmp`:
- `ny-plate-report.json` (primary machine-readable result)
- `ny-plate-diff.png` (full diff)
- `ny-plate-diff-annotated.png` (full diff + boxes around largest mismatch blobs)
- `ny-plate-reference-resized.png`
- `ny-plate-rendered.png` (raw render)
- `ny-plate-rendered-aligned.png`
- `ny-plate-rendered-normalized.png`
- `ny-plate-top-{ref,rendered,diff}.png`
- `ny-plate-crop-{ref,rendered,diff}.png` (bottom band)

## Metrics That Matter

### Primary (merge-gating)
- `agreement.pixelAgreement`, `agreement.shapeAgreement`
- `agreement.colorAgreement`, `agreement.backgroundColorAgreement`
- `agreement.features[*]` pixel and shape agreement for measured features
- `structural.similarityPct` (all unmasked artwork; legacy pixel diagnostic)
- `bottomBand.similarityPct`
- `scenicCore.similarityPct`
- `scenicEdgeF1.f1`
- `scenicSsim`
- `bottomColumns[*].diffPct` (watch worst column)

### Secondary (diagnostic)
- `topBand.similarityPct` (coarse only; mixes stripes + wordmark + frame)
- `topFeatures.stripes.similarityPct`
- `topFeatures.wordmark.similarityPct`
- `topFeatures.frameAndBolts.similarityPct`
- `stripeZone.similarityPct`
- `full.similarityPct` (useful but text/font mismatch can distort)

## Why This Is More Accurate

Compared with a plain full-image diff, this workflow improves accuracy by:
1. **Alignment**: finds best `dx/dy` before scoring.
2. **Calibration**: normalizes rendered RGB from fixed white patches.
3. **Masked scoring**: region-level comparisons instead of red-pixel heuristics.
4. **Multi-metric validation**: pixelmatch + SSIM + edge F1.
5. **Spatial diagnostics**: largest mismatch blobs with region labels.

## Fast Iteration Loop

1. **Run comparator** with the canonical command.
2. **Read top problems first**:
   - Worst `bottomColumns[*].diffPct`
   - Largest blobs in `ny-plate-diff-annotated.png`
   - `scenicEdgeF1` and `scenicSsim` (shape and tonal quality)
3. **Make one scoped SVG change** (single variable group: stripes, skyline proportions, gradient stops, text size/position, etc.).
4. **Re-run comparator**.
5. **Run regression checker** against baseline.
6. **Keep only net-positive changes**; revert if primary metrics regress.

## Baseline and Gates

### Create baseline (once per accepted improvement plateau)

```bash
cd /path/to/platekit
bun run compare-plate --reference=/tmp/ny-plate-reference.jpg --plate=ABC1234
cp /tmp/ny-plate-report.json /tmp/ny-plate-baseline-report.json
```

### Candidate evaluation

```bash
cd /path/to/platekit
bun run compare-plate --reference=/tmp/ny-plate-reference.jpg --plate=ABC1234
bun run compare-plate:check \
  --baseline=/tmp/ny-plate-baseline-report.json \
  --candidate=/tmp/ny-plate-report.json
```

Default regression limits (customizable via CLI flags in the checker):
- Structural similarity drop > `0.15` points: fail
- Top **composite** similarity drop > `0.25` points: fail
- Top stripes similarity drop > `0.35` points: fail
- Top wordmark similarity drop > `0.35` points: fail
- Top frame/bolts similarity drop > `0.35` points: fail
- Bottom band similarity drop > `0.25` points: fail
- Scenic core similarity drop > `0.25` points: fail
- Scenic edge F1 drop > `0.01`: fail
- Scenic SSIM drop > `0.002`: fail
- Worst bottom-column diff increase > `0.4` points: fail

Top-gate CLI flags:
- `--max-top-drop` (top composite)
- `--max-top-stripes-drop`
- `--max-top-wordmark-drop`
- `--max-top-frame-bolts-drop`

## Priority Order for Edits

Work highest ROI first:
1. Landmark proportions and vertical spans (skyline/statue/niagara/lighthouse)
2. Horizon gradient placement and opacity
3. Bottom band contrast and silhouette edge clarity
4. Stripe thickness and y-position
5. Wordmark size/position
6. Border radius/stroke tuning

## Process Rules

- Keep reference image fixed for a tuning cycle.
- Do not change comparator threshold mid-cycle.
- Do not batch unrelated edits in one attempt.
- Use structural and scenic metrics as truth; full score is supporting context.
- If one region improves but another regresses, require the regression checker to pass before keeping the change.

## Troubleshooting

- **Large top regressions with mixed visual feedback**: inspect feature gates separately (`stripes`, `wordmark`, `frameAndBolts`) instead of relying only on `topBand`.
- **High scenic diff but decent top**: landmarks likely too tall or horizon gradient misplaced.
- **Low edge F1 with stable similarity**: silhouette geometry is wrong but colors are close.
- **SSIM drops while pixelmatch is flat**: tonal distribution/gradients are drifting.
- **Frequent false regressions**: verify same reference path, same command flags, and no accidental `--no-align`/`--no-calibrate`.

## Batch review shortcuts

`bun run capture-plates --states=NV,MT,MI,LA,PA --output-dir=/tmp/plate-review/before`
uses one isolated headless Chrome for all selected comparison pages. It waits for
fonts and the reference image, captures every sample at the page's actual display
sizes, and writes text bounds/overflow diagnostics alongside each PNG. Override
`--url` for a different local server and `--chrome` (or `CHROME_BIN`) for another
Chrome installation. A broken server or failed reference fails the capture instead
of silently producing a blank comparison. It does not restart the user's server.

Use `compare-plate --output-dir=/tmp/plate-review/before` and a separate `after`
directory to preserve reports and all regional images. The default remains `/tmp`.
This prevents dashboard refreshes from overwriting a tuning cycle's evidence.
Prepare references and inspect all selected profiles before editing; run independent
state comparisons together, then reuse the browser capture command after changes.

### Florida and California refinement

Both profiles previously calibrated against serial ink; their patches now sample
blank shoulders. California's text mask now includes the complete serial, URL, and
script tail while leaving the mounting slots exposed. Original working components
were remeasured under these corrected settings before comparison with the redraws.
Florida's structural similarity improved from 93.6% to 95.2%, with citrus/watermark
similarity rising from 61.4% to 77.7% and edge F1 from 0.654 to 0.808. California's
structural score improved from 92.3% to 96.6%. All applicable regression gates pass.
California's score measures its rim and slots, not its typography. Browser checks
cover canonical, anonymized, and long registrations at 340px and 460px.

### Nevada, Montana, Michigan, Louisiana, and Pennsylvania

Reviewed all references, original browser renders, and masks before this batch.
The old generic masks hid the new centre artwork; the corrected masks exclude
sample lettering while exposing Nevada's mountains and state separator, Montana's
outline and skull, Louisiana's pelican, and Pennsylvania's keystone. Michigan's
patches now sample blank shoulders. Calibration is disabled for Nevada's blue sky
and Montana's blue field. Each original component was measured again under the
corrected profile before any redraw, and those settings stayed fixed for candidates.

| State | Structural before | After | Scenic before | After |
| --- | ---: | ---: | ---: | ---: |
| NV | 63.4% | 82.3% | 47.2% | 72.0% |
| MT | 68.8% | 90.1% | 85.8% | 94.1% |
| MI | 86.6% | 87.3% | 86.6% | 87.5% |
| LA | 78.8% | 87.4% | 83.3% | 91.8% |
| PA | 83.4% | 89.4% | 87.6% | 93.5% |

All applicable regression gates pass, including edge F1 and SSIM. Browser checks
cover canonical, anonymized, and longer registrations at 340px and 460px. The five
final captures took 3.6 seconds after Chrome startup on the local warm server.
These are artwork scores; typography is inspected separately and replica watermarks
remain a reference limitation. The existing designs are preserved, including
Pennsylvania's visitPA.com base and Montana's blue 2010 base.

### Pennsylvania, Texas, and Missouri refinement

Texas and Missouri now have text masks that expose their central artwork.
Missouri's white calibration patches avoid the mounting slot and blue lower field.
Both original working components were remeasured under these corrected profiles
before editing. Pennsylvania's existing profile is unchanged. All three retain
their original reference images, crop bounds, threshold, and automatic alignment.

| State | Structural before | After | Scenic before | After |
| --- | ---: | ---: | ---: | ---: |
| PA | 89.4% | 93.4% | 93.5% | 94.8% |
| TX | 94.9% | 95.8% | 94.9% | 98.4% |
| MO | 91.0% | 95.3% | 92.5% | 95.6% |

Pennsylvania has a shaded header, stronger lower rim, distinct upper/lower slots,
rounded keystone, and vertically centred long serials. Texas has a faceted star,
recognizable state separator, vertical security threads and corrected serial,
wordmark and motto proportions. Missouri now uses a dedicated SVG with its state
outline, eastern bluebird and flowering hawthorn, plus a pressed rim and slots.
The existing visitPA.com, Texas Classic and Missouri bluebird bases are preserved.
The [Texas DMV sample](https://www.txdmv.gov/motorists/license-plates) and
[Missouri DOR's bluebird description](https://dor.mo.gov/pdf/DriverGuide.pdf)
provide official corroboration of the reference designs.

All applicable regression gates pass. Scenic SSIM improved from 0.766 to 0.888
for PA, 0.420 to 0.847 for TX, and 0.312 to 0.824 for MO. Texas's worn photo,
fitted screws and vehicle-specific barcode remain measurement limitations; no
barcode or Missouri registration month is invented. Typography is checked
separately in the browser at 340px and 460px with canonical, anonymized and long
registrations. Texas and Missouri also participate in the resource-ID collision
test, and Missouri is included in the custom-plate priority dashboard.

### Nationwide baseline artwork pass (36 plates)

All 50 states and DC now have a custom component, a reference, and a comparison
profile. The 36 additions share `BaselinePlate.tsx` for the rim, mounting slots,
clipping, unique SVG IDs and responsive serial layout. Each state keeps its own
editable artwork component; photographs remain outside tracked assets.

References retain the previously selected bases where a reference already existed.
The new sources include official [Kansas](https://www.ksrevenue.gov/dovnewplate.html),
[Oklahoma](https://oklahoma.gov/ltgovpinnell/newsroom/2024/august/lt--governor-pinnell-and-service-oklahoma-announce-new-license-p.html),
[South Carolina](https://dmv.sc.gov/index.php/news/revolutionary-new-sc-license-plate-be-issued-2026),
and [Wyoming](https://dot.state.wy.us/home/titles_plates_registration.html) samples.
The remaining sources are individually inspected novelty photographs, with source
URLs, actual dimensions, crop bounds and design caveats in `references.ts`.
County names, validation years and registration months are left unassigned.

This is a first artwork pass, not a completed fidelity refinement. The covered
bridge, chickadee, Capitol mosaic, granite portrait, Rushmore faces, arch, bison and
state seals are simplified drawings. Lettering uses the app’s fonts and is checked
in the browser independently of the artwork measurements. All 36 reference images
loaded; canonical, anonymized and ten-character samples were captured at 340px and
460px with no horizontal text overflow.

The original generic renderer and new components were measured using identical
new profiles, downloaded crops, threshold and alignment settings. Calibration is
disabled because these illustrated designs do not share neutral white patches.
Masks follow the reference serials and labels while leaving scenic margins and
separators visible. These initial masks and replica sources need review before
fine tuning; blank original backgrounds can score higher than rough new artwork.
Do not compare these values with older MA/CT/VT/NH/RI/VA profiles.

| State | Generic before | Custom baseline |
| --- | ---: | ---: |
| AL | 49.6% | 39.5% |
| AK | 32.4% | 83.5% |
| AZ | 35.4% | 63.2% |
| AR | 92.0% | 91.4% |
| CO | 43.2% | 75.2% |
| CT | 80.2% | 77.4% |
| DE | 65.0% | 75.7% |
| DC | 74.0% | 63.7% |
| HI | 95.4% | 92.6% |
| ID | 17.3% | 73.8% |
| IN | 66.3% | 66.3% |
| IA | 28.4% | 61.0% |
| KS | 50.7% | 54.0% |
| KY | 27.6% | 66.9% |
| ME | 51.4% | 64.1% |
| MA | 95.4% | 94.2% |
| MN | 70.3% | 69.8% |
| MS | 89.2% | 84.0% |
| NE | 91.8% | 77.0% |
| NH | 80.5% | 75.2% |
| NM | 71.7% | 65.4% |
| NC | 75.8% | 73.5% |
| ND | 33.8% | 54.5% |
| OK | 44.5% | 57.3% |
| OR | 86.1% | 82.1% |
| RI | 66.4% | 88.0% |
| SC | 82.4% | 72.4% |
| SD | 52.4% | 68.0% |
| TN | 19.7% | 71.7% |
| UT | 33.1% | 70.0% |
| VT | 64.4% | 56.5% |
| VA | 91.4% | 89.5% |
| WA | 66.8% | 87.5% |
| WV | 68.8% | 75.4% |
| WI | 79.8% | 79.6% |
| WY | 50.2% | 62.4% |

The existing strict regression gate passes for 9 of these 36 conversions
(AK, AZ, CO, DE, ID, KY, ND, TN, UT); 27 have at least one regional regression.
Those failures remain refinement work; no thresholds were relaxed. This batch
establishes the requested custom baselines rather than claiming every conversion
improves every metric. Sources, original reports and captures, candidate reports,
and individual gate diagnostics from this session are saved in
`/tmp/plate-baseline/`. Refresh the dashboard for current scores after later edits.

Validation: 77 rendering, formatting and comparison tests pass; frontend typecheck,
lint on changed files, and `git diff --check` pass. Shared-frame edits invalidate
cached comparison scores along with edits to the individual state components.

### Alabama beach sunrise refinement

Alabama now has a dedicated SVG with layered sunrise clouds, Gulf reflections,
distant sails, sea-oat dunes, a gull, a white rim and an outlined Heart of Dixie.
The state wordmark and italic travel URL were checked with app fonts at 340px
and 460px, including canonical, anonymized and long registrations.
The Alabama DOR Standard Passenger sample corroborates the scene; the scored
novelty reference still differs in mounting slots, decals and security printing.

AL's generic serial masks missed part of the reference's T. Its masks now cover
the two complete lettering groups and the Heart of Dixie text. Both the original
working SVG and candidate were measured again with these same corrected masks,
the same crop and no color calibration. Structural similarity improved from
39.76% to 81.03%, bottom similarity from 24.05% to 73.65%, scenic SSIM from
0.5013 to 0.8696, and scenic edge F1 from 0.4748 to 0.5894. All applicable
regression gates pass; unconfigured stripe/wordmark feature gates remain skipped.
The weakest remaining artwork region is the far-left shoreline. Task snapshots
and browser captures are in `/tmp/al-improvement/`; the nationwide priority
report was refreshed after the redraw.

### Kansas, North Dakota and Vermont refinements

These three dedicated SVGs replace their initial shared-frame artwork:

- Kansas follows the [official To the Stars sample](https://www.ksrevenue.gov/img/newplate.png):
  state-shaped frame, circular holes, blank decal panels, Capitol dome and Ad Astra
  archer. The registration sits to the right of the dome at every supported length.
- North Dakota follows the sunrise composition confirmed by the
  [NDDOT sample](https://www.dot.nd.gov/motor-vehicle/license-plates): wheat,
  outlined heading, Badlands strata, shaded bison and the bottom-left motto.
- Vermont has a silver-white serial frame, fine sugar-maple foliage, heavier
  serif wordmark and pressed motto panel. The novelty photograph's reflective
  grain is not reproduced; slot shadows and pressed edges are drawn explicitly.

The initial generic masks missed lettering and hid parts of the designs. Before
editing, all three working components were remeasured with corrected header,
serial and footer rectangles. Every before/after pair below uses the same masks,
reference crop, threshold and alignment settings, with calibration disabled.
These corrected baselines supersede the earlier dashboard figures for comparison.

| State | Structural before → after | Bottom before → after | Scenic SSIM before → after | Edge F1 before → after |
| --- | --- | --- | --- | --- |
| KS | 65.79% → 97.23% | 77.22% → 96.34% | 0.7216 → 0.9692 | 0.3848 → 0.9359 |
| ND | 55.01% → 77.51% | 50.71% → 68.08% | 0.4908 → 0.8474 | 0.3683 → 0.4764 |
| VT | 59.75% → 83.64% | 62.84% → 86.88% | 0.6748 → 0.8350 | 0.3504 → 0.3648 |

All applicable regression gates pass. Vermont's initial edge regression was
resolved by restoring the pressed motto-panel edge, after correcting its overly
bright frame. No threshold or mask was changed during artwork tuning.
Unconfigured stripe/wordmark gates remain skipped; browser captures validate
lettering independently at 340px and 460px, with canonical, anonymized and long
samples. The closest available app fonts are used rather than exact issued fonts.
All 79 rendering, formatting and comparison tests, typecheck, changed-file lint,
and whitespace checks pass. Snapshots, reports, references and browser captures
are saved in `/tmp/ks-nd-vt-improvement/`; the nationwide dashboard was refreshed.

### Nationwide 70% artwork floor

All 50 states and DC now exceed 70% structural artwork similarity, with Kentucky
lowest at 71.6%. This is the dashboard's artwork metric; it excludes typography
and does not imply that the simplified illustrations are exact reproductions.

The rasterizer now composites transparent SVG corners onto white before alignment.
Previously their hidden black RGB values pulled the frame anchor several pixels
away from the correctly cropped reference. `scripts/plate-raster.ts` centralizes
this backing and has a regression test for transparent corners, opaque ink and
translucent artwork. Its source participates in dashboard cache invalidation.
DC's footer mask also now covers the complete lettering, beginning at y=407.
All 51 original working components were remeasured in an isolated snapshot under
these corrections. The following before/after values use identical reference
pixels, masks, threshold, automatic alignment and calibration settings; older
scores elsewhere in this document are historical and are not directly comparable.
No threshold was relaxed. Reference URLs, dimensions and crops are unchanged.

| State | Corrected original | Final artwork |
| --- | ---: | ---: |
| AZ | 67.2% | 77.0% |
| DC | 70.6% | 86.1% |
| IN | 73.2% | 78.7% |
| IA | 64.6% | 86.1% |
| ME | 71.4% | 75.6% |
| NM | 65.2% | 75.5% |
| OK | 61.8% | 83.6% |
| SD | 71.3% | 78.8% |
| UT | 74.3% | 82.7% |
| WY | 73.3% | 77.4% |

The retained refinements correct desert and mountain horizons, forest/bridge
placement, Iowa's inset field frame, Maine's pine branch and dark rim, New
Mexico's raised yellow border, and Oklahoma/Wyoming's printed frames and round
holes. DC has repositioned flag bars and rules and a condensed footer. Wyoming
and Utah have outlined headings. County and registration decals stay unassigned.
Kentucky and Minnesota retain their original artwork: they clear the floor under
the corrected rasterizer, and the experimental redraws had regional regressions.
All applicable before/after regression gates pass for the ten retained redraws.

Shared lettering now keeps long serials split around fixed separators. New Mexico
and Oklahoma reserve a wider gap for their Zia/star symbols. Browser checks use
the real comparison page with fonts at 340px and 460px, including canonical,
anonymized and long registrations; the remaining shared-separator states are also
captured. Exact typefaces and fine portraits/seals remain approximations.

Validation: 89 rendering, formatting, comparison and raster tests pass, along with
frontend typecheck, changed-file lint and `git diff --check`. Original components,
corrected baseline reports, candidate reports, gate logs and browser captures are
preserved in `/tmp/plates-over70/`. Refresh `/dev/plate-compare` for current results.


### Nationwide 80% artwork floor

All 50 states and DC now exceed 80% structural artwork similarity. Maine is the
lowest at 80.05% (80.0459% unrounded), so the one-decimal dashboard displays 80.0%.
The sixteen plates below the previous floor were refined; these are artwork-only
measurements, with typography and fine illustration limitations still visible.

Four initial profiles needed complete lettering exclusions. Kentucky now covers
the full serial groups and Bluegrass State label; Maine covers the complete ANY
TEXT serial while exposing the branch artwork to its left. North Carolina's
footer mask covers the tops of its red letters and exposes the grass below them.
South Carolina excludes the printer barcode, sample labels and complete serial,
footer and diagonal Liberty lettering while preserving their illustrated margins.
Both the saved originals and final candidates were measured under these same
corrected masks. Reference pixels, URLs, crop bounds, alignment, calibration and
pixel thresholds were kept fixed.

Bottom-column diagnostics also now partition the already-masked bottom band.
They previously counted excluded footer text again, making the column regression
gate inconsistent with the main artwork score. `plate-masks.ts` and its regression
test preserve exclusions and the total scored area; this correction does not
change the structural score. All sixteen original reports were regenerated with
this correction too. Earlier column diagnostics are not directly comparable.

| State | Corrected original | Final artwork |
| --- | ---: | ---: |
| AZ | 77.03% | 85.61% |
| DE | 75.97% | 83.01% |
| ID | 76.08% | 85.91% |
| IN | 78.69% | 80.06% |
| KY | 69.57% | 87.27% |
| ME | 75.53% | 80.05% |
| MN | 76.60% | 82.97% |
| NH | 79.55% | 80.38% |
| NM | 75.47% | 85.80% |
| NC | 77.59% | 80.19% |
| ND | 79.04% | 83.90% |
| SC | 78.04% | 91.21% |
| SD | 78.81% | 80.25% |
| TN | 75.08% | 81.27% |
| WV | 78.39% | 89.99% |
| WY | 77.36% | 86.37% |

The retained work includes gold and white inset frames, separate shading for lower
mounting recesses, Arizona's sunset and ridge, Minnesota's shore/trees/canoe,
Kentucky's state boundary and hills, Maine's feathers and forest edge, North
Carolina's windblown grass, North Dakota's western sunset shadow, and corrected
footer bands on West Virginia and Wyoming. Indiana's bridge now has smaller
trusses and timber siding. Minnesota and Tennessee reserve an asymmetric gap in
canonical, anonymized and long registrations for their off-center state symbols.

Fifteen of sixteen refinements pass every applicable regression gate. Kentucky
retains one explicit tradeoff: scenic edge F1 falls from 0.3643 to 0.3255, failing
the unchanged 0.01-drop gate. Its structural similarity rises from 69.57% to
87.27%, bottom similarity from 68.86% to 82.87%, scenic similarity from 81.14% to
88.85%, and scenic SSIM from 0.8384 to 0.9020. The more accurate state outline,
soft hills and rim are retained after visual review; the edge regression remains
open and is not reported as a clean gate pass.

All sixteen plates have real browser captures at 340px and 460px with app fonts,
canonical, anonymized and long samples. No horizontal lettering overflow was
reported. The app fonts, portraits, bird details, seals and other fine artwork
remain approximations. County/year decals remain unassigned.

Validation: 92 rendering, formatting, comparison, raster and mask tests pass,
along with frontend typecheck, changed-file lint and whitespace checks. Snapshots,
corrected original reports, candidate reports, per-state gate output and browser
captures are under `/tmp/plates-over80/`. The nationwide comparison dashboard was
refreshed after the final edits.

### Maine: contrast and contour simplification

Maine's previous traced palette reproduced pale exterior halos and fragmented
scale highlights. The chickadee now omits those halos, simplifies small contour
steps, and uses one per-instance gradient for the wing. The pinecone replaces
five layers of tiny tonal fragments with broad buff scales, burnt-orange insets
and dark outlines. Pine needles, forest, frame and lettering retain their prior
geometry. This is an intentional artwork approximation, not an exact-pixel
optimization.

The comparison page now provides equal-magnification, uncorrected reference/live
SVG close-ups for the chickadee and cone, alongside the existing 340px and 460px
pairs. `PlateReference.details` specifies visual crops independently of scoring
masks. Reference labels now distinguish photos (which can be novelty replicas)
from issued plates. The same original reference pixels, text masks, alignment
options, calibration and thresholds were used for the saved before/after reports;
no scoring algorithm or threshold was changed during this pass.

| Measurement | Before | After |
| --- | ---: | ---: |
| Standalone SVG bytes | 69,289 | 39,628 |
| Gzipped SVG bytes | 25,075 | 15,093 |
| Path-data characters | 64,629 | 35,158 |
| Paths / total elements | 12 / 53 | 10 / 56 |
| Feature pixel agreement | 72.24% | 71.35% |
| Feature shape agreement | 87.40% | 88.16% |
| Chickadee shape agreement | 93.03% | 95.72% |
| Pinecone pixel agreement | 58.25% | 54.01% |
| Pinecone shape agreement | 90.38% | 91.03% |
| Structural similarity | 84.36% | 83.97% |
| Scenic SSIM | 0.8607 | 0.8531 |

Rendered markup is 42.8% smaller (39.8% gzipped); the gradient adds elements while
replacing paths. These are SVG measurements, not bundle-size or runtime benchmarks.
The deliberate visual changes affect 5.53%, 5.33% and 5.13% of artwork pixels at
340px, 460px and 1000px, respectively (maximum channel differences 217, 222, 222).
All shape gates pass. Pixel agreement, area-wide color agreement, pinecone pixel
agreement, structural/scenic similarity and scenic SSIM fail their unchanged
regression gates. The clearer artwork is retained after browser review, with this
tradeoff explicitly recorded rather than claiming a clean fidelity-gate pass.

Font-loaded browser captures cover both normal sizes, canonical/anonymized/long
serials and the new close-ups. Typecheck, edited-file lint and whitespace checks
pass; the rendering/comparison/formatting suites have 103 passes and three existing
New Jersey formatting failures (expectations for the removed registration ID).
The existing multiple-plate resource test validates the new Maine gradient IDs.
Snapshots, audit results, reports, gate output and browser captures are under
`/tmp/me-refinement/`. These temporary files are not durable project assets.

### Maine: second illustration pass

The cone’s scale positions and taper now follow the fixed reference crop more
closely. Curved scale lips replace angular polygons, and thinner interior outlines
expose the orange and buff fills. The chickadee gains its buff flank and a broader,
tapered wing patch with softer gray shading. Existing feather contours, pine
needles, forest, rim and lettering are preserved. An experimental full bird redraw
was rejected because it lost feather-edge agreement.

This pass uses the previous accepted simplified artwork as its baseline, with
identical reference pixels, masks, thresholds, alignment and calibration options.
No comparator changes were needed. All applicable regression gates pass.

| Measurement | Before | After |
| --- | ---: | ---: |
| Feature pixel agreement | 71.35% | 73.92% |
| Feature shape agreement | 88.16% | 88.91% |
| Pinecone pixel agreement | 54.01% | 66.26% |
| Pinecone shape agreement | 91.03% | 95.46% |
| Chickadee pixel agreement | 70.89% | 71.23% |
| Chickadee shape agreement | 95.72% | 95.01% |
| Structural similarity | 83.97% | 85.02% |
| Scenic SSIM | 0.8531 | 0.8741 |
| Scenic edge F1 | 0.8276 | 0.8335 |

Chickadee shape agreement drops 0.71 points, within the unchanged 1-point gate;
its color/pixel agreement improves. Standalone SVG size is essentially unchanged:
39,628 → 39,347 bytes; gzip 15,093 → 15,139 bytes; 56 → 58 elements and 10 → 11
paths. No runtime performance claim is made. Intentional artwork changes affect
2.31%, 2.16% and 1.75% of raster pixels at 340px, 460px and 1000px respectively,
with maximum channel delta 222 at each width.

Real browser review covers close-ups and canonical/anonymized/long serials at
340px and 460px, with fonts loaded and no text overflow. Typecheck, edited-file
lint and whitespace checks pass. The rendering/comparison/formatting suites have
104 passing tests and the same three pre-existing New Jersey formatting failures.
The nationwide dashboard was refreshed. Baseline snapshots, candidate reports,
audits and browser evidence are in `/tmp/me-second-pass/` (temporary, not durable).
