# Optional feature cleanup

The September 2026 display-reference pass uses AI image edits of the existing
`references/cleaned/*.webp` images. It removes mounting holes, screw heads, and
registration sticker areas while reconstructing the surface behind them.
The original photographs and their scoring crops remain unchanged. These edited
images are display aids, not measurements or evidence of the obscured artwork.

`references/cleaned-references.json` records each input and output SHA-256 under
`optionalFeatureCleanup`. Input images can be recovered from Git history.
The built-in image generation tool was used. Only the reconstructed feature
regions were composited onto the input image, with boundary color matching and lossless
WebP encoding. This prevents the AI's incidental changes to lettering or artwork
elsewhere from reaching the display reference. Bounds and the integration logic
are in `tools/artwork/optional-features.ts` and `tools/artwork/reference-cleanup.ts`.

Common edit prompt:

> Use case: precise-object-edit. The input is the edit target: a cleaned license
> plate reference image. Remove all FOUR screw mounting holes/slots near the top
> and bottom (including outlines, recesses, shadows and highlights), and remove
> registration sticker/decal boxes or blank embossed rectangular sticker wells
> if any are present. Remove vehicle-specific month/year stickers too.
> Seamlessly reconstruct the exact surrounding background and scenery under
> each removed feature. Preserve all remaining pixels as closely as possible:
> exact state name and motto lettering, typography, state symbols, scenic
> artwork, colors, textures, outer rim, framing and aspect ratio. Keep the
> central registration empty. Do not simplify or redesign the artwork. Output
> just the edited image.

State-specific guidance:

- Florida: remove the four round holes and the complete top-right sticker well;
  retain MYFLORIDA.COM, SUNSHINE STATE, the halftone map, oranges and flowers.
- Georgia: remove the bottom YOUR COUNTY decal and reconstruct the orchard.
- Texas: remove the screw heads at the upper mounting points too.
- Tennessee: remove the PERRY county decal and reconstruct the dark blue field.
- Kentucky: remove the McCREARY county decal and reconstruct the scenery.
- Montana: preserve MONTANA - 10; the 10 identifies the plate design.
- Nebraska: preserve the small 2024 design issue marking at bottom left.
