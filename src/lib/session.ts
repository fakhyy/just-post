import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '#/lib/auth'

export const requireSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    return auth.api.getSession({
      headers: {
        cookie: headers.get('cookie') ?? '',
      },
    })
  },
)
