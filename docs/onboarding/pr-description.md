# Pull request description — first PREIshare contribution

**PR URL:** <!-- paste the live GitHub PR URL here -->
**Base repository:** EdTechForLearning/PREIShare-org-repo
**Base branch:** main
**Head repository:** matthewgarside/PREIShare-org-repo
**Compare branch:** docs/first-contribution-matt
**Author:** matthewgarside
**Date opened:** 2026-09-03

## Problem
PREIshare needed a small, reviewed onboarding contribution to demonstrate the
Git → review → merge workflow for a new teammate.

## Approach
- Added a personal entry to `CONTRIBUTORS.md`.
- Documented this pull request in `docs/onboarding/pr-description.md`.
- Kept the change limited to documentation.
- Used the existing onboarding plan and implementation notes.

## What reviewers should look at
- [ ] The `CONTRIBUTORS.md` entry is accurate and matches neighboring entries.
- [ ] The diff contains only the intended documentation files.
- [ ] The commit message explains why this onboarding change exists.

## Test plan
1. Confirm the PR changes only `CONTRIBUTORS.md` and this description.
2. Verify both files render as valid Markdown.
3. Check the diff for secrets, tokens, passwords, and local paths.
4. Confirm the branch and fork metadata match the live PR.

## Screenshots / notes
No UI screenshots; this is a documentation-only change.

## Checklist before requesting review
- [ ] Live PR URL has replaced the placeholder above.
- [ ] Feature branch is pushed and up to date.
- [ ] PR title is specific.
- [ ] Description states the problem, approach, and test plan.
- [ ] I can explain every changed line.