import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export function createBrowserSupabaseClient() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (!url || !publishableKey) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. See docs/setup/supabase-env-checklist.md'
    )
  }

  return createClient<Database>(url, publishableKey)
}