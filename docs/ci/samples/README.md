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

- Pull request URL: https://github.com/matthewgarside/PREIShare-org-repo/pull/2
- PR status: Open
- Merged: No
- GitHub Actions CI result: Passed (PR CI / ci)
- GitHub Actions run link: https://github.com/matthewgarside/PREIShare-org-repo/actions/runs/44249106163/job/134615140963?pr=2
