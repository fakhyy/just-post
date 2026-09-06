import type { Editor } from '@tiptap/core'
import { Toggle } from '../ui/toggle'
import { SubscriptIcon, SuperscriptIcon } from 'lucide-react'
import { useEditorState } from '@tiptap/react'
import { useMemo } from 'react'

export default function ScriptToggles({ editor }: { editor: Editor }) {
  const { isSubscriptActive, isSuperscriptActive } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isSuperscriptActive: editor.isActive('superscript'),
      isSubscriptActive: editor.isActive('subscript'),
    }),
  })

  const commands = useMemo(
    () => ({
      toggleSuperscript: () => editor.chain().focus().toggleSuperscript().run(),
      toggleSubscript: () => editor.chain().focus().toggleSubscript().run(),
    }),
    [editor],
  )

  return (
    <div className="flex items-center gap-1">
      <Toggle
        pressed={isSuperscriptActive}
        onPressedChange={commands.toggleSuperscript}
      >
        <SuperscriptIcon />
      </Toggle>
      <Toggle
        pressed={isSubscriptActive}
        onPressedChange={commands.toggleSubscript}
      >
        <SubscriptIcon />
      </Toggle>
    </div>
  )
}
