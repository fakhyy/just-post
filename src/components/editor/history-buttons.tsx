import { useMemo } from 'react'
import { useEditorState } from '@tiptap/react'
import { RedoIcon, UndoIcon } from 'lucide-react'
import { Button } from '#/components/ui/button'
import type { Editor } from '@tiptap/core'

export default function HistoryButtons({ editor }: { editor: Editor }) {
  const { canRedo, canUndo } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  })

  const commands = useMemo(
    () => ({
      redo: () => editor.chain().focus().redo().run(),
      undo: () => editor.chain().focus().undo().run(),
    }),
    [editor],
  )

  return (
    <div>
      <Button
        size="icon"
        variant="ghost"
        disabled={!canUndo}
        onClick={commands.undo}
      >
        <UndoIcon />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        disabled={!canRedo}
        onClick={commands.redo}
      >
        <RedoIcon />
      </Button>
    </div>
  )
}
