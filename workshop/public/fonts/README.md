# Local preview fonts

`serial.otf` is the originating app's `Zurich Extra Condensed Regular.otf`, preserved for the development preview. The stylesheet also recognizes a locally installed copy under its original family name. This development asset is excluded from the npm package; its provenance is separate from Platekit's MIT source code license.

The development pages load Geist, Playfair Display, Sanchez and Yellowtail from Google Fonts. The font probe loads additional candidates. An internet connection is needed for those faces; fallback fonts remain available offline. Browser captures record the font-loading status. A completed capture with fallback fonts is not proof of typography fidelity.
