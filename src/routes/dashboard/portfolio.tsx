import { createFileRoute } from '@tanstack/react-router'
import { PortfolioTable } from '../../components/dashboard/PortfolioTable'

export const Route = createFileRoute('/dashboard/portfolio')({
  component: PortfolioPage,
})

function PortfolioPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Portfolio</h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          Review your real estate investment holdings.
        </p>
      </header>
      <PortfolioTable />
    </div>
  )
}