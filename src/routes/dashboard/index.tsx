import { createFileRoute } from '@tanstack/react-router'
import { PortfolioSummary } from '../../components/dashboard/PortfolioSummary'
import { RecentActivity } from '../../components/dashboard/RecentActivity'
import { StatsCard } from '../../components/dashboard/StatsCard'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHomePage,
})

function DashboardHomePage() {
  return (
    <div className="dashboard-page space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Investor dashboard</h1>
        <p className="text-sm text-[var(--sea-ink-soft)]" role="note">
          Sample dashboard data. All financial values and deal counts are placeholders.
        </p>
      </header>

      <section
        aria-label="Portfolio and deal metrics"
        className="dashboard-stats-grid"
      >
        <StatsCard
          label="Total Portfolio Value"
          value="$300,000"
          hint="Sample portfolio value"
        />
        <StatsCard
          label="Number of Investments"
          value="3"
          hint="Sample holdings"
        />
        <StatsCard label="Open Deals" value="4" hint="Sample opportunities" />
      </section>

      <div className="dashboard-overview-grid">
        <PortfolioSummary totalLabel="$300,000" />
        <RecentActivity />
      </div>
    </div>
  )
}
