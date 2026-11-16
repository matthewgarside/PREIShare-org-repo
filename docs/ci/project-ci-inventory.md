# PREIShare project CI inventory

## 1. Project overview

PREIShare is a TypeScript web app for an investor dashboard. It uses React,
TanStack Start, TanStack Router, and Vite. The goal for pull request CI is to
run the same useful checks for each change, catch basic problems before merge,
and leave reviewers more time to think about whether a change is right for the
product.

This is an inventory of what the repository has today. It does not create a
workflow or add missing checks.

## 2. Package manager and lockfile

- **Package manager:** npm. The repository has `package-lock.json`.
- **Other lockfiles:** No `pnpm-lock.yaml` or `yarn.lock` was found, so there
  is no lockfile conflict.
- `package.json` also has a `pnpm.onlyBuiltDependencies` setting. The npm
  lockfile is the only lockfile found, but the team may want to confirm that
  this pnpm-specific setting is still intentional.
- No Node.js version is specified in `package.json`; the CI setup will need to
  decide and document which version to use.

## 3. Available package.json scripts

These are the exact script names and commands in `package.json`:

| Purpose | Script name | Exact command |
| --- | --- | --- |
| Typechecking | `typecheck` | `tsc --noEmit` |
| Building | `build` | `vite build` |
| Linting | **MISSING** | **MISSING** |
| Testing | **MISSING** | **MISSING** |
| Development/start | `dev` | `vite dev --port 3000` |
| Route generation | `generate-routes` | `tsr generate` |
| Preview | `preview` | `vite preview` |

`package.json` does not define a lint or test script. No test runner or lint
tool is listed there. This inventory does not make up replacement commands.

## 4. Project structure and technologies

- The application source is in `src/`; no `app/` directory was found.
- `tsconfig.json` enables strict TypeScript checks and is used by the
  `typecheck` script.
- `vite.config.ts` configures Vite with the TanStack Start and React plugins.
- `app.config.ts` points TanStack Start at the router entry and route folders
  under `src/`.
- `tsr.config.json` identifies the router target as React.
- React, TanStack Start, TanStack Router, and Vite are also listed in
  `package.json`.
- Supabase source code is under `src/lib/`; SQL migrations are under
  `supabase/migrations/`.

## 5. Environment variables and CI considerations

`.env.example` exists. The application and environment documentation refer to
these variable names; no values are included here:

| Variable name | Use |
| --- | --- |
| `VITE_SUPABASE_URL` | Public Supabase project configuration |
| `VITE_SUPABASE_ANON_KEY` | Public Supabase anon-key configuration |
| `SUPABASE_URL` | Optional server-side URL override |
| `SUPABASE_ANON_KEY` | Optional server-side anon-key override |
| `SUPABASE_SERVICE_ROLE_KEY` | Privileged, server-only Supabase credential |
| `OPENAI_API_KEY` | Server-side key used by the embedding-generation code |

The Supabase variable names are listed in `.env.example` and
`docs/env-var-checklist.md`. `OPENAI_API_KEY` is read by
`src/lib/embeddings/generate.ts`; it is not listed in `.env.example`.
Variables starting with `VITE_` can be included in browser code, so they must
not contain private secrets. The service-role and OpenAI keys must stay
server-side.

Documentation about environment setup is in `docs/env-var-checklist.md` and
`docs/setup/supabase-env-checklist.md`. Normal app use of Supabase and
embedding generation can need credentials and reachable external services.
The typecheck and build scripts are not themselves integration-test scripts;
their success does not prove that Supabase authentication, database access,
or embedding calls work.

## 6. Headless-safe checks

These are reasonable first PR checks because they are available in the
repository and do not inherently need private credentials or a live service.
They support the goals in `pr-pain-and-goals.md` of catching problems before
merge, running checks consistently, and saving reviewers from repeating
basic checks by hand.

