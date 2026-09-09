# Cleaned plate references

Display copies for `/dev/plate-compare`, edited with imagegen to remove the
large sample registration (such as `ANY TEXT`) and reconstruct the background
behind it. State names, slogans and permanent emblems remain. These images
contain AI reconstruction and are not authoritative plate artwork.

`dev/plate-compare/cleaned-references.json` records the source URL, original
image dimensions and crop for every copy. The display falls back to the original
if that source or crop changes. New cleaned images should use the same full plate
crop and be exported as WebP, with the matching manifest entry updated.

The comparator and reference preparation script continue to use the unedited
sources from `references.ts`, with their existing text exclusions. Do not use
these reconstructed images as scoring inputs. Original photos remain linked
from the comparison page.
