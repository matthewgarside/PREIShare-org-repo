import type { ReactNode } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { getDashboardNavigationItem } from './navConfig'

type HeaderProps = {
  title?: string
  children?: ReactNode
}

/** Top bar: page title + optional actions / user slot. */
export function Header({ title = 'Investor Dashboard', children }: HeaderProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const pageTitle = getDashboardNavigationItem(pathname)?.title ?? title

  return (
    <header className="dashboard-header flex items-center justify-between gap-6 border-b border-slate-200 bg-white px-8 py-6 md:px-10">
      <h1 className="text-xl font-semibold">{pageTitle}</h1>
      <div className="dashboard-header-meta flex items-center gap-4 text-sm text-slate-600">
        <span>Investor</span>
        {children}
      </div>
    </header>
  )
}