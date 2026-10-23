import { createFileRoute, Link } from '@tanstack/react-router'
import { ListingCard } from '../../../components/listings/ListingCard'
import { listMyListings } from '../../../server/listings'

export const Route = createFileRoute('/dashboard/listings/')({
  loader: () => listMyListings(),
  pendingMs: 0,
  pendingComponent: ListingsLoading,
  errorComponent: ListingsLoadError,
  component: ListingsIndexPage,
})

function ListingsLoading() {
  return (
    <section aria-labelledby="listings-heading" aria-busy="true" className="space-y-6">
      <h1 id="listings-heading" className="text-2xl font-bold text-[var(--sea-ink)]">
        My Property Listings
      </h1>
      <p className="text-sm text-[var(--sea-ink-soft)]" role="status">
        Loading your property listings…
      </p>
    </section>
  )
}

function ListingsLoadError({ error }: { error: unknown }) {
  const detail =
    error instanceof Error ? error.message : 'An unexpected error occurred.'

  return (
    <section aria-labelledby="listings-error-heading" className="space-y-4">
      <h1 id="listings-error-heading" className="text-2xl font-bold text-[var(--sea-ink)]">
        My Property Listings
      </h1>
      <p className="text-sm text-red-700" role="alert">
        We couldn’t load your property listings. {detail}
      </p>
    </section>
  )
}

function ListingsIndexPage() {
  const result = Route.useLoaderData()

  if (!result.ok) {
    return (
      <section aria-labelledby="listings-heading" className="space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 id="listings-heading" className="text-2xl font-bold text-[var(--sea-ink)]">
            My Property Listings
          </h1>
          <Link
            to="/dashboard/listings/new"
            className="rounded-lg bg-[var(--lagoon-deep)] px-4 py-2 text-sm font-semibold text-white no-underline transition hover:opacity-90"
          >
            Add Property
          </Link>
        </header>
        <p className="text-sm text-red-700" role="alert">
          {result.error}
        </p>
      </section>
    )
  }

  return (
    <section aria-labelledby="listings-heading" className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 id="listings-heading" className="text-2xl font-bold text-[var(--sea-ink)]">
          My Property Listings
        </h1>
        <Link
          to="/dashboard/listings/new"
          className="rounded-lg bg-[var(--lagoon-deep)] px-4 py-2 text-sm font-semibold text-white no-underline transition hover:opacity-90"
        >
          Add Property
        </Link>
      </header>

      {result.listings.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--sea-ink)]">No properties yet</h2>
          <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
            Create your first property listing to start sharing it with investors.
          </p>
        </div>
      ) : (
        <ul className="grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
          {result.listings.map((listing) => (
            <li key={listing.id} className="min-w-0">
              <ListingCard listing={listing} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
