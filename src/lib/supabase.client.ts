// src/lib/supabase.client.ts
// Browser-safe: only public env values are exposed to client-side code.
import { createBrowserSupabaseClient as createProjectBrowserSupabaseClient } from './supabase/client'

let browserClient: ReturnType<typeof createProjectBrowserSupabaseClient> | undefined

export function createSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createProjectBrowserSupabaseClient()
  }

  return browserClient
}

export const supabaseBrowser = createSupabaseBrowserClient()
