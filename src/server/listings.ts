import { createServerFn } from '@tanstack/react-start'
import { getUser } from '../lib/auth/session'
import {
  createListingSchema,
  updateListingSchema,
  type CreateListingInput,
  type UpdateListingInput,
} from '../lib/listings/schema'
import { createServerClient } from '../lib/supabase/server'
import type { PropertyListingRow } from '../lib/supabase/types'

export type ListingRow = PropertyListingRow

export type ListingsResult =
  | { ok: true; listings: ListingRow[] }
  | { ok: false; error: string }

export type ListingMutationResult =
  | { ok: true; listing: ListingRow }
  | { ok: false; error: string }

export const listMyListings = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ListingsResult> => {
    const user = await getUser()
    if (!user) {
      return { ok: false, error: 'You must be signed in to view listings.' }
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('property_listings')
      .select('*')
      .eq('sponsor_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return { ok: false, error: 'Could not load listings. Please try again.' }
    }

    return { ok: true, listings: data }
  }
)

export const createListing = createServerFn({ method: 'POST' })
  .validator((input: unknown): CreateListingInput =>
    createListingSchema.parse(input)
  )
  .handler(async ({ data }): Promise<ListingMutationResult> => {
    const user = await getUser()
    if (!user) {
      return { ok: false, error: 'You must be signed in to create a listing.' }
    }

    const supabase = createServerClient()
    const { data: listing, error } = await supabase
      .from('property_listings')
      .insert({ ...data, sponsor_id: user.id })
      .select('*')
      .single()

    if (error) {
      return {
        ok: false,
        error: 'Could not create listing. Please check the listing details and try again.',
      }
    }

    return { ok: true, listing }
  })

export const updateListing = createServerFn({ method: 'POST' })
  .validator((input: unknown): UpdateListingInput =>
    updateListingSchema.parse(input)
  )
  .handler(async ({ data }): Promise<ListingMutationResult> => {
    const user = await getUser()
    if (!user) {
      return { ok: false, error: 'You must be signed in to update a listing.' }
    }

    const { id, ...patch } = data
    const supabase = createServerClient()
    const { data: listing, error } = await supabase
      .from('property_listings')
      .update(patch)
      .eq('id', id)
      .eq('sponsor_id', user.id)
      .select('*')
      .maybeSingle()

    if (error || !listing) {
      return {
        ok: false,
        error:
          'Could not update listing. It may not exist or you may not have permission to modify it.',
      }
    }

    return { ok: true, listing }
  })
