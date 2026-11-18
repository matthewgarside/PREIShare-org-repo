# PREIShare AI Review Orchestration Runbook

## 1. Purpose and What This File Is Not

This runbook explains how a PREIShare pull request moves through automated
checks, an optional AI-assisted review, human judgment, approval, and merging.
Follow the steps in order; people remain responsible for every review decision.

This is a manual, human-directed process. It:

- Does not create a new GitHub Actions workflow or replace the existing CI
  system.
- Does not automatically send pull request content to an AI or post AI review
  comments on GitHub.
- Does not let AI formally request changes, approve a pull request, or merge
  it.
- Does not make a passing CI check proof that a change is correct or ready to
  merge.

## 2. Existing Pieces Used

This runbook uses the following existing files; it does not duplicate or
replace them:

- [`.github/workflows/pr-ci.yml`](../../.github/workflows/pr-ci.yml) runs the
  automated `PR CI` workflow and its `ci` job for pull requests to `main`.
  The job installs dependencies and runs typecheck, build, lint, and test
  commands.
- [`docs/ci/ai-pr-review-prompts.md`](ai-pr-review-prompts.md) contains the
  AI's standing instructions and review prompts.
- [`docs/ci/pr-approval-roles.md`](pr-approval-roles.md) defines human
  approval and merge responsibilities.
- [`docs/ci/human-judgment-checklist.md`](human-judgment-checklist.md) guides
  human judgment about sign-in, money, privacy, and product intent.
- [`docs/ci/ai-review-overlay-brief.md`](ai-review-overlay-brief.md) explains
  the purpose and boundaries of the AI review overlay.

## 3. Who May Act

The role names below are the exact role names in
[`docs/ci/pr-approval-roles.md`](pr-approval-roles.md).

- **PR Author:** Opens the pull request, explains the change, responds to
  feedback, and fixes problems found by CI or review. This role does not
  include formal approval or the final merge.
- **AI Review Assistant:** May summarize supplied information and suggest
  possible findings or questions. It is an advisor only; it has no authority
  to make GitHub review or merge decisions.
- **Human Reviewer:** Reviews the code, CI results, requirements, and AI
  suggestions. Only an authorized Human Reviewer may formally approve the pull
  request. The person authorized for a particular review must be confirmed;
  this runbook does not assign names or GitHub permissions.
- **Repository Maintainer:** Confirms required checks and human review are
  satisfied. Only an authorized Repository Maintainer may perform the final
  merge. The person and their GitHub permissions must be confirmed.

## 4. Where to Click in GitHub

1. Sign in to GitHub and open the PREIShare repository.
2. Select **Pull requests** in the repository navigation.
3. Select the title of the pull request you are reviewing.
4. Read the pull request description. Open **Files changed** to inspect the
   proposed code changes.
5. Find the automated checks on the pull request. Open its **Checks** section
   or **Checks** tab if shown. Look for the workflow named **PR CI** and its
   job named **ci**.
6. To inspect the full run, select the **Actions** tab in the repository,
   open the **PR CI** run for this pull request, and select the **ci** job.
   The job steps show which commands ran and their results.
7. Check the displayed status: passed, failed, or still running. A running
   check is not a passed check. Do not assume a result before one is shown.
8. If an AI review would help, open a separate chat assistant yourself.
   Copy the standing system instructions from
   [`docs/ci/ai-pr-review-prompts.md`](ai-pr-review-prompts.md), choose the
   appropriate review task, and provide only the relevant sanitized pull
   request description and code changes.
9. Return to the pull request. Check any AI suggestions against the actual
   code and project requirements, then make the human review decisions
   described below. AI suggestions are not GitHub review actions.

## 5. Never Paste Sensitive Information

**Never Paste** any of the following into an AI chat:

- Passwords.
- API keys.
- Supabase service-role keys.
- Access tokens or session tokens.
- Private environment variable values.
- `.env` or `.env.local` file contents.
- Private customer or member information.
- Any other confidential project data.

Share only the relevant code or descriptions needed for the review, and
sanitize them first. If a change contains sensitive information, leave that
information out of the chat and ask an appropriate human how to handle it.

## 6. Six-Stop Review Sequence

### Stop 1: Wait for CI

When a pull request is opened or updated, wait for the existing `ci` job to
finish. Do not treat a check that is still running as a passed check.

### Stop 2: Understand the CI Result

- A green check means the automated commands passed.
- A red check means a command failed and needs attention.
- Neither result is an approval or a merge decision.
- Fix a failed required check and rerun it successfully before merging.

### Stop 3: Human Starts the AI Review

A human manually opens a separate chat assistant and provides the standing
system instructions from
[`docs/ci/ai-pr-review-prompts.md`](ai-pr-review-prompts.md). The human chooses
the appropriate review task and supplies only relevant, sanitized pull
request information. The AI may identify possible risks, evidence, and
questions. It cannot formally request changes, approve, or merge.

### Stop 4: Human Completes the Judgment Checklist

The Human Reviewer uses
[`docs/ci/human-judgment-checklist.md`](human-judgment-checklist.md) to
evaluate sign-in, money, privacy, and product intent. A human assigns each
section **Pass**, **Fail**, or **Needs Info**, and verifies AI findings against
the evidence.

**Fail** and **Needs Info** both block merging, even when CI is green. Resolve
the problem or missing information and have a human review it again before
proceeding.

### Stop 5: Authorized Human Approval

Only an authorized **Human Reviewer** may formally approve the pull request.
Approval must wait until the required CI checks have passed and every section
of the human judgment checklist is **Pass**. An AI response or comment is not
an approval.

### Stop 6: Authorized Maintainer Merges

Only an authorized **Repository Maintainer** performs the final merge. Merging
requires the required CI check to have passed and the required human approval
to be in place. The AI must not merge or recommend bypassing the review
process.

## 7. Roles Critique

Checked against [`docs/ci/pr-approval-roles.md`](pr-approval-roles.md):

- The approver role matches the existing role map: **YES** — authorized Human
  Reviewer.
- The merger role matches the existing role map: **YES** — authorized
  Repository Maintainer.
- AI is only an advisor: **YES**.
- AI cannot formally request changes as a GitHub reviewer: **YES**.
- AI cannot approve pull requests: **YES**.
- AI cannot merge pull requests: **YES**.
- Every successful merge path ends with an authorized Repository Maintainer
  performing the merge: **YES**.

## 8. Current Limitations

The workflow and review process are documented, but the existing documentation
does not verify a successful real GitHub Actions pull request run or confirm
that branch-protection rules are enforced in GitHub. This runbook does not
claim the process has been fully tested on GitHub. Confirm the actual check
results and required human permissions for each pull request.
