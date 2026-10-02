export type PortfolioSummaryItem = {
  name: string
  value: string
  allocation?: string
}

export type PortfolioSummaryProps = {
  title?: string
  summaryItems: PortfolioSummaryItem[]
  emptyMessage: string
}

export function PortfolioSummary({
  title = 'Portfolio summary',
  summaryItems,
  emptyMessage,
}: PortfolioSummaryProps) {
  return (
    <section
      aria-label={title}
      className="dashboard-card rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-sm"
    >
      <h2 className="text-lg font-bold text-[var(--sea-ink)]">{title}</h2>
      {summaryItems.length > 0 ? (
        <ul className="mt-3 divide-y divide-[var(--line)]">
          {summaryItems.map((item, index) => (
            <li
              key={`${item.name}-${index}`}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3"
            >
              <span className="min-w-0 break-words text-sm font-semibold text-[var(--sea-ink)]">
                {item.name}
              </span>
              <span className="shrink-0 text-sm tabular-nums text-[var(--sea-ink-soft)]">
                {item.allocation ? `${item.allocation} · ` : ''}
                {item.value}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-[var(--sea-ink-soft)]">{emptyMessage}</p>
      )}
    </section>
  )
}