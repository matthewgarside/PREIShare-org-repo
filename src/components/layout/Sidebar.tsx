import type { ReactNode } from 'react'

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
        <ul className="space-y-2">
          <li><a className="block rounded px-4 py-3 text-sm text-slate-700 hover:bg-slate-100" href="/dashboard">Home</a></li>
          <li><a className="block rounded px-4 py-3 text-sm text-slate-700 hover:bg-slate-100" href="/dashboard/portfolio">Portfolio</a></li>
          <li><a className="block rounded px-4 py-3 text-sm text-slate-700 hover:bg-slate-100" href="/dashboard/deals">Deals</a></li>
          <li><a className="block rounded px-4 py-3 text-sm text-slate-700 hover:bg-slate-100" href="/dashboard/profile">Profile</a></li>
        </ul>
        {children}
      </nav>
    </aside>
  )
}