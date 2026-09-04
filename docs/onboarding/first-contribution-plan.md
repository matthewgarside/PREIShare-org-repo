# First contribution plan — PREIshare onboarding

## Author
- Name / GitHub handle: matthewgarside
- Feature branch: `docs/first-contribution-matthewgarside`
- Date: 2026-09-03

## One-sentence goal
Add myself as a new contributor in `CONTRIBUTORS.md` and make one minimal, reviewable documentation touch so the team can practice review on a small first PR.

## Why this surface (link to prior artifacts)
- From `docs/onboarding/repo-map.md`: "Documentation and onboarding notes live in `docs/`. Safe first-touch: `docs/onboarding/` is a documentation-only area for onboarding information with minimal risk of breaking product behavior."
- From `docs/onboarding/team-orientation-notes.md`: "My first reviewed PR is done only when all of the following are true: Scoped (intentionally small, e.g. onboarding docs or a contributors list), Isolated (work on a feature branch), Described, Reviewable (under 10 minutes), Verified (re-read diff myself), Aligned (matches team conventions)."
- From `docs/onboarding/ai-tooling-verification.md`: "Decision: GO for using this AI tooling on the first contribution. All four critical checks passed, including safety and repo-path awareness. The tool is suitable for a small, scoped contribution in the documented surfaces of the repo."

## In scope (only these)
1. Create `CONTRIBUTORS.md` at the repository root with my name, GitHub handle, and a one-line role (e.g., "Onboarding engineer, INFO3330").
2. No optional second touch in this first implementation—keep it to one file only.
3. Capture implementation notes later in `docs/onboarding/first-contribution-notes.md` (next step—not done here).

## Out of scope (explicitly not this PR)
- Auth, sessions, or environment secrets (`.env` files, API keys, tokens)
- Database schema, migrations, Supabase policies, pgvector, or any data-layer work
- Dependency upgrades, `package-lock.json` churn, or build-tool config changes
- Multi-package refactors, renames, or repository-wide formatting
- CI/CD workflow edits (`.github/workflows/`) unless a mentor explicitly assigns them
- Unrelated "drive-by" fixes or scope creep
- Changes to `AGENTS.md`, `.cursor/rules/preishare.mdc`, or `docs/onboarding/repo-map.md` (sources of truth; update only after mentor review)

## Likely files to change
| File | Action | Why |
|------|--------|-----|
| `CONTRIBUTORS.md` | create | Add my contributor entry (matthewgarside, role: Onboarding engineer) |
| n/a | n/a | Keeping scope to one file only for first contribution |

## Acceptance criteria
- [ ] I am on feature branch `docs/first-contribution-matthewgarside` (created from updated default branch, not the default branch itself).
- [ ] `CONTRIBUTORS.md` exists at the repository root and lists my name `matthewgarside` and role in consistent Markdown or plain-text format.
- [ ] `git diff` shows only `CONTRIBUTORS.md` modified; no secrets, `.env` files, or generated build artifacts are included.
- [ ] No unrelated edits or "while I was here" changes are present.
- [ ] A teammate can review the diff in under 10 minutes without product-context deep dives.

## Verification plan (how I will know it worked)
1. Run `git branch` and confirm output shows `* docs/first-contribution-matthewgarside` (asterisk indicates current branch).
2. Run `git status` and confirm only `CONTRIBUTORS.md` (new file) appears in "Untracked files" or "Changes not staged".
3. Open `CONTRIBUTORS.md` in the editor and confirm my entry renders cleanly as plain Markdown with name and role.
4. Run `git diff HEAD` (or `git diff` if committing for the first time) and skim output; confirm no files outside the table above appear.
5. Confirm no `.env`, secrets, or generated artifacts are in the diff.

## Risks and mitigations
- **Risk:** Accidentally edit the default branch instead of the feature branch. **Mitigation:** Check `git branch` output at the start of each work session; confirm the asterisk points to `docs/first-contribution-matthewgarside`.
- **Risk:** Agent or editor scope-creep into product code. **Mitigation:** Refuse diffs that touch `src/`, `vite.config.ts`, `tsconfig.json`, `tsr.config.json`, or any file outside `docs/onboarding/` or root configs; re-prompt with the out-of-scope list.
- **Risk:** `.env` or secrets accidentally included. **Mitigation:** Treat `.gitignore` as law; never paste credentials, API keys, or tokens into the file or prompts.

## Definition of done for this planning step
- [ ] Feature branch `docs/first-contribution-matthewgarside` created from updated default branch.
- [ ] This plan file saved at `docs/onboarding/first-contribution-plan.md` with all sections filled (no angle-bracket or `<...>` placeholders remain).
- [ ] I understand the out-of-scope list and can explain why each item is excluded.
- [ ] I am ready to implement the changes in the next step without re-deciding scope.
- [ ] Next step: create the feature branch locally, add my entry to `CONTRIBUTORS.md`, commit, push, and open a pull request.