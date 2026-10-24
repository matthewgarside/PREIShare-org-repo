// src/lib/supabase.client.ts
// Browser-safe Supabase client. This file must never touch server-only credentials.
import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase/types'

function requirePublicEnv(name: string, value: string | undefined): string {
  if (!value || !value.trim()) {
    throw new Error(`Missing required browser env ${name}. See docs/env-var-checklist.md.`)
  }
  return value
}

const supabaseUrl = requirePublicEnv('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL)
const supabaseAnonKey = requirePublicEnv(
  'VITE_SUPABASE_ANON_KEY',
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export function createSupabaseBrowserClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

export const supabaseBrowser = createSupabaseBrowserClient()
