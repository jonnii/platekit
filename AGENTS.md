# Platekit

Run commands from this repository root. `mise run dev` starts the public documentation site on port 3001; `mise run build:site` builds it to `site/dist/`. `mise run dev:workshop` starts the internal plate workshop on port 3002 (override with `PORT`). Bun is pinned in both `mise.toml` and `package.json`; use that version when updating the lockfile.

## Plate work

- Use [.agents/skills/plate-improvements/SKILL.md](.agents/skills/plate-improvements/SKILL.md) for redraws, realism improvements, and selecting the next state.
- Use [.agents/skills/plate-svg-optimization/SKILL.md](.agents/skills/plate-svg-optimization/SKILL.md) for SVG complexity audits and optimizations. Its measured findings remain with the skill; the shared audit CLI is `tools/artwork/cli/audit.ts`.
- Keep runtime code in `src/`, public docs in `site/`, internal React UI in `workshop/`, and shared artwork logic in `tools/artwork/`. Tools must not import workshop UI. The public site must not import artwork tools, reference assets, or workshop code. Package scripts are the canonical commands; mise supplies pinned tools and wrappers.
- The component registry is `src/registry.ts`; samples and source filenames live in `tools/artwork/metadata.ts`. References and comparison profiles are in `tools/artwork/references.ts` and `tools/artwork/profiles/index.tsx`.
- `references/originals/` contains the original scoring crops. The manifest records source, crop, and SHA-256; keep these consistent. Cleaned images are reconstructed display aids, never scoring inputs.
- Keep accepted working-tree artwork as the before baseline. Hold reference pixels and scoring settings fixed across comparisons. Historical reports in `docs/history/reference-material/` and scores in `docs/history/plate-comparisons.md` are context, not fresh measurements.
- SVG resources need per-instance `useId()` IDs. Test resource relationships and rendering behavior rather than fixed generated IDs or decorative path coordinates.

## Verification and package boundary

`mise run check` runs tests and typechecks both package code and development tools. `mise run build` builds the public ESM package and optional font stylesheet. `bun run check:package` verifies publication contents and font checksums/licenses. Only `dist/`, package metadata, README, and LICENSE should be published; redistributable fonts and their notices are included under `dist/fonts/`. The development server, reference images, unverified fonts, skills, and historical reports stay in the repository.

Browser artwork and typography checks use `/compare?state=GA`. Confirm fonts loaded; text-free comparator output does not validate lettering. See `docs/contributing.md` for repository boundaries and `docs/artwork-workflow.md` for commands and `docs/history/plate-comparisons.md` for historical design decisions.
