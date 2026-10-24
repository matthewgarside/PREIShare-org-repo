import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { createSupabaseServerClient } from '../../lib/supabase.server'
import type { PropertyListingRow } from '../../lib/supabase/types'

type PropertyListItem = Pick<
  PropertyListingRow,
  | 'id'
  | 'title'
  | 'summary'
  | 'property_type'
  | 'city'
  | 'region'
  | 'asking_price'
  | 'currency'
  | 'status'
  | 'created_at'
>

const loadSponsorProperties = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ properties: PropertyListItem[]; error: string | null }> => {
    const supabase = createSupabaseServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      if (
        userError.name === 'AuthSessionMissingError' ||
        (userError.name === 'AuthApiError' &&
          (userError.status === 400 ||
            userError.status === 401 ||
            userError.status === 403))
      ) {
        throw redirect({ to: '/login' })
      }
      throw new Error('Could not verify your sponsor session.', {
        cause: userError,
      })
    }

    if (!user) {
      throw redirect({ to: '/login' })
    }

    const { data, error } = await supabase
      .from('property_listings')
      .select(
        'id, title, summary, property_type, city, region, asking_price, currency, status, created_at'
      )
      .order('created_at', { ascending: false })

    if (error) {
      return {
        properties: [],
        error: 'Could not load properties. Please try again.',
      }
    }

    return { properties: data, error: null }
  }
)

export const Route = createFileRoute('/dashboard/properties')({
  loader: () => loadSponsorProperties(),
  pendingMs: 0,
  pendingComponent: PropertiesLoading,
  errorComponent: PropertiesLoadError,
  component: PropertiesPage,
})

function PropertiesLoading() {
  return (
    <section aria-busy="true" className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold">My Properties</h1>
      <p role="status">Loading properties...</p>
    </section>
  )
}

function PropertiesLoadError() {
  return (
    <section className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold">My Properties</h1>
      <p role="alert" className="text-sm text-red-700">
        Could not load properties. Please try again.
      </p>
    </section>
  )
}

function formatAskingPrice(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}`
  }
}

function PropertiesPage() {
  const { properties, error } = Route.useLoaderData()

  return (
    <section className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">My Properties</h1>
        <p className="mt-1 text-sm text-slate-600">
          Properties associated with your sponsor account.
        </p>
      </header>

      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : properties.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-slate-600">
          <p className="font-medium">No properties yet.</p>
          <p className="mt-1 text-sm">
            Your property listings will appear here when available.
          </p>
        </div>
      ) : (
        <ul className="grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <li
              key={property.id}
              className="space-y-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-slate-900">{property.title}</h2>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs capitalize text-slate-700">
                  {property.status.replaceAll('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-slate-600">{property.summary}</p>
              <p className="text-sm text-slate-600">
                {property.city}, {property.region}
              </p>
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm">
                <span className="capitalize text-slate-600">
                  {property.property_type.replaceAll('_', ' ')}
                </span>
                <span className="font-semibold text-slate-900">
                  {formatAskingPrice(property.asking_price, property.currency)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
