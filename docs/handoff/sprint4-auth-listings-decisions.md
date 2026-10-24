# Sprint 4 Handoff — Sponsor Auth & Postgres Property Listings

**Project:** PREIshare dashboard  
**Sprint:** 4 (Topic 1) — Supabase auth & database  
**Audience:** Sponsors and the next-sprint implementer  
**Status date:** YYYY-MM-DD

## 1. Client story recap
PREIshare sponsors need a secure way to sign in and manage real property listings—not mock data in the browser—while secret keys stay out of the client bundle.

## 2. Delivered vs original request
| Client need | Delivered? | Where / evidence |
| --- | --- | --- |
| Secure sponsor login | Yes / Partial | Auth routes + session guard (see verification checklist) |
| Postgres-backed listings (create/read/display) | Yes / Partial | Server loaders/actions + dashboard listings UI |
| Row-level security so sponsors only see allowed rows | Yes / Partial | Migration + RLS policy review |
| Secrets kept out of the client bundle | Yes / Partial | `.env.example` + server vs browser Supabase clients |

Summarize any gaps in one short paragraph tied to docs/verification/sprint4-auth-listings-checklist.md.

## 3. Architecture decisions (keep short)
- **Auth:** Supabase Auth; session checked on protected dashboard routes.
- **Data:** PostgreSQL `property_listings` (or agreed table name) per docs/data-model/property-listings-schema.md.
- **Authorization:** RLS policies; browser uses anon key + user JWT; privileged work stays on the server.
- **Clients:** `src/lib/supabase/server.ts` (server-only secrets) vs `src/lib/supabase/client.ts` (public URL + anon key only).
- **Env hygiene:** Document which vars are `VITE_`/public vs server-only; never commit real `.env` values.

## 4. How to run locally (sponsor-friendly)
1. Copy `.env.example` → `.env` and fill values from the Supabase project (see docs/setup/supabase-env-checklist.md).
2. Apply migrations / confirm RLS is enabled for listings.
3. Install deps and start the TanStack Start dev server (project standard command).
4. Sign up / log in as a test sponsor → open dashboard listings → create one listing → confirm it reloads from Postgres.

## 5. Known limitations
- List only what is true after verification (examples: no email templates branded; no password reset UX; listing fields still minimal; no approval workflow; no full-text/vector search yet).
- Call out any checklist items that failed or were skipped.

## 6. Recommended next-sprint work (pick with stakeholders)
1. **Richer listing fields** — more columns, validation, and edit/delete flows on top of the current schema.
2. **Approvals workflow** — draft → submit → approve/reject states and who may transition them (RLS + UI).
3. **pgvector search** — embeddings + similarity search for listings once core CRUD and auth are stable.

For each option, note dependency on current auth + RLS (do not recommend ripping out secret separation).

## 7. Open questions for stakeholders
- Who may create vs only view listings?
- Is multi-sponsor isolation required in the next sprint?
- Preferred next theme: richer fields, approvals, or search?

## 8. Source artifacts
- docs/requirements/sponsor-auth-and-listings-brief.md
- docs/verification/sprint4-auth-listings-checklist.md
- docs/data-model/property-listings-schema.md
- docs/setup/supabase-env-checklist.md