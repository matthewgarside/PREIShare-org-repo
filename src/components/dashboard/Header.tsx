export type HeaderProps = {
  /** Page or dashboard title shown in the header. */
  title?: string
}

/** Shared header for the PREIshare investor dashboard. */
export function Header({ title = 'Dashboard' }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-900 text-sm font-semibold text-white">
          P
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">PREIshare</p>
          <h1 className="truncate text-xs font-medium text-slate-500">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-700"
        >
          IN
        </span>
        <span className="hidden text-sm text-slate-700 sm:inline">Investor</span>
      </div>
    </header>
  )
}