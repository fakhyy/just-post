import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from 'lucide-react'
import { Toggle } from '#/components/ui/toggle'
import type { Editor } from '@tiptap/react'
import { useEditorState } from '@tiptap/react'
import { useMemo } from 'react'

export default function AlignToggles({ editor }: { editor: Editor }) {
  const { isCenterAlign, isJustify, isLeftAlign, isRightAlign } =
    useEditorState({
      editor,
      selector: ({ editor }) => ({
        isLeftAlign: editor.isActive({ textAlign: 'left' }),
        isRightAlign: editor.isActive({ textAlign: 'right' }),
        isCenterAlign: editor.isActive({ textAlign: 'center' }),
        isJustify: editor.isActive({ textAlign: 'justify' }),
      }),
    })

  const commands = useMemo(
    () => ({
      left: () => editor.chain().focus().toggleTextAlign('left').run(),
      right: () => editor.chain().focus().toggleTextAlign('right').run(),
      center: () => editor.chain().focus().toggleTextAlign('center').run(),
      justify: () => editor.chain().focus().toggleTextAlign('justify').run(),
    }),
    [editor],
  )

  return (
    <div className="flex items-center gap-1">
      <Toggle pressed={isLeftAlign} onPressedChange={commands.left}>
        <AlignLeftIcon />
      </Toggle>
      <Toggle pressed={isCenterAlign} onPressedChange={commands.center}>
        <AlignCenterIcon />
      </Toggle>
      <Toggle pressed={isRightAlign} onPressedChange={commands.right}>
        <AlignRightIcon />
      </Toggle>
      <Toggle pressed={isJustify} onPressedChange={commands.justify}>
        <AlignJustifyIcon />
      </Toggle>
    </div>
  )
}
