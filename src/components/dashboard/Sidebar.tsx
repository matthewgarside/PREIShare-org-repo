import { Link, useRouterState } from '@tanstack/react-router'

const navItems = [
  { label: 'Overview', to: '/dashboard' },
  { label: 'Portfolio', to: '/dashboard/portfolio' },
  { label: 'Deals', to: '/dashboard/deals' },
  { label: 'Profile', to: '/dashboard/profile' },
] as const

export function Sidebar() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname.replace(/\/$/, '') || '/',
  })

  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white p-4 md:flex md:flex-col">
      <p className="mb-4 text-sm font-semibold text-slate-700">PREIshare</p>
      <nav aria-label="Investor dashboard">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.to

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: true }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`block rounded px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}