# Publishing Platekit

Publish a GitHub release to publish the library to npm. There is no local publishing or tag-push step. The public docs have a separate GitHub Pages workflow.

## Create a release

Once the workflow and npm authentication are configured:

1. Open the repository's **Releases → Draft a new release** page.
2. Choose the code to release, usually `main`, and create a tag such as `v0.1.0` in GitHub.
3. Add release notes and click **Publish release**.

The `publish.yml` workflow checks out that release's code, installs the pinned Bun version, sets the package version from the release tag, runs checks, builds the library, verifies its contents, and publishes it to npm. The version change happens only in the runner; you do not need to edit `package.json` or commit a version bump first.

A draft does not publish anything. A tag push by itself does not publish anything. The workflow runs on `release.published`. See [GitHub's release event](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#release).

Stable releases such as `v0.1.0` publish under npm's `latest` tag. For a prerelease, use a tag such as `v0.2.0-beta.1` and select **Set as a pre-release** in GitHub; the package publishes under `next`. The workflow rejects mismatches between the version and the GitHub prerelease setting. Build metadata in version tags is not supported.

## One-time npm setup

npm requires the package to exist before you can configure a trusted publisher. The initial release can still be published entirely from GitHub Actions:

1. Sign into npm's website with the account that should own `platekit`.
2. Create a granular access token that permits creating and publishing the package, with **Read and write** package permissions and **Bypass two-factor authentication** for unattended publishing.
3. In GitHub, open **Settings → Secrets and variables → Actions** and add a repository secret named `NPM_TOKEN` containing that token.
4. Publish the first GitHub release, for example `v0.1.0`.

A name lookup can show that no public package exists, but npm makes the final availability decision when publishing. See [npm's token documentation](https://docs.npmjs.com/creating-and-viewing-access-tokens/) and the [package-existence requirement](https://docs.npmjs.com/cli/v11/commands/npm-trust/#prerequisites).

## Switch to trusted publishing

After the first release, add a trusted publisher in the npm package settings:

| Field | Value |
| --- | --- |
| Provider | GitHub Actions |
| Organization or user | `jonnii` |
| Repository | `platekit` |
| Workflow filename | `publish.yml` |
| Environment | Leave empty |
| Allowed actions | Allow direct `npm publish` |

Remove the `NPM_TOKEN` secret and revoke the bootstrap token. Subsequent GitHub releases use OIDC authentication, with no stored npm token or local login. The workflow has the required `id-token: write` permission and uses Node 24 with an npm version supporting trusted publishing. See [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).

## Checks and retries

`bun run check` runs tests and typechecks. `bun run check:package` rebuilds the library and verifies the publication boundary and all 51 state exports. Only `dist/`, package metadata, README, and LICENSE are included; development tools, sites, reference images, and fonts are excluded.

If publishing fails before npm accepts the version, fix the configuration and rerun the failed workflow from the Actions tab. Published versions cannot be overwritten. If a version already exists, use a new release tag for changes.

After the first successful release, replace the public site's source-install notice with `npm install platekit`.
