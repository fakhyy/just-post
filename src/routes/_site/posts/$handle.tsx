import { requireSession } from '#/lib/session'
import { db } from '#/db'
import { posts } from '#/db/schemas/core.schema'
import { eq } from 'drizzle-orm'
import { redirect, createFileRoute } from '@tanstack/react-router'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Highlight as HighlightExtension } from '@tiptap/extension-highlight'
import { Superscript } from '@tiptap/extension-superscript'
import { Subscript } from '@tiptap/extension-subscript'
import { TextAlign } from '@tiptap/extension-text-align'
import { Link } from '@tiptap/extension-link'
import { EditorToolbar } from '#/components/editor/editor-toolbar'
import { NotionDragHandle } from '#/components/editor/drag-plus-handle'

export const Route = createFileRoute('/_site/posts/$handle')({
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
  loader: async ({ params }) => {
    const rows = await db
      .select()
      .from(posts)
      .where(eq(posts.handle, params.handle))
      .limit(1)

    return {
      post: rows[0] as typeof posts.$inferSelect | null,
      handle: params.handle,
    }
  },
})

function RouteComponent() {
  const { post } = Route.useLoaderData()

  const extensions = [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
    }),
    HighlightExtension.configure({ multicolor: true }),
    Superscript,
    Subscript,
    TextAlign.configure({
      types: ['heading', 'paragraph', 'figure', 'div'],
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
    }),
  ]

  const editor = useEditor({
    extensions,
    content: post?.htmlContent ?? '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none',
      },
    },
  })

  return (
    <main className="w-full min-h-screen">
      <header className="sticky top-0 z-20 w-full border-b bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-2">
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-sm font-semibold">
              {post?.title ?? post?.handle ?? 'New post'}
            </span>
            <span className="text-xs text-muted-foreground">
              {post?.status === 'published' ? 'Published' : 'Draft'}
            </span>
          </div>
          <EditorToolbar editor={editor} />
        </div>
      </header>
      <article className="mx-auto w-full max-w-3xl p-4">
        <EditorContent editor={editor} />
        <NotionDragHandle editor={editor} />
      </article>
    </main>
  )
}
