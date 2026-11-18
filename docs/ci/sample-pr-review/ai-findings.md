# Sample pull request AI findings

This file records one chat-assistant review of the PREIshare sample pull request. It is advisor notes only. It is not a GitHub approval. It does not merge the pull request.

## Run record

- Date: 2026-11-17
- Human who ran the chat: matthewgarside
- Tool used: ChatGPT in a separate new chat for the actual AI review. The coding agent is being used only afterward to fill in this Markdown record; it did not perform or change the AI review.
- Sequence followed: docs/ci/ai-review-orchestration.md
- System instruction source: docs/ci/ai-pr-review-prompts.md
- Sample pull request: https://github.com/matthewgarside/PREIShare-org-repo/pull/2
- CI before review: green
- CI note: The GitHub Actions `PR CI / ci` check was reported as successful for the sample pull request. This is a recorded observation, not a claim that this agent reran CI.
- Change text pasted: docs/ci/samples/planted-privacy-snippet.ts (the sample diff) and docs/ci/samples/sample-pr-body.md
- Not pasted: secrets, .env files, real member data, the human checklist, and the rest of the repository
- Reply handling: The assistant's response below was copied unchanged into the Assistant reply section.

## Assistant reply

## 1. Findings

Sample file: `docs/ci/samples/planted-privacy-snippet.ts`

Finding 1

- Severity: high
- Evidence: In `getPublicSharePreview()`, the returned object includes `memberEmail: propertyListing.member.email` and `memberPhone: propertyListing.member.phone`. The `PublicSharePreview` type also explicitly includes both fields. This directly demonstrates that the function exposes member contact information in its returned preview data. The PR describes the preview as public, but the supplied code does not demonstrate that the function is connected to a publicly accessible route. The example uses fictional information and is not part of the production application.
- Category: privacy
- Question for human reviewer: Should a public property sharing preview include a member's email address and phone number, or should this information be excluded unless the member has explicitly agreed to share it?

## 2. Information a human may need

- Confirmation of PREIShare's privacy requirements for publicly shared property listings.
- Whether members must explicitly consent before their contact information appears in a public preview.
- Whether the intended public preview should contain only property information, such as the title and summary.
- Confirmation that this teaching example remains separate from production code, as described in the PR.

Review limitation: This advisory review is based only on the supplied PR description and `docs/ci/samples/planted-privacy-snippet.ts`. No code, tests, CI checks, or security scans were run.

The finding identifies a privacy concern for human investigation, not a confirmed production vulnerability. The supplied information does not establish that any real member information has been exposed.

I cannot approve or merge the pull request. I also cannot determine the human review outcome or submit a formal GitHub review requesting changes. The sample code remains unchanged, and the pull request must remain open and unmerged as instructed.

## Shape check

The review used Prompt 2, PREIshare Risk Flags, from `docs/ci/ai-pr-review-prompts.md`.

- Required heading: `1. Findings` — present
- Required heading: `2. Information a human may need` — present
- The finding includes exactly four required fields: Severity, Evidence, Category, and Question for human reviewer — yes
- Severity uses an allowed value, `high` — yes
- Category uses an allowed value, `privacy` — yes
- The reply says the assistant cannot approve or merge and does not instruct a human to click Approve or Merge — yes
- The reply names `planted-privacy-snippet.ts` — yes
- I did not add a finding the assistant did not write — yes
- I did not edit the planted snippet or merge the pull request — yes, based on the review workflow and the scope of this task
- Note for next step: The AI identified member email and phone exposure as a privacy concern. The next critique step can evaluate the quality of that finding.

This shape check is a review of the AI response's formatting and restrictions. It is not an approval of the pull request.