# PREIShare Type-Safety Verification Checklist

Use this checklist when reviewing the investor listing type model.

## Documentation and fields

- [ ] Confirm the domain brief's listing rules match the current TypeScript types; record any mismatch for review.
- [ ] Confirm the field inventory uses the current property names: `summary`, `financialSummary`, `primaryContactId`, and `ownership`.
- [ ] Confirm `Address` has required `line1`, `city`, `region`, `postalCode`, and `country`, plus optional `line2`.
- [ ] Confirm `FinancialSummary` has required `askingPrice` and `currency`, plus optional `projectedIrrPercent` and `capRatePercent`.
- [ ] Confirm `InvestorContact` requires `id`, `name`, `role`, and `email`, with optional `phone`.
- [ ] Confirm `Ownership` requires `name`, `contactId`, and `relationship`, with optional `percentage` and `notes`.
- [ ] Confirm `InvestorContact` and `Ownership` follow the documented contact, reachable-contact, and ownership-reference business rules.

## Allowed values and listing shape

- [ ] Confirm `ListingStatus` contains exactly: `"draft"`, `"active"`, `"under_contract"`, and `"closed"`.
- [ ] Confirm `PropertyType` contains exactly: `"single_family"`, `"multi_family"`, `"commercial"`, and `"land"`.
- [ ] Confirm `InvestorListing` composes `Address`, `FinancialSummary`, `InvestorContact[]`, `Ownership`, and `PropertyType` correctly.
- [ ] Confirm `id` and `createdAt` remain `readonly` and cannot be reassigned.
- [ ] Confirm the listing union uses `status` as its discriminant.
- [ ] Confirm `draft`, `active`, and `under_contract` listings do not require `closedAt`.
- [ ] Confirm `closed` listings require `closedAt: string`.

## Fixtures and checks

- [ ] Confirm the valid fixtures cover `draft`, `active`, `under_contract`, and `closed` statuses.
- [ ] Confirm the valid fixtures cover `single_family`, `multi_family`, `commercial`, and `land` property types.
- [ ] Run `npm run typecheck` and confirm valid project files pass with no TypeScript errors.
- [ ] Confirm `src/fixtures/invalid-listings.errors.ts` is excluded from the normal clean check by `tsconfig.json`.
- [ ] Confirm each invalid fixture matches one documented case in `docs/type-safety/expected-type-errors.md`.
- [ ] Confirm the documented invalid fixture names match the actual exports: `invalidStatusString`, `missingAddressCity`, `missingOwnershipContactId`, `financialNumberProvidedAsString`, `missingContactName`, `invalidPropertyType`, and `closedListingMissingClosedAt`.
- [ ] Review intentional errors separately and confirm they prove the PREIShare types reject invalid listing data.
- [ ] Confirm `package.json` runs TypeScript in no-emit mode through `"typecheck": "tsc --noEmit"`.
- [ ] Confirm no `any`, `@ts-ignore`, or similar bypass is used to make the model pass.
- [ ] Confirm `src/types/index.ts` re-exports `Address`, `FinancialSummary`, `InvestorContact`, `InvestorListing`, `ListingStatus`, `Ownership`, and `PropertyType`.