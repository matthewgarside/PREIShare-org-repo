// src/lib/supabase.server.ts
// Server-only module. Do not import this file from browser React code.
import { createServerOnlyFn } from '@tanstack/react-start'
import { getCookies, setCookie, setResponseHeaders } from '@tanstack/react-start/server'
import { createServerClient as createSupabaseServerClientFactory } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase/types'

function requirePublicEnv(name: string, value: string | undefined): string {
  if (!value || !value.trim()) {
    throw new Error(`Missing required server env ${name}. See .env.example and docs/setup/supabase-env-checklist.md.`)
  }
  return value
}

function requireServerSecret(name: string, value: string | undefined): string {
  if (!value || !value.trim()) {
    throw new Error(`Missing required server-only env ${name}. See .env.example and docs/setup/supabase-env-checklist.md.`)
  }
  return value
}

export const createSupabaseServerClient = createServerOnlyFn(() => {
  const url = requirePublicEnv('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL)
  const publishableKey = requirePublicEnv(
    'VITE_SUPABASE_PUBLISHABLE_KEY',
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  )

  return createSupabaseServerClientFactory<Database>(url, publishableKey, {
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
 * Privileged server-only helper for trusted admin tasks only.
 * This must never be used for normal sponsor listing operations.
 */
export function createSupabasePrivilegedClient() {
  const url = requirePublicEnv('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL)
  const secretKey = requireServerSecret('SUPABASE_SECRET_KEY', process.env.SUPABASE_SECRET_KEY)

  return createClient<Database>(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
