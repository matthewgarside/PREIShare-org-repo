import { useState, type FormEvent } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { createClientOnlyFn } from '@tanstack/react-start'
import { establishSession } from '../lib/auth/session'
import { supabaseBrowser } from '../lib/supabase.client'

const getBrowserSupabase = createClientOnlyFn(() => supabaseBrowser)

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedEmail = email.trim()
    const enteredPassword = password

    if (!trimmedEmail || !enteredPassword.trim()) {
      setErrorMessage('Email and password are required.')
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const { data, error } = await getBrowserSupabase().auth.signInWithPassword({
        email: trimmedEmail,
        password: enteredPassword,
      })

      if (error) {
        setErrorMessage(error.message || 'Unable to sign in right now. Please try again.')
        return
      }

      if (!data.session) {
        setErrorMessage('Sign-in succeeded, but no session was returned. Please try again.')
        return
      }

      await establishSession({
        data: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
        },
      })
      await navigate({ to: '/dashboard' })
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to sign in right now. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">Sponsor login</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to access your sponsor dashboard.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              autoComplete="email"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              autoComplete="current-password"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-red-700" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Need a sponsor account?{' '}
          <Link className="font-medium text-indigo-700 hover:text-indigo-800" to="/auth/signup">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  )
}