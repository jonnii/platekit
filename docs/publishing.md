# Publishing Platekit

Publish a GitHub release to publish the library to npm. There is no local publishing or tag-push step. The public docs have a separate GitHub Pages workflow.

## Create a release

Once the workflow and npm authentication are configured:

1. Open the repository's **Releases → Draft a new release** page.
2. Choose the code to release, usually `main`, and create a new tag such as `v0.1.1` in GitHub.
3. Add release notes and click **Publish release**.

The `publish.yml` workflow checks out that release's code, installs the pinned Bun version, sets the package version from the release tag, runs checks, builds the library, verifies its contents, and publishes it to npm. The version change happens only in the runner; you do not need to edit `package.json` or commit a version bump first.

A draft does not publish anything. A tag push by itself does not publish anything. The workflow runs on `release.published`. See [GitHub's release event](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#release).

Stable releases such as `v0.1.0` publish under npm's `latest` tag. For a prerelease, use a tag such as `v0.2.0-beta.1` and select **Set as a pre-release** in GitHub; the package publishes under `next`. The workflow rejects mismatches between the version and the GitHub prerelease setting. Build metadata in version tags is not supported.

## Configure trusted publishing

The initial `platekit@0.1.0` release was published locally. Subsequent releases use GitHub Actions with OIDC authentication.

With an npm account that has write access to `platekit` and two-factor authentication enabled, run:

```sh
npx --yes npm@11.19.1 trust github platekit --repo jonnii/platekit --file publish.yml --allow-publish
npx --yes npm@11.19.1 trust list platekit
```

Complete npm's authentication prompt. These commands use a version supporting the current trust configuration flags without upgrading your global npm installation. See [npm trust](https://docs.npmjs.com/cli/v11/commands/npm-trust/).

Alternatively, add a trusted publisher in the [npm package settings](https://www.npmjs.com/package/platekit/access):

| Field | Value |
| --- | --- |
| Provider | GitHub Actions |
| Organization or user | `jonnii` |
| Repository | `platekit` |
| Workflow filename | `publish.yml` |
| Environment | Leave empty |
| Allowed actions | Allow direct `npm publish` |

The workflow uses OIDC authentication with no stored npm token. It has the required `id-token: write` permission and uses Node 24 with an npm version supporting trusted publishing. No `NPM_TOKEN` secret is needed. See [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).

Commit and push the workflow before creating the next GitHub release from `main`. Use a new version such as `v0.1.1` to verify publishing through Actions; rerunning the original `v0.1.0` workflow cannot overwrite the package already on npm.

## Checks and retries

`bun run check` runs tests and typechecks. `bun run check:package` rebuilds the library and verifies the publication boundary, all 51 state exports, and font assets/licenses against the pinned checksums. Only `dist/`, package metadata, README, and LICENSE are included. The optional font stylesheet and redistributable fonts ship under `dist/` with their own attribution and licenses; development tools, sites, reference images, and unverified font assets are excluded.

If publishing fails before npm accepts the version, fix the configuration and rerun the failed workflow from the Actions tab. Published versions cannot be overwritten. If a version already exists, use a new release tag for changes.
