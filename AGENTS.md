# PREIshare onboarding

## What PREIshare is
PREIshare is the PREIshare app repo and its onboarding/docs. It is currently a single-package TanStack Start app with product code in `src/` and project guidance in `docs/`. The repository is not a monorepo and it does not yet appear to include a full data layer implementation.

## Verified technology stack
- React 19
- TanStack Start
- TanStack Router with file-based routes
- TypeScript
- Vite
- Tailwind CSS v4
- npm

## Current data-layer status
The repo map names the intended data-layer concerns as:
- Supabase
- PostgreSQL
- pgvector
- APIs

Those concerns are part of the planned product direction, but they are not currently implemented in the blank scaffold. Do not assume a database, ORM, migration workflow, or API layer exists unless the task or repo state explicitly adds it. Do not invent Prisma or other data-layer tooling.

## Run or find scripts
Use only the scripts defined in `package.json` and the onboarding docs:
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run generate-routes`

If a script is not in the repo map or `package.json`, do not assume it exists.

## Where onboarding docs live
- `docs/onboarding/repo-map.md` — repo map and verified inventory
- `docs/onboarding/team-orientation-notes.md` — team context and working expectations
- `.cursor/rules/preishare.mdc` — repo-specific rules and guardrails

## Agent workflow
Follow this order on every task:
1. Plan: read the relevant docs and the exact files to be edited.
2. Small diff: keep the change narrow and justified.
3. Verify: run the smallest relevant command or check and report the result.

## Repo shape
The current app layout is:
- `src/` — app source
- `src/routes/` — route files
- `src/router.tsx` — router entry
- `src/components/` — shared UI components
- `src/styles.css` — styling entry
- `vite.config.ts` — Vite and app config
- `tsconfig.json` — TypeScript config
- `tsr.config.json` — TanStack Router config

## Safety boundaries
- Treat `docs/onboarding/repo-map.md` and `.cursor/rules/preishare.mdc` as the source of truth.
- Prefer the repo’s documented conventions over inventing new patterns.
- Do not add database, API, or secret setup assumptions unless the task explicitly requires them.
- Do not freeze the repo as “no database” in a way that ignores the intended future data-layer concerns.

## Final reminder
Keep the repo memory short, verified, and task-focused. Read the onboarding docs first, follow `.cursor/rules/preishare.mdc`, and make a small, verifiable change.