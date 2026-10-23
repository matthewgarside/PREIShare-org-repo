import { useRef, useState, type FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import {
  createListingSchema,
  listingStatusSchema,
  propertyTypeSchema,
  type CreateListingInput,
} from '../../lib/listings/schema'
import type { ListingStatus, PropertyType } from '../../lib/supabase/types'

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

type ListingField = keyof CreateListingInput
type FieldErrors = Partial<Record<ListingField, string>>

export type ListingFormProps = {
  onSubmit: (values: CreateListingInput) => void | Promise<void>
  errorMessage?: string | null
  isSubmitting?: boolean
}

export function ListingForm({
  onSubmit,
  errorMessage = null,
  isSubmitting = false,
}: ListingFormProps) {
  const submittingRef = useRef(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current || isSubmitting) return

    const formData = new FormData(event.currentTarget)
    const priceValue = String(formData.get('asking_price') ?? '')
    const parsed = createListingSchema.safeParse({
      title: String(formData.get('title') ?? ''),
      summary: String(formData.get('summary') ?? ''),
      property_type: String(formData.get('property_type') ?? ''),
      address_line1: String(formData.get('address_line1') ?? ''),
      address_line2: String(formData.get('address_line2') ?? '') || undefined,
      city: String(formData.get('city') ?? ''),
      region: String(formData.get('region') ?? ''),
      postal_code: String(formData.get('postal_code') ?? ''),
      country: String(formData.get('country') ?? ''),
      asking_price: priceValue.trim() ? Number(priceValue) : Number.NaN,
      currency: String(formData.get('currency') ?? ''),
      status: String(formData.get('status') ?? ''),
    })

    if (!parsed.success) {
      const errors: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0]
        if (typeof field === 'string' && field in createListingSchema.shape) {
          errors[field as ListingField] ??= issue.message
        }
      }
      setFieldErrors(errors)
      setSubmissionError(null)
      return
    }

    setFieldErrors({})
    setSubmissionError(null)
    submittingRef.current = true
    try {
      await onSubmit(parsed.data)
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? `Could not submit the listing: ${error.message}`
          : 'Could not submit the listing. Please try again.'
      )
    } finally {
      submittingRef.current = false
    }
  }

  function fieldError(field: ListingField) {
    const message = fieldErrors[field]
    return message ? (
      <p id={`${field}-error`} className="mt-1 text-sm text-red-700">
        {message}
      </p>
    ) : null
  }

  const displayedError = submissionError ?? errorMessage
  const inputClassName =
    'mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-[var(--lagoon-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]'

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-busy={isSubmitting || undefined}
      className="space-y-5 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7"
    >
      {displayedError ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">
          {displayedError}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="listing-title" className="text-sm font-medium text-slate-800">
            Title
          </label>
          <input
            id="listing-title"
            name="title"
            type="text"
            required
            autoComplete="off"
            disabled={isSubmitting}
            className={inputClassName}
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby={fieldErrors.title ? 'title-error' : undefined}
          />
          {fieldError('title')}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="listing-summary" className="text-sm font-medium text-slate-800">
            Summary
          </label>
          <textarea
            id="listing-summary"
            name="summary"
            required
            rows={4}
            disabled={isSubmitting}
            className={inputClassName}
            aria-invalid={Boolean(fieldErrors.summary)}
            aria-describedby={fieldErrors.summary ? 'summary-error' : undefined}
          />
          {fieldError('summary')}
        </div>

        <div>
          <label htmlFor="listing-property-type" className="text-sm font-medium text-slate-800">
            Property type
          </label>
          <select
            id="listing-property-type"
            name="property_type"
            required
            defaultValue=""
            disabled={isSubmitting}
            className={inputClassName}
            aria-invalid={Boolean(fieldErrors.property_type)}
            aria-describedby={fieldErrors.property_type ? 'property_type-error' : undefined}
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
          <label htmlFor="listing-status" className="text-sm font-medium text-slate-800">
            Listing status
          </label>
          <select
            id="listing-status"
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
          <label htmlFor="listing-address-line1" className="text-sm font-medium text-slate-800">
            Address
          </label>
          <input
            id="listing-address-line1"
            name="address_line1"
            type="text"
            required
            autoComplete="address-line1"
            disabled={isSubmitting}
            className={inputClassName}
            aria-invalid={Boolean(fieldErrors.address_line1)}
            aria-describedby={fieldErrors.address_line1 ? 'address_line1-error' : undefined}
          />
          {fieldError('address_line1')}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="listing-address-line2" className="text-sm font-medium text-slate-800">
            Address line 2 <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <input
            id="listing-address-line2"
            name="address_line2"
            type="text"
            autoComplete="address-line2"
            disabled={isSubmitting}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="listing-city" className="text-sm font-medium text-slate-800">
            City
          </label>
          <input
            id="listing-city"
            name="city"
            type="text"
            required
            autoComplete="address-level2"
            disabled={isSubmitting}
            className={inputClassName}
            aria-invalid={Boolean(fieldErrors.city)}
            aria-describedby={fieldErrors.city ? 'city-error' : undefined}
          />
          {fieldError('city')}
        </div>

        <div>
          <label htmlFor="listing-region" className="text-sm font-medium text-slate-800">
            State, province, or region
          </label>
          <input
            id="listing-region"
            name="region"
            type="text"
            required
            autoComplete="address-level1"
            disabled={isSubmitting}
            className={inputClassName}
            aria-invalid={Boolean(fieldErrors.region)}
            aria-describedby={fieldErrors.region ? 'region-error' : undefined}
          />
          {fieldError('region')}
        </div>

        <div>
          <label htmlFor="listing-postal-code" className="text-sm font-medium text-slate-800">
            Postal code
          </label>
          <input
            id="listing-postal-code"
            name="postal_code"
            type="text"
            required
            autoComplete="postal-code"
            disabled={isSubmitting}
            className={inputClassName}
            aria-invalid={Boolean(fieldErrors.postal_code)}
            aria-describedby={fieldErrors.postal_code ? 'postal_code-error' : undefined}
          />
          {fieldError('postal_code')}
        </div>

        <div>
          <label htmlFor="listing-country" className="text-sm font-medium text-slate-800">
            Country
          </label>
          <input
            id="listing-country"
            name="country"
            type="text"
            required
            autoComplete="country-name"
            disabled={isSubmitting}
            className={inputClassName}
            aria-invalid={Boolean(fieldErrors.country)}
            aria-describedby={fieldErrors.country ? 'country-error' : undefined}
          />
          {fieldError('country')}
        </div>

        <div>
          <label htmlFor="listing-asking-price" className="text-sm font-medium text-slate-800">
            Asking price
          </label>
          <input
            id="listing-asking-price"
            name="asking_price"
            type="number"
            required
            min="0"
            max="9999999999.99"
            step="0.01"
            inputMode="decimal"
            disabled={isSubmitting}
            className={inputClassName}
            aria-invalid={Boolean(fieldErrors.asking_price)}
            aria-describedby={fieldErrors.asking_price ? 'asking_price-error' : undefined}
          />
          {fieldError('asking_price')}
        </div>

        <div>
          <label htmlFor="listing-currency" className="text-sm font-medium text-slate-800">
            Currency
          </label>
          <input
            id="listing-currency"
            name="currency"
            type="text"
            required
            autoComplete="off"
            disabled={isSubmitting}
            className={inputClassName}
            aria-invalid={Boolean(fieldErrors.currency)}
            aria-describedby={fieldErrors.currency ? 'currency-error' : undefined}
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
          {isSubmitting ? 'Saving…' : 'Create Listing'}
        </button>
        <Link
          to="/dashboard/listings"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 no-underline transition hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
