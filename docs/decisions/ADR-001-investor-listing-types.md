# ADR-001: Investor Listing Types

## Status

Accepted for Sprint 2. This is the current compile-time model for investor listings.

## Context

PREIShare needs trustworthy listing data because investors and internal reviewers must be able to rely on the price, property location, contacts, ownership, and lifecycle state they see. Missing or inconsistent data can make a listing incomplete, hard to review, or unsafe to show to investors.

The domain documents call for one consistent listing shape, required information for investor-ready listings, approved values for status and property type, and grouped address and financial information. TypeScript can catch many of these mistakes before the data reaches the application. The current public type entry point is `src/types/index.ts`.

## Decision

Use `InvestorListing` as the main listing model. It contains the listing identity and summary, a nested `Address`, a nested `FinancialSummary`, a list of `InvestorContact` records, a `primaryContactId`, one `Ownership` record, timestamps, and a controlled `PropertyType`.

`InvestorListing` is a discriminated union. Its `status` field identifies one of four valid shapes: `"draft"`, `"active"`, `"under_contract"`, or `"closed"`. A closed listing must include `closedAt`; the other three status shapes do not require it. The listing `id`, `createdAt`, and `updatedAt` fields are readonly, so code cannot reassign those values after a listing is created.

## Type Choices Mapped to Business Rules

| Business rule | Type decision |
| --- | --- |
| A listing needs a stable identity and consistent core information. | `InvestorListing` has required `id`, `title`, `summary`, timestamps, address, financial summary, contacts, primary contact, ownership, status, and property type fields. |
| Listing status must use approved lifecycle values. | `ListingStatus` is represented by the fixed string union `"draft" | "active" | "under_contract" | "closed"`, rather than plain `string`, so misspelled or ad-hoc statuses are rejected. |
| Property type must use supported real-estate categories. | `PropertyType` is a controlled union of `"single_family"`, `"multi_family"`, `"commercial"`, and `"land"`, rather than an unrestricted string. |
| A property address must be complete enough for display, maps, and location checks. | The nested `Address` type requires `line1`, `city`, `region`, `postalCode`, and `country`; `line2` is optional for a unit or suite. |
| Price and related metrics belong together, and price must be usable in calculations. | The nested `FinancialSummary` requires numeric `askingPrice` and `currency`; projected IRR and cap rate are optional. |
| A listing can have associated people, and a published listing needs reachable contact information. | `contacts` is an `InvestorContact[]`; each contact requires `id`, `name`, `role`, and `email`, while `phone` is optional. `primaryContactId` references a contact id. |
| Ownership must identify the related contact or entity and its relationship to the asset. | `Ownership` groups required `name`, `contactId`, and `relationship` fields, with optional `percentage` and `notes`. |
| Different lifecycle states can require different information. | The `status` discriminant narrows `InvestorListing` to a status-specific branch, requiring `closedAt` for `"closed"` and excluding it from the other branches. |
| Listing identity and creation history should not be changed casually. | `id`, `createdAt`, and `updatedAt` are `readonly`. |

## Alternatives Considered

1. **Use untyped JSON, `any`, or plain strings.** Rejected because errors such as missing prices, invalid statuses, incomplete addresses, and numeric values stored as text would be discovered later at runtime.
2. **Use one flat object with many optional fields.** Rejected because it would make required investor-ready information easy to omit and would weaken the grouping of address, financial, contact, and ownership data.
3. **Use enums for the controlled values.** Not chosen for this model because string unions are simpler to read in fixtures and keep the allowed values explicit without adding runtime enum objects.
4. **Add runtime validation now.** Deferred. Sprint 2 establishes the TypeScript model and fixture checks; runtime validation can be added when API boundaries exist.

## Consequences

- Product and engineering work with one named listing shape instead of unrelated loose objects.
- Exact status and property values improve consistency, but callers must use the approved spellings.
- Nested types make the structure clearer and mean fixtures and future data mappers must provide complete nested objects.
- Valid fixtures prove that correct examples for the supported statuses and property types can typecheck.
- The intentionally invalid fixtures demonstrate that TypeScript rejects bad listing shapes, including invalid status or property type values, missing required nested fields, a string asking price, and a closed listing without `closedAt`.

## Out of Scope for Sprint 2

This sprint focused on defining and verifying the TypeScript model for PREIShare investor listings.

The following work is intentionally outside the scope of this sprint:

- runtime validation libraries
- database schema changes or migrations
- API route handlers
- UI forms
- authentication
- persistence or database integration
- production data loading

These areas can build on the type model in later work.

## Follow-ups

Future implementation work should use the existing type package as the source of truth.

Key files include:

- `src/types/index.ts` for the public type exports
- `src/fixtures/sample-investor-listings.ts` for valid example listings
- `src/fixtures/invalid-listings.errors.ts` for intentionally invalid examples
- `docs/type-safety/verification-checklist.md` for checking that the model still matches the PREIShare business rules
- `docs/type-safety/expected-type-errors.md` for understanding which invalid cases TypeScript is expected to reject

Any mismatch between older planning documents and the current exported types should be reviewed before the next sprint extends the model.