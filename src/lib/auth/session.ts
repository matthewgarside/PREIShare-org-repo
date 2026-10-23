import { createServerFn } from '@tanstack/react-start'
import { createServerClient } from '../supabase/server'

async function readVerifiedUser() {
  const supabase = createServerClient()
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    if (
      error.name === 'AuthSessionMissingError' ||
      (error.name === 'AuthApiError' &&
        (error.status === 400 ||
          error.status === 401 ||
          error.status === 403))
    ) {
      return null
    }
    throw error
  }

  return data.user
}

export const getUser = createServerFn({ method: 'GET' }).handler(
  readVerifiedUser
)

export const establishSession = createServerFn({ method: 'POST' })
  .validator((value: unknown) => {
    if (
      typeof value !== 'object' ||
      value === null ||
      !('accessToken' in value) ||
      !('refreshToken' in value) ||
      typeof value.accessToken !== 'string' ||
      typeof value.refreshToken !== 'string' ||
      !value.accessToken.trim() ||
      !value.refreshToken.trim()
    ) {
      throw new Error('A valid Supabase session is required.')
    }

    return {
      accessToken: value.accessToken,
      refreshToken: value.refreshToken,
    }
  })
  .handler(async ({ data }) => {
    const supabase = createServerClient()
    const { error } = await supabase.auth.setSession({
      access_token: data.accessToken,
      refresh_token: data.refreshToken,
    })

    if (error) {
      throw new Error('Unable to establish the sponsor session.', {
        cause: error,
      })
    }

    const user = await readVerifiedUser()
    if (!user) {
      throw new Error('Supabase did not verify the sponsor session.')
    }
  })

export const signOut = createServerFn({ method: 'POST' }).handler(async () => {
  const supabase = createServerClient()
  const { error } = await supabase.auth.signOut({ scope: 'local' })

  if (error) {
    throw new Error('Unable to sign out of the sponsor account.', {
      cause: error,
    })
  }
})