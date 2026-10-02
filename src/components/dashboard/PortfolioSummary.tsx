export type HoldingSnapshot = {
  id: string
  name: string
  allocationLabel: string
  valueLabel: string
}

export type PortfolioSummaryProps = {
  title?: string
  totalLabel: string
  holdings?: HoldingSnapshot[]
  isSampleData?: boolean
}

const MOCK_HOLDINGS: HoldingSnapshot[] = [
  {
    id: 'h1',
    name: 'PREIshare Multifamily Fund A',
    allocationLabel: '40%',
    valueLabel: '$120,000',
  },
  {
    id: 'h2',
    name: 'PREIshare Industrial Note B',
    allocationLabel: '35%',
    valueLabel: '$105,000',
  },
  {
    id: 'h3',
    name: 'PREIshare Cash Reserve',
    allocationLabel: '25%',
    valueLabel: '$75,000',
  },
]

export function PortfolioSummary({
  title = 'Portfolio summary',
  totalLabel,
  holdings = MOCK_HOLDINGS,
  isSampleData = true,
}: PortfolioSummaryProps) {
  return (
    <section
      aria-label={title}
      className="dashboard-card rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold text-[var(--sea-ink)]">{title}</h2>
        {isSampleData ? (
          <p className="text-xs font-semibold text-[var(--palm)]" role="note">
            PREIshare sample data - placeholder balances only
          </p>
        ) : null}
      </div>
      <p className="mt-4 flex items-baseline justify-between gap-3 border-b border-[var(--line)] pb-3">
        <span className="text-sm text-[var(--sea-ink-soft)]">Total (sample)</span>
        <span className="text-xl font-bold tabular-nums text-[var(--sea-ink)]">
          {totalLabel}
        </span>
      </p>
      <ul className="divide-y divide-[var(--line)]">
        {holdings.map((item) => (
          <li key={item.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
            <span className="min-w-0 break-words text-sm font-semibold text-[var(--sea-ink)]">
              {item.name}
            </span>
            <span className="shrink-0 text-sm tabular-nums text-[var(--sea-ink-soft)]">
              {item.allocationLabel} · {item.valueLabel}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}