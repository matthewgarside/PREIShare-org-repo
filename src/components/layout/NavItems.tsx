import { Link, useRouterState } from '@tanstack/react-router'
import { dashboardNavigation } from './navConfig'

/** Shared links for the investor dashboard areas. */
export function NavItems() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname.replace(/\/$/, '') || '/',
  })

  return (
    <ul className="dashboard-nav-list space-y-2">
      {dashboardNavigation.map((item) => {
        const isActive = pathname === item.path

        return (
          <li key={item.path}>
            <Link
              to={item.path}
              activeOptions={{ exact: true }}
              aria-current={isActive ? 'page' : undefined}
              className={`dashboard-nav-link block rounded px-4 py-3 text-sm ${
                isActive
                  ? 'bg-emerald-100 font-semibold text-emerald-900'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}