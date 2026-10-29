# Semantic Search Requirements

## Overview

PREIShare helps investors explore property listings and find possible investment
opportunities. Semantic search lets someone search with everyday language and
find listings that match the meaning of their words, even when a listing uses
different wording. For example, a search for “cabin near water” could find a
“lakeside vacation home” even if the listing never says “cabin.”

This feature is intended to make it easier for investors to find relevant
properties without knowing the exact words used in each listing. Search results
should still be based on the information in the listings; they should not
promise a particular investment outcome.

## Actors

| Actor | What they need |
| --- | --- |
| Investor searching for properties | To describe the kind of property or opportunity they want in ordinary language and see relevant listings, including listings described with different words. |
| PREIShare project team | To check search behavior against sample listings and agree which results are relevant for the example searches. |

## Example Queries

The examples below show the kind of meaning a good match should have. The
listing wording does not need to repeat the search phrase.

| Investor's search | A relevant listing might describe... | Why exact-word search might miss it |
| --- | --- | --- |
| “cabin near water” | A lakeside vacation home or a waterfront cottage. | The listing may say “lakeside” or “waterfront” without using “cabin” or “near water.” |
| “family-friendly home close to good schools” | A house in a residential area near schools, described as suitable for families. | The listing may describe the neighborhood and nearby schools without using “family-friendly.” |
| “downtown condo walkable to restaurants” | A central apartment or condo a short walk from dining and shops. | The listing may say “in the city center” or “near dining” instead of “downtown” or “walkable to restaurants.” |
| “small apartment building with rental income” | A multi-unit residential property described as having tenants or rental activity. | The listing may use “multi-family” or “occupied units” instead of “apartment building” or “rental income.” |
| “quiet rural place for weekend getaways” | A country home or vacation property described as peaceful and suitable for short stays. | The listing may say “secluded,” “countryside,” or “vacation home” without using the searcher's words. |

## Success Criteria

- [ ] With a sample listing described as a “lakeside vacation home” that does not
  contain the word “cabin,” searching “cabin near water” returns that listing
  as a relevant result.
- [ ] For each example query, a sample listing that fits the meaning in the
  “A relevant listing might describe...” column appears in the results, even
  when it does not repeat the search phrase.
- [ ] For each example query, an expected relevant sample listing appears
  before sample listings that do not fit the query as well.
- [ ] When a sample listing's wording directly matches a search, that listing
  appears in the results.
- [ ] As a contrast check, when the sample set contains cabins and condos but
  no farmland, searching “farmland for growing crops” does not present those
  cabins or condos as strong matches.
- [ ] The project team can review the sample results for each example query
  against an agreed list of relevant listings and mark each check as pass or
  fail.

## In-Scope Work

- Describe the expected search behavior for investors using everyday language.
- Find and show property listings that match the meaning of a search, even
  when the listing uses different words.
- Check the behavior with a small set of sample listings and the example
  queries in this document.
- Keep results focused on relevant property listings rather than promising
  investment performance.

## Out-of-Scope Work

- Building a complete recommendation system that predicts what an investor
  might want beyond the search they entered.
- Redesigning the PREIShare application.
- Adding unrelated features such as investment transactions, messaging, or
  account management as part of this search requirement.
- Choosing or documenting a specific technical implementation. This document
  describes expected behavior, not how the search is built.

## Open Questions

- Which sample listings will be used to check the example queries?
- Who will review the results and agree whether a sample listing is relevant?
- How should results be ordered when several listings seem equally relevant?
- What should investors see when no sample listing appears to match their
  search?
- Should this search include other search conditions, such as a price range or
  location, or should those be considered separately?
