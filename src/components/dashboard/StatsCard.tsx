export type StatsCardProps = {
  label: string
  value: string
  hint?: string
}

/** Reusable metric tile for the investor dashboard home. */
export function StatsCard({ label, value, hint }: StatsCardProps) {
  return (
    <article
      aria-label={label}
      className="rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-4 shadow-sm"
    >
      <p className="text-sm font-semibold text-[var(--sea-ink-soft)]">{label}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums text-[var(--sea-ink)]">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">{hint}</p>
      ) : null}
    </article>
  )
}