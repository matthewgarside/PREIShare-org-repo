# PREIshare team orientation notes

Author: <Matthew Garside>
Date: <2026-09-02>

## 0. Team repository of record

- **Team repo (upstream):** https://github.com/EdTechForLearning/PREIShare-org-repo
- **My fork (created in Step 3):** https://github.com/matthewgarside/PREIShare-org-repo
- I contribute by forking this repo and opening pull requests from my fork. I do not push to the team repo directly.

## 1. Product mission (my words)

PREIshare helps people make better real-estate decisions by using property and market data. The engineering team builds the website using tools like TypeScript, React, Supabase, and PostgreSQL. As a new contributor, my job is to learn how the team works, make changes carefully, and help improve the product without trying to change everything at once.

## 2. Everyday collaboration → engineering workflow

| Everyday picture | PREIshare engineering parallel |
| --- | --- |
| Shared final document | Shared default branch on the team repository |
| My draft copy | My feature branch with a small change |
| Save history / version notes | Commits with clear messages |
| Ask a peer to review before publish | Open a pull request (PR) for review |
| Peer approves, then we publish | Review passes, then the PR can merge |

## 3. Actors in a pull-request workflow

- **Contributor (me):** picks a tiny safe change, works on a branch, describes the change, responds to feedback.
- **Reviewer (teammate or simulated reviewer):** checks correctness, scope, and clarity before merge.
- **Shared repository:** the team’s source of truth on GitHub; default branch is protected by process even when tools allow edits.
- **Automation (later):** checks such as GitHub Actions may run on the PR; I treat failing checks as blockers, not noise.

## 4. First-PR definition of done (beginner-safe)

My first reviewed PR is done only when all of the following are true:

1. **Scoped:** The change is intentionally small (for example onboarding docs or a contributors list)—not a multi-feature rewrite.
2. **Isolated:** Work happened on a feature branch, not by editing the shared default branch directly.
3. **Described:** The PR states why the change exists, what files changed, and how a reviewer can verify it.
4. **Reviewable:** A teammate can understand the diff without a meeting; notes capture any decisions or follow-ups.
5. **Verified:** I re-read the diff myself and fixed obvious mistakes before asking for review.
6. **Aligned:** The change matches team conventions I will learn in later steps (repo map, AI rules, best practices).

## 5. Out of scope for the first PR

- Large refactors, dependency upgrades, or database schema changes
- Secrets, production credentials, or real customer data
- “While I was here” unrelated edits that enlarge review risk

## 6. How I will use AI on this team

I will prompt agents in small cycles: understand → plan → prompt → review → refine.
I will not paste secrets into agents. I will not accept agent output I cannot explain.
Orientation complete means I can tell a human what PREIshare is, who is in the
PR loop, and what “first PR done” means—before I configure tools or write code.