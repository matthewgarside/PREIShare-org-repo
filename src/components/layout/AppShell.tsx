import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

type AppShellProps = {
  title?: string
  children: ReactNode
}

/**
 * Shared investor chrome: sidebar + header + main content region.
 * Child routes render inside `children` (wired from the dashboard layout route).
 */
export function AppShell({ title = 'Investor Dashboard', children }: AppShellProps) {
  return (
    <div className="dashboard-shell min-h-screen bg-slate-50 text-slate-900 md:grid md:grid-cols-[18rem_minmax(0,1fr)]">
      <Sidebar />
      <div className="dashboard-content min-w-0">
        <Header title={title} />
        <main className="dashboard-main mx-auto w-full max-w-7xl px-8 py-10 md:px-12 md:py-12 lg:px-16" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
