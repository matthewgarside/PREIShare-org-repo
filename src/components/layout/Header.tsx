import type { ReactNode } from 'react'

type HeaderProps = {
  title?: string
  children?: ReactNode
}

/** Top bar: page title + optional actions / user slot. */
export function Header({ title = 'Investor Dashboard', children }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-6 border-b border-slate-200 bg-white px-8 py-6 md:px-10">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex items-center gap-4 text-sm text-slate-600">
        <span>Investor</span>
        {children}
      </div>
    </header>
  )
}