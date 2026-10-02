import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHomePage,
})

function DashboardHomePage() {
  return (
    <section>
      <h2>Dashboard Home</h2>
      <p>Investor metrics and activity will appear here later.</p>
    </section>
  )
}
