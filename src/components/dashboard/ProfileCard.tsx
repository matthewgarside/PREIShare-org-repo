export type InvestorProfile = {
  displayName: string
  email: string
  membershipTier: string
  preferredContact: string
  notes: string
}

export const MOCK_INVESTOR_PROFILE: InvestorProfile = {
  displayName: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  membershipTier: 'Preferred investor',
  preferredContact: 'Email',
  notes: 'Interested in multifamily and industrial deals in the Southeast.',
}

export type ProfileCardProps = {
  profile?: InvestorProfile
}

export function ProfileCard({ profile = MOCK_INVESTOR_PROFILE }: ProfileCardProps) {
  return (
    <section
      aria-label="Investor profile"
      className="dashboard-card rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold text-[var(--sea-ink)]">Investor profile</h2>
        <p className="text-xs font-semibold text-[var(--palm)]" role="note">
          Sample investor information for demonstration only
        </p>
      </div>
      <dl className="mt-3 divide-y divide-[var(--line)]">
        <div className="dashboard-profile-row grid gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4">
          <dt className="text-sm text-[var(--sea-ink-soft)]">Display Name</dt>
          <dd className="break-words text-sm font-semibold text-[var(--sea-ink)]">
            {profile.displayName}
          </dd>
        </div>
        <div className="dashboard-profile-row grid gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4">
          <dt className="text-sm text-[var(--sea-ink-soft)]">Email</dt>
          <dd className="break-words text-sm font-semibold text-[var(--sea-ink)]">
            {profile.email}
          </dd>
        </div>
        <div className="dashboard-profile-row grid gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4">
          <dt className="text-sm text-[var(--sea-ink-soft)]">Membership Tier</dt>
          <dd className="break-words text-sm font-semibold text-[var(--sea-ink)]">
            {profile.membershipTier}
          </dd>
        </div>
        <div className="dashboard-profile-row grid gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4">
          <dt className="text-sm text-[var(--sea-ink-soft)]">Preferred Contact</dt>
          <dd className="break-words text-sm font-semibold text-[var(--sea-ink)]">
            {profile.preferredContact}
          </dd>
        </div>
        <div className="dashboard-profile-row grid gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4">
          <dt className="text-sm text-[var(--sea-ink-soft)]">Notes</dt>
          <dd className="break-words text-sm text-[var(--sea-ink)]">{profile.notes}</dd>
        </div>
      </dl>
    </section>
  )
}