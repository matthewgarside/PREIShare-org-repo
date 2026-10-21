# Sponsor Authentication and Property Listings Requirements Brief

## Purpose

This brief describes a planned sponsor sign-in and property-listing feature. The
current app is a frontend demo. This document does not mean that authentication
or a database is already connected.

## Actors

| Actor | What they need to do |
| --- | --- |
| Sponsor | Create or use an account, sign in, and view or create their own property listings. |
| Signed-out visitor | Sign in or create an account; cannot view protected sponsor listings. |
| Application server | Verify identity and permissions, manage sessions, and read or write listing data. |
| Project maintainer | Configure the service safely and keep credentials out of source control and browser code. |

## Goals

1. Give sponsors a secure way to create an account, sign in, and sign out.
2. Require a valid sponsor session before showing sponsor listing pages or data.
3. Save sponsor-owned property listings in PostgreSQL so they remain available after a reload.
4. Make sure sponsors can access only listings that belong to them.
5. Keep the authentication and database design compatible with the existing TanStack Start and TypeScript app.

The repository does not currently select an authentication provider or define a
database schema. Those choices should be made before implementation; this brief
does not assume a provider or add a new data-layer tool.

## In scope for the planned sprint

- Sponsor account creation, sign-in, and sign-out using the authentication approach selected by the team.
- A protected sponsor area for viewing and creating property listings.
- Server-verified sessions and permission checks for protected pages and listing operations.
- PostgreSQL persistence for listings, including a reliable association between each listing and its sponsor.
- Basic validation of required listing information, such as a title and property address.
- Clear empty, loading, and error states when listing data is unavailable or a request fails.
- Documenting required environment variable names without including real credentials.

## Out of scope for the planned sprint

- Editing or deleting existing listings.
- Public listing search, investor deal discovery, or a public marketplace.
- Payments, investment transactions, document uploads, or financial calculations.
- Admin dashboards, complex staff roles, and sponsor organizations with multiple members.
- Social sign-in providers and password recovery, unless the team selects these as a separate requirement.
- Migrating the existing investor demo data into production records.

## Success criteria

- [ ] A sponsor can create an account, sign in, and sign out successfully.
- [ ] A signed-out visitor who opens a protected sponsor page is redirected to sign in or receives an access-denied response; listing data is not returned.
- [ ] After signing in, a sponsor can submit a listing with the required fields and see it in their listing view.
- [ ] A newly created listing is still present after a page reload, showing that it was persisted rather than held only in browser memory.
- [ ] A sponsor cannot read another sponsor's listing by changing a page URL or request identifier.
- [ ] Missing or invalid required listing fields are rejected with a useful error and are not saved.
- [ ] Signing out ends access to protected pages and listing operations.
- [ ] Production session cookies are marked `Secure`, `HttpOnly`, and `SameSite` as appropriate; session signing secrets are not readable by browser JavaScript.
- [ ] A production client build contains no database password or URL, service-role or private API key, session secret, or server authentication code.
- [ ] Setup documentation names required environment variables but contains no real secret values.

## Current dashboard and mock-data observations

- The file-based dashboard pages are `/dashboard` (overview),
  `/dashboard/portfolio`, `/dashboard/deals`, and `/dashboard/profile`.
- The shared dashboard layout is currently a visual shell. It does not check for
  a signed-in user, so the dashboard routes are not protected.
- The overview labels its figures as placeholders and renders empty portfolio
  summary and activity sections.
- The Portfolio page uses two hard-coded sample holdings in
  `PortfolioTable`; the component labels them as demonstration data.
- The Deals page uses three hard-coded sample deals in `DealsList`, also labeled
  as demonstration data.
- The Profile page uses a hard-coded sample investor profile in `ProfileCard`.
- `src/fixtures/sample-investor-listings.ts` defines four sample investor
  listings, but the dashboard does not import or display that fixture.
- `src/lib/user.ts` contains a `getUser()` stub that always returns `null`. It is
  not a working sign-in flow or session manager.
- The current UI is for an investor dashboard. It has no sponsor sign-in page
  or sponsor listing-management page, and the mock holdings/deals/profile are
  not PostgreSQL records.

## Server-only security boundaries

The browser must never receive:

- PostgreSQL credentials or a direct privileged database connection URL.
- Private API keys, provider secrets, service-role keys, or keys that bypass
  database access policies.
- Session signing/encryption secrets, private tokens, or other credentials used
  to authenticate or administer the service.
- Server-side authentication code or trusted authorization decisions. Client
  code may display forms and send requests, but the server must verify identity
  and permission for every protected operation.

Keep these values in server-only environment configuration, out of source
control and out of browser-exposed environment variables (for example, variables
intended for client bundles). If the selected provider requires a public client
key, expose it only as documented by that provider and enforce permissions on
the server and in database policies. Never treat a public key as a substitute
for authorization.

Use server-side access checks and database policies so a sponsor can read or
create only records associated with their verified identity. The exact provider,
schema, and policy syntax remain implementation decisions.