| Check | What exists now | Pain point or goal it helps |
| --- | --- | --- |
| Install dependencies | npm and `package-lock.json` are present; there is no install script in `package.json`. The workflow implementation still needs to choose its package-manager install step. | Reduces the need for each teammate to set up dependencies by hand. |
| Typecheck | Script `typecheck` runs `tsc --noEmit`. | Can catch TypeScript errors early and provide the same basic check on each PR. |
| Build | Script `build` runs `vite build`. Confirm during workflow setup that it succeeds in a clean environment without app credentials. | Can catch build problems before merge instead of making reviewers find basic build issues. |

There are no current test or lint scripts to list as headless-safe checks.
Do not treat their absence as a passing result.

## 7. Secret/service-dependent checks

These are not checks that the current package scripts run. They would need a
test or verification plan before being added to PR CI. This matters because a
problem can go unnoticed if important behavior is never checked, but putting
real service credentials in an unprotected PR job creates security and
reliability risks.

| Check or behavior | Dependency and risk |
| --- | --- |
| Supabase auth, listings, or database integration | Needs Supabase configuration and a reachable project/database. Tests must use a safe non-production project and carefully limited credentials. The service-role key is privileged and should not be added to an ordinary PR job. |
| Applying or testing SQL migrations against a live database | Needs a database with the expected PostgreSQL/pgvector setup. Running changes against a shared or production database from PR CI could be destructive. No migration script is defined in `package.json`. |
| Embedding generation | `src/lib/embeddings/generate.ts` calls an external embedding API and reads `OPENAI_API_KEY`. Such a check would need a protected key, network access, and controls for cost and provider outages. |

The current inventory does not recommend running these service-backed checks
in the first PR workflow. They need a separate safe test environment and an
agreed credential plan.

## 8. Human-only review items

CI can report whether commands pass, but it cannot decide whether a change:

- Meets the product requirements or is useful to PREIShare users.
- Has correct business behavior, including appropriate authorization and
  ownership rules.
- Has a clear and usable interface.
- Has acceptable risk or should be merged.

People still need to review changes, respond to feedback, and make approval
and merge decisions. This follows the goals in `pr-pain-and-goals.md` and
`ci-concepts-notes.md`; passing checks are not proof that a change is correct.

## 9. Missing scripts, risks, and next steps

- **Linting: MISSING.** The agreed PR goals include linting, but no lint script
  is present. The team needs to choose and add one before CI can run it.
- **Testing: MISSING.** The agreed PR goals include tests, but no test script
  or test runner is present in `package.json`. The team needs to decide what
  behavior to test and add a supported test setup before CI can run tests.
- **Node version is unspecified.** Pick a supported version for CI rather
  than guessing from this inventory.
- **Build without credentials is not verified here.** Confirm it in a clean
  environment before relying on it as a secret-free CI check.
- **Service-backed coverage is not available as a package script.** Decide
  later whether a separate, isolated Supabase/OpenAI test plan is worthwhile;
  do not use production services or privileged secrets for ordinary PR checks.
- Later workflow design should run only verified checks on PRs, report
  failures clearly, and keep human approval in charge. That directly addresses
  the goals of consistent checks, faster review, and catching problems before
  merge.

## Sources checked

- [`package.json`](../../package.json) and [`package-lock.json`](../../package-lock.json)
- [`src/`](../../src/), [`supabase/migrations/`](../../supabase/migrations/),
  [`tsconfig.json`](../../tsconfig.json), [`vite.config.ts`](../../vite.config.ts),
  [`app.config.ts`](../../app.config.ts), and [`tsr.config.json`](../../tsr.config.json)
- [`.env.example`](../../.env.example), [`docs/env-var-checklist.md`](../env-var-checklist.md),
  and [`docs/setup/supabase-env-checklist.md`](../setup/supabase-env-checklist.md)
- [`pr-pain-and-goals.md`](./pr-pain-and-goals.md) and
  [`ci-concepts-notes.md`](./ci-concepts-notes.md)
