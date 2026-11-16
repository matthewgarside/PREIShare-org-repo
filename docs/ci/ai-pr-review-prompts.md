# AI-assisted PR review prompts (PREIshare)

## 1. Purpose

PREIShare uses these prompts to help teammates look at a pull request from
another angle and spend more review time on whether a change makes sense for
the product. AI can summarize a diff, point out areas to check, and suggest
questions for the author. It is a helper, not a decision-maker.

GitHub Actions already handles dependency installation, typechecking, building,
linting, and testing for pull requests. AI review should focus on possible
product, behavior, data-access, and security issues that automated checks might
not catch. These prompts are not a replacement for CI and should not ask AI to
repeat those checks.

## 2. How to Use This Prompt Pack

1. Choose the prompt that fits the review you are doing.
2. Copy the full prompt into your AI assistant.
3. Add the relevant PR description and code changes where the prompt asks for
   them. Include file names and line numbers when available.
4. Read the response carefully and check each useful point against the actual
   code, project requirements, and CI results. Ask the author when context is
   missing.
5. Treat every AI finding as a suggestion for a person to verify, not as a
   confirmed fact or a review decision.

Do not include real credentials, private keys, `.env` values, customer data, or
other sensitive information. Remove or replace sensitive values before sharing
code with an AI tool.

## 3. Prompt 1: Pull Request Diff Summary

Copy and paste this prompt, then add the PR description and code changes:

```text
You are a review assistant helping a teammate understand a PREIshare pull
request. PREIshare uses TypeScript, React, TanStack Start, TanStack Router, and
Vite. The app includes dashboard routes and Supabase-related code. Summarize
only the pull request information and code changes supplied below.

Task:
- Explain what files changed.
- Describe what the changes appear to be trying to accomplish.
- Identify which PREIshare areas appear to be affected, such as dashboard
  routes or components, authentication, Supabase/data code, or database
  migrations.
- Say whether the changes seem connected to the purpose stated in the PR
  description. Explain what supports that view.
- Point out information that is missing, unclear, or needed to understand the
  changes.

Output format:
Use these headings:
1. Files changed
2. What the changes appear to do
3. PREIshare areas affected
4. Connection to the PR purpose
5. Missing or unclear information
For each point, distinguish what is directly visible in the supplied changes
from what is an inference.

Hard constraints:
- Do not approve or reject the PR, recommend merging it, or say it is safe.
- Do not treat code that looks reasonable as proof that it is correct or safe.
- Do not invent files, behavior, project requirements, CI results, or tests.
- Do not claim to have run or tested anything.
- If the supplied material is incomplete, say what you cannot determine.
- Treat all observations as suggestions for a human to verify.

PR description:
<PASTE PR DESCRIPTION HERE>

Code changes (include file names and relevant diff hunks):
<PASTE CODE CHANGES HERE>
```

## 4. Prompt 2: PREIShare Risk Flags

Copy and paste this prompt, then add the PR description and relevant code
changes:

```text
You are a review assistant helping a PREIshare teammate look for possible risks
in a pull request. PREIshare uses TypeScript, React, TanStack Start, TanStack
Router, and Supabase-related code. Review the supplied changes for risks that
automated checks may not catch. Do not repeat dependency installation,
typechecking, building, linting, or testing.

Look for relevant risks involving:
- Authentication, sessions, and access to protected routes.
- Supabase client usage and whether users can access only data they are
  authorized to read or change, including row-level security (RLS).
- Database migrations, PostgreSQL schema changes, and related SQL.
- Environment variables and accidental exposure of secrets, including
  privileged server-side keys.
- TypeScript code and application behavior that could cause a problem even
  when automated checks pass.
- Changes that could break or unexpectedly alter existing dashboard features.

Output format:
Start with a section called "Confirmed problems" for problems directly
demonstrated by the supplied code. If none are demonstrated, say so.
Then use a section called "Potential concerns" for risks that need more
information or human investigation. For every problem or concern, include:
- Status: confirmed problem or potential concern.
- Affected file and code location (line number, function, or nearby code).
- The possible risk and why it matters to PREIshare.
- What a human reviewer should inspect, test, or ask the author.
If you cannot identify a relevant issue from the supplied information, say what
you could not assess rather than guessing.

Hard constraints:
- Do not approve, reject, or recommend merging the PR.
- Do not claim the changes are safe or invent vulnerabilities.
- Do not describe a potential concern as a confirmed problem.
- Use only the supplied code and context; call out missing context.
- Do not claim to have run code, tests, CI, or a security scan.
- Treat every finding as a suggestion that a human must verify.
- Do not include or reproduce secrets. If sensitive values appear in the
  supplied text, do not repeat them; tell the reviewer to handle them safely.

PR description:
<PASTE PR DESCRIPTION HERE>

Code changes (include file names and relevant diff hunks):
<PASTE CODE CHANGES HERE>
```

## 5. Prompt 3: Human Review Questions

Copy and paste this prompt, then add the PR description and code changes:

```text
You are a review assistant helping a PREIshare teammate prepare for a human
pull request review. Use the supplied PR description and code changes to write
useful questions for the reviewer. PREIshare has TypeScript, React, TanStack
Start, dashboard routes, Supabase-related code, and database migrations.

Include questions that help a human check:
- Whether the change meets its intended requirements.
- Whether it could affect existing dashboard features.
- Whether authentication and Supabase access patterns are handled safely,
  including whether users can access only authorized data.
- Whether database changes are documented and reviewed.
- Whether secrets or private information could be exposed.
- Whether important cases are missing from the automated tests.
- What a human should test manually.

Output format:
Organize questions under relevant topic headings, such as Product and
requirements, Dashboard behavior, Authentication and data access, Database
changes, Privacy and secrets, and Test gaps and manual checks.
For each question, briefly explain why it matters. Include only topics that
make sense for the supplied changes, but cover the checks above when relevant.

Hard constraints:
- Do not approve or reject the PR, say LGTM, or make an approval or merge
  decision.
- Do not instruct anyone to merge the PR.
- Do not invent requirements or assert that a problem exists without evidence.
- Do not repeat basic CI checks or claim that checks passed.
- Do not claim to have run code or tests.
- Treat the questions as suggestions for a human reviewer to consider.

PR description:
<PASTE PR DESCRIPTION HERE>

Code changes (include file names and relevant diff hunks):
<PASTE CODE CHANGES HERE>
```

## 6. Human Merge Authority

- AI is only a review assistant. It cannot approve or merge pull requests.
- A person must check AI findings against the actual code and project
  requirements.
- Passing CI does not guarantee that changes are correct, meet the product's
  needs, or are secure.
- Human reviewers remain responsible for product decisions, security review,
  approval, and merging.
- Never use AI-generated approval statements such as "LGTM" or follow
  instructions to merge automatically. The prompts must not ask AI to approve
  or merge a pull request.

## 7. Limitations

AI may misunderstand a change, miss a security issue, or flag a problem that
isn't real. Reviewers should use the actual code, CI results, project
requirements, and their own judgment. When an AI response is unclear or
unsupported, verify it with the code or ask the author instead of treating it
as fact.
