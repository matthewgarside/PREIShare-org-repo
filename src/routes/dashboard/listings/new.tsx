import { useState } from 'react'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { ListingForm } from '../../../components/listings/ListingForm'
import type { CreateListingInput } from '../../../lib/listings/schema'
import { createListing } from '../../../server/listings'

export const Route = createFileRoute('/dashboard/listings/new')({
  component: NewListingPage,
})

function NewListingPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(values: CreateListingInput) {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const result = await createListing({ data: values })
      if (!result.ok) {
        setErrorMessage(result.error)
        return
      }

      await navigate({ to: '/dashboard/listings', replace: true })
      await router.invalidate()
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? `Could not save the listing: ${error.message}`
          : 'Could not save the listing. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section aria-labelledby="new-listing-heading" className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 id="new-listing-heading" className="text-2xl font-bold text-[var(--sea-ink)]">
          Create Property Listing
        </h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          Add the property details you want to share with investors.
        </p>
      </header>
      <ListingForm
        onSubmit={handleSubmit}
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
      />
    </section>
  )
}
