import { createFileRoute } from '@tanstack/react-router'
import { auth } from '#/lib/auth'
import { db } from '#/db'
import { posts, topics } from '#/db/schemas/core.schema'
import { eq, and, desc } from 'drizzle-orm'

export const Route = createFileRoute('/api/public/posts')({
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
          .select({
            id: posts.id,
            title: posts.title,
            handle: posts.handle,
            summary: posts.summary,
            status: posts.status,
            featured: posts.featured,
            publishedAt: posts.publishedAt,
            createdAt: posts.createdAt,
            topicName: topics.name,
          })
          .from(posts)
          .leftJoin(topics, eq(posts.topicId, topics.id))
          .where(and(eq(posts.status, 'published'), eq(posts.enabled, true)))
          .orderBy(desc(posts.publishedAt))

        return Response.json({ posts: rows })
      },
    },
  },
})
