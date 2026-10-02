export type PortfolioHolding = {
  id: string
  propertyName: string
  assetType: string
  investedAmount: number
  currentValue: number
  status: 'Performing' | 'Under review' | 'Exited'
}

export type PortfolioTableProps = {
  holdings?: PortfolioHolding[]
}

export const MOCK_PORTFOLIO_HOLDINGS: PortfolioHolding[] = [
  {
    id: 'h1',
    propertyName: 'Riverfront Lofts',
    assetType: 'Multifamily',
    investedAmount: 50000,
    currentValue: 56200,
    status: 'Performing',
  },
  {
    id: 'h2',
    propertyName: 'Cedar Business Park',
    assetType: 'Industrial',
    investedAmount: 75000,
    currentValue: 74100,
    status: 'Under review',
  },
]

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function PortfolioTable({
  holdings = MOCK_PORTFOLIO_HOLDINGS,
}: PortfolioTableProps) {
  if (holdings.length === 0) {
    return (
      <section
        aria-label="Portfolio holdings"
        className="rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-sm"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold text-[var(--sea-ink)]">Portfolio holdings</h2>
          <p className="text-xs font-semibold text-[var(--palm)]" role="note">
            Sample data for demonstration only
          </p>
        </div>
        <p className="mt-4 text-sm text-[var(--sea-ink-soft)]">
          No portfolio holdings to display.
        </p>
      </section>
    )
  }

  return (
    <section
      aria-label="Portfolio holdings"
      className="rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold text-[var(--sea-ink)]">Portfolio holdings</h2>
        <p className="text-xs font-semibold text-[var(--palm)]" role="note">
          Sample data for demonstration only
        </p>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--line)] text-[var(--sea-ink-soft)]">
              <th className="px-3 py-3 font-semibold" scope="col">Property</th>
              <th className="px-3 py-3 font-semibold" scope="col">Type</th>
              <th className="px-3 py-3 text-right font-semibold" scope="col">Invested Amount</th>
              <th className="px-3 py-3 text-right font-semibold" scope="col">Current Value</th>
              <th className="px-3 py-3 font-semibold" scope="col">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)] text-[var(--sea-ink)]">
            {holdings.map((row) => (
              <tr key={row.id}>
                <td className="px-3 py-4 font-semibold">{row.propertyName}</td>
                <td className="px-3 py-4 text-[var(--sea-ink-soft)]">{row.assetType}</td>
                <td className="px-3 py-4 text-right tabular-nums">{formatCurrency(row.investedAmount)}</td>
                <td className="px-3 py-4 text-right tabular-nums">{formatCurrency(row.currentValue)}</td>
                <td className="px-3 py-4">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}