# CI scripts notes

## Purpose

These notes explain the commands PREIShare runs in pull request CI. Keeping
them documented makes it easier for teammates to understand what each check
does and reproduce a failure locally.

## Package manager and environment

The project uses npm and the `package-lock.json` lockfile. CI uses Node.js 24
and runs `npm ci` to install the locked dependency versions. Using Node.js 24
locally helps make local results more like CI.

## CI commands

The workflow runs these commands in order:

1. `npm ci`
2. `npm run typecheck`
3. `npm run build`
4. `npm run lint`
5. `npm run test`

Each command must succeed for the CI job to pass.

## What each command does

- **`npm ci`** installs the exact dependencies recorded in
  `package-lock.json`, giving CI a clean, repeatable install.
- **`npm run typecheck`** runs `tsc --noEmit` to check TypeScript types without
  generating output files.
- **`npm run build`** runs `vite build` to create the production app and catch
  build problems.
- **`npm run lint`** runs `eslint .` to check project files for configured
  code issues.
- **`npm run test`** runs `tsx --test src/lib/listings/schema.test.ts` with
  Node's built-in test runner to check listing validation behavior.

## Running checks locally

Use Node.js 24, open a terminal at the repository root, and run the same
commands in the same order:

```sh
npm ci
npm run typecheck
npm run build
npm run lint
npm run test
```

If a command fails, fix that check before moving on. Running the same command
locally can help reproduce the error shown in the GitHub Actions logs.

## Test coverage

The current tests focus on listing validation. They check that a valid listing
is accepted and text fields are trimmed, a negative asking price is rejected,
and an update with only its ID is rejected as incomplete.

These three tests cover only a small part of PREIShare. They do not test the
whole application or all listing behavior.

## Current limitations

The listing schema tests run without a browser, Supabase credentials, or
external services. They do not cover Supabase authentication or database
access, SQL migrations, or embedding generation, which can require a safe
test service, credentials, or external network access.

The build command has been run locally, but its behavior in a clean CI
environment without Supabase credentials has not been confirmed. Passing
build, typecheck, lint, or test commands also does not prove that the entire
app is correct. CI supports review; it does not replace human code review.

## Troubleshooting

If a check fails, read the failed step and error in the CI log, then run that
same command locally. Check that you are using Node.js 24 and that your
dependencies are installed from the current lockfile. Fix the underlying
problem rather than skipping the check, then rerun the commands that failed.
If the failure depends on a service or environment setting, ask the team
before adding credentials or changing the CI environment.
