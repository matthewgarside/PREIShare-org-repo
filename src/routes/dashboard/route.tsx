import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <main>
      <h1>PREIshare Dashboard</h1>
      <Outlet />
    </main>
  )
}