import { z } from 'zod'

export const propertyTypeSchema = z.enum([
  'single_family',
  'multi_family',
  'commercial',
  'land',
])

export const listingStatusSchema = z.enum([
  'draft',
  'active',
  'under_contract',
  'closed',
])

const listingFields = {
  title: z.string().trim().min(1, 'Title is required'),
  summary: z.string().trim().min(1, 'Summary is required'),
  property_type: propertyTypeSchema,
  address_line1: z.string().trim().min(1, 'Address is required'),
  address_line2: z.string().nullable().optional(),
  city: z.string().trim().min(1, 'City is required'),
  region: z.string().trim().min(1, 'Region is required'),
  postal_code: z.string().trim().min(1, 'Postal code is required'),
  country: z.string().trim().min(1, 'Country is required'),
  asking_price: z
    .number()
    .finite()
    .min(0, 'Asking price must be zero or greater')
    .max(9_999_999_999.99, 'Asking price exceeds the database limit'),
  currency: z.string().trim().min(1, 'Currency is required'),
  status: listingStatusSchema,
}

const listingFieldsSchema = z.object(listingFields)

export const updateListingSchema = z
  .object({ id: z.string().uuid('Listing id must be a valid UUID') })
  .extend(listingFieldsSchema.partial().shape)
  .strict()
  .refine(
    (fields) => Object.keys(fields).some((field) => field !== 'id'),
    'At least one field must be provided to update.'
  )

export const createListingSchema = listingFieldsSchema.strict()

export type CreateListingInput = z.infer<typeof createListingSchema>
export type UpdateListingInput = z.infer<typeof updateListingSchema>
