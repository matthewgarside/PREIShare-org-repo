# PREIShare pull request approval roles

## 1. Purpose

This document follows the existing AI Review Overlay plan in
[`docs/ci/ai-review-overlay-brief.md`](ai-review-overlay-brief.md). PREIShare
needs clearly defined approval and merging responsibilities so every change is
reviewed, checked, and merged by the right people. Clear roles help the team
avoid confusion about who may give feedback, who may approve a pull request,
and who may perform the final merge.

This document does not start a new PREIShare project, create a second CI
design, or replace the existing GitHub Actions workflow. It also does not
change GitHub repository settings and does not enable branch protection.

This document only defines responsibilities for the existing AI Review
Overlay. It does not edit [`.github/workflows/pr-ci.yml`](../../.github/workflows/pr-ci.yml)
or change the existing **ci** status check.

## 2. Approve vs. Merge

- **Approve:** A human reviewer examines the proposed changes and formally
  indicates that they accept the changes. An approval is a review decision.
- **Merge:** An authorized person combines the approved changes into the target
  branch.

Approve and merge are different actions. Approval does not automatically merge
a pull request. CI passing, an AI comment, or human feedback also does not
automatically merge a pull request.

## 3. Four Review Roles

### PR Author

The PR Author creates the pull request, explains the changes, and fixes
problems found by CI or human review. The PR Author may provide context and
respond to feedback, but the role does not include formal approval or the
final merge.

The existing overlay and branch-protection documents do not assign a specific
person as the PR Author. The person who submits a particular pull request fills
this role.

### AI Review Assistant

The AI Review Assistant summarizes changes, identifies possible risks, and
suggests questions or findings for human reviewers to examine. AI findings are
advice only. The AI Review Assistant may give feedback, but it cannot provide
formal approval or make merge decisions.

### Human Reviewer

The Human Reviewer reviews functionality, security, requirements, and CI
results. An authorized Human Reviewer may formally approve the pull request or
request changes through GitHub. The Human Reviewer's approval is separate from
the final merge.

The existing documents do not name a specific Human Reviewer or assign exact
human approval permissions. The team must confirm the Human Reviewer for the
review process before the person is treated as an authorized approver.

### Repository Maintainer

The Repository Maintainer confirms that the required CI check and human reviews
are satisfied. When authorized, the Repository Maintainer performs the final
merge. This role is the identifiable human role responsible for carrying out
the merge.

The existing documents identify "a maintainer" as the person who has the needed
GitHub access to review and apply repository settings, but they do not provide
a person's name or confirm a specific maintainer's permissions. The team must
confirm the authorized Repository Maintainer and that person's GitHub merge
permissions.

In summary:

- PR Authors and AI Review Assistants may explain or suggest findings.
- Human Reviewers provide human review feedback and can give formal approval
  when authorized.
- Repository Maintainers confirm requirements and perform the final merge when
  authorized.
- No role except an authorized human maintainer performs the merge.

## 4. AI Restrictions

- AI must not approve pull requests.
- AI must not request changes as a GitHub reviewer.
- AI must not merge pull requests.

AI may suggest findings in a review comment, but those comments are not
approvals, formal requests for changes, or merge decisions. People must
evaluate AI findings against the actual code and project requirements. Human
reviewers make the actual review decisions.

## 5. Allowed Pull Request and Merge Paths

### Example A: Normal PR

The PR Author submits changes. The existing **ci** status check runs. The AI
Review Assistant may suggest findings. A Human Reviewer evaluates the changes
and approves. The authorized and confirmed Repository Maintainer performs the
final merge.

### Example B: Problems found

The PR Author submits changes. The existing **ci** status check fails or a
Human Reviewer identifies a problem. The PR Author fixes the issue. CI reruns.
A Human Reviewer evaluates the result and approves. The authorized and
confirmed Repository Maintainer performs the final merge.

Both successful merge paths end with an explicitly identified Repository
Maintainer role performing the merge. AI does not approve, formally request
changes, or merge in either path.

## 6. Alignment With Branch Protection

[`docs/ci/branch-protection-checklist.md`](branch-protection-checklist.md)
documents the intended branch-protection process. It says that maintainers
should consider requiring at least one human approval before merging and that
the existing **ci** status check from the PR CI workflow should pass before
merging.

The intended process requires:

- Passing the existing **ci** status check before merging.
- Human approval before merging.
- An authorized Repository Maintainer to perform the final merge.

These are documented requirements or recommendations. GitHub branch-protection
enforcement has not yet been verified. This document does not claim that the
settings are already enabled or that a real GitHub Actions result or human
review rule has been confirmed.

This document does not change GitHub repository settings. It does not enable
branch protection. It does not edit [`.github/workflows/pr-ci.yml`](../../.github/workflows/pr-ci.yml).

## 7. Accountability

- **Fixing code problems:** The PR Author fixes problems identified by CI or
  human reviewers and updates the pull request.
- **Reviewing AI findings:** The Human Reviewer checks whether AI findings are
  accurate and relevant, comparing them with the code and PREIShare
  requirements.
- **Checking authentication and Supabase access risks:** The Human Reviewer
  checks sign-in, sessions, Supabase access, and row-level security risks.
- **Evaluating product requirements:** The Human Reviewer evaluates whether the
  change matches PREIShare's product requirements and helps users make better
  real-estate decisions.
- **Giving formal approval:** An authorized Human Reviewer gives formal approval
  through GitHub.
- **Performing the final merge:** An authorized Repository Maintainer performs
  the final merge after the required checks and human approval are satisfied.
