# PREIShare privacy-review teaching sample

This folder contains a fictional PREIShare privacy-review teaching sample.
The sample is for AI-assisted and human code-review practice only.

The TypeScript example intentionally includes one privacy mistake. The code
must not be imported into the real PREIShare application and must not be used
in production. It is not an application module, has no Supabase or database
integration, and is not executed by the normal PREIShare runtime.

The sample uses fictional contact details only: fake sponsors, example email
addresses, and reserved example phone numbers. It contains no real personal
information, credentials, API keys, or secrets.

AI may suggest findings and questions, but humans decide review outcomes.
Only an authorized Human Reviewer can approve the pull request, and only an
authorized Repository Maintainer can merge it. This teaching pull request must
remain open and unmerged.

## Exact three-file list

- `docs/ci/samples/planted-privacy-snippet.ts`
- `docs/ci/samples/sample-pr-body.md`
- `docs/ci/samples/README.md`

## Pull request evidence placeholders

- Pull request URL: `REPLACE_WITH_REAL_PULL_REQUEST_URL`
- PR status: `REPLACE_WITH_PR_STATUS`
- GitHub Actions CI result: `REPLACE_WITH_GITHUB_ACTIONS_CI_RESULT`
- GitHub Actions run link: `REPLACE_WITH_GITHUB_ACTIONS_RUN_LINK`
