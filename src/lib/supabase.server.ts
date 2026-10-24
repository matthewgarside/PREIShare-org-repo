// src/lib/supabase.server.ts
// Server-only module. Do not import this file from browser React code.
import { createServerOnlyFn } from '@tanstack/react-start'
import { getCookies, setCookie, setResponseHeaders } from '@tanstack/react-start/server'
import { createServerClient as createSupabaseServerClientFactory } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase/types'

function requireServerEnv(name: string, value: string | undefined): string {
  if (!value || !value.trim()) {
    throw new Error(`Missing required server env ${name}. See docs/env-var-checklist.md.`)
  }
  return value
}

function requireServiceRoleKey(name: string, value: string | undefined): string {
  if (!value || !value.trim()) {
    throw new Error(`Missing required server-only env ${name}. See docs/env-var-checklist.md.`)
  }
  return value
}

/**
 * Default server client for authenticated sponsor dashboard operations.
 * It uses the public Supabase anon key and the current request's cookies,
 * allowing PostgreSQL RLS to enforce sponsor ownership for property_listings.
 * This is the correct client for normal sponsor reads and writes and must not
 * use service-role credentials.
 */
export const createSupabaseServerClient = createServerOnlyFn(() => {
  const url = requireServerEnv('SUPABASE_URL', process.env.SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL)
  const anonKey = requireServerEnv(
    'SUPABASE_ANON_KEY',
    process.env.SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY
  )

  return createSupabaseServerClientFactory<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({
          name,
          value,
        }))
      },
      setAll(
        cookies: Array<{ name: string; value: string; options: Record<string, unknown> }>,
        headers: Record<string, string>
      ) {
        setResponseHeaders(new Headers(headers))
        for (const { name, value, options } of cookies) {
          setCookie(name, value, {
            ...(options ?? {}),
            httpOnly: true,
            secure: import.meta.env.PROD,
            sameSite: 'lax',
            path: '/',
          })
        }
      },
    },
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: true,
    },
  })
})

/**
 * Privileged server-only helper for explicitly authorized administrative
 * operations requiring elevated database privileges. Never use this client for
 * ordinary sponsor listing work.
 */
export function createSupabaseServiceRoleClient() {
  const url = requireServerEnv('SUPABASE_URL', process.env.SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL)
  const serviceRoleKey = requireServiceRoleKey(
    'SUPABASE_SERVICE_ROLE_KEY',
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
