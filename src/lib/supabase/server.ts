import { createServerOnlyFn } from '@tanstack/react-start'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export const createAuthenticatedServerSupabaseClient = createServerOnlyFn(
  async (accessToken: string) => {
    const url = import.meta.env.VITE_SUPABASE_URL
    const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

    if (!url || !publishableKey) {
      throw new Error(
        'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. See docs/setup/supabase-env-checklist.md'
      )
    }

    if (!accessToken.trim()) {
      throw new Error('A sponsor session access token is required.')
    }

    const client = createClient<Database>(url, publishableKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })

    const { data, error } = await client.auth.getUser(accessToken)
    if (error) {
      throw new Error('Unable to verify the sponsor session.', { cause: error })
    }
    if (!data.user) {
      throw new Error('The sponsor session does not identify an authenticated user.')
    }

    return client
  }
)
