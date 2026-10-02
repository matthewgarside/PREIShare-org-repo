import type { ReactNode } from 'react'
import { NavItems } from './NavItems'

type SidebarProps = {
  brandLabel?: string
  children?: ReactNode
}

/** Left navigation chrome for the investor dashboard shell. */
export function Sidebar({ brandLabel = 'PREIshare', children }: SidebarProps) {
  return (
    <aside className="dashboard-sidebar" aria-label="Investor navigation">
      <div className="dashboard-brand">
        <div className="text-2xl font-bold tracking-tight text-emerald-900">{brandLabel}</div>
        <div className="mt-1 text-xs font-medium text-slate-500">Investor dashboard</div>
      </div>
      <nav aria-label="Dashboard">
        <NavItems />
        {children}
      </nav>
    </aside>
  )
}