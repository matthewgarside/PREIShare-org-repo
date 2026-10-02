import { createFileRoute } from '@tanstack/react-router'
import { ProfileCard } from '../../components/dashboard/ProfileCard'

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Profile</h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          Review your investor profile information.
        </p>
      </header>
      <ProfileCard />
    </div>
  )
}