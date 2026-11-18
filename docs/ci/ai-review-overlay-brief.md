# PREIShare AI Review Overlay Brief

## 1. Purpose

PREIShare is planning an AI-assisted review overlay to give human reviewers
another way to understand a pull request. It can summarize changes, point out
possible risks, and suggest questions to check. This should help people focus
on product behavior and issues that automatic checks may not catch. AI is a
helper, not a decision-maker.

## 2. Important Definitions

- **Pull request:** A proposal to change the shared project. The proposed
  changes are not part of the shared project until a person accepts and
  merges them.
- **CI check:** An automatic run of project commands on a proposed change. A
  passing check means those commands passed; it does not prove the change is
  correct or ready to merge.
- **Merge:** When a person accepts a pull request and adds its changes to the
  shared project.
- **Review comment:** A note on a pull request that describes a concern,
  question, or suggestion. It is not an approval or a merge.

## 3. Existing CI Foundation

The previous topic established the CI workflow and its supporting
documentation. The workflow is
`.github/workflows/pr-ci.yml`; the existing AI review prompt pack is
`docs/ci/ai-pr-review-prompts.md`.

The workflow installs dependencies with `npm ci`, then runs
`npm run typecheck`, `npm run build`, `npm run lint`, and `npm run test`.
These checks help find certain code, build, lint, and test problems. The AI
prompt pack is for review support beyond those automatic checks. We are
building on these existing pieces rather than replacing them or asking AI to
repeat CI.

The verification log records static checks of the workflow and earlier local
results reporting that all five commands passed. It also records a simulated
prompt exercise. A successful GitHub Actions run on a real pull request has
not been confirmed. Branch-protection and human-approval enforcement have
not been verified in GitHub either. Earlier dependency installation reported
vulnerability and install-script warnings; they were not resolved as part of
that verification.

## 4. Locked Files and Existing Artifacts

These are the five files reviewed for this brief. They must remain unchanged
during this planning step:

- `.github/workflows/pr-ci.yml`
- `docs/ci/branch-protection-checklist.md`
- `docs/ci/ai-pr-review-prompts.md`
- `docs/ci/e2e-verification-log.md`
- `docs/ci/stakeholder-handoff.md`

Only this planning brief is being created or changed now. The other planned
materials below are not being created in this step.

## 5. Planned AI Review Overlay Additions

The topic instructions identify these five additions for later steps:

1. A clear statement of who may approve a pull request and who may merge it.
2. A constrained system instruction with a required output shape, to be
   edited later in the existing `docs/ci/ai-pr-review-prompts.md` prompt pack.
3. A checklist for human judgment.
4. A practice review using a sample pull request.
5. An honest record of which branch-protection rules the GitHub plan actually
   saved.

These are planned additions, not existing features, and this brief does not
implement them.

## 6. What We Are Not Rebuilding

This topic does not recreate or replace:

- The existing GitHub Actions workflow.
- The current CI commands.
- The existing AI review prompt pack.
- The current branch-protection documentation.
- The verification work already completed and recorded.

The existing production URL also stays as it is; this topic does not create a
new hosting project.

## 7. Important Review Risks

AI-assisted review should pay attention to these PREIShare areas:

- **Sign-in:** Authentication, user sessions, and access to the right parts
  of the app.
- **Money:** Financial information, listing prices, and related business
  logic.
- **Privacy:** Supabase access, row-level security (RLS), personal
  information, and secret handling.
- **Product intent:** Whether a change meets PREIShare's requirements and
  helps users make better real-estate decisions.

AI can point out possible concerns, but it can miss problems or raise
incorrect ones. It cannot independently guarantee that code is correct or
secure. People must check its findings against the actual code and project
requirements.

## 8. Human Review and Merge Authority

- AI is only a review assistant.
- AI can summarize changes, identify possible risks, and suggest review
  questions.
- AI cannot approve pull requests.
- AI cannot merge pull requests.
- People must verify AI findings.
- Human reviewers are responsible for approval and merging.
- Passing CI does not automatically mean a change is safe or ready to merge.

## 9. Success Criteria

This planning brief is ready for the next steps when it clearly describes the
existing CI foundation, names all five planned additions from the topic
instructions, and separates current functionality from future work. It also
needs to explain PREIShare's main review risks, preserve the recorded
verification limits, and make human approval and merge authority clear.

This step is complete when this brief is the only file created or changed.
The later additions should be planned and reviewed separately; this brief
does not claim they have been implemented or that GitHub branch protection
has been verified.
