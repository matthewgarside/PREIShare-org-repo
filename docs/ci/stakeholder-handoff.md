# PREIShare Sprint 6: CI Stakeholder Handoff

## 1. Project Overview

PREIShare is building a dashboard with TypeScript, React, TanStack Start, and
Supabase. During Sprint 6, the team worked on continuous integration (CI):
automatic checks that run when someone proposes a code change.

Before CI, teammates had to install dependencies and remember to run checks
themselves. This took time and could slow down pull request reviews. It also
meant that a check might be missed and a problem could go unnoticed. CI makes
the checks more consistent, while leaving decisions about the product to
people.

## 2. What We Built in Sprint 6

We created a GitHub Actions workflow named **PR CI**. It is configured to run
for pull requests targeting the proposed `main` branch when they are opened,
updated with new commits, or reopened. Its one job is named **ci**.

The workflow runs these steps in order:

1. **Checkout repository:** Gets the proposed code so the workflow can check
   it.
2. **Set up Node.js 24 with npm caching:** Prepares the JavaScript runtime and
   caches npm downloads to help later runs install faster.
3. **Install dependencies with `npm ci`:** Installs the exact package
   versions recorded in the project's lockfile.
4. **Run `npm run typecheck`:** Checks the TypeScript code for type-related
   problems without creating build files.
5. **Run `npm run build`:** Checks that the application can be built.
6. **Run `npm run lint`:** Looks for code issues covered by the project's
   lint rules.
7. **Run `npm run test`:** Runs the automated tests currently configured for
   listing validation.

The workflow runs again when a pull request is updated. If a newer run starts
for the same pull request, it cancels an older run that is no longer needed.

## 3. What Was Verified

The verification log records that the workflow configuration passed static
checks: it targets `main`, lists the expected pull request events, uses
Node.js 24 and npm caching, and contains the expected steps. It also confirms
the workflow has no production deployment or live Supabase database
operations.

All five local CI commands—`npm ci`, `npm run typecheck`, `npm run build`,
`npm run lint`, and `npm run test`—were reported as passing in earlier local
verification. The test command passed all three listing validation tests.
These are recorded local results, not proof that the workflow passed on
GitHub.

The simulated AI review stayed advisory: it raised items for a person to
check, did not claim a confirmed problem without evidence, and did not make an
approval or merge decision.

**A successful GitHub Actions run on an actual pull request has not yet been
verified.** The full end-to-end CI process has therefore not been confirmed
on GitHub.

## 4. What Humans Still Control

CI can catch some technical problems, but it does not replace people.
Reviewers still decide:

- Whether a change meets PREIShare's requirements.
- Whether authentication and Supabase access are safe.
- Whether database migrations are appropriate.
- Whether the application works correctly for users.
- Whether a pull request should be approved or merged.

AI-assisted review prompts can help reviewers spot possible risks and think
of questions. AI suggestions need to be checked by a person. AI cannot approve
or merge a pull request, and it does not take away the human reviewers'
responsibility.

## 5. Branch Protection and Maintainer Responsibilities

The workflow is configured for pull requests targeting `main`, which is the
proposed branch to protect. Maintainers should:

- Confirm which branches need protection and whether `main` is the right
  target.
- Identify the actual required status check for the **ci** job. GitHub may
  show it as **PR CI / ci**.
- Decide whether a pull request branch must be up to date with its target
  branch before merging.
- Consider requiring human approval.
- Verify that a failed required check prevents merging.

**Branch protection has not been confirmed as enabled.** The checklist is
guidance; it does not change repository settings. A maintainer with the
necessary permissions needs to check and configure those settings. Contributors
without administrator permissions may only be able to prepare documentation
and recommendations.

## 6. Current Limitations

- A GitHub Actions run on a real pull request has not been verified.
- Branch protection and enforcement of human approval have not been verified.
- The current automated tests cover only a small part of the application:
  three listing validation tests.
- Supabase-dependent behavior, including authentication and database access,
  is not fully covered by CI tests.
- Actual GitHub Actions logs have not yet been reviewed for unexpected
  sensitive information.
- Earlier `npm ci` output reported 15 dependency vulnerabilities and
  install-script warnings for `esbuild` and `fsevents`. These warnings need
  further investigation; they were not resolved as part of the verification.

## 7. Recommended Next Steps

Maintainers or the next sprint should:

1. Run GitHub Actions on an actual pull request targeting `main`.
2. Confirm all automated checks pass on GitHub's runners.
3. Confirm the correct CI status check is available for branch protection.
4. Review and configure branch protection with the appropriate permissions.
5. Review the npm dependency vulnerability warnings.
6. Expand automated test coverage for important PREIShare functionality.
7. Consider safe testing approaches for authentication and Supabase access.
8. Continue using the AI review prompts as assistance for human reviewers.

## 8. Handoff Summary

Sprint 6 created the **PR CI** GitHub Actions workflow, documented its checks,
recorded passing local results, and tried an AI review prompt that remained
advisory. The workflow configuration and local checks have been reviewed, but
a successful run on a real GitHub pull request has not been confirmed.
Maintainers still need to verify the workflow on GitHub and decide and confirm
the branch protection and review settings before treating CI as an enforced
merge requirement.
