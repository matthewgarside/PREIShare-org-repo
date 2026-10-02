import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'

const navItems = [
  { label: 'Overview', to: '/dashboard' },
  { label: 'Portfolio', to: '/dashboard/portfolio' },
  { label: 'Deals', to: '/dashboard/deals' },
  { label: 'Profile', to: '/dashboard/profile' },
] as const

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = useRouterState({
    select: (state) => state.location.pathname.replace(/\/$/, '') || '/',
  })

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="rounded border px-3 py-2 text-sm"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-dashboard-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Close menu' : 'Open menu'}
      </button>
      {open ? (
        <nav
          id="mobile-dashboard-menu"
          aria-label="Investor dashboard"
          className="mt-2 rounded border bg-white p-3"
        >
          <ul className="space-y-2">
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
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      ) : null}
    </div>
  )
}