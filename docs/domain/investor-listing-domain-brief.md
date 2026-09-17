# Investor Listing Domain Brief

## Purpose
PREIshare needs investor listings that are clear, consistent, and trustworthy. A listing should describe a property or investment in a way that the whole team can rely on, and it should be structured well enough that TypeScript can catch mistakes before the data reaches users.

## Actors
- **PREIshare team** — defines and uses listing data across product, ops, and engineering.
- **Developers** — work with the listing data shape and need it to be predictable.
- **Investors / users** — eventually view prepared listings and rely on the information being complete.
- **Listing editors and reviewers** — create, check, and approve listings before they are shown.

## Goals
- Use one consistent definition of an investor listing across the app and team.
- Prevent weak data such as missing prices, mismatched statuses, or incomplete addresses.
- Keep related information grouped logically in nested objects instead of loose JSON.
- Make it possible for TypeScript to enforce required fields and valid values.
- Only show a listing to investors when it is safe, complete, and valid.

## Listing Lifecycle Statuses
Use a small set of fixed status values instead of free text.

- `draft` — still being prepared; not ready for investors.
- `published` — visible to investors and meets the listing requirements.
- `under_offer` — still active in the market, but not yet sold.
- `sold` — closed and no longer active for new interest.
- `archived` — no longer active in the browse flow, but kept for record history.

These values should be treated as a closed list. A listing should not be considered valid if its status is unknown, misspelled, or written in an ad-hoc way.

## Nested Data Groups
A listing should be organized into clear, nested groups so the data stays consistent across screens and API responses.

### 1. Identity
Basic listing information such as:
- listing id
- title
- property type
- short description
- created and updated timestamps

### 2. Address
The location of the property should be grouped together in one nested address object.

Typical fields include:
- street line 1
- optional street line 2
- city
- region or state
- postal code
- country

### 3. Financial Information
The money details should also be grouped together.

Typical fields include:
- asking price
- currency
- optional return metrics such as projected IRR or cap rate

### 4. Contacts
A listing may include one or more people associated with the investment. Contact details should include:
- name
- role
- email or phone

### 5. Ownership
Ownership information explains who is connected to the asset and how they relate to it.

Typical fields include:
- contact reference
- relationship to the asset
- optional ownership share

This structure matters because nested data should not disappear between screens or be stored in inconsistent shapes.

## Success Criteria for a Valid Listing
A listing is safe to show investors only when all required information is present and the structure is consistent.

A listing should be considered investor-ready when:
1. It has a non-empty id and title.
2. Its status is one of the approved lifecycle values.
3. Its property type is a known fixed value.
4. The address is complete enough to identify the property.
5. The asking price is present and includes a currency.
6. There is at least one valid contact with a name and a reachable method such as email or phone.
7. Ownership fields, when present, use a consistent fixed set of relationship values.
8. Required nested fields are present and not missing for published, under_offer, and sold listings.

A listing should not be investor-ready when any of the following are true:
- the price is missing
- the status is unknown, invalid, or inconsistent
- the address is incomplete
- required nested information is missing or silently dropped
- the data is loosely structured and different screens interpret it differently

This is the core rule: a listing must be structured consistently so TypeScript types can enforce it later and prevent unsafe data from reaching investors.

## Inventory Rules
These rules must hold for the listing shape used by PREIshare:

1. Do not invent extra top-level groups beyond identity, address, financial information, contacts, and ownership unless the domain brief is updated.
2. Status values must remain a closed list of fixed choices and not be free text.
3. Property type values must also remain a fixed list and not be free text.
4. Address and financial information must be nested objects, not scattered flat strings.
5. Contacts must be represented as a list, and a valid published listing needs at least one contact.
6. Required fields must be enforced in TypeScript later so missing values are caught before production.
7. The same structure should be used across screens and API responses so nested data does not disappear between places.

These rules keep the data model realistic and safe for investor-facing use.