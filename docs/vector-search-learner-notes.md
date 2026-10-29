# Vector search learner notes (PREIshare)

## 1. My plain-language definition
Vector similarity search compares number lists, called embeddings, that represent
text. For PREIShare, the search system can compare the investor's query
embedding with saved property embeddings. Properties with similar meanings
should generally rank closer together, even when they use different words.

## 2. How a search runs (steps I can explain)
1. The buyer types a search in everyday language.
2. The system turns the query into an embedding using an approach compatible
   with the one used for the property embeddings.
3. The system compares the query embedding with property embeddings already
   saved for listings.
4. Each property gets a distance or similarity score.
5. The system orders listings from best match to worst match, then returns the
   requested top-K results.

```text
[Buyer query text]
        |
        v
[Query embedding] ----compare----> [Saved property embeddings]
        |
        v
[Scores] -> [Order best-first] -> [Limit to top-K listings]
```

In the planned PREIShare setup, PostgreSQL with pgvector could store and compare
the property embeddings. This describes the idea, not a search system that is
already producing results.

## 3. Keyword search vs vector search (same query)
**Example query:** "Family-friendly home near good schools."

| Approach | What it looks for | Likely miss |
| --- | --- | --- |
| Keyword | Matching words such as "family-friendly" and "schools" | A listing that describes a quiet neighborhood and a nearby highly rated elementary school without saying "family-friendly" |
| Vector / semantic | Similar meaning, even when the words differ | A listing may still be hard to match if its description is missing or unclear |

Keyword search looks for matching words. Vector search compares the meanings
represented by embeddings, so it may find a relevant listing with different
wording. PREIShare listings and investor searches can describe the same idea in
different ways.

## 4. Worked ranking examples (no real math required)

These are learning examples, not results from a working search system. They do
not include real vector scores.

### Example A — family-friendly home near good schools
**Investor query:** "Family-friendly home near good schools."

| Property | Listing description | Expected ranking | Why |
| --- | --- | --- | --- |
| A | "Spacious four-bedroom house in a quiet neighborhood, within walking distance of a highly rated elementary school." | Highest | It matches the family, home, and school intent most closely. |
| B | "Two-bedroom townhouse in a residential area with a small backyard." | Partial match | It sounds like a home in a residential area, but does not mention nearby schools or as much family space. |
| C | "One-bedroom apartment in the middle of downtown, close to nightlife and office buildings." | Less relevant | It describes a different kind of home and lifestyle. |

A strict keyword search might miss Property A if it only looks for the exact
phrase "family-friendly." Its description instead gives clues about space,
neighborhood, and the nearby school.

### Example B — cabin by the lake
**Investor query:** "Cabin by the lake."

| Property | Listing description | Expected ranking | Why |
| --- | --- | --- | --- |
| A | "Rustic wooden vacation getaway surrounded by trees with private waterfront access." | Highest | It sounds like a rustic getaway by water, even though it does not use "cabin" or "lake." |
| B | "Modern apartment in a busy downtown neighborhood with restaurants nearby." | Less relevant | It describes a city apartment, not a quiet getaway by water. |
| C | "Large country house surrounded by open fields and farmland." | Less relevant | It is rural, but the description does not mention a cabin or water. |

Property A should rank highest based on its meaning. A keyword search might miss
it because the description uses "vacation getaway" and "waterfront" instead of
"cabin" and "lake." Waterfront access does not prove that the property is next
to a lake, though, so an investor still needs to check the actual listing
details.

## 5. Top-K and scores (what I will check later)
- **Top-K** is the number of highest-ranked search results returned. Top 3
  returns three listings; top 5 returns five, assuming enough listings match.
- Results need to be ranked from best match to worst match **before** the
  top-K limit is applied. Otherwise, the returned listings might not be the
  best matches.
- A **distance score** normally means lower is closer.
- A **similarity score** normally means higher is closer.
- The direction depends on the metric being used, so I need to check which
  kind of score the search returns before deciding how it should sort results.
- A result should include useful information to review, such as a listing
  identifier, title, description, and match score.
- We have not chosen a distance metric or embedding model yet; those choices
  belong to a later lesson.

## 6. What good ranking is *not*
- Not alphabetical order of property titles or newest listing first, unless
  PREIShare adds that as a separate rule.
- Not matching only exact keywords and calling that vector search.
- Not comparing embeddings that are incompatible, such as embeddings made
  with different models or dimensions.
- Not sorting in the wrong direction for the score type: distance normally
  goes from low to high, while similarity normally goes from high to low.
- Not choosing the top-K listings before ranking all candidates correctly.

## 7. Assessment questions for a future match_properties-style function
When reviewing a future SQL function or TypeScript search helper, I can check:

1. Does PREIShare generate the query embedding using the same embedding model
   as the stored property embeddings?
2. Does the search compare the query embedding against property embeddings
   already stored in PostgreSQL using pgvector?
3. Does the search order results correctly so the best match appears first,
   based on the chosen similarity or distance metric?
4. Does the search correctly limit results to the requested top-K number?
5. Does the search return enough useful property information, such as a
   listing identifier, title, description, and match score, for the investor
   to review the result?
6. Can the search find relevant properties when the buyer uses different words
   than the listing description, such as finding Property A for "Cabin by the
   lake" when its description says "vacation getaway" and "waterfront"?

## 8. Link back to requirements
Relevant example queries from
[docs/semantic-search-requirements.md](./semantic-search-requirements.md):
- "cabin near water"
- "family-friendly home close to good schools"
- "downtown condo walkable to restaurants"

Success criteria this ranking model supports:
- A relevant listing can appear even when it does not repeat the search phrase.
- A listing that fits the query should appear before listings that fit less
  well.
- The project team can compare sample results with an agreed list of relevant
  listings and mark each check as pass or fail.

## 9. Open questions for later steps
- Which embedding model will PREIShare use?
- How many dimensions will its embeddings have?
- Which distance or similarity metric will we use, and which direction should
  the results be sorted?
- How will we verify later that the top results are relevant, including when
  a listing uses different words from the query?
- What should PREIShare show if no sample listing appears to match?
- What default top-K value should a future search use?