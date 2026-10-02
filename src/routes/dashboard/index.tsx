import { createFileRoute } from '@tanstack/react-router'
import { MetricCard } from '../../components/dashboard/MetricCard'
import { PortfolioSummary } from '../../components/dashboard/PortfolioSummary'
import { RecentActivity } from '../../components/dashboard/RecentActivity'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHomePage,
})

function DashboardHomePage() {
  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Overview</h1>
        <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
          Demo preview. All figures are placeholders, not live investor data.
        </p>
      </header>

      <section aria-label="Demo metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="Portfolio value (demo)"
          value="—"
          hint="Placeholder; no live data connected."
        />
        <MetricCard
          label="Open deals (demo)"
          value="—"
          hint="Placeholder; no live data connected."
        />
        <MetricCard
          label="Active investments (demo)"
          value="—"
          hint="Placeholder; no live data connected."
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <PortfolioSummary
          title="Portfolio summary"
          summaryItems={[]}
          emptyMessage="No portfolio items to show in this demo yet. Portfolio data is not connected."
        />
        <RecentActivity
          title="Recent activity"
          items={[]}
          emptyMessage="There is no activity to show yet. Activity data is not connected."
        />
      </div>
    </main>
  )
}
