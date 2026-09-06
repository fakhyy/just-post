import type { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
  RedoIcon,
  UndoIcon,
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  SubscriptIcon,
  SuperscriptIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  PilcrowIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  CodeXmlIcon,
} from 'lucide-react'
import { Toggle } from '#/components/ui/toggle'
import { Button } from '#/components/ui/button'
import { Separator } from '#/components/ui/separator'
import { Group } from '#/components/ui/group'
import LinkPopover from './link-popover'
import HighlightPopup from './highlighter-popover'
import ImagePopover from './image-popover'

export function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <HistoryButtons editor={editor} />
      <Separator orientation="vertical" />
      <BlockControls editor={editor} />
      <Separator orientation="vertical" />
      <MarksControls editor={editor} />
      <Separator orientation="vertical" />
      <ScriptControls editor={editor} />
      <Separator orientation="vertical" />
      <AlignControls editor={editor} />
      <Separator orientation="vertical" />
      <ListControls editor={editor} />
      <Separator orientation="vertical" />
      <ImagePopover editor={editor} />
    </div>
  )
}

function HistoryButtons({ editor }: { editor: Editor }) {
  const { canUndo, canRedo } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  })

  return (
    <Group>
      <Button
        size="icon-sm"
        variant="ghost"
        disabled={!canUndo}
        onClick={() => editor.chain().focus().undo().run()}
        aria-label="Undo"
      >
        <UndoIcon />
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        disabled={!canRedo}
        onClick={() => editor.chain().focus().redo().run()}
        aria-label="Redo"
      >
        <RedoIcon />
      </Button>
    </Group>
  )
}

function BlockControls({ editor }: { editor: Editor }) {
  const { isP, isH1, isH2, isH3, isQuote } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isP: editor.isActive('paragraph'),
      isH1: editor.isActive('heading', { level: 1 }),
      isH2: editor.isActive('heading', { level: 2 }),
      isH3: editor.isActive('heading', { level: 3 }),
      isQuote: editor.isActive('blockquote'),
    }),
  })

  const items = [
    {
      active: isP,
      command: () => editor.chain().focus().setParagraph().run(),
      icon: <PilcrowIcon />,
      label: 'Paragraph',
    },
    {
      active: isH1,
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      icon: <Heading1Icon />,
      label: 'Heading 1',
    },
    {
      active: isH2,
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      icon: <Heading2Icon />,
      label: 'Heading 2',
    },
    {
      active: isH3,
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      icon: <Heading3Icon />,
      label: 'Heading 3',
    },
    {
      active: isQuote,
      command: () => editor.chain().focus().toggleBlockquote().run(),
      icon: <QuoteIcon />,
      label: 'Quote',
    },
  ]

  return (
    <Group>
      {items.map((item) => (
        <Toggle
          key={item.label}
          size="sm"
          variant="outline"
          pressed={item.active}
          onPressedChange={item.command}
          aria-label={item.label}
        >
          {item.icon}
        </Toggle>
      ))}
    </Group>
  )
}

function MarksControls({ editor }: { editor: Editor }) {
  const { isBold, isItalic, isUnderline, isStrike, isCode } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor.isActive('bold'),
      isItalic: editor.isActive('italic'),
      isUnderline: editor.isActive('underline'),
      isStrike: editor.isActive('strike'),
      isCode: editor.isActive('code'),
    }),
  })

  const actions = [
    {
      active: isBold,
      cmd: () => editor.chain().focus().toggleBold().run(),
      icon: <BoldIcon />,
      label: 'Bold',
    },
    {
      active: isItalic,
      cmd: () => editor.chain().focus().toggleItalic().run(),
      icon: <ItalicIcon />,
      label: 'Italic',
    },
    {
      active: isUnderline,
      cmd: () => editor.chain().focus().toggleUnderline().run(),
      icon: <UnderlineIcon />,
      label: 'Underline',
    },
    {
      active: isStrike,
      cmd: () => editor.chain().focus().toggleStrike().run(),
      icon: <StrikethroughIcon />,
      label: 'Strikethrough',
    },
    {
      active: isCode,
      cmd: () => editor.chain().focus().toggleCode().run(),
      icon: <CodeIcon />,
      label: 'Inline code',
    },
  ]

  return (
    <Group>
      {actions.map((a) => (
        <Toggle
          key={a.label}
          size="sm"
          variant="outline"
          pressed={a.active}
          onPressedChange={a.cmd}
          aria-label={a.label}
        >
          {a.icon}
        </Toggle>
      ))}
      <LinkPopover editor={editor} />
      <HighlightPopup editor={editor} />
    </Group>
  )
}

function ScriptControls({ editor }: { editor: Editor }) {
  const { isSup, isSub } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isSup: editor.isActive('superscript'),
      isSub: editor.isActive('subscript'),
    }),
  })

  return (
    <Group>
      <Toggle
        size="sm"
        variant="outline"
        pressed={isSup}
        onPressedChange={() => editor.chain().focus().toggleSuperscript().run()}
        aria-label="Superscript"
      >
        <SuperscriptIcon />
      </Toggle>
      <Toggle
        size="sm"
        variant="outline"
        pressed={isSub}
        onPressedChange={() => editor.chain().focus().toggleSubscript().run()}
        aria-label="Subscript"
      >
        <SubscriptIcon />
      </Toggle>
    </Group>
  )
}

function AlignControls({ editor }: { editor: Editor }) {
  const { left, center, right, justify } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      left: editor.isActive({ textAlign: 'left' }),
      center: editor.isActive({ textAlign: 'center' }),
      right: editor.isActive({ textAlign: 'right' }),
      justify: editor.isActive({ textAlign: 'justify' }),
    }),
  })

  const items = [
    { active: left, cmd: 'left', icon: <AlignLeftIcon />, label: 'Align left' },
    {
      active: center,
      cmd: 'center',
      icon: <AlignCenterIcon />,
      label: 'Align center',
    },
    {
      active: right,
      cmd: 'right',
      icon: <AlignRightIcon />,
      label: 'Align right',
    },
    {
      active: justify,
      cmd: 'justify',
      icon: <AlignJustifyIcon />,
      label: 'Justify',
    },
  ]

  return (
    <Group>
      {items.map((item) => (
        <Toggle
          key={item.cmd}
          size="sm"
          variant="outline"
          pressed={item.active}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign(item.cmd).run()
          }
          aria-label={item.label}
        >
          {item.icon}
        </Toggle>
      ))}
    </Group>
  )
}

function ListControls({ editor }: { editor: Editor }) {
  const { isBullet, isOrdered, isCodeBlock } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBullet: editor.isActive('bulletList'),
      isOrdered: editor.isActive('orderedList'),
      isCodeBlock: editor.isActive('codeBlock'),
    }),
  })

  return (
    <Group>
      <Toggle
        size="sm"
        variant="outline"
        pressed={isBullet}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Bullet list"
      >
        <ListIcon />
      </Toggle>
      <Toggle
        size="sm"
        variant="outline"
        pressed={isOrdered}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Ordered list"
      >
        <ListOrderedIcon />
      </Toggle>
      <Toggle
        size="sm"
        variant="outline"
        pressed={isCodeBlock}
        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
        aria-label="Code block"
      >
        <CodeXmlIcon />
      </Toggle>
    </Group>
  )
}
