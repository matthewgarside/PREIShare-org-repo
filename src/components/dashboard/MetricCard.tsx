export type MetricCardProps = {
  /** Name of the metric shown above its value. */
  label: string
  /** Display-ready text or number for the metric. */
  value: string | number
  /** Optional short supporting text. */
  hint?: string
}

export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <article
      aria-label={label}
      className="dashboard-card rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-4 shadow-sm"
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