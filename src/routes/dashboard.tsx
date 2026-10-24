import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppShell } from '../components/dashboard/AppShell'
import { getUser } from '../lib/auth/session'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const user = await getUser()
    if (!user) {
      throw redirect({ to: '/login' })
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
