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

After installing dependencies with `npm install`, run:

```bash
npm run typecheck
```

This runs `tsc --noEmit`, which checks the files under `src/` without emitting
JavaScript output files.

## Source of truth

The source of truth for investor-listing vocabulary and field rules is
`docs/domain/investor-listing-domain-brief.md`.

The actual investor listing types will be added here in later steps.
