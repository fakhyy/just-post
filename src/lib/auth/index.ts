import { db } from '#/db'
import { user as userTable } from '#/db/schemas/auth.schema'
import { count } from 'drizzle-orm'
import { betterAuth } from 'better-auth'
import { APIError } from 'better-auth/api'
import { openAPI } from 'better-auth/plugins'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { apiKey } from '@better-auth/api-key'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          if (ctx?.context.session) {
            throw new APIError('BAD_REQUEST', {
              message: 'Already signed in',
            })
          }

          const [existing] = await db.select({ total: count() }).from(userTable)

          if (existing.total >= 1) {
            throw new APIError('BAD_REQUEST', {
              message: 'Only a single user account is allowed',
            })
          }

          return { data: user }
        },
      },
    },
  },
  plugins: [
    openAPI(),
    tanstackStartCookies(),
    apiKey({
      // enabled: true,
      // defaultExpiresIn: 60 * 60 * 24 * 30,
      defaultPrefix: 'jp',
    }),
  ],
})
