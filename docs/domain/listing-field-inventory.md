# Listing Field Inventory

This document defines the core fields for an investor listing in PREIshare. The goal is to make the listing data predictable, easy to review, and safe to enforce with TypeScript later.

## Important business rules
- Status must be a fixed choice and must not be free text.
- Property type must also be a fixed choice and must not be free text.
- A listing should not be considered investor-ready if the price is missing.
- A listing should not be considered investor-ready if the status is unknown or invalid.
- A listing should not be considered investor-ready if the address is incomplete.
- Related fields should be grouped into nested objects where appropriate.
- Contacts may be represented as a list if there can be more than one contact.
- Keep the structure simple enough to turn into TypeScript types later.

## 1. Listing identity

| Field name | Meaning | Data shape | Required? | Example value |
| --- | --- | --- | --- | --- |
| id | Unique identifier for the listing | Text | Yes | `lst_1001` |
| title | Short investor-facing name for the property or offering | Text | Yes | `Riverfront Multifamily Opportunity` |
| description | Brief summary of the investment opportunity | Text | Optional | `Value-add asset near downtown with strong in-place cash flow.` |
| createdAt | When the listing record was created | Text | Yes | `2026-03-01T10:00:00Z` |
| updatedAt | When the listing was last changed | Text | Yes | `2026-03-15T16:30:00Z` |

## 2. Listing status

Allowed status values:
- Draft
- Under Review
- Active
- Inactive
- Sold
- Archived

| Field name | Meaning | Data shape | Required? | Example value |
| --- | --- | --- | --- | --- |
| status | Current lifecycle state of the listing | Fixed choice | Yes | `Active` |

## 3. Property type

Allowed property type values:
- Single Family
- Multifamily
- Office
- Retail
- Industrial
- Mixed Use
- Land
- Other

| Field name | Meaning | Data shape | Required? | Example value |
| --- | --- | --- | --- | --- |
| propertyType | Type of real estate asset being listed | Fixed choice | Yes | `Multifamily` |

## 4. Address

Address data should be grouped into one nested object so it stays consistent.

| Field name | Meaning | Data shape | Required? | Example value |
| --- | --- | --- | --- | --- |
| address | Container for the property address | Nested object | Yes | `{ ... }` |
| address.line1 | Street number and name | Text | Yes | `500 River Rd` |
| address.line2 | Unit, suite, or apartment number if needed | Text | Optional | `Suite 200` |
| address.city | City where the property is located | Text | Yes | `Austin` |
| address.region | State, province, or region | Text | Yes | `TX` |
| address.postalCode | Postal or ZIP code | Text | Yes | `78701` |
| address.country | Country for the property location | Text | Yes | `US` |

## 5. Financial summary

Financial details should be grouped into a nested object so the price and related values stay together.

| Field name | Meaning | Data shape | Required? | Example value |
| --- | --- | --- | --- | --- |
| financials | Container for pricing and financial metrics | Nested object | Yes | `{ ... }` |
| financials.askingPrice | Asked sale price for the property | Number | Yes | `12500000` |
| financials.currency | Currency used for the asking price | Fixed choice | Yes | `USD` |
| financials.projectedIrrPercent | Optional projected return estimate | Number | Optional | `12.5` |
| financials.capRatePercent | Optional cap rate estimate | Number | Optional | `5.8` |

## 6. Investor contacts

Contacts may be stored as a list if more than one person is associated with the listing.

| Field name | Meaning | Data shape | Required? | Example value |
| --- | --- | --- | --- | --- |
| contacts | List of people or firms linked to the listing | List | Yes for published listings | `[{ ... }]` |
| contacts[].name | Person or firm name | Text | Yes | `Jordan Lee` |
| contacts[].role | Their role on the listing | Fixed choice | Yes | `Broker` |
| contacts[].email | Email address for contact | Text | Optional if phone exists | `jordan@example.com` |
| contacts[].phone | Phone number for contact | Text | Optional if email exists | `+1-512-555-0142` |

## 7. Ownership

Ownership can be stored as a list of relationship rows tied to contacts or entities.

| Field name | Meaning | Data shape | Required? | Example value |
| --- | --- | --- | --- | --- |
| ownership | Ownership details related to the asset | List | Optional | `[{ ... }]` |
| ownership[].contactNameOrId | Which contact the ownership row refers to | Text | Yes | `Jordan Lee` |
| ownership[].relationship | Relationship to the asset | Fixed choice | Yes | `Primary Owner` |
| ownership[].sharePercent | Optional share of ownership | Number | Optional | `60` |

## Summary of required data for investor-ready listings

A listing should be considered investor-ready only when:
- the status is a valid fixed choice
- the property type is a valid fixed choice
- the price is present
- the address is complete
- the listing data is grouped consistently and not stored as loose, inconsistent JSON

This keeps the listing data trustworthy and simple enough to translate into TypeScript types later.
