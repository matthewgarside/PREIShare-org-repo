# PREIShare Pull Request CI Pipeline Design

This is my first draft of how PREIShare's pull request (PR) checks could work.
It is a design document only; it does not create a GitHub Actions workflow.
The plan is based on the PR goals, CI notes, project inventory, and the current
`package.json`.

## 1. Pipeline purpose

PREIShare needs automatic PR checks so each proposed change gets the same
basic checks before it is merged. Right now, teammates may need to set up
dependencies themselves, remember to run checks, or run different checks.
That takes time and can let a basic problem reach the main branch.

The pipeline would install dependencies and run the project's available
typecheck and build commands in a consistent environment. It would give
authors and reviewers an early, visible result, so reviewers can spend less
time repeating basic checks and more time evaluating the change. CI can find
some problems, but it cannot decide whether a change is right for PREIShare.

## 2. Workflow triggers

The proposed workflow should run when a pull request is opened, updated, or
reopened. When an author pushes new commits, GitHub Actions should run the
checks again so the result reflects the latest proposed changes, not just the
first version of the PR.

The exact target branch or branches still need to be confirmed by the team.
This draft does not assume that the target is `main`.

## 3. Proposed CI check order

The proposed pipeline stages should run in this order:

1. **Checkout repository.** GitHub Actions retrieves the pull request's code
   so the runner can access the project files.
2. **Set up Node.js.** Configure Node.js before running npm commands. The
   exact Node.js version still needs to be selected and verified for
   compatibility with the project's dependencies and build tools.
3. **Install dependencies — `npm ci`.** This uses the existing
   `package-lock.json` to install the project's dependency versions. The
   typecheck and build need these dependencies, so installation comes before
   those checks.
4. **Typecheck — `npm run typecheck`** (runs `tsc --noEmit`). This checks
   TypeScript without producing build output. Running it before the build
   makes TypeScript problems clear before building the app.
5. **Build — `npm run build`** (runs `vite build`). This checks that the app
   can be built after the TypeScript check passes. We still need to confirm
   that it works in a clean environment without private Supabase credentials
   before relying on it as a credential-free PR check.

The exact script names in the current `package.json` are `typecheck` and
`build`, with commands `tsc --noEmit` and `vite build`. `npm ci` is the
proposed npm lockfile-based install command; it is not a `package.json`
script. Checkout and Node.js setup are workflow setup stages, not package
scripts. The project does not define scripts for linting or testing, so the
workflow should not include commands for those checks yet.

## 4. Dependency Caching Intent

GitHub Actions should cache npm dependency downloads to make future runs
faster. The cache key should be based on `package-lock.json`, so a lockfile
change can use a different cache. Caching does not
replace running `npm ci` on every workflow run. Do not cache build output in
a way that could hide problems or make a build look successful using
outdated files; every pull request should still receive a fresh build.

## 5. Checks not ready for automation

Linting and testing were identified as missing, and that is still accurate:
the current `package.json` has no `lint` or test script, and the inventory
does not identify a configured lint tool or test runner. These are future
improvements. The team should decide which tools and checks it wants, add and
verify the appropriate project scripts, and only then include them in CI.

This draft does not invent commands such as `npm run lint` or `npm test`.
Missing checks should be described as gaps, not treated as passing checks.

## 6. Environment and dependency requirements

- **Package manager and lockfile:** The project uses npm and has
  `package-lock.json`; the inventory found no pnpm or Yarn lockfile. The
  `package.json` also contains `pnpm.onlyBuiltDependencies` for `esbuild` and
  `lightningcss`. This setting applies to pnpm, not npm, so it does not change
  `npm ci` or the proposed `npm run` commands. It is not a package-manager
  conflict, though the team may want to confirm that the setting is still
  intentional.
- **Node.js version:** There is no Node.js version specified in
  `package.json`, and the repository has no `.nvmrc` or `.node-version`.
  The team still needs to choose and document a version, then verify that it
  is compatible with the project's dependencies and build tools.
- **Credentials and services:** Dependency installation and TypeScript
  checking do not themselves call Supabase or the embedding service. The
  build's behavior without private Supabase credentials has not been
  verified. CI must not assume it can run without them until that is checked.
  Supabase integration and embedding-generation checks are not current
  package scripts; those behaviors can need credentials and reachable
  external services. They should not be added to ordinary PR checks without
  a separate safe test plan. No real credentials or secret values belong in
  this document or in an ordinary PR workflow.

## 7. Failure policy

If dependency installation, typechecking, or an enabled build check fails,
the workflow should report that failure on the PR with a failing status and
logs that help the author see which check needs attention. Developers should
fix failures and update the PR. GitHub Actions should rerun the checks after
new commits are pushed, as well as when the PR is opened or reopened. Failed
checks should not be ignored or presented as successful.

A passing CI result only means that the automated checks which ran passed.
It does not automatically approve or merge the PR, or mean that the change
is correct. If passing checks must be required before merging, the repository
rules must be configured to require them; creating a workflow alone does not
set that policy.

## 8. Human review responsibilities

Reviewers still need to check code quality, functionality, security, and
whether the change meets the project's requirements. They should consider
whether the behavior is useful and correct for PREIShare, not only whether it
builds. Authors also need to explain their changes and respond to review
feedback.

AI-assisted reviews can help point out possible issues, but AI can miss
problems or be mistaken. People remain responsible for approving and merging
PRs.

## 9. Out of scope

This proposed PR pipeline does not include:

- Production deployment.
- Live Supabase database writes, migrations, or other changes to a shared or
  production database.
- Automatic PR approval or merging.
- Linting, tests, or any other checks with commands that have not been
  verified in the project.
- Checks that depend on Supabase, OpenAI, or other external services without
  a separately agreed safe test setup.

No YAML files or GitHub Actions workflows are part of this design draft.

## 10. Success criteria

The design will be successful when the team can implement it so that:

- Opening or updating a PR starts the same agreed checks in a clean
  environment, rather than relying on each teammate to remember them.
- Opening, updating, and reopening PRs triggers checks, and new commits cause
  the checks to run again.
- Checkout, Node.js setup, `npm ci`, `npm run typecheck`, and
  `npm run build` run in that order, with the build included only after
  confirming that it works without private Supabase credentials.
- The PR clearly shows which checks passed or failed, and a failure helps the
  author know what needs fixing before merge.
- The checks reduce repeated manual setup and basic build checking, leaving
  reviewers more time to assess correctness and usefulness.
- CI results support review without replacing human judgment, approval, or
  merge decisions.

Before the workflow is written, the team still needs to choose a Node.js
version and verify its compatibility, confirm the build works in a clean
environment without private Supabase credentials, and decide the PR target
branch or branches. The repository must also require passing checks in its
rules if that is the team's intended merge policy. Linting and tests can be
considered later, once their scripts and safe setup exist.
