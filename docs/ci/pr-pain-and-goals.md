# PREIShare Pull Request Pain Points and CI Goals

## Client need
PREIShare is building a dashboard with TypeScript, TanStack Start, React, and Supabase. The client wants every pull request (PR) to get the same automatic build and testing checks. This should help the team catch problems before broken code reaches the main branch and save teammates from repeating the same checks by hand.

## Current PR pain points
- Teammates have to install project dependencies on their own computers for each change.
- Someone has to remember to build the app and run checks manually.
- Different people may run different checks, or forget a check when they are busy.
- Running the checks by hand takes time and can slow down PR review.
- A problem may go unnoticed and get merged into the main branch.
- Reviewers may spend time checking basic build issues instead of focusing on whether the change is correct and helpful.

## Automated CI goals
When a PR is opened or updated, CI should run the same checks in a clean environment. The planned checks are:
- Install the project dependencies.
- Check the TypeScript code (typechecking).
- Build the app.
- Run linting to look for common code issues.
- Run tests to check that the code behaves as expected.

The current `package.json` has scripts for typechecking and building, but it does not list lint or test scripts. Those scripts need to be verified and agreed on before the workflow is set up. CI should show which checks pass or fail so the team can address problems before merging.

## Human review stays in charge
Developers still need to explain their changes, respond to feedback, and fix issues. Reviewers still need to judge whether a change makes sense for the product, consider risks, and approve or request changes. AI-assisted review prompts planned for this sprint can help reviewers notice possible issues faster, but AI can miss things or be wrong. People make the review and merge decisions; AI does not approve or merge PRs.

## Out of scope for this sprint
This step is only planning the PR problems, goals, and success signals. It does not create GitHub Actions workflows or turn on CI. Later in Sprint 6, the team plans to implement the workflows and prepare supporting documentation, an AI code-review prompt pack, a verification log, and a handoff note. Production deployment, deployment secrets, and automatic merging are not goals of this work.

## Success signals
- The CI plan clearly describes why checks should run when a PR is opened or updated.
- The team agrees on which checks to automate and verifies the commands for them, including lint and tests.
- In the later implementation, the same agreed checks run consistently and their results are easy to find on a PR.
- Failures help the author see what needs attention before merge.
- The AI review prompts assist human reviewers without making approval or merge decisions for them.
