import type { ReactNode } from 'react'
import { NavItems } from './NavItems'

type SidebarProps = {
  brandLabel?: string
  children?: ReactNode
}

/** Left navigation chrome for the investor dashboard shell. */
export function Sidebar({ brandLabel = 'PREIshare', children }: SidebarProps) {
  return (
    <aside className="border-b border-slate-200 bg-white px-7 py-8 md:min-h-screen md:border-b-0 md:border-r md:px-8" aria-label="Investor navigation">
      <div className="mb-10">
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