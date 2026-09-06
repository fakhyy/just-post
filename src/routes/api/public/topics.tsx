import { createFileRoute } from '@tanstack/react-router'
import { auth } from '#/lib/auth'
import { db } from '#/db'
import { topics } from '#/db/schemas/core.schema'
import { desc } from 'drizzle-orm'

export const Route = createFileRoute('/api/public/topics')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const key = request.headers.get('x-api-key')
        if (!key) {
          return Response.json(
            { error: 'Missing x-api-key header' },
            { status: 401 },
          )
        }

        const result = await auth.api.verifyApiKey({
          body: { key },
        })

        if (!result.valid) {
          return Response.json(
            { error: result.error?.message ?? 'Invalid API key' },
            { status: 401 },
          )
        }

        const rows = await db
          .select()
          .from(topics)
          .orderBy(desc(topics.createdAt))

        return Response.json({ topics: rows })
      },
    },
  },
})
