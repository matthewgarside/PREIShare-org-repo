# Supabase environment setup checklist

Use this guide to prepare local or deployment environment variables. It does not
set up Supabase authentication, a database connection, or listing functionality.

## Find the Supabase values

In your Supabase project dashboard, open **Project Settings → API** to find the
Project URL and API keys. Use the anon key for browser-facing features. Use
the service-role key only in trusted server-side code when privileged
operations are explicitly required.

## Variable visibility

| Variable | Visibility | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Public | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Public | Supabase anon API key |
| `SUPABASE_URL` | Server override | Optional server-side project URL; falls back to `VITE_SUPABASE_URL` |
| `SUPABASE_ANON_KEY` | Server override | Optional server-side anon key; falls back to `VITE_SUPABASE_ANON_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Privileged server-side operations |

Vite exposes variables with the `VITE_` prefix to browser code. Treat both
`VITE_` variables as public; never put secrets in them. Keep
`SUPABASE_SERVICE_ROLE_KEY` unprefixed and only read it in server-only code.
This service-role key can bypass database protections, so exposing it could
let someone perform privileged actions as your application.

## Local setup

1. Copy `.env.example` to `.env.local` (or `.env`).
2. Replace the placeholders in your local copy with values from Supabase.
3. Keep `.env.local` or `.env` on your machine; do not commit it.
4. Restart the development server after changing environment variables.

With TanStack Start, use public `VITE_` values only where browser code needs
them. Read `SUPABASE_SERVICE_ROLE_KEY` only in server-side code, such as server
functions or handlers. Do not import it into client components or shared
modules that are included in the browser bundle, and never return it to the
client in loader data or an API response.

## GitHub and deployment

Never commit the service-role key to GitHub. A committed secret can be copied from
repository history even after it is removed from a later commit. If a real key
is exposed, revoke or rotate it in Supabase.

The repository `.gitignore` ignores `.env` and `.env.*` files while allowing
`.env.example` to be committed. Confirm the rules locally with:

```sh
git check-ignore -v .env .env.local .env.production
git check-ignore -v .env.example
```

The first command should list ignore rules for all three real environment-file
paths. The second should report that `.env.example` is not ignored. Do not use
`git add -f` on real environment files.

For deployment, add `SUPABASE_SERVICE_ROLE_KEY` through your hosting provider's
server-side environment-variable or secret-management settings. Restrict it to
the server runtime; do not put it in client/build-exposed settings. Configure
the public URL and anon key separately as public variables, according to the
provider's guidance. Do not paste secrets into source files, build logs, or
deployment documentation.

## Authentication and listing access

Normal sponsor listing operations must require a verified sponsor session and
enforce permissions on the server. Database Row Level Security (RLS) policies
should limit sponsors to their own listings. A public URL or publishable key is
not authorization, and a service-role key must not be used to bypass those checks
for ordinary sponsor requests. Authentication, database access, and listing
features are not implemented by this setup guide.
