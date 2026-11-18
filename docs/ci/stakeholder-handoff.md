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
updated with new commits, or reopened. The workflow file,
[`.github/workflows/pr-ci.yml`](../../.github/workflows/pr-ci.yml), defines
the automated checks that run on those pull requests. It runs one job named
**ci**.

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

People also remain responsible for handling secrets and environments safely.
Reviewers and maintainers need to decide which environment variables are
appropriate for CI and check whether a change uses them safely. They must make
sure private Supabase credentials and other secret values are not exposed, and
decide how checks that depend on services should be tested safely. Production
credentials and sensitive data should stay out of pull request workflows
unless a secure approach has been explicitly reviewed and approved.

## 5. Branch Protection and Maintainer Responsibilities

The workflow is configured for pull requests targeting `main`, which is the
proposed branch to protect. Maintainers and repository administrators should
use the [branch protection checklist](branch-protection-checklist.md) to
confirm which branches need protection and configure the intended rules.
They should:

- Confirm which branches need protection and whether `main` is the right
  target.
- Require the actual **ci** status check from the **PR CI** workflow. GitHub
  may show it as **PR CI / ci**.
- Decide whether a pull request branch must be up to date with its target
  branch before merging.
- Require human review and approval according to the team's agreed policy.
- Verify that a failed required check prevents merging.

Passing CI does not automatically approve or merge a pull request.
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
- Tests can sometimes fail inconsistently, which can make CI results harder
  to trust. This is a potential risk, not a claim that the current three
  listing validation tests are flaky. Maintainers should investigate and
  stabilize unreliable tests before making them required checks.
- Local commands and GitHub Actions commands need to stay consistent. If a
  script in `package.json` changes without a matching workflow or
  documentation update, developers and GitHub Actions could run different
  checks. The [CI scripts notes](ci-scripts-notes.md) help teammates reproduce
  the same checks locally; script drift has not been reported.

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

## Sprint 6 Artifact Index

- [PR Pain and Goals](pr-pain-and-goals.md) — Explains the original pull
  request problems and CI goals.
- [Pipeline Design](pipeline-design.md) — Documents the planned CI stages,
  order, and failure policy.
- [PR CI Workflow](../../.github/workflows/pr-ci.yml) — Contains the actual
  GitHub Actions workflow.
- [CI Scripts Notes](ci-scripts-notes.md) — Lists the commands developers can
  run locally.
- [Branch Protection Checklist](branch-protection-checklist.md) — Helps
  maintainers configure required checks and human review.
- [AI PR Review Prompts](ai-pr-review-prompts.md) — Contains the
  AI-assisted review prompts.
- [E2E Verification Log](e2e-verification-log.md) — Records what passed and
  what still needs verification.

## Topic 2: AI Review Overlay and Branch Protection Handoff

### What Topic 2 Added

Topic 2 added an AI-assisted pull request review process alongside the existing
Sprint 6 CI workflow. CI handles automated technical checks, while AI helps
identify possible issues and questions for human reviewers to investigate.
The AI review complements CI; it does not replace CI or make pull request
decisions.

### What the AI Can and Cannot Do

The AI Review Assistant can summarize changes, suggest findings, identify
possible risks, and ask questions. Possible findings must follow the required
format in [AI PR Review Prompts](ai-pr-review-prompts.md). Every finding must
use exactly these four fields:

- **Severity:** Use only `critical`, `high`, `medium`, or `low`.
- **Evidence:** Identify actual supporting code or supplied information and
  distinguish confirmed evidence from uncertainty or inference.
- **Category:** Use only `sign-in`, `money`, `privacy`, `product intent`, or
  `other`.
- **Question for human reviewer:** Ask a specific question for a person to
  investigate.

Findings need supporting code evidence or a quote from the supplied change.
When the supplied information does not support a finding, the assistant must
report `not-found` instead of inventing an issue. These findings are advisory
only and do not replace CI or the [Human Judgment Checklist](human-judgment-checklist.md).

The AI cannot:

- Approve pull requests.
- Merge pull requests.
- Formally request changes as a GitHub reviewer.
- Declare PREIShare safe or guarantee security.
- Replace human judgment.

An authorized **Human Reviewer** makes approval decisions, and an authorized
**Repository Maintainer** performs the final merge. These are the actual role
names defined in [PR Approval Roles](pr-approval-roles.md).

### Why Human Review Still Matters

Human reviewers must evaluate these areas separately:

- **Sign-in:** A human needs to check whether authentication and authorization
  work as intended and whether users can access information they should not
  see. Passing automated checks does not prove access rules are correct.
- **Money:** A human needs to review prices, calculations, and financial
  behavior because incorrect amounts or business logic could affect users and
  transactions, even if the code builds successfully.
- **Privacy:** A human needs to check whether personal information is being
  shared appropriately and whether members have authorized that sharing. Our
  planted email and phone example showed how a privacy problem could pass CI.
- **Product intent:** A human needs to determine whether a proposed change
  actually matches PREIShare's requirements and intended behavior. Working
  code is not necessarily the correct feature.

Human reviewers use [Human Judgment Checklist](human-judgment-checklist.md)
to evaluate these areas before deciding whether a pull request is acceptable.
The checklist gives them a process for recording a Pass, Fail, or Needs Info
result.

A passing CI check does not automatically mean a pull request is safe or
acceptable. [AI Review Orchestration](ai-review-orchestration.md) shows that
CI, AI advice, human judgment, approval, and merging are separate steps.
Each step needs its own responsible action rather than being treated as the
same as the others.

### Topic 2 Reading Paths

- `docs/ci/ai-pr-review-prompts.md` — Contains the standing AI review rules,
  task prompts, and required output shapes.
- `docs/ci/ai-review-overlay-brief.md` — Explains the goals and scope of the
  AI Review Overlay.
- `docs/ci/samples/README.md` — Documents the planted privacy teaching
  sample, its pull request, and its CI evidence.

Other useful Topic 2 references are
`docs/ci/human-judgment-checklist.md`,
`docs/ci/ai-review-orchestration.md`,
`docs/ci/pr-approval-roles.md`,
`docs/ci/branch-protection-checklist.md`,
`docs/ci/sample-pr-review/ai-findings.md`, and
`docs/ci/sample-pr-review/critique-and-prompt-revision.md`.

### Sample Pull Request and AI Review

The completed fictional privacy-review teaching example used this sample pull
request: https://github.com/matthewgarside/PREIShare-org-repo/pull/2. Its
sample branch was `docs/sample-planted-privacy`, and it targeted `main`.
The example intentionally included a privacy mistake involving fictional
member contact information.

The sample pull request was kept open and unmerged. The GitHub Actions
`PR CI / ci` check passed for the sample. The original AI review identified a
high-severity privacy concern. It identified the relevant email and phone
fields but did not name the literal fictional values.

The prompt pack was then revised in place to improve evidence specificity.
One re-run using the revised prompt named the fictional values and quoted the
relevant code. The AI did not approve or merge the pull request.

This example demonstrated why automated checks and AI review both need human
oversight. The passing CI check did not rule on the privacy problem, and the
AI finding still required a person to verify the code and make review
decisions. The recorded finding, critique, and revision are available in
[Sample AI Findings](sample-pr-review/ai-findings.md) and
[Critique and Prompt Revision](sample-pr-review/critique-and-prompt-revision.md).

### Branch Protection Enforcement

The source of truth for the saved settings is the `Enforcement record` in
[Branch Protection Checklist](branch-protection-checklist.md). The verified
facts are:

- Repository: `matthewgarside/PREIShare-org-repo`
- Visibility: Public
- Protected branch: `main`
- Configuration date: `2026-11-18`
- Configured by: `matthewgarside`
- GitHub screen: Settings → Branches → Classic branch protection rule
- Require a pull request before merging: saved
- Required human approvals: saved
- Approval count: 1
- Require passing status checks: saved
- Exact required check: `ci` (GitHub Actions)
- Workflow: `.github/workflows/pr-ci.yml`
- The rule and all three requirements remained enabled after the page was
  refreshed and reopened in Settings.
- No paid GitHub upgrade was purchased.

GitHub now enforces the three configured requirements: pull requests before
merging, one human approval, and a passing required `ci` status check. Review
procedures, including use of the human judgment checklist and AI review
runbook, are separate human responsibilities. The AI findings document is not
a required GitHub status check.

### Responsibilities and Remaining Limitations

GitHub enforces the configured pull-request, approval, and CI requirements,
while humans still follow [Human Judgment Checklist](human-judgment-checklist.md)
and [AI Review Orchestration](ai-review-orchestration.md) to evaluate and
approve changes.

Passing CI does not guarantee complete security, product correctness, or
releasability. The current automated checks do not cover every possible issue,
including all Supabase-related behavior or every privacy concern. Maintainers
should continue reviewing important changes and improving test coverage.

This handoff does not claim that the app has been fully security tested or that
all PREIShare problems have been resolved.

### Sprint 7 Next Actions

The existing pull-request CI workflow is already at
`.github/workflows/pr-ci.yml`, and the AI review prompt pack already exists at
`docs/ci/ai-pr-review-prompts.md`. The project also already has an existing
Vercel project and a recorded Production URL:
https://prei-share-org-repo-five.vercel.app/. Sprint 7 should build on these
pieces rather than recreate them.

1. Confirm the existing Vercel Production URL and verify that the current
   deployed application is reachable. Reuse the existing Vercel project;
   do not create a new hosting project.
2. Continue using the existing `.github/workflows/pr-ci.yml` workflow for new
   pull requests and investigate any failing required `ci` checks before
   merging.
3. Continue using the existing AI review prompt pack as an advisory review tool
   without granting AI approval or merge authority.
4. Have authorized humans follow [Human Judgment Checklist](human-judgment-checklist.md)
   and [AI Review Orchestration](ai-review-orchestration.md) before making
   merge decisions.
5. Maintain the saved branch protection requirements on `main`, including the
   pull-request requirement, one human approval, and passing `ci`.
6. Continue improving application functionality and test coverage based on
   actual Sprint 7 requirements rather than rebuilding completed Sprint 6 or
   Topic 2 infrastructure.
7. Keep the intentionally flawed sample privacy pull request open and unmerged.

### Topic 2 Handoff Summary

The team now has the existing automated PR CI workflow, AI-assisted review
instructions, a human judgment checklist, defined approval and merge
responsibilities, a completed teaching sample and critique, and saved branch
protection settings. Together, these pieces help prevent unreviewed or failing
changes from reaching `main`, while authorized people still make the final
review and merge decisions.
