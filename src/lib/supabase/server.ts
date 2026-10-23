import { createServerOnlyFn } from '@tanstack/react-start'
import {
  getCookies,
  setCookie,
  setResponseHeaders,
} from '@tanstack/react-start/server'
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import type { Database } from './types'

export const createServerClient = createServerOnlyFn(() => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (!url || !publishableKey) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. See docs/setup/supabase-env-checklist.md'
    )
  }

  return createSupabaseServerClient<Database>(url, publishableKey, {
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
