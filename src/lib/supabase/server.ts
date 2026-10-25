import { createServerOnlyFn } from '@tanstack/react-start'
import {
  getCookies,
  setCookie,
  setResponseHeaders,
} from '@tanstack/react-start/server'
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import type { Database } from './types'

export const createServerClient = createServerOnlyFn(() => {
  const url = process.env.SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_ANON_KEY (or their VITE_ public fallbacks). See docs/env-var-checklist.md'
    )
  }

  return createSupabaseServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({
          name,
          value,
        }))
      },
      setAll(cookies, headers) {
        setResponseHeaders(new Headers(headers))
        for (const { name, value, options } of cookies) {
          setCookie(name, value, {
            ...options,
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
