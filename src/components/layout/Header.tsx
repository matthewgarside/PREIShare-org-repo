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
    <header className="dashboard-header">
      <h1 className="text-xl font-semibold">{pageTitle}</h1>
      <div className="dashboard-header-meta">
        <span>Investor</span>
        {children}
      </div>
    </header>
  )
}