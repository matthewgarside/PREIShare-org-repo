# Branch protection checklist (PREIshare)

## 1. Purpose

Branch protection adds rules that help stop a pull request from being merged
before important checks and reviews are complete. Requiring the CI check can
catch problems before broken code reaches a protected branch.

## 2. Branches to protect

The current workflow uses `main` as the proposed pull request target and
branch to protect for this assignment. The CI design document leaves the
target branch or branches undecided, so maintainers must confirm whether
`main` is correct and whether any other branches need protection before
creating rules. Do not treat this proposal as a confirmed team decision.

## 3. Required status checks

The current workflow is named **PR CI**. Its job ID is **ci**, and because
the workflow does not set a separate job display name, the job's display name
is also **ci**. The scaffold's former **Install dependencies** display name
is not present in the current workflow. The typecheck, build, lint, and test
commands are steps inside the one **ci** job; they are not separate workflow
jobs or separate status checks.

After PR CI has run on a pull request, require the GitHub status check for the
**ci** job before merging. The job check is **ci**; GitHub may display it
alongside the workflow name as **PR CI / ci**. Select the check that GitHub
lists for this workflow's **ci** job in the repository settings rather than
the old **Install dependencies** name or separate checks for each step.

## 4. Require branches to be up to date

GitHub can require a pull request branch to include the latest changes from
its target branch before it can be merged. This can help catch problems caused
by newer target-branch changes. Consider enabling this setting if the team
wants CI to check the pull request against the latest target branch. It can
also mean more CI runs when the target branch changes.

## 5. Human review requirements

A passing CI check does not prove that a pull request is correct or a good fit
for the project. Maintainers should consider requiring at least one human
approval before merging.

AI-assisted code reviews can help point out possible problems, but they can
miss things or be wrong. AI reviews must not replace human approval or make
merge decisions. They must not approve or automatically merge pull requests.
The team still needs to decide the exact human approval policy, such as how
many approvals to require.

## 6. How maintainers configure protection

Use this checklist after the team has agreed on the branches and review rules:

- [ ] Open the repository's **Settings** on GitHub.
- [ ] Find **Rules** or **Branches** and choose the option to add a ruleset or
  branch protection rule.
- [ ] Select the agreed branch or branches.
- [ ] Require pull requests before merging, and set the team's chosen human
  approval requirement.
- [ ] Require the status check for the **ci** job (displayed as **PR CI / ci**
  if GitHub includes the workflow name). Run the workflow on a pull request
  first if the check is not listed yet.
- [ ] Decide whether to require the pull request branch to be up to date before
  merging.
- [ ] Save the rule and confirm it applies to the intended branches.

The exact GitHub settings and labels may depend on the repository's
permissions and configuration. A maintainer with the needed access should
confirm the choices in GitHub; this checklist does not change repository
settings.

## 7. What Not to Require Yet

- **Deployment or production jobs:** The current CI pipeline checks code
  quality and builds the app. It does not deploy the application, so do not
  require deployment checks here.
- **Flaky or optional checks:** Do not require checks that are experimental
  or unreliable until they have been tested and work consistently.
- **Secrets in the PR workflow:** Do not add private Supabase credentials,
  production keys, or other secrets just to make a required check pass.
  Checks that need private services should be designed and reviewed
  separately.

## 8. Learner responsibilities and limitations

Students and contributors without repository administrator permissions can
prepare this checklist and help verify the intended rules. They may not have
permission to create or change branch protection themselves. Ask a repository
maintainer to review and apply the agreed settings.

This document is a guide only. It does not mean branch protection has already
been configured.

## 9. Verification checklist

After a maintainer applies the rules, confirm:

- [ ] The intended branches are protected.
- [ ] The required check is the actual **ci** job check from **PR CI**.
- [ ] A failed required CI check prevents merging.
- [ ] The chosen human review requirement works before merging.
- [ ] AI review does not approve or merge code.

## Enforcement record

- Repository: `matthewgarside/PREIShare-org-repo` (Public)
- Protected branch: `main`
- GitHub settings path: Settings → Branches → Classic branch protection rule
- Configured by GitHub user `matthewgarside` on 2026-11-18: opened Settings,
  configured and saved the rule, refreshed the page, and verified the
  protections remained enabled.
- Require a pull request before merging: saved
- Require human approvals: saved
- Required number of human approvals: 1. The roles document does not specify
  a numeric count; 1 was the assignment default and the number actually
  configured in GitHub Settings.
- Require status checks to pass before merging: saved
- Exact required status check: `ci` (GitHub Actions)
- Existing CI workflow: `.github/workflows/pr-ci.yml`
- Verification after refresh: the rule remained listed, and all three
  requirements remained enabled after reopening it.
- Payment status: No paid GitHub upgrade was purchased.

The authorized **Human Reviewer** makes approval decisions, and the authorized
**Repository Maintainer** makes merge decisions. The AI Review Assistant is
advisory only and cannot approve or merge; an AI review does not count as the
required human approval.

The required automated status check is `ci`, produced by the existing GitHub
Actions workflow. The sample AI review notes in
`docs/ci/sample-pr-review/ai-findings.md` are not a required GitHub status
check. AI-generated review notes are advisory documentation and do not replace
CI or human approval.

People must follow `docs/ci/human-judgment-checklist.md` and
`docs/ci/ai-review-orchestration.md` before deciding whether a pull request
should be merged. These documents guide human review even if a GitHub branch
protection setting cannot be saved or enforced; the review process must not be
bypassed because a technical rule is missing. For this repository, all three
required protections were successfully saved and verified. A passing CI check
does not make a privacy issue acceptable, and AI-generated findings are not
formal approval.

The intentionally flawed sample privacy pull request must remain open and
unmerged.
