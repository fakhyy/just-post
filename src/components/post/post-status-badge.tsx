import { Badge } from '#/components/ui/badge'

type PostStatus = 'draft' | 'published'

export function PostStatusBadge({ status }: { status: PostStatus }) {
  return (
    <Badge variant={status === 'published' ? 'success' : 'secondary'}>
      {status === 'published' ? 'Published' : 'Draft'}
    </Badge>
  )
}
