# Property Listings Schema Design

This is a proposed design for sponsor-owned property listings in PostgreSQL. It
does not create a table or implement authentication. The fields reuse the
property, address, and asking-price vocabulary in `src/types/`; they are not a
claim that the investor dashboard's mock data is already stored in a database.

## 1. Property Listing Fields

The proposed table is `property_listings`. Each database row represents one
property listing owned by one signed-in sponsor.

| Column | PostgreSQL type | Required? | Purpose and TypeScript mapping |
| --- | --- | --- | --- |
| `id` | `uuid` | Yes | Primary key with a generated UUID. Maps to `InvestorListing.id`. |
| `sponsor_id` | `uuid` | Yes | Foreign key to `auth.users(id)`; identifies the sponsor who owns the row. See section 2. |
| `title` | `text` | Yes | Short listing title. Maps to `InvestorListing.title`; also required by the sponsor requirements. |
| `summary` | `text` | Yes | Plain-language listing description. Maps to `InvestorListing.summary`. |
| `property_type` | `text` | Yes | Property category. Use the fixed values `single_family`, `multi_family`, `commercial`, or `land` from `PropertyType`. |
| `address_line1` | `text` | Yes | Street address; maps to `Address.line1` and satisfies the required property address. |
| `address_line2` | `text` | No | Optional unit, suite, or apartment; maps to `Address.line2`. |
| `city` | `text` | Yes | City; maps to `Address.city`. |
| `region` | `text` | Yes | State, province, or region; maps to `Address.region`. |
| `postal_code` | `text` | Yes | ZIP or postal code; maps to `Address.postalCode`. |
| `country` | `text` | Yes | Country; maps to `Address.country`. No default country is assumed. |
| `asking_price` | `numeric(12,2)` | Yes | The property's asking price; maps to `FinancialSummary.askingPrice`. It should not be negative. |
| `currency` | `text` | Yes | Currency code for the asking price; maps to `FinancialSummary.currency`. |
| `status` | `text` | Yes | Listing workflow state, restricted to the current `ListingStatus` values: `draft`, `active`, `under_contract`, or `closed`. |
| `created_at` | `timestamptz` | Yes | Creation time, normally set by the database. Maps to `InvestorListing.createdAt` as an ISO date string in the app. |
| `updated_at` | `timestamptz` | Yes | Most recent update time, normally set by the database or server. Maps to `InvestorListing.updatedAt` as an ISO date string in the app. |

The nested TypeScript `address` and `financialSummary` objects are represented
by related columns in this relational table, then grouped into objects when
the application reads them. Optional projected return and cap-rate values in
`FinancialSummary` are not included: financial calculations are outside this
sprint. The current sponsor requirements do not request contact management or
asset-ownership details, so this table does not add `contacts`,
`primaryContactId`, or the separate `Ownership` object. `sponsor_id` is account
ownership for access control, not a claim about legal ownership of the property.

**Type follow-up before implementation:** `src/types/listing-status.ts` uses
`draft`, `active`, `under_contract`, and `closed`, while
`docs/domain/investor-listing-domain-brief.md` describes
`draft`, `published`, `under_offer`, `sold`, and `archived`. This proposal
follows the current TypeScript union as requested, but the team should choose
one shared set before implementing a database constraint or migration.

## 2. Ownership and Authentication

`sponsor_id` is required and references `auth.users(id)`. When a sponsor signs
in with Supabase Auth, Supabase validates the session and provides the user's
identity. In a database request made with that sponsor's authenticated session,
`auth.uid()` returns the signed-in user's ID. The listing's `sponsor_id` must
match that ID.

For a new listing, trusted server-side code should take the sponsor ID from the
verified session rather than trust an ID supplied by the browser. The database
foreign key ensures that the referenced account exists; the RLS policies in
section 3 ensure that the signed-in user can act only on rows tied to their own
ID.

## 3. Proposed Row Level Security (RLS) Rules

Enable RLS on `property_listings`. Only authenticated sponsors may access
protected listing data, and each policy checks ownership against
`auth.uid()`:

| Operation | Proposed rule |
| --- | --- |
| View listings | Allow an authenticated user to select rows only when `sponsor_id = auth.uid()`. There is no public listing-read policy in this sprint. |
| Create listings | Allow an authenticated user to insert a row only when its `sponsor_id = auth.uid()`. The server should set this value from the verified session. |
| Update listings | Not supported in this sprint. Do not add an update policy yet. |
| Delete listings | Not supported in this sprint. Do not add a delete policy yet. |

These ownership checks prevent one sponsor from reading or creating a listing
under another sponsor's account, even if they change an ID in a URL or request.
An unauthenticated visitor has no matching authenticated identity, so they
cannot read or create protected listing data. The sprint does not call for a
public marketplace, listing edits, or listing deletion; those capabilities
should not be added as policies.

## 4. Server vs. Browser Operations

The browser may use the public Supabase project URL and publishable key for
sign-in UI and authenticated requests. Both are public configuration, not proof
of permission. The browser can collect listing details and send them to the
application, but it must not decide which sponsor owns a listing.

TanStack Start server-side code should verify the sponsor session for protected
pages and listing requests. It can read or create listings using the
authenticated sponsor's identity so RLS applies. The insert's `sponsor_id`
should come from that verified identity, not from untrusted form data.

Database passwords, direct privileged database connection URLs, Supabase
secret/service-role keys, session secrets, and other privileged operations must
remain server-only. A service-role key can bypass RLS, so ordinary sponsor
listing reads and creates must use the sponsor's authenticated permissions
instead of a service-role key. Never expose a secret in browser code, a
client-visible environment variable, or a response sent to the browser.
