import type { PropertyListingRow } from '../../lib/supabase/types'

export type ListingCardProps = {
  listing: PropertyListingRow
}

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
    }).format(amount)
  } catch (error) {
    if (!(error instanceof RangeError)) throw error
    return `${currency} ${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }
}

function formatLabel(value: string) {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function ListingCard({ listing }: ListingCardProps) {
  const location = [listing.city, listing.region, listing.postal_code, listing.country]
    .filter(Boolean)
    .join(', ')

  return (
    <article
      aria-labelledby={`listing-${listing.id}-title`}
      className="flex h-full flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--sea-ink-soft)]">
            {formatLabel(listing.property_type)}
          </p>
          <h2
            id={`listing-${listing.id}-title`}
            className="mt-1 break-words text-lg font-semibold text-[var(--sea-ink)]"
          >
            {listing.title}
          </h2>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {formatLabel(listing.status)}
        </span>
      </div>

      <div>
        <p className="text-xl font-bold text-[var(--sea-ink)]">
          {formatCurrency(listing.asking_price, listing.currency)}
        </p>
        <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
          {listing.address_line1}
          {listing.address_line2 ? `, ${listing.address_line2}` : ''}
        </p>
        <p className="text-sm text-[var(--sea-ink-soft)]">{location}</p>
      </div>

      {listing.summary ? (
        <p className="line-clamp-3 text-sm leading-6 text-slate-600">{listing.summary}</p>
      ) : null}
    </article>
  )
}