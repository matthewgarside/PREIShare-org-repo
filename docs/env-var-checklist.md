# PREIShare Environment Variable Checklist

## 1. Purpose

PREIShare separates public and private environment variables so browser code
receives only configuration that is safe to share, while privileged credentials
remain on trusted servers. The application uses Supabase for sponsor
authentication and PostgreSQL property listings.

## 2. Environment Variable Classification

| Variable Name | Classification | Purpose | Where It Can Be Used |
| --- | --- | --- | --- |
| `VITE_SUPABASE_URL` | Public / Client-safe | Identifies the Supabase project URL. | Browser and server configuration where appropriate. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public / Client-safe | Initializes the public Supabase client. | Browser and server configuration where appropriate. |
| `SUPABASE_SECRET_KEY` | Private / Server-only | Provides privileged access for trusted server-side operations, if required. | Trusted server-side code only. |

Public Supabase configuration does not authenticate a user or grant access to
their listings by itself. Authentication and PostgreSQL Row Level Security
(RLS) are still necessary to verify sponsor identity and restrict listing
access to its owner.

## 3. Browser vs. Server Security Rules

- Variables beginning with `VITE_` may be included in browser bundles. Treat
  their values as public.
- Do not give a server-only credential the `VITE_` prefix.
- Never import a secret key into browser components or shared modules that can
  be included in the browser bundle.
- Never expose a secret key through client-facing responses, including loader
  data or API responses.
- Never hardcode private credentials in JavaScript or TypeScript files.
- Server-only code must verify authentication and authorization before
  performing protected operations.
- Privileged Supabase keys can bypass RLS. Do not use them for ordinary sponsor
  listing requests.
- Normal sponsor listing operations must use the authenticated user's
  permissions so PostgreSQL RLS enforces listing ownership.

## 4. Git Security

- Real environment files such as `.env`, `.env.local`, and
  `.env.production.local` must remain ignored by Git.
- `.env.example` may be committed because it contains placeholders only.
- Never commit real API keys, database passwords, or other credentials.
- Do not put secrets in documentation, logs, or code examples.
- `.gitignore` does not automatically untrack files that were already
  committed. Check tracked paths separately; do not assume an ignore rule
  removes previously committed files.

## 5. Local Developer Checklist

- [ ] Copy the safe `.env.example` template to a local environment file, such
  as `.env.local`.
- [ ] Add real values only to the local file, and do not commit it.
- [ ] Keep private credentials server-only and never use the `VITE_` prefix
  for them.
- [ ] Confirm `.gitignore` protects real environment files and allows
  `.env.example`.
- [ ] Check that browser code and client-facing responses do not expose server
  secrets.
- [ ] Verify authenticated sponsor listing operations continue to respect
  PostgreSQL RLS and ownership rules.

## 6. Security Verification

Perform these checks in the project environment. Record the results when
verification is complete; this checklist does not claim that any check has
passed.

1. **Check the example contains placeholders only.** Review `.env.example` and
   confirm it has generic example values, not real project identifiers,
   credentials, or JWT-like tokens.
2. **Check private variable names.** Confirm no private variable uses the
   `VITE_` prefix. In particular, `SUPABASE_SECRET_KEY` must remain
   unprefixed.
3. **Check Git ignore and tracked-file status.** Run
   `git check-ignore -v .env .env.local .env.development .env.production .env.production.local`
   and confirm the real environment paths are ignored. Confirm
   `git check-ignore .env.example` produces no ignored result. Separately
   inspect tracked filenames (without opening their contents), because ignore
   rules do not untrack files already committed.
4. **Check the browser bundle.** Inspect the generated client bundle for
   private credentials and confirm no server-only credential is included.
   Do not put real secret values into search commands, logs, or reports.
5. **Check shared React code.** Search shared components and routes for
   `SUPABASE_SECRET_KEY` and other server-only credentials; they should not be
   referenced there.
6. **Check authenticated listing access and RLS.** Using separate sponsor
   accounts, verify that each account can access its own listings but cannot
   access another sponsor's listings. Confirm normal listing requests use the
   authenticated sponsor's permissions and are enforced by PostgreSQL RLS.
