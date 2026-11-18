FILE: docs/ci/samples/planted-privacy-snippet.ts
export type Sponsor = {
  id: string;
  name: string;
};

export type ListingContact = {
  email: string;
  phone: string;
};

export type PropertyListing = {
  id: string;
  title: string;
  sponsorId: string;
  contact: ListingContact;
};

export const sponsors: Sponsor[] = [
  { id: "sponsor-maple", name: "Maple Example Homes" },
  { id: "sponsor-river", name: "River Example Realty" },
];

export const listings: PropertyListing[] = [
  {
    id: "listing-101",
    title: "Fictional Maple Street Home",
    sponsorId: "sponsor-maple",
    contact: {
      email: "member@example.com",
      phone: "202-555-0142",
    },
  },
  {
    id: "listing-202",
    title: "Fictional River Avenue Condo",
    sponsorId: "sponsor-river",
    contact: {
      email: "river.member@example.com",
      phone: "202-555-0176",
    },
  },
];

export function getListingContact(
  listingId: string,
  requestingSponsorId: string,
): ListingContact | undefined {
  const listing = listings.find((item) => item.id === listingId);

  if (!listing) {
    return undefined;
  }

  return listing.contact;
}

FILE: docs/ci/samples/sample-pr-body.md
# Pull request title
Add a teaching sample for a public share preview (do not merge)

# Pull request description
This pull request adds three teaching files under docs/ci/samples and nothing else.

- docs/ci/samples/planted-privacy-snippet.ts
- docs/ci/samples/sample-pr-body.md
- docs/ci/samples/README.md

The snippet is not part of the TanStack app and must not be imported.
It does not change app routes, Supabase, or .github/workflows/pr-ci.yml.
The contact values are fake (example@example.com and a 555 phone number).

Please review the sample helper the way the runbook in docs/ci/ai-review-orchestration.md describes, using docs/ci/human-judgment-checklist.md.
Roles in docs/ci/pr-approval-roles.md still apply: a human may approve, a human may merge, and an AI assistant may only advise.

This description does not approve the change. Do not merge this pull request as part of the exercise.

FILE: docs/ci/samples/README.md
# Privacy-review teaching sample

This folder is a teaching fixture for pull-request review practice.

The file planted-privacy-snippet.ts is not part of the TanStack app and must not be imported.
Do not wire it into a route, a page, or Supabase.
Contact values in the snippet are fake. They are not a real member.

## Files this pull request adds

Only these three paths:

- docs/ci/samples/planted-privacy-snippet.ts
- docs/ci/samples/sample-pr-body.md
- docs/ci/samples/README.md

No app routes, no Supabase files, and no change to .github/workflows/pr-ci.yml.

## Pull request record

- Pull request URL: REPLACE_WITH_YOUR_PULL_REQUEST_URL
- Status: open
- Merged: no

## CI record

- Workflow file: .github/workflows/pr-ci.yml
- Result: REPLACE_WITH_passed_OR_failed_OR_did_not_start
- Actions run URL: REPLACE_WITH_ACTIONS_RUN_URL_OR_checks_note

## Human learner note — do not paste this section into the AI review

One privacy mistake is planted in the snippet on purpose: the public share preview includes a member email and a member phone.
No sign-in, money, or product-intent mistake is planted.
Use this note later to judge whether an AI review found that mistake. Do not treat this note as approval to merge.
