// src/lib/supabase.server.ts
// Server-only module. Do not import this file from browser React code.
import { createServerClient as createProjectServerClient } from './supabase/server'

export function createSupabaseServerClient() {
  return createProjectServerClient()
}
