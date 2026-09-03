# PREIshare repository map

> Onboarding map for first contribution planning. Built with AI-assisted
> inventory + human path verification. Do not treat this as architecture law
> if the real tree disagrees—update this file when you learn more.

## Meta

- Clone path (from setup-log): `/Users/mattgarside/INFO3330/PREIShare-org-repo`
- Date mapped: `2026-09-03`
- Agent tool used: `GitHub Copilot`
- Mapper: `matthewgarside`

## 1. Overview (5–8 sentences)

PREIshare appears to be a single-package TanStack Start application, not a monorepo.
The product code lives mainly in `src/`.
No shared libraries or additional packages were found.
Documentation and onboarding notes live in `docs/`.
The application uses React, TypeScript, Tailwind CSS, and TanStack Router.
No database, Supabase, PostgreSQL, authentication, or CI integration was found.
This map documents the repository without changing application code.

## 2. Top-level inventory

| Path | Kind | One-sentence purpose | Verified by me? |
|------|------|----------------------|-----------------|
| `src/` | app | Main React and TypeScript application source | yes |
| `public/` | app | Static assets served by the application | yes |
| `docs/` | docs | Onboarding and project documentation | yes |
| `.git/` | other | Git repository metadata | yes |
| `AGENTS.md` | config | Agent instructions and project architecture notes | yes |
| `package.json` | config | Root package manifest, dependencies, and scripts | yes |
| `package-lock.json` | config | Locked npm dependency versions | yes |
| `vite.config.ts` | config | Vite, React, Tailwind, and TanStack Start configuration | yes |
| `tsconfig.json` | config | TypeScript compiler configuration | yes |
| `tsr.config.json` | config | TanStack Router file-route generation configuration | yes |
| `.cta.json` | config | TanStack CLI scaffold metadata | yes |
| `.gitignore` | config | Files excluded from Git, including `.env` files | yes |


## 3. Frontend concerns (TypeScript, React, TanStack Start)

- Likely app root: `src/`
- Clues:
  - `package.json` contains the React and TanStack Start dependencies.
  - `vite.config.ts` configures React, Tailwind, and TanStack Start plugins.
  - `tsconfig.json` provides TypeScript configuration.
  - `tsr.config.json` configures TanStack Router file-based routes.
- Entry / routes / UI areas:
  - `src/router.tsx` — router factory and routing entry point.
  - `src/routes/__root.tsx` — root route and shared layout.
  - `src/routes/index.tsx` — main index route.
  - `src/routes/about.tsx` — about route.
  - `src/components/` — shared React components.
  - `src/styles.css` — Tailwind CSS entry stylesheet.
- These files define the user-facing pages, layout, components, routing, and styling.

## 4. Backend / data concerns (Supabase, PostgreSQL, pgvector, APIs)

- Supabase or data configuration paths: not found.
- Migrations, SQL, or schema-related paths: not found.
- PostgreSQL or pgvector paths: not found.
- Environment examples: none found.
- `.gitignore` indicates that `.env` files are excluded from Git; no secret values were inspected.
- The blank scaffold currently has no database or production-data integration.

## 5. Tooling and CI

- TypeScript configuration: `tsconfig.json`
- Build and framework configuration: `vite.config.ts`
- TanStack Router configuration: `tsr.config.json`
- Linting configuration: not found.
- Formatting configuration: not found.
- CI workflows: none found under `.github/`.
- Editor configuration: none found under `.vscode/`.
- Agent configuration: `AGENTS.md`
- Scaffold metadata: `.cta.json`
- Root scripts from `package.json`:
  - `dev`
  - `build`
  - `preview`
  - `generate-routes`

## 6. Safe first-touch vs do-not-edit-yet

### Safe first-touch (good candidates for a tiny onboarding PR)

| Path or area | Why it is relatively safe | Risk if handled carelessly |
|--------------|---------------------------|----------------------------|
| `docs/onboarding/` | Documentation-only area for onboarding information | Misleading or outdated documentation |
| `src/routes/` | Application routes with focused user-facing scope | Broken navigation or page behavior |
| `src/components/` | Shared UI components | Visual or behavior regressions across pages |

### Do not edit yet (wait until you have tests, review, and a real task)

| Path or area | Why wait | What could break |
|--------------|----------|------------------|
| `package-lock.json` | Generated dependency lockfile | Installation failures or dependency drift |
| `vite.config.ts` | Shared build and framework configuration | Development or production builds |
| `tsr.config.json` | Route generation configuration | Generated route issues |
| `.cta.json` | Scaffold metadata | Tooling assumptions |
| `AGENTS.md` | Project-wide agent and architecture instructions | Incorrect future code changes |
| `.gitignore` | Repository-wide file exclusion rules | Accidental tracking of local or secret files |


## 7. Open questions for the team

- Which deployment target should receive the future TanStack Start adapter?
- Which pages and product features should be added beyond the current routes?
- Will a database, authentication provider, or other backend integration be introduced later?
- What linting and formatting standards should be adopted?

## 8. How I will use this map next

- Configure AI project rules and memory using the verified paths above.
- Pick a first contribution from `docs/onboarding/` or another low-risk area.
- Revisit this file whenever new routes, integrations, packages, or tooling are added.