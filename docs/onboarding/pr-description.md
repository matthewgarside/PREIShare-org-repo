# Pull request description — first PREIshare contribution

**PR URL:** <!-- paste the GitHub PR URL after opening -->
**Base repository:** EdTechForLearning/PREIShare-org-repo
**Base branch:** main
**Head repository:** matthewgarside/PREIShare-org-repo
**Compare branch:** docs/first-contribution-matt
**Author:** matthewgarside
**Date opened:** 2026-09-03

## Problem
PREIshare had no clear, reviewed onboarding contribution from this engineer yet.
The team needs a small, low-risk change that proves the Git → review → merge path works
for a new teammate without touching product runtime code.

## Approach
- Added a personal entry to `CONTRIBUTORS.md` following the repo’s existing format.
- Kept the change scoped to documentation only.
- Followed the plan in `docs/onboarding/first-contribution-plan.md` and implementation notes in
  `docs/onboarding/first-contribution-notes.md`.

## What reviewers should look at
- [ ] `CONTRIBUTORS.md` — new entry is accurate and formatted like neighboring entries
- [ ] Diff contains only intended files
- [ ] Commit message explains why this onboarding change exists

## Test plan
1. Confirm the PR changes only the expected documentation file.
2. Verify the new `CONTRIBUTORS.md` entry renders as valid Markdown.
3. Check the diff for secrets, tokens, passwords, and local paths.
4. Optionally preview `CONTRIBUTORS.md` locally.

## Screenshots / notes
No UI screenshots; this is a documentation-only change.
Implementation decisions and verification notes are in
`docs/onboarding/first-contribution-notes.md`.

## Checklist before requesting review
- [ ] Feature branch is pushed and up to date with this description
- [ ] PR title is specific
- [ ] Description states the problem, approach, and test plan
- [ ] I can explain every staged line if asked