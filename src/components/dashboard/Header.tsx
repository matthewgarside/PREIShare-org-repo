import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { createClientOnlyFn } from '@tanstack/react-start'
import { signOut } from '../../lib/auth/session'
import { supabaseBrowser } from '../../lib/supabase.client'

const getBrowserSupabase = createClientOnlyFn(() => supabaseBrowser)

export type HeaderProps = {
  /** Page or dashboard title shown in the header. */
  title?: string
}

/** Shared header for the PREIshare investor dashboard. */
export function Header({ title = 'Dashboard' }: HeaderProps) {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    setErrorMessage('')
    setIsSigningOut(true)
    try {
      const { error } = await getBrowserSupabase().auth.signOut({ scope: 'local' })
      if (error) {
        throw error
      }

      await signOut()
      await navigate({ to: '/login' })
    } catch {
      setErrorMessage('Unable to sign out. Please try again.')
    } finally {
      setIsSigningOut(false)
    }
  }

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

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 sm:flex">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-700"
          >
            IN
          </span>
          <span className="text-sm text-slate-700">Investor</span>
        </div>
        {errorMessage && (
          <span className="text-sm text-red-700" role="alert">
            {errorMessage}
          </span>
        )}
        <button
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          disabled={isSigningOut}
          onClick={handleSignOut}
          type="button"
        >
          {isSigningOut ? 'Signing out…' : 'Sign Out'}
        </button>
      </div>
    </header>
  )
}