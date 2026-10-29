import { createFileRoute, type FileRoutesByPath } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'

export const Route = createFileRoute('/search' as keyof FileRoutesByPath)({
  component: PropertySearchPage,
})

type PropertyResult = {
  id: string
  title: string
  description: string
  distance: number
  location?: string | null
  price_usd?: number | null
}

type SearchStatus = 'idle' | 'loading' | 'error' | 'success'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isPropertyResult(value: unknown): value is PropertyResult {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    typeof value.distance === 'number' &&
    Number.isFinite(value.distance)
  )
}

function PropertySearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PropertyResult[]>([])
  const [status, setStatus] = useState<SearchStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'loading') return

    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      setResults([])
      setStatus('error')
      setErrorMessage('Enter a description of the property you want to find.')
      return
    }

    setStatus('loading')
    setErrorMessage('')
    setResults([])

    try {
      const params = new URLSearchParams({ q: trimmedQuery })
      const response = await fetch(`/api/properties/search?${params.toString()}`)
      const data: unknown = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please sign in before searching properties.')
        }

        if (response.status === 400 && isRecord(data) && typeof data.error === 'string') {
          throw new Error(data.error)
        }

        throw new Error('Property search could not be completed. Please try again.')
      }

      if (
        !isRecord(data) ||
        !Array.isArray(data.results) ||
        !data.results.every(isPropertyResult)
      ) {
        throw new Error('The search response could not be read. Please try again.')
      }

      setResults(data.results)
      setStatus('success')
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Property search could not be completed. Please try again.',
      )
      setStatus('error')
    }
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Search Properties</h1>
        <p className="max-w-2xl text-slate-600">
          Describe the kind of property you want in your own words. Search matches
          listings by meaning, even when they use different wording.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7"
      >
        <div>
          <label htmlFor="property-search-query" className="block text-sm font-medium text-slate-900">
            Describe a property
          </label>
          <input
            id="property-search-query"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            maxLength={500}
            placeholder="Quiet cabin near water"
            aria-describedby="search-instructions"
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-[var(--lagoon-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]"
          />
          <p id="search-instructions" className="mt-2 text-sm text-slate-600">
            For example: “Sunny condo close to public transportation” or
            “Investment property with strong rental income.”
          </p>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-lg bg-[var(--lagoon-deep)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? 'Searching...' : 'Search'}
        </button>
      </form>

      {status === 'loading' ? (
        <p role="status" aria-live="polite" className="text-sm text-slate-600">
          Searching properties...
        </p>
      ) : null}

      {status === 'error' ? (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      {status === 'success' && results.length === 0 ? (
        <p role="status" aria-live="polite" className="text-sm text-slate-600">
          No matching properties found. Try a different search.
        </p>
      ) : null}

      {status === 'success' && results.length > 0 ? (
        <section aria-labelledby="search-results-heading" aria-live="polite" className="space-y-4">
          <div>
            <h2 id="search-results-heading" className="text-xl font-semibold text-slate-900">
              Search results
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Results are ranked by cosine distance. A lower distance means a
              closer semantic match.
            </p>
          </div>

          <ol className="space-y-4">
            {results.map((property) => (
              <li
                key={property.id}
                className="space-y-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-slate-900">{property.title}</h3>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {property.description}
                </p>
                <p className="text-sm font-medium text-slate-700">
                  Cosine distance: {property.distance.toFixed(3)}
                </p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </main>
  )
}
