# CI concepts notes — PREIshare

## What is continuous integration?

Continuous integration, or CI, means automatically checking code changes as
people work together. For PREIshare, the idea is to run the same checks when
someone opens a pull request or updates it. That way, the team can find
problems before the changes are merged.

## What is a pipeline or workflow?

A pipeline, often called a workflow in GitHub Actions, is a set of
instructions for running checks. GitHub Actions follows those instructions
on GitHub's computers, so the checks do not depend on what someone remembers
to run on their own computer.

## What do green checks and red Xs mean?

A green check means the automated checks passed. A red X means at least one
check failed and needs attention. Passing checks are helpful, but they do not
prove that the code is perfect or that the change is right for the product.

## Why should PREIShare check every pull request?

Checking every pull request gives everyone the same feedback before a
change is merged. It can catch basic problems sooner and save reviewers from
repeating routine checks by hand. It is more dependable than relying on
different people to run different checks—or waiting until after a change
reaches the main branch.

## Mapping PR pain points to CI ideas

| PR pain point | Possible CI help |
| --- | --- |
| Teammates have to install dependencies on their own computers for each change. | CI can install the project's dependencies in a clean environment for each run. |
| Someone has to remember to build the app and run checks manually. | CI can run the agreed checks automatically when a PR is opened or updated. |
| People may run different checks or forget one when they are busy. | One shared workflow can run the same agreed checks for every PR. |
| Running checks by hand takes time and can slow down review. | CI can give an early result, so reviewers can spend less time repeating basic checks. |
| A problem may go unnoticed and get merged into the main branch. | Checks before merging can flag some problems while the PR is still open. |
| Reviewers may spend time finding basic build issues instead of judging the change. | CI can report basic check failures, leaving people to focus on whether the change is correct and helpful. |

CI cannot decide whether a change makes sense for PREIShare, whether it
meets the user's needs, or whether its risks are acceptable. People still
need to review the code, respond to feedback, and make approval and merge
decisions. AI-assisted review is separate from CI: it can help people notice
possible issues, but it does not replace automated checks or human judgment.

The planned checks include installing dependencies, typechecking, building,
linting, and tests. The project currently has typecheck and build scripts;
lint and test scripts still need to be verified and agreed on before a
workflow is set up.

## Non-examples / CI washing

- **Only running `npm run build` manually on someone's laptop:** That is a
  useful local check, but it does not automatically check every PR or give
  the whole team a consistent result.
- **Merging because an AI says the code looks good without running actual
  checks:** AI review is not an automated build or test result, and AI can
  miss things or be wrong. People still make review and merge decisions.
- **Having a workflow file that never runs when pull requests are opened or
  updated:** A workflow that does not run at the right time does not give
  the team CI feedback on its PRs.
- **Checking only after changes are merged:** That feedback comes too late
  to help catch problems before they reach the main branch.
