import type { Editor } from '@tiptap/core'
import { Toggle } from '#/components/ui/toggle'
import { Popover, PopoverPopup, PopoverTrigger } from '@/components/ui/popover'
import { HighlighterIcon, SlashIcon } from 'lucide-react'
import { useEditorState } from '@tiptap/react'
import { useMemo } from 'react'

export default function HighlightPopup({ editor }: { editor: Editor }) {
  const {
    isYellowActive,
    isGreenActive,
    isBlueActive,
    isPinkActive,
    isPurpleActive,
    isOrangeActive,
    isAnyActive,
  } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isYellowActive: editor.isActive('highlight', {
        color: 'var(--highlight-yellow)',
      }),
      isGreenActive: editor.isActive('highlight', {
        color: 'var(--highlight-green)',
      }),
      isBlueActive: editor.isActive('highlight', {
        color: 'var(--highlight-blue)',
      }),
      isPinkActive: editor.isActive('highlight', {
        color: 'var(--highlight-pink)',
      }),
      isPurpleActive: editor.isActive('highlight', {
        color: 'var(--highlight-purple)',
      }),
      isOrangeActive: editor.isActive('highlight', {
        color: 'var(--highlight-orange)',
      }),
      isAnyActive:
        editor.isActive('highlight', {
          color: 'var(--highlight-yellow)',
        }) ||
        editor.isActive('highlight', {
          color: 'var(--highlight-green)',
        }) ||
        editor.isActive('highlight', {
          color: 'var(--highlight-blue)',
        }) ||
        editor.isActive('highlight', {
          color: 'var(--highlight-pink)',
        }) ||
        editor.isActive('highlight', {
          color: 'var(--highlight-purple)',
        }) ||
        editor.isActive('highlight', {
          color: 'var(--highlight-orange)',
        }),
    }),
  })

  const commands = useMemo(
    () => ({
      yellow: () =>
        editor
          .chain()
          .focus()
          .toggleHighlight({ color: 'var(--highlight-yellow)' })
          .run(),
      green: () =>
        editor
          .chain()
          .focus()
          .toggleHighlight({ color: 'var(--highlight-green)' })
          .run(),
      blue: () =>
        editor
          .chain()
          .focus()
          .toggleHighlight({ color: 'var(--highlight-blue)' })
          .run(),
      pink: () =>
        editor
          .chain()
          .focus()
          .toggleHighlight({ color: 'var(--highlight-pink)' })
          .run(),
      purple: () =>
        editor
          .chain()
          .focus()
          .toggleHighlight({ color: 'var(--highlight-purple)' })
          .run(),
      orange: () =>
        editor
          .chain()
          .focus()
          .toggleHighlight({ color: 'var(--highlight-orange)' })
          .run(),
      remove: () => editor.chain().focus().unsetHighlight().run(),
    }),
    [editor],
  )

  return (
    <Popover>
      <PopoverTrigger render={<Toggle pressed={isAnyActive} />}>
        <HighlighterIcon />
      </PopoverTrigger>
      <PopoverPopup className="*:p-0 p-1 w-fit">
        <div className="flex items-center gap-1">
          <Toggle
            pressed={isYellowActive}
            onPressedChange={() => commands.yellow()}
          >
            <span className="w-4 h-4 bg-highlight-yellow rounded-sm" />
          </Toggle>
          <Toggle
            pressed={isGreenActive}
            onPressedChange={() => commands.green()}
          >
            <span className="w-4 h-4 bg-highlight-green rounded-sm" />
          </Toggle>
          <Toggle
            pressed={isBlueActive}
            onPressedChange={() => commands.blue()}
          >
            <span className="w-4 h-4 bg-highlight-blue rounded-sm" />
          </Toggle>
          <Toggle
            pressed={isPinkActive}
            onPressedChange={() => commands.pink()}
          >
            <span className="w-4 h-4 bg-highlight-pink rounded  -sm" />
          </Toggle>
          <Toggle
            pressed={isPurpleActive}
            onPressedChange={() => commands.purple()}
          >
            <span className="w-4 h-4 bg-highlight-purple rounded-sm" />
          </Toggle>
          <Toggle
            pressed={isOrangeActive}
            onPressedChange={() => commands.orange()}
          >
            <span className="w-4 h-4 bg-highlight-orange rounded-sm" />
          </Toggle>
          <Toggle
            pressed={!isAnyActive}
            onPressedChange={() => commands.remove()}
          >
            <SlashIcon className="size-4" />
          </Toggle>
        </div>
      </PopoverPopup>
    </Popover>
  )
}
