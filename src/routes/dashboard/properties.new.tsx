import { useRef, useState, type FormEvent } from 'react'
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import {
  createListingSchema,
  listingStatusSchema,
  propertyTypeSchema,
  type CreateListingInput,
} from '../../lib/listings/schema'
import { createSupabaseServerClient } from '../../lib/supabase.server'
import type { ListingStatus, PropertyType } from '../../lib/supabase/types'

const createPropertySchema = createListingSchema
  .extend({
    asking_price: z
      .number()
      .finite()
      .min(0, 'Asking price must be zero or greater')
      .max(9_999_999_999.99, 'Asking price exceeds the database limit')
      .refine(
        (amount) => Number(amount.toFixed(2)) === amount,
        'Asking price can have at most two decimal places'
      ),
  })
  .strict()

type CreatePropertyInput = CreateListingInput
type PropertyField = keyof CreatePropertyInput
type FieldErrors = Partial<Record<PropertyField, string>>
type CreatePropertyResult =
  | { ok: true; id: string }
  | { ok: false; error: string }

const propertyTypeLabels: Record<PropertyType, string> = {
  single_family: 'Single family',
  multi_family: 'Multi family',
  commercial: 'Commercial',
  land: 'Land',
}

const listingStatusLabels: Record<ListingStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  under_contract: 'Under contract',
  closed: 'Closed',
}

export const createProperty = createServerFn({ method: 'POST' })
  .validator((input: unknown): CreatePropertyInput =>
    createPropertySchema.parse(input)
  )
  .handler(async ({ data }): Promise<CreatePropertyResult> => {
    const supabase = createSupabaseServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        ok: false,
        error: 'Your session has expired. Please sign in to create a property.',
      }
    }

    const { data: property, error } = await supabase
      .from('property_listings')
      .insert({ ...data, sponsor_id: user.id })
      .select('id')
      .single()

    if (error || !property) {
      return {
        ok: false,
        error: 'Could not create property. Please check your information and try again.',
      }
    }

    return { ok: true, id: property.id }
  })

export const Route = createFileRoute('/dashboard/properties/new')({
  component: NewPropertyPage,
})

function NewPropertyPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const submittingRef = useRef(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current || isSubmitting) return

    const formData = new FormData(event.currentTarget)
    const priceValue = String(formData.get('asking_price') ?? '').trim()
    const parsed = createPropertySchema.safeParse({
      title: String(formData.get('title') ?? ''),
      summary: String(formData.get('summary') ?? ''),
      property_type: String(formData.get('property_type') ?? ''),
      address_line1: String(formData.get('address_line1') ?? ''),
      address_line2:
        String(formData.get('address_line2') ?? '').trim() || null,
      city: String(formData.get('city') ?? ''),
      region: String(formData.get('region') ?? ''),
      postal_code: String(formData.get('postal_code') ?? ''),
      country: String(formData.get('country') ?? ''),
      asking_price: priceValue ? Number(priceValue) : Number.NaN,
      currency: String(formData.get('currency') ?? ''),
      status: String(formData.get('status') ?? ''),
    })

    if (!parsed.success) {
      const errors: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0]
        if (typeof field === 'string' && field in createPropertySchema.shape) {
          errors[field as PropertyField] ??= issue.message
        }
      }
      setFieldErrors(errors)
      setErrorMessage(null)
      return
    }

    setFieldErrors({})
    setErrorMessage(null)
    submittingRef.current = true
    setIsSubmitting(true)

    try {
      const result = await createProperty({ data: parsed.data })
      if (!result.ok) {
        setErrorMessage(result.error)
        return
      }

      try {
        await navigate({ to: '/dashboard/properties', replace: true })
        await router.invalidate()
      } catch {
        setErrorMessage(
          'Property created, but the properties list could not be refreshed. Return to My Properties to confirm it was saved.'
        )
      }
    } catch {
      setErrorMessage(
        'Could not create property. Please check your information and try again.'
      )
    } finally {
      submittingRef.current = false
      setIsSubmitting(false)
    }
  }

  function fieldError(field: PropertyField) {
    const message = fieldErrors[field]
    return message ? (
      <p id={`${field}-error`} className="mt-1 text-sm text-red-700">
        {message}
      </p>
    ) : null
  }

  const inputClassName =
    'mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-[var(--lagoon-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]'

  return (
    <section
      aria-labelledby="new-property-heading"
      className="mx-auto max-w-3xl space-y-6"
    >
      <header className="space-y-2">
        <h1
          id="new-property-heading"
          className="text-2xl font-bold text-[var(--sea-ink)]"
        >
          Add Property
        </h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          Enter the property details you want to share with investors.
        </p>
      </header>

      <form
        noValidate
        onSubmit={handleSubmit}
        aria-busy={isSubmitting || undefined}
        className="space-y-5 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7"
      >
        {errorMessage ? (
          <p
            className="rounded-lg bg-red-50 p-3 text-sm text-red-800"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="property-title"
              className="text-sm font-medium text-slate-800"
            >
              Title
            </label>
            <input
              id="property-title"
              name="title"
              type="text"
              required
              disabled={isSubmitting}
              className={inputClassName}
              aria-invalid={Boolean(fieldErrors.title)}
              aria-describedby={fieldErrors.title ? 'title-error' : undefined}
            />
            {fieldError('title')}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="property-summary"
              className="text-sm font-medium text-slate-800"
            >
              Summary
            </label>
            <textarea
              id="property-summary"
              name="summary"
              required
              rows={4}
              disabled={isSubmitting}
              className={inputClassName}
              aria-invalid={Boolean(fieldErrors.summary)}
              aria-describedby={
                fieldErrors.summary ? 'summary-error' : undefined
              }
            />
            {fieldError('summary')}
          </div>

          <div>
            <label
              htmlFor="property-type"
              className="text-sm font-medium text-slate-800"
            >
              Property type
            </label>
            <select
              id="property-type"
              name="property_type"
              required
              defaultValue=""
              disabled={isSubmitting}
              className={inputClassName}
              aria-invalid={Boolean(fieldErrors.property_type)}
              aria-describedby={
                fieldErrors.property_type ? 'property_type-error' : undefined
              }
            >
              <option value="" disabled>
                Select a property type
              </option>
              {propertyTypeSchema.options.map((propertyType) => (
                <option key={propertyType} value={propertyType}>
                  {propertyTypeLabels[propertyType]}
                </option>
              ))}
            </select>
            {fieldError('property_type')}
          </div>

          <div>
            <label
              htmlFor="property-status"
              className="text-sm font-medium text-slate-800"
            >
              Listing status
            </label>
            <select
              id="property-status"
              name="status"
              required
              defaultValue="draft"
              disabled={isSubmitting}
              className={inputClassName}
              aria-invalid={Boolean(fieldErrors.status)}
              aria-describedby={fieldErrors.status ? 'status-error' : undefined}
            >
              {listingStatusSchema.options.map((status) => (
                <option key={status} value={status}>
                  {listingStatusLabels[status]}
                </option>
              ))}
            </select>
            {fieldError('status')}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="property-address-line1"
              className="text-sm font-medium text-slate-800"
            >
              Street address
            </label>
            <input
              id="property-address-line1"
              name="address_line1"
              type="text"
              autoComplete="address-line1"
              required
              disabled={isSubmitting}
              className={inputClassName}
              aria-invalid={Boolean(fieldErrors.address_line1)}
              aria-describedby={
                fieldErrors.address_line1 ? 'address_line1-error' : undefined
              }
            />
            {fieldError('address_line1')}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="property-address-line2"
              className="text-sm font-medium text-slate-800"
            >
              Address line 2 <span className="font-normal text-slate-500">(optional)</span>
            </label>
            <input
              id="property-address-line2"
              name="address_line2"
              type="text"
              autoComplete="address-line2"
              disabled={isSubmitting}
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="property-city"
              className="text-sm font-medium text-slate-800"
            >
              City
            </label>
            <input
              id="property-city"
              name="city"
              type="text"
              autoComplete="address-level2"
              required
              disabled={isSubmitting}
              className={inputClassName}
              aria-invalid={Boolean(fieldErrors.city)}
              aria-describedby={fieldErrors.city ? 'city-error' : undefined}
            />
            {fieldError('city')}
          </div>

          <div>
            <label
              htmlFor="property-region"
              className="text-sm font-medium text-slate-800"
            >
              State, province, or region
            </label>
            <input
              id="property-region"
              name="region"
              type="text"
              autoComplete="address-level1"
              required
              disabled={isSubmitting}
              className={inputClassName}
              aria-invalid={Boolean(fieldErrors.region)}
              aria-describedby={fieldErrors.region ? 'region-error' : undefined}
            />
            {fieldError('region')}
          </div>

          <div>
            <label
              htmlFor="property-postal-code"
              className="text-sm font-medium text-slate-800"
            >
              Postal code
            </label>
            <input
              id="property-postal-code"
              name="postal_code"
              type="text"
              autoComplete="postal-code"
              required
              disabled={isSubmitting}
              className={inputClassName}
              aria-invalid={Boolean(fieldErrors.postal_code)}
              aria-describedby={
                fieldErrors.postal_code ? 'postal_code-error' : undefined
              }
            />
            {fieldError('postal_code')}
          </div>

          <div>
            <label
              htmlFor="property-country"
              className="text-sm font-medium text-slate-800"
            >
              Country
            </label>
            <input
              id="property-country"
              name="country"
              type="text"
              autoComplete="country-name"
              required
              disabled={isSubmitting}
              className={inputClassName}
              aria-invalid={Boolean(fieldErrors.country)}
              aria-describedby={
                fieldErrors.country ? 'country-error' : undefined
              }
            />
            {fieldError('country')}
          </div>

          <div>
            <label
              htmlFor="property-asking-price"
              className="text-sm font-medium text-slate-800"
            >
              Asking price
            </label>
            <input
              id="property-asking-price"
              name="asking_price"
              type="number"
              min="0"
              max="9999999999.99"
              step="0.01"
              inputMode="decimal"
              required
              disabled={isSubmitting}
              className={inputClassName}
              aria-invalid={Boolean(fieldErrors.asking_price)}
              aria-describedby={
                fieldErrors.asking_price ? 'asking_price-error' : undefined
              }
            />
            {fieldError('asking_price')}
          </div>

          <div>
            <label
              htmlFor="property-currency"
              className="text-sm font-medium text-slate-800"
            >
              Currency
            </label>
            <input
              id="property-currency"
              name="currency"
              type="text"
              required
              disabled={isSubmitting}
              className={inputClassName}
              aria-invalid={Boolean(fieldErrors.currency)}
              aria-describedby={
                fieldErrors.currency ? 'currency-error' : undefined
              }
            />
            {fieldError('currency')}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-[var(--lagoon-deep)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Creating…' : 'Create Property'}
          </button>
          <Link
            to="/dashboard/properties"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 no-underline transition hover:bg-slate-50"
          >
            Back to Properties
          </Link>
        </div>
      </form>
    </section>
  )
}
