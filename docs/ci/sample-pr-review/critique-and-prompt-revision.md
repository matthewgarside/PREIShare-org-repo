# Critique and prompt revision — sample PREIshare pull request

## What I compared
- Saved AI findings: docs/ci/sample-pr-review/ai-findings.md
- Planted leak: docs/ci/samples/planted-privacy-snippet.ts
- Human checklist: docs/ci/human-judgment-checklist.md
- Prompt pack edited in place (not a new file): docs/ci/ai-pr-review-prompts.md

## The planted privacy leak, in my words
- Email I saw in the snippet: `example@example.com`
- Phone I saw in the snippet: `202-555-0142`
- Why this is a privacy problem for a PREIshare member: A member probably wouldn't want their personal email and phone number shared publicly because strangers could contact them without their permission.

## Four judgments of the first AI review

### 1. Did it catch the privacy issue?
- Caught the privacy issue involving member email and phone information: yes
- Caught the literal email address from the sample: no — the saved AI reply does not name `example@example.com`.
- Caught the literal phone number from the sample: no — the saved AI reply does not name `202-555-0142`.
- Quote or close restatement from the findings file: "The returned object includes `memberEmail: propertyListing.member.email` and `memberPhone: propertyListing.member.phone`" and identifies this as member contact information exposed in public preview data.
- Gap: The AI identified the privacy concern and named the two code fields, but did not name the fictional contact values provided above.

### 2. Did it invent a finding?
- Invented finding: none
- How I know it is not in the sample: The saved finding is explicitly based on the snippet's returned `memberEmail` and `memberPhone` fields, and the reply does not add a separate concern unsupported by the supplied code.

### 3. Did it skip evidence?
- Claim with no quote from the change: none — the finding cites the `getPublicSharePreview()` return object and the `PublicSharePreview` type in the supplied change.
- Evidence nuance: The finding cites code fields but does not reproduce the literal fictional contact values. That is a gap in specificity, not a missing quote.

### 4. Did it try to approve or merge?
- Tried to approve or merge: no
- Words it used, if yes: not applicable
- Evidence: The assistant explicitly said, "I cannot approve or merge the pull request," and also said the pull request must remain open and unmerged.
- Sample pull request left unmerged: yes
- Planted leak must not land on main: yes
- I am not telling anyone to merge this sample: yes

## Checklist areas
- Area this leak belongs to: privacy
- Why it matters: Public exposure of a member's personal contact information can enable unwanted contact and give the member less control over who receives private information.
- Sign-in, money, or product intent reviewed without evidence: no — the original AI did not invent findings in those areas.

## Gaps the prompt change will fix
- Gap 1: The original AI identified the member email and phone fields but did not name the actual fictional contact values from the snippet.
- Gap 2: no second gap
- Gaps I am not fixing, and why: No additional invented findings, unsupported claims, or merge-authority failures were observed, so no rules are needed for those checks.

## One re-run on the same unmerged sample
- Advisor tool: ChatGPT in a new conversation, not a coding agent
- Same sample as the first review: yes
- Answer key pasted into the chat: no
- Output shape improved: no. The original response already followed the required Prompt 2 headings and four-field finding format, and the second response preserved that correct format.
- Privacy finding improved: yes. The second review explicitly named the fictional email `example@example.com` and phone `202-555-0142`, and quoted the code showing that `getPublicSharePreview()` returns the member's contact fields.
- What is still wrong: Nothing from the four required judgments remained wrong. The response did not invent an unrelated finding, omit supporting code evidence, or attempt to approve or merge. Human review is still required to evaluate the privacy concern.
- Number of re-runs: 1

## Human stays in charge
- I did not let the AI approve.
- I did not click Merge.
- The teaching sample pull request remains open and unmerged.
- The planted privacy snippet must not be committed or merged into main.
- Course files are being prepared for a later commit after the actual re-run.
- Course files prepared for that later commit: this critique and docs/ci/ai-pr-review-prompts.md only.
