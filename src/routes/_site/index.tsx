import { Button } from '#/components/ui/button'
import { db } from '#/db'
import {
  posts as postsTable,
  topics as topicsTable,
} from '#/db/schemas/core.schema'
import { requireSession } from '#/lib/session'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { desc, eq } from 'drizzle-orm'
import { useState } from 'react'
import { PostCard } from '#/components/post/post-card'
import type { PostListItem } from '#/components/post/post-card'
import { PostSearchInput } from '#/components/post/post-search-input'
import { usePostFilters } from '#/hooks/use-post-filters'

export const Route = createFileRoute('/_site/')({
  beforeLoad: async ({ location }) => {
    const session = await requireSession()
    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
  component: RouteComponent,
  loader: async () => {
    const rows = await db
      .select({
        id: postsTable.id,
        title: postsTable.title,
        handle: postsTable.handle,
        summary: postsTable.summary,
        status: postsTable.status,
        featured: postsTable.featured,
        enabled: postsTable.enabled,
        publishedAt: postsTable.publishedAt,
        createdAt: postsTable.createdAt,
        updatedAt: postsTable.updatedAt,
        topicName: topicsTable.name,
      })
      .from(postsTable)
      .leftJoin(topicsTable, eq(postsTable.topicId, topicsTable.id))
      .orderBy(desc(postsTable.createdAt))

    return { posts: rows }
  },
})

function RouteComponent() {
  const { posts } = Route.useLoaderData()
  const [search, setSearch] = useState('')

  const { posts: filteredPosts } = usePostFilters(posts, search)

  return (
    <main className="w-full flex flex-col justify-center items-center max-md:px-4 zoom-0">
      <div className="top-0 sticky w-full py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            Jp.
          </Link>
          <Link to="/settings/general">
            <Button variant="ghost" size="sm" className="text-xs">
              Settings
            </Button>
          </Link>
        </div>
      </div>
      <section className="w-full flex flex-col max-w-2xl mt-5 md:mt-15 lg:mt-20 space-y-2">
        <div className="flex items-center justify-between pb-4 gap-4">
          <PostSearchInput value={search} onChange={setSearch} />
          <Button size="sm">New post</Button>
        </div>
        <div className="grid grid-cols-1 gap-4 py-6">
          {filteredPosts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No posts found.
            </p>
          ) : (
            filteredPosts.map((post) => (
              <PostCard key={post.id} post={post as PostListItem} />
            ))
          )}
        </div>
      </section>
    </main>
  )
}
