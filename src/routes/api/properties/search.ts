import { createFileRoute, type FileRoutesByPath } from '@tanstack/react-router'
import { searchProperties } from '../../../lib/property-search'

const DEFAULT_MATCH_COUNT = 5
const MAX_MATCH_COUNT = 20
const MAX_QUERY_LENGTH = 500 // Keep natural-language prompts bounded.

export const Route = createFileRoute(
  '/api/properties/search' as keyof FileRoutesByPath,
)({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const query = url.searchParams.get('q')?.trim() ?? ''

        if (!query) {
          return Response.json({ error: 'A search query is required.' }, { status: 400 })
        }

        if (query.length > MAX_QUERY_LENGTH) {
          return Response.json(
            { error: `Search queries must be ${MAX_QUERY_LENGTH} characters or fewer.` },
            { status: 400 },
          )
        }

        const limitValue = url.searchParams.get('limit')
        let matchCount = DEFAULT_MATCH_COUNT

        if (limitValue !== null) {
          if (!/^\d+$/.test(limitValue)) {
            return Response.json(
              { error: `The result limit must be between 1 and ${MAX_MATCH_COUNT}.` },
              { status: 400 },
            )
          }

          matchCount = Number(limitValue)
          if (!Number.isInteger(matchCount) || matchCount < 1 || matchCount > MAX_MATCH_COUNT) {
            return Response.json(
              { error: `The result limit must be between 1 and ${MAX_MATCH_COUNT}.` },
              { status: 400 },
            )
          }
        }

        try {
          const results = await searchProperties({
            data: { query, matchCount },
          })

          return Response.json({ results })
        } catch (error) {
          if (
            error instanceof Error &&
            error.message === 'Sign in before searching properties.'
          ) {
            return Response.json(
              { error: 'Sign in before searching properties.' },
              { status: 401 },
            )
          }

          return Response.json(
            { error: 'Property search could not be completed.' },
            { status: 500 },
          )
        }
      },
    },
  },
})
