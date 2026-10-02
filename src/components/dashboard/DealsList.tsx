export type Deal = {
  id: string
  name: string
  location: string
  minimumInvestment: number
  status: 'Open' | 'Closing Soon' | 'Waitlist'
}

export type DealsListProps = {
  deals?: Deal[]
}

export const MOCK_DEALS: Deal[] = [
  {
    id: 'd1',
    name: 'Harbor View Residences',
    location: 'Tampa, FL',
    minimumInvestment: 25000,
    status: 'Open',
  },
  {
    id: 'd2',
    name: 'Summit Logistics Hub',
    location: 'Columbus, OH',
    minimumInvestment: 50000,
    status: 'Closing Soon',
  },
  {
    id: 'd3',
    name: 'Maple Grove Apartments',
    location: 'Asset class: Multifamily',
    minimumInvestment: 25000,
    status: 'Waitlist',
  },
]

export function DealsList({
  deals = MOCK_DEALS,
}: DealsListProps) {
  if (deals.length === 0) {
    return (
      <section
        aria-label="Open deals"
        className="rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-sm"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold text-[var(--sea-ink)]">Open deals</h2>
          <p className="text-xs font-semibold text-[var(--palm)]" role="note">
            Sample deals for demonstration only
          </p>
        </div>
        <p className="mt-4 text-sm text-[var(--sea-ink-soft)]">
          No open deals are available right now.
        </p>
      </section>
    )
  }

  return (
    <section
      aria-label="Open deals"
      className="rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold text-[var(--sea-ink)]">Open deals</h2>
        <p className="text-xs font-semibold text-[var(--palm)]" role="note">
          Sample deals for demonstration only
        </p>
      </div>
      <ul className="mt-2 divide-y divide-[var(--line)]">
        {deals.map((deal) => (
          <li
            key={deal.id}
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4"
          >
            <div className="min-w-0 flex-1">
              <h3 className="break-words text-sm font-semibold text-[var(--sea-ink)]">
                {deal.name}
              </h3>
              <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">{deal.location}</p>
            </div>
            <p className="text-sm text-[var(--sea-ink-soft)]">
              Minimum investment{' '}
              <span className="font-semibold tabular-nums text-[var(--sea-ink)]">
                {formatCurrency(deal.minimumInvestment)}
              </span>
            </p>
            <span
              className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold ${getStatusClasses(deal.status)}`}
            >
              {deal.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function getStatusClasses(status: Deal['status']): string {
  switch (status) {
    case 'Open':
      return 'bg-emerald-100 text-emerald-800'
    case 'Closing Soon':
      return 'bg-amber-100 text-amber-900'
    case 'Waitlist':
      return 'bg-slate-100 text-slate-700'
  }
}