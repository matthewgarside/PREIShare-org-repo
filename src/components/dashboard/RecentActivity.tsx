export type ActivityItem = {
  timestamp: string
  description: string
  type?: string
}

export type RecentActivityProps = {
  title?: string
  items: ActivityItem[]
  emptyMessage: string
}

export function RecentActivity({
  title = 'Recent activity',
  items,
  emptyMessage,
}: RecentActivityProps) {
  return (
    <section
      aria-label={title}
      className="dashboard-card rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-sm"
    >
      <h2 className="text-lg font-bold text-[var(--sea-ink)]">{title}</h2>
      {items.length > 0 ? (
        <ol className="mt-3 divide-y divide-[var(--line)]">
          {items.map((item, index) => (
            <li
              key={`${item.timestamp}-${index}`}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3"
            >
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold text-[var(--sea-ink)]">
                  {item.description}
                </p>
                {item.type ? (
                  <p className="mt-1 text-xs text-[var(--sea-ink-soft)]">
                    {item.type}
                  </p>
                ) : null}
              </div>
              <time className="shrink-0 text-xs tabular-nums text-[var(--sea-ink-soft)]">
                {item.timestamp}
              </time>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-sm text-[var(--sea-ink-soft)]">{emptyMessage}</p>
      )}
    </section>
  )
}