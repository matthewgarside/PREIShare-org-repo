# Expected TypeScript errors for invalid investor listings

This page documents the intentionally broken fixtures in [src/fixtures/invalid-listings.errors.ts](../../src/fixtures/invalid-listings.errors.ts). Each example is meant to show a real TypeScript error that the PREIshare types are designed to stop.

| Fixture name | What is wrong in plain business language | Which field or type rule should catch it | Expected TypeScript error |
| --- | --- | --- | --- |
| `invalidStatusString` | The listing status is set to a value that is not one of the allowed lifecycle states, so the app would not know how to treat the listing correctly. | The `status` field is a string union in `ListingStatus`, and the discriminated union in `InvestorListing` only allows `"draft"`, `"active"`, `"under_contract"`, or `"closed"`. | invalid string literal |
| `missingAddressCity` | The property address is missing the city, which is required for display, maps, and location checks. | The `Address` type requires `city: string`. | missing required property |
| `missingOwnershipContactId` | The ownership record is missing the required contact reference, even though the domain documents describe ownership as tied to a contact or entity. | The `Ownership` type requires `contactId: InvestorContact["id"]`. | missing required property |
| `financialNumberProvidedAsString` | The asking price is stored as text instead of a number, so it cannot be used in pricing or financial calculations. | The `FinancialSummary.askingPrice` field must be a `number`. | string used where number is required |
| `missingContactName` | A contact record is missing the required contact name, so the record is incomplete. | The `InvestorContact` type requires `name: string`. | missing required property |
| `invalidPropertyType` | The property type is not one of the supported real-estate categories. | The `propertyType` field uses the `PropertyType` union and only allows values like `"single_family"`, `"multi_family"`, `"commercial"`, and `"land"`. | invalid property type |
| `closedListingMissingClosedAt` | A closed listing is missing the date it closed, which is required for the closed status branch of the union. | The `InvestorListingClosed` variant requires `status: "closed"` and `closedAt: string`. | missing status-specific field |

## Notes

- These examples are intentionally invalid and should not be fixed.
- The goal is to show that the TypeScript types are protecting the app from bad data.
- Each fixture in the invalid file has one matching entry above.
