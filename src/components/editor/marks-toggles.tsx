import type { Editor } from '@tiptap/core'
import { Toggle } from '#/components/ui/toggle'
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  LinkIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react'
import { useEditorState } from '@tiptap/react'
import { useMemo } from 'react'
import HighlightPopup from './highlighter-popover'
import LinkPopover from './link-popover'

export function MarksToggles({ editor }: { editor: Editor }) {
  const {
    isBoldActive,
    isItalicActive,
    isUnderlineActive,
    isStrikethroughActive,
    isCodeActive,
  } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBoldActive: editor.isActive('bold'),
      isItalicActive: editor.isActive('italic'),
      isUnderlineActive: editor.isActive('underline'),
      isStrikethroughActive: editor.isActive('strike'),
      isCodeActive: editor.isActive('code'),
    }),
  })

  const commands = useMemo(
    () => ({
      bold: () => editor.chain().focus().toggleBold().run(),
      italic: () => editor.chain().focus().toggleItalic().run(),
      underline: () => editor.chain().focus().toggleUnderline().run(),
      strikethrough: () => editor.chain().focus().toggleStrike().run(),
      code: () => editor.chain().focus().toggleCode().run(),
    }),
    [editor],
  )

  return (
    <div className="flex items-center gap-1">
      <Toggle pressed={isBoldActive} onPressedChange={() => commands.bold()}>
        <BoldIcon />
      </Toggle>
      <Toggle
        pressed={isItalicActive}
        onPressedChange={() => commands.italic()}
      >
        <ItalicIcon />
      </Toggle>
      <Toggle
        pressed={isUnderlineActive}
        onPressedChange={() => commands.underline()}
      >
        <UnderlineIcon />
      </Toggle>
      <Toggle
        pressed={isStrikethroughActive}
        onPressedChange={() => commands.strikethrough()}
      >
        <StrikethroughIcon />
      </Toggle>
      <LinkPopover editor={editor} />
      <HighlightPopup editor={editor} />
      <Toggle pressed={isCodeActive} onPressedChange={() => commands.code()}>
        <CodeIcon />
      </Toggle>
    </div>
  )
}
