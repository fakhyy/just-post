import { Badge } from '#/components/ui/badge'
import { Link } from '@tanstack/react-router'

export type PostListItem = {
  id: string
  title: string
  handle: string
  summary: string | null
  status: 'draft' | 'published'
  featured: boolean
  createdAt: string | Date
}

export function PostCard({ post }: { post: PostListItem }) {
  return (
    <div className="group border-b p-1 pb-6">
      <div className="mb-2 flex items-center gap-2">
        <p className="text-xs font-medium text-muted-foreground">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <Badge variant={post.status === 'published' ? 'success' : 'secondary'}>
          {post.status === 'published' ? 'Published' : 'Draft'}
        </Badge>
        {post.featured && <Badge variant="warning">Featured</Badge>}
      </div>
      <Link
        to="/posts/$handle"
        params={{ handle: post.handle }}
        className="mb-0.5 cursor-pointer font-medium group-hover:underline"
      >
        {post.title}
      </Link>
      <p className="text-sm text-muted-foreground">{post.summary}</p>
    </div>
  )
}
