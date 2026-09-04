# PREIshare onboarding

## What PREIshare is
PREIshare is the project repo for the PREIshare app and its contributor docs. Keep changes grounded in the repo map and project rules instead of guessing.

## Verified technology stack
- React 19
- TanStack Start
- TanStack Router with file-based routes
- TypeScript
- Vite
- Tailwind CSS v4
- npm

## Run or find scripts
Use the scripts defined in `package.json` and the onboarding docs. The supported commands in this repo are:
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run generate-routes`

If a command is not in `package.json` or the onboarding docs, do not assume it exists.

## Where onboarding docs live
- `docs/onboarding/repo-map.md` — repo layout and project map
- `docs/onboarding/team-orientation-notes.md` — team context and expectations
- `.cursor/rules/preishare.mdc` — repo-specific rules and guardrails

## Agent workflow
Follow this order on every task:
1. Plan: read the relevant docs and the exact files to be edited.
2. Small diff: keep the change narrow and justified.
3. Verify: run the smallest relevant command or check and report the result.

## Project structure
Keep the generated layout unless the repo map or a requirement says otherwise:
- `src/routes/`
- `src/router.tsx`
- `src/components/`
- `src/styles.css`
- `vite.config.ts`

## Safety boundaries
- Follow `.cursor/rules/preishare.mdc` as the source of truth for repo-specific rules.
- Prefer the repo’s documented conventions over inventing new patterns.
- Do not add secrets to client-exposed config; follow the env conventions already established by the repo.

## Final reminder
This repo is about PREIshare app work plus onboarding. Start with the onboarding docs and the project rules, then make a small, verifiable change.