import { useState, type FormEvent } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { establishSession } from '../../lib/auth/session'
import { createBrowserSupabaseClient } from '../../lib/supabase/client'

export const Route = createFileRoute('/auth/signup')({
  component: SignupPage,
})

function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      const supabase = createBrowserSupabaseClient()
      const { data, error } = await supabase.auth.signUp({ email, password })

      if (error) {
        setErrorMessage(error.message)
        return
      }

      if (data.session) {
        await establishSession({
          data: {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
          },
        })
        await navigate({ to: '/dashboard' })
        return
      }

      setSuccessMessage(
        'Check your email for a confirmation link to complete your registration.'
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to create your account right now. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">Create a sponsor account</h1>
        <p className="mt-2 text-sm text-slate-600">
          Register with your email address and password.
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
            <label
              className="mb-1 block text-sm font-medium text-slate-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              autoComplete="new-password"
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
          {successMessage && (
            <p className="text-sm text-green-700" role="status">
              {successMessage}
            </p>
          )}

          <button
            className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            className="font-medium text-indigo-700 hover:text-indigo-800"
            to="/auth/login"
          >
            Log in
          </Link>
        </p>
      </section>
    </main>
  )
}
