# PREIShare pull request approval roles

## 1. Purpose

PREIShare needs clearly defined approval and merging responsibilities so every
change is reviewed, checked, and merged by the right people. Clear roles help
the team avoid confusion about who may give feedback, who may approve a pull
request, and who may perform the final merge.

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

### Repository Maintainer

The Repository Maintainer confirms that the required CI check and human reviews
are satisfied. When authorized, the Repository Maintainer performs the final
merge. This role is the identifiable human role responsible for carrying out
the merge.

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
evaluate AI findings against the actual code and project requirements.

## 5. Allowed Pull Request and Merge Paths

### Example A: Normal PR

The PR Author submits changes. CI runs. The AI Review Assistant may suggest
findings. A Human Reviewer evaluates the changes and approves. The named
Repository Maintainer performs the final merge.

### Example B: Problems found

The PR Author submits changes. CI fails or a Human Reviewer identifies a
problem. The PR Author fixes the issue. CI reruns. A Human Reviewer evaluates
the result and approves. The named Repository Maintainer performs the final
merge.

Both successful merge paths end with an explicitly identified Repository
Maintainer role performing the merge. AI does not approve, formally request
changes, or merge in either path.

## 6. Alignment With Branch Protection

The PREIShare branch-protection checklist says that maintainers should consider
requiring at least one human approval before merging and that the **ci** status
check from the PR CI workflow should pass before merging.

The intended process requires:

- Passing the existing **ci** status check before merging.
- Human approval before merging.
- An authorized Repository Maintainer to perform the final merge.

These are documented requirements or recommendations. GitHub branch-protection
enforcement has not yet been verified. This document does not claim that the
settings are already enabled or that a real GitHub Actions result or human
review rule has been confirmed.

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
