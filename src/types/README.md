# PREIShare Investor Listing Types

PREIShare uses strict TypeScript types to help keep investor listings trustworthy.
Investors should not be shown incomplete, incorrect, or inconsistent property
information.

These types catch bad listing data at compile time, before it reaches
production. They will eventually help us catch problems such as:

- missing prices
- invalid or inconsistent listing statuses
- incomplete nested address information

## How to check the types

After installing dependencies with `npm install`, run the normal TypeScript check:

```bash
npm run typecheck
```

This runs TypeScript in no-emit mode. A successful check exits without any
TypeScript errors, which means the valid project files pass typechecking.

The file `src/fixtures/invalid-listings.errors.ts` is intentionally excluded
from this clean check in `tsconfig.json`. It contains invalid listing examples
that are expected to produce errors. Those examples are kept separately to
prove that the PREIShare types reject invalid listing data; do not fix them.

## Source of truth

The source of truth for investor-listing vocabulary and field rules is
`docs/domain/investor-listing-domain-brief.md`.

The actual investor listing types will be added here in later steps.
