# PREIshare embedding data model

## Purpose
This document is a plan for storing PREIShare property listings and their
embeddings. It describes the data model only; it is not a migration or
application code.

## Sources
- [docs/semantic-search-requirements.md](./semantic-search-requirements.md)
- [docs/embeddings-learner-notes.md](./embeddings-learner-notes.md)
- [docs/vector-search-learner-notes.md](./vector-search-learner-notes.md)
- [docs/data-model/property-listings-schema.md](./data-model/property-listings-schema.md)
- `supabase/migrations/20250321000000_property_listings.sql` (existing schema reference)

## Overview
PREIShare stores regular property information, such as a title, summary, city,
and asking price, in the `property_listings` table. The plan is to add an
embedding that represents the meaning of the property's title and summary.
The original text stays available to show investors, while the separate
embedding can help compare a search query with listings that use different
words.

The embedding model generates the number list from text. PostgreSQL with
pgvector stores the list; the database does not generate it by itself. The
current project schema already includes property listing fields, but it does
not yet include an embedding column.

## Identifiers
| Field | Type (logical) | Required | Status | Notes |
|-------|----------------|----------|--------|-------|
| `id` | UUID | Yes | Existing | Primary key and unique identifier for each property listing. The existing table generates a UUID by default. |

Every embedding must stay associated with the correct property through this
identifier.

## Core listing fields (this tutorial slice)
The existing table is named `property_listings`. The fields marked **Existing**
are in the current migration. **Proposed** marks the new field planned for
semantic search. The schema documentation uses `summary`, not a separate
`description` column; here, summary is the written property description.

| Field name | General data type | Required? | Status | Purpose |
|-------|----------------|----------|--------|---------|
| `title` | Text | Yes | Existing | Short name for the listing and part of the text used to represent its meaning. |
| `summary` | Text | Yes | Existing | Written property description and part of the text used to represent its meaning. |
| `city` | Text | Yes | Existing | The city where the property is located. |
| `asking_price` | Number (`numeric(12,2)` in the current schema) | Yes | Existing | The property's listed asking price. |
| `embedding` | Fixed-length vector of numbers | Temporarily optional; intended to be required for listings eligible for semantic search after backfill | Proposed | Stores the embedding generated from the property's title and summary. |
| `sponsor_id` | UUID | Yes | Existing | Identifies the sponsor associated with the listing; access rules still apply. |
| `property_type` | Text with allowed values | Yes | Existing | Describes the listing category, such as `single_family` or `land`. |
| `address_line1` | Text | Yes | Existing | Street address for the listing. |
| `address_line2` | Text | No | Existing | Optional additional address information, such as a unit or suite. |
| `region` | Text | Yes | Existing | State, province, or region for the property. |
| `postal_code` | Text | Yes | Existing | Postal or ZIP code for the property. |
| `country` | Text | Yes | Existing | Country where the property is located. |
| `currency` | Text | Yes | Existing | Currency used for the asking price. |
| `status` | Text with allowed values | Yes | Existing | Current listing state, such as `draft` or `active`. |
| `created_at` | Timestamp with time zone | Yes | Existing | When the listing row was created. |
| `updated_at` | Timestamp with time zone | Yes | Existing | When the listing was most recently updated. |

The existing schema requires the listing fields above except for
`address_line2`. In particular, its column is named `summary`, and that field
is required. This plan does not rename it to `description` or change the
existing requirements. The proposed `embedding` field is the only new field
in this table for this lesson.

## What text is embedded
For this tutorial, the embedding model will use the property title together
with its summary (the written description). For example:

**Title:** Lakeside Vacation Home  
**Description / summary:** Peaceful wooden retreat with waterfront access.

Combining the title and summary gives the model more information about what the
property is and how it is described. The original title and summary remain
stored as regular text so PREIShare can display them to investors.

The existing schema requires both `title` and `summary` to contain text. If
either is missing, the listing should not be treated as ready for an embedding.
If the title or summary changes later, the embedding should be regenerated
from the updated text before the listing is treated as ready for semantic
search. The exact update process is for a later lesson.

## Embedding column
| Field | Type (logical) | Required | Notes |
|-------|----------------|----------|-------|
| `embedding` | `vector(DIMENSION_TODO)` using pgvector | Temporarily optional during backfill; intended to be required for listings eligible for semantic search afterward | A fixed-length list of numbers generated from the property's title and summary. It is stored separately from the original text. |

PostgreSQL can store this vector using pgvector. Every vector compared in a
search must use a compatible representation. The vector length must match the
embedding model selected later, and the query and property vectors must be
compatible with each other. No model has been chosen; the size remains
`DIMENSION_TODO` until a later lesson.

### Dimension placeholder
- The vector size is written as **DIMENSION_TODO** until a later lesson chooses
  the embedding model and confirms its output size.
- Embeddings being compared must have compatible representations and the same
  vector length, **DIMENSION_TODO**.
- Do not replace the placeholder with a real size or choose a model in this
  lesson.

### Nullability and backfill
- The existing property listing schema has not yet been given an embedding
  column. If that field is added, it may temporarily allow `NULL` while
  existing listings are being processed.
- Once the required backfill is complete, the intended final design is for
  listings eligible for semantic search to have a non-`NULL` embedding.
- A listing without an embedding can remain stored, but it is not ready to be
  included in semantic search until its embedding is available.
- The planned lifecycle is: keep the listing text → generate its embedding
  with a model → store the vector linked to the listing → make the listing
  eligible for semantic search.

## Separation of concerns
| Concern | Where it lives |
|---------|----------------|
| Human-readable listing information | Existing columns such as `title`, `summary`, `city`, and `asking_price` |
| Meaning used for search | Proposed `embedding` vector column |
| Embedding generation | An embedding model, chosen in a later lesson |
| Embedding storage | PostgreSQL with pgvector, once implemented |

The vector does not replace the title or summary. Investors need the original
text to understand a listing, and the search can use the separate embedding
to compare meaning.

## In scope vs out of scope (data model)
**In scope for this lesson**
- Plan for one embedding associated with each property listing.
- Describe the existing listing fields and the proposed embedding field.
- Define the title and summary as the text used to make the embedding.
- State the temporary and intended final embedding nullability rules.

**Out of scope for this design lesson**
- Database migrations or table changes.
- Embedding generation code.
- SQL similarity search functions.
- API endpoints.
- Search page components.
- Authentication or authorization changes.
- Payment processing.
- Advanced ranking or recommendation systems.
- Production-scale embedding management.

These items are out of scope for this lesson only; they may be part of later
implementation lessons in the semantic search tutorial.

## Consistency checklist (must pass before migration)
- [ ] Existing field names and required/optional rules match the current schema.
- [ ] Primary key and property-to-embedding relationship are clear.
- [ ] Embedding input text uses the title and summary.
- [ ] The `DIMENSION_TODO` placeholder is used consistently without choosing a
  model or real vector size.
- [ ] Original text and the proposed vector are separate.
- [ ] Temporary backfill and intended final nullability rules are stated.
- [ ] Out-of-scope work is listed for this design lesson.

## Open questions
- Which embedding model will PREIShare use?
- How many dimensions will the model produce?
- Which vector distance or similarity metric should we use?
- How will property embeddings be generated?
- How will existing properties receive embeddings?
- When should an embedding be updated after a listing changes?
- How will we verify that stored embeddings match the correct properties?
- How will search results respect existing property visibility and access
  rules?

## Handoff
The data model is a planning reference for later implementation lessons. The
embedding field, pgvector setup, and any backfill still need to be planned and
implemented in their appropriate future lessons.