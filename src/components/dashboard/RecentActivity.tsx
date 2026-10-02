export type ActivityItem = {
  id: string
  title: string
  detail: string
  dateLabel: string
}

export type RecentActivityProps = {
  title?: string
  items?: ActivityItem[]
  isSampleData?: boolean
}

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: 'a1',
    title: 'Distribution posted',
    detail: 'PREIshare Multifamily Fund A, sample distribution',
    dateLabel: 'Mar 1, 2026',
  },
  {
    id: 'a2',
    title: 'Capital call notice (sample)',
    detail: 'PREIshare Industrial Note B, sample notice',
    dateLabel: 'Feb 18, 2026',
  },
  {
    id: 'a3',
    title: 'Investor profile updated',
    detail: 'Sample accreditation document added to PREIshare profile',
    dateLabel: 'Feb 5, 2026',
  },
]

export function RecentActivity({
  title = 'Recent activity',
  items = MOCK_ACTIVITY,
  isSampleData = true,
}: RecentActivityProps) {
  return (
    <section
      aria-label={title}
      className="rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold text-[var(--sea-ink)]">{title}</h2>
        {isSampleData ? (
          <p className="text-xs font-semibold text-[var(--palm)]" role="note">
            PREIshare sample activity - not connected to a live feed
          </p>
        ) : null}
      </div>
      <ol className="mt-2 divide-y divide-[var(--line)]">
        {items.map((item) => (
          <li key={item.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--sea-ink)]">{item.title}</p>
              <p className="mt-1 break-words text-sm text-[var(--sea-ink-soft)]">
                {item.detail}
              </p>
            </div>
            <time className="shrink-0 text-xs tabular-nums text-[var(--sea-ink-soft)]">
              {item.dateLabel}
            </time>
          </li>
        ))}
      </ol>
    </section>
  )
}