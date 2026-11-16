# PREIShare End-to-End CI Verification Log

## 1. Verification purpose

This verification checks whether the PREIShare GitHub Actions workflow is
configured as expected and whether the same CI commands work locally. It also
records a simulated test of the AI-assisted review prompt.

The local checks and prompt exercise do not prove that GitHub Actions has
passed on an actual pull request.

## 2. Static workflow verification

I reviewed `.github/workflows/pr-ci.yml` and compared its commands with
`package.json` and `docs/ci/ci-scripts-notes.md`.

| Workflow item | Result | Evidence |
| --- | --- | --- |
| Pull request trigger targets `main` | PASS | `pull_request.branches` contains `main`. |
| Pull request event types | PASS | The workflow lists `opened`, `synchronize`, and `reopened`. |
| Concurrency | PASS | The group uses the workflow and pull request number, and `cancel-in-progress` is `true`. |
| Runner | PASS | The CI job runs on `ubuntu-latest`. |
| Checkout and Node setup | PASS | It uses `actions/checkout@v4` and `actions/setup-node@v4`. |
| Node.js and npm caching | PASS | Setup specifies Node.js 24 and npm caching keyed by `package-lock.json`. |
| Dependency installation | PASS | The workflow runs `npm ci`. |
| Typecheck, build, lint, and test | PASS | The workflow runs `npm run typecheck`, `npm run build`, `npm run lint`, and `npm run test`, in that order after install. |
| No production deployment or live Supabase database operations | PASS | No deployment or database operation steps appear in the workflow. |
| Workflow secrets | PASS (static review only) | No hardcoded secret values or secret references are present in the reviewed YAML. GitHub Actions logs have not been inspected. |

The command names match the scripts in `package.json` and the sequence in
`docs/ci/ci-scripts-notes.md`.

## 3. Local CI command results

These are the results reported by the earlier local verification. The commands
are not being claimed as rerun for this log.

Local Node.js version reported earlier: **v24.20.0**.

| Exact command | Result | Exit code | Explanation |
| --- | --- | --- | --- |
| `npm ci` | PASS | 0 | Dependencies installed from the lockfile. npm also reported dependency vulnerability and install-script warnings. |
| `npm run typecheck` | PASS | 0 | TypeScript check completed without reported errors. |
| `npm run build` | PASS | 0 | The production build completed successfully. |
| `npm run lint` | PASS | 0 | ESLint completed without reported errors. |
| `npm run test` | PASS | 0 | All three listing schema tests passed. |

The recorded `npm ci` output reported 15 dependency vulnerabilities and
install-script warnings for `esbuild` and `fsevents`. These warnings were not
fixed as part of this verification. A local `.env.local` file was present but
was not inspected; its contents and any effect on the local build are
therefore unknown.

## 4. PR-to-CI verification checklist

`READY` means the item is supported by repository configuration or
documentation. `BLOCKED` means it needs an actual GitHub pull request, logs,
or repository settings access.

| Item | Status | Evidence and remaining action |
| --- | --- | --- |
| Workflow triggers for pull requests targeting `main` | READY | The branch is configured in the workflow. |
| Opened, synchronize, and reopened events are configured | READY | All three event types are listed. |
| CI job has the intended name `ci` | READY | The job ID and display name are `ci` in the workflow. Confirm how GitHub displays it on an actual PR. |
| Concurrency uses the PR number and cancels outdated runs | READY | The group contains the PR number and `cancel-in-progress` is enabled. |
| Five local CI commands match the workflow | READY | Workflow, CI notes, and package scripts agree; all five local checks were reported as passing. |
| No hardcoded secrets in the workflow file | READY | The YAML was reviewed. This does not establish anything about actual Actions logs. |
| No production deployment or live Supabase database writes in the workflow | READY | No such steps are present in the reviewed workflow. |
| Branch protection requirements are documented | READY | The checklist describes the intended required check and human review considerations. |
| Branch protection is active | BLOCKED | No repository settings were inspected. A maintainer must verify the rule and its target branches in GitHub. |
| Human approval is separate from automated CI in the guidance | READY | The checklist says human review remains necessary and AI cannot approve or merge. |
| Human approval enforcement is configured | BLOCKED | Repository settings were not inspected. A maintainer must verify the actual approval requirement. |
| Required status check is listed and enforced by GitHub | BLOCKED | `ci` is the intended check name (possibly shown as `PR CI / ci`), but an actual PR run and settings access are needed to confirm it is available and required. |
| A successful GitHub Actions run on a real PR is confirmed | BLOCKED | No such run has been confirmed. Run the workflow on a PR targeting `main` and review its result. |
| Actual GitHub Actions logs have been checked for sensitive information | BLOCKED | Logs were not inspected. A reviewer with access should check them without exposing any credentials. |

The repository checklist is guidance; it does not mean branch protection has
been enabled. Passing local commands also does not verify GitHub enforcement.

## 5. AI-assisted review prompt test

**Prompt tested:** PREIShare Risk Flags from
`docs/ci/ai-pr-review-prompts.md`.

**Sample scenario:** A developer removes an explicit `sponsor_id` filter from
a Supabase listing query and relies on RLS. The described PR does not change
RLS policies or include database migrations. No actual code diff was provided.

### AI review response

#### Confirmed problems

No problems are directly demonstrated by the supplied description. No code,
RLS policy definitions, or database migrations were provided, so I cannot
confirm that unauthorized access is possible—or that RLS correctly restricts
access.

#### Potential concerns

- **Status:** Potential concern  
  **Affected file and code location:** Sponsor dashboard listing query; no
  filename, function, or line number was supplied.  
  **Possible risk and why it matters:** Removing the application-level
  `sponsor_id` filter means access control now depends on RLS applying the
  intended restrictions to this query. If the applicable policies are absent,
  too broad, or do not cover the relevant user role and operation, one sponsor
  might be able to access another sponsor's listings. However, the change
  description alone does not establish that this can happen: correctly
  enforced RLS may prevent unauthorized access.  
  **Human reviewer should inspect or ask:** Which RLS policies apply to this
  table and authenticated role? Do they restrict listing reads to the current
  sponsor? Do they cover the query's execution path and any related read or
  write operations? Can reviewers verify behavior for two different sponsor
  accounts, including that one cannot access the other's listings?

- **Status:** Potential concern  
  **Affected file and code location:** Sponsor dashboard query and its related
  data-access path; implementation details were not supplied.  
  **Possible risk and why it matters:** The description does not show which
  Supabase client or user/session context executes the query. If that path
  does not use the expected authenticated context, the effective RLS behavior
  may differ from what the change assumes.  
  **Human reviewer should inspect or ask:** Which client and session are used
  for this query? Does the query run with the authenticated sponsor's context,
  and is that consistent with the relevant RLS policies?

**Not assessable from the supplied information:** The actual query, table and
column names, RLS policy definitions, user/session handling, affected files,
and any test evidence. No database or application behavior was tested for
this review.

### Assessment

| Assessment item | Result | Explanation |
| --- | --- | --- |
| Followed the required structured output format | PASS | Used “Confirmed problems” and “Potential concerns,” with the requested fields for each concern. |
| Identified PREIShare-specific risks | PASS | Discussed sponsor listing access, Supabase client/session context, and RLS. |
| Distinguished potential risks from confirmed problems | PASS | Reported no demonstrated confirmed problem and labeled RLS issues as potential concerns. |
| Suggested useful human review questions | PASS | Asked reviewers to inspect policies, auth context, operation coverage, and cross-sponsor access. |
| Avoided approval or safe-to-merge claims | PASS | Made no approval, merge, or safety recommendation. |
| Kept approval and merging decisions with humans | PASS | Presented the findings as items for human reviewers to verify. |

The simulated review stayed advisory. It did not test a live database or a
GitHub PR and did not claim to run tests or verify RLS behavior.

## 6. Fixes and improvements

Earlier in Sprint 6, ESLint identified a React Hooks issue in `ThemeToggle.tsx`.
The component was changed to use `useSyncExternalStore`, after which lint,
typecheck, and build passed. This was an earlier setup fix cycle, not a failure
in the latest verification.

In the latest recorded verification, all five local CI commands passed. No
application, workflow, dependency, or prompt changes were made as part of
that verification. The npm warnings from installation remain for separate
investigation.

## 7. Remaining limitations and next steps

- Run the workflow on an actual pull request targeting `main`.
- Confirm GitHub Actions reports the `ci` job as expected.
- Ask maintainers to verify branch protection and required human approval in
  repository settings.
- Verify that the required CI status check is selected and enforced.
- Review actual GitHub Actions logs for unexpected sensitive information;
  no logs were inspected for this verification.
- Investigate the reported npm audit and install-script warnings separately.
- Continue expanding test coverage over time; the current tests cover only a
  small part of PREIShare.

The earlier `pipeline-design.md` is a design draft. It says the target branch
was undecided and that lint and test scripts were not yet available. The
current workflow, `package.json`, and CI notes contain the later implemented
configuration and commands; the draft should not be treated as evidence of a
GitHub Actions run or of branch protection.

## 8. Overall verification summary

- **Static workflow checks:** Passed based on repository configuration.
- **Local CI checks:** All five commands passed with exit code 0 in the
  previously reported local verification.
- **Simulated AI review:** Stayed advisory based on the recorded assessment.
- **Real GitHub PR execution:** Not yet verified.
- **Branch protection enforcement:** Not yet verified.
- **Human approval enforcement:** Not yet verified.
- **GitHub Actions log review for sensitive information:** Not yet completed.

The workflow configuration and local checks are ready for GitHub verification,
but the full end-to-end GitHub process is not yet verified.
