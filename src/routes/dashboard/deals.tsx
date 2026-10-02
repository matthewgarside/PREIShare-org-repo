import { createFileRoute } from '@tanstack/react-router'
import { DealsList } from '../../components/dashboard/DealsList'

export const Route = createFileRoute('/dashboard/deals')({
  component: DealsPage,
})

function DealsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Deals</h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          Explore current real estate investment opportunities.
        </p>
      </header>
      <DealsList />
    </div>
  )
}
