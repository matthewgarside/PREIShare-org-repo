# Sprint 2 Topic 1: Types Handoff

## Client Story Recap

PREIShare needed investor listing data the team could trust. This topic focused on strict TypeScript modeling so bad listing data can be caught before users see it.

## What We Shipped This Topic

- `docs/decisions/ADR-001-investor-listing-types.md` records the agreed investor listing model and the business rules behind it.
- `docs/type-safety/verification-checklist.md` provides a practical checklist for checking fields, allowed values, fixtures, and type-safety expectations.
- `src/types/index.ts` is the public type entry point for `InvestorListing` and its related shared types.
- `src/fixtures/sample-investor-listings.ts` provides valid examples covering the supported listing statuses and property types.
- `package.json` defines the typecheck setup as `npm run typecheck`, which runs TypeScript with `tsc --noEmit`.

## What We Must Not Claim Is Done

This topic did not complete:

- the full investor listing feature
- TanStack Start forms
- Supabase/PostgreSQL schema work
- API route handlers or API boundary implementation
- runtime validation
- authentication

The database and the listing feature are not finished.

## Next Sprint Pickups

1. **TanStack Start forms**

       Forms should consume the existing shared types instead of redefining listing fields.

2. **Supabase/PostgreSQL schema alignment**

       The database schema should be aligned with the current TypeScript model and business rules.

3. **API boundaries**

       Request and response shapes should consume the shared types or intentionally mapped DTOs instead of creating ad hoc listing shapes.

## Prompting and Review Self-Assessment

Prompting habits that helped:
- Giving the AI the domain brief and field inventory reduced guessing.
- Asking the AI to change only a few specific files at a time made the work easier to review.

Review habit:
- I compared union values, required fields, and nested types against the domain documents instead of trusting the generated code automatically.

What I would improve:
- I would keep prompts even more focused and verify the source files before asking the AI to make changes.