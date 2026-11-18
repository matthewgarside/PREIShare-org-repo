# PREIshare Human Judgment Checklist

Passing the GitHub Actions **pr-ci** check does not guarantee that a pull
request is correct, secure, or ready to merge. CI mainly shows whether the
project's existing commands succeed. A human reviewer must still judge risks
that automated checks cannot understand, such as sign-in behavior, financial
information, privacy, and whether the change really fits PREIshare's purpose.

AI may suggest findings or questions, but only authorized humans may assign
final review outcomes. AI cannot approve pull requests, formally request
changes as a GitHub reviewer, or merge pull requests.

## How to use this checklist

1. Check the existing pr-ci result for the pull request.
2. Read any AI findings as suggestions that a human must verify.
3. Review the evidence for each section below.
4. Assign exactly one outcome to each section: **Pass**, **Fail**, or
   **Needs Info**.
5. Give the outcomes to the Human Reviewer for the pull request.

If the pr-ci check is red, the pull request is not ready for merge. A green
pr-ci check does not remove a human **Fail** or **Needs Info** outcome. A
pull request cannot merge until every section is Pass and all required human
review and merge steps are complete.

## 1. Sign-in

Authentication, user sessions, and account access are important because they
control who can enter an account and use account features. CI cannot prove
that a change keeps the wrong person out or prevents a signed-in user from
seeing or changing another person's account.

### Risks a human should consider

- Wrong-person sign-in or account takeover.
- Sessions that remain active after sign-out or when access should end.
- Screens or actions that fail to restrict access to the right account.
- Login, logout, password, or session behavior that does not match the
  expected user experience.

### Evidence a human should examine

- Relevant authentication and account-access code.
- Session creation, refresh, expiration, and sign-out handling.
- Routes or actions that require a signed-in user.
- Access restrictions that limit records and actions to the correct account.
- The pull request description and any documented sign-in requirements.
- The actual behavior of the changed sign-in or account screens when practical.

### What the AI cannot decide

The AI cannot guarantee that sign-in is safe or that sessions keep the wrong
person out. It cannot decide that authentication is correct and cannot assign
this section's outcome.

### Outcomes

- **PASS:** A human reviewer has enough evidence to determine that the change
  meets the sign-in and account-access requirements. The reviewer found no
  sign-in, session, or access problem that must be fixed.
- **FAIL:** A human reviewer identifies a sign-in, session, or account-access
  problem that must be fixed. A Fail blocks merging even if the existing
  pr-ci check is green.
- **NEEDS INFO:** There is not enough information or evidence to decide that
  sign-in, sessions, or account access meet the requirements. Needs Info blocks
  merging until the missing information is provided and reviewed.

## 2. Money

Listing prices, financial calculations, and business-related data need human
judgment because they can affect how users understand property costs or how a
PREIshare feature behaves. A passing CI check cannot tell whether an amount,
calculation, or financial rule is correct for the product.

### Risks a human should consider

- An incorrect listing price or another incorrect financial value.
- A calculation that adds, subtracts, rounds, or converts values incorrectly.
- Financial data shown to or changed by the wrong person.
- Validation that allows an invalid, misleading, or unsupported amount.
- A change that conflicts with documented business rules or requirements.

### Evidence a human should examine

- Listing values and other financial fields affected by the change.
- Calculation code and example inputs or expected outputs.
- Validation for missing, negative, unusually large, or incorrectly formatted
  values.
- Documented requirements, acceptance criteria, or business rules.
- The display and behavior of financial values in the actual application.

### What the AI cannot decide

The AI cannot determine that prices or financial calculations are correct.
It cannot decide which listing values or business rules are appropriate and
cannot assign this section's outcome.

### Outcomes

- **PASS:** A human reviewer has enough evidence to determine that the change
  meets the financial and business requirements for the affected values.
- **FAIL:** A human reviewer identifies an incorrect amount, calculation,
  validation, or financial rule that must be fixed. A Fail blocks merging even
  if the existing pr-ci check is green.
- **NEEDS INFO:** There is not enough information or evidence to decide whether
  the listing values, calculations, validation, or business rules are correct.
  Needs Info blocks merging until the missing information is provided and
  reviewed.

## 3. Privacy

Supabase access, row-level security, personal information, and secret handling
must receive human review because incorrect access or disclosure can expose
private information. CI cannot prove that every Supabase query or row-level
security rule protects data in every situation.

### Risks a human should consider

- Supabase or data access that lets the wrong person read or change records.
- Row-level security that is missing, incomplete, or contradicted by app code.
- Personal information displayed, logged, downloaded, or shared with the wrong
  audience.
- Secrets, credentials, or environment values exposed in code or review
  materials.
- A change that leaks private data through an error, public page, or shared
  interface.

### Evidence a human should examine

- Relevant Supabase access code and configured access rules.
- Row-level security policies or the documented expectations for record access.
- Code that handles personal information or displays it to a user.
- Logging, error handling, downloads, public routes, and API responses.
- Secret handling and whether credentials or private values appear in changed
  files or supplied review information.
- Documented data-access requirements and acceptance criteria.

### What the AI cannot decide

The AI cannot guarantee privacy or security, including Supabase access or
row-level security. It cannot inspect live policy behavior unless evidence is
supplied, and it cannot assign this section's outcome.

### Outcomes

- **PASS:** A human reviewer has enough evidence to determine that the change
  meets the relevant Supabase access, row-level security, personal-information,
  and secret-handling requirements.
- **FAIL:** A human reviewer identifies a privacy or security problem that must
  be fixed, such as wrong data access or exposed personal information or
  secrets. A Fail blocks merging even if the existing pr-ci check is green.
- **NEEDS INFO:** There is not enough information or evidence to decide that
  access and privacy protections are adequate. Needs Info blocks merging until
  the missing information is provided and reviewed.

## 4. Product Intent

A working application does not automatically mean that a change meets
PREIshare's actual goals. A feature can pass automated checks and still help
the wrong audience, solve the wrong problem, or conflict with the documented
purpose of helping people make better real-estate decisions using property and
market data.

### Risks a human should consider

- The change does not match PREIshare's documented requirements.
- The change helps a different type of user or changes a workflow without
  evidence that this is intended.
- The implementation works technically but does not solve the stated user need.
- Acceptance criteria are missing, unclear, or contradicted by the behavior.

### Evidence a human should examine

- PREIshare's documented requirements and product purpose.
- The pull request description and acceptance criteria.
- The affected design, route, component, or workflow.
- The actual behavior of the change when practical.
- Evidence that the intended users can complete the documented task.

### What the AI cannot decide

The AI cannot decide whether a feature is appropriate for PREIshare or its
intended users. It cannot create undocumented requirements and cannot assign
this section's outcome.

### Outcomes

- **PASS:** A human reviewer has enough evidence to determine that the change
  meets the project's documented requirements and makes sense for the intended
  users.
- **FAIL:** A human reviewer identifies a problem with product requirements or
  intended use that must be fixed. A Fail blocks merging even if the existing
  pr-ci check is green.
- **NEEDS INFO:** There is not enough information or evidence to decide whether
  the change meets PREIshare's requirements or is appropriate for its intended
  users. Needs Info blocks merging until the missing information is provided
  and reviewed.

## Human roles and accountability

- The **AI Review Assistant** may summarize changes and suggest findings or
  questions for this checklist. It does not assign outcomes, approve pull
  requests, request changes formally, or merge pull requests.
- The **PR Author** provides context and fixes problems identified during
  review or by CI.
- The **Human Reviewer** examines the AI findings and the actual evidence,
  assigns the Pass, Fail, or Needs Info outcome for each section, and provides
  formal human approval through GitHub when authorized.
- The **Repository Maintainer** confirms that required CI and human review
  requirements are satisfied. An authorized Repository Maintainer performs the
  final merge; no role except an authorized human maintainer performs the
  merge.

No specific person or GitHub permission is assumed. The team must confirm the
authorized Human Reviewer and Repository Maintainer for the pull request.

## Practice Example

**(Hypothetical) Change:** A developer updates the sponsor dashboard so users
can view property listings, but the new code accidentally allows one sponsor
to see another sponsor's listings.

**Checklist section:** Privacy

**Evidence:** During a manual review, the Human Reviewer finds that the
listing query is not properly restricted to the authorized sponsor, and the
required Supabase access controls do not prevent cross-sponsor access in this
hypothetical example.

**Human outcome:** Fail

**Reason:** This change could expose private listing information to the wrong
users. Even if the existing pr-ci check is green, the pull request cannot be
merged until the privacy issue is fixed and reviewed again.

*This is only a practice example, not a real PREIshare bug or pull request
review.*

## Merge boundary

- A **Fail** or **Needs Info** outcome blocks merging even when pr-ci is green.
- Needs Info remains blocking until the missing evidence is provided and a
  human reviews it again.
- The existing pr-ci check is not a manual checklist task. This document
  focuses only on human judgment that automated checks cannot make.
- Only the authorized Human Reviewer and Repository Maintainer roles described
  above have the human review and merge responsibilities.
