import { ArrowUpRightFromSquareIcon, LinkIcon } from 'lucide-react'
import { Popover, PopoverPopup, PopoverTrigger } from '../ui/popover'
import { Toggle } from '../ui/toggle'
import { useCallback, useEffect, useState } from 'react'
import type { Editor } from '@tiptap/react'
import { useEditorState } from '@tiptap/react'
import { Button } from '../ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { Group, GroupSeparator } from '../ui/group'
import { Input } from '../ui/input'

export default function LinkPopover({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false)
  const [link, setLink] = useState('')

  const { isLinkActive, currentHref } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isLinkActive: editor.isActive('link'),
      currentHref: editor.getAttributes('link').href as string | undefined,
    }),
  })

  useEffect(() => {
    setLink(currentHref ?? '')
  }, [currentHref])

  const closeAndFocus = useCallback(() => {
    setIsOpen(false)
    editor.chain().focus().run()
  }, [editor])

  const handleSubmit = useCallback(() => {
    const trimmed = link.trim()
    if (!trimmed) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: trimmed })
        .run()
    }
    closeAndFocus()
  }, [editor, link, closeAndFocus])

  const handleRemove = useCallback(() => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    setLink('')
    closeAndFocus()
  }, [editor, closeAndFocus])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={
          <Toggle pressed={isLinkActive}>
            <LinkIcon />
          </Toggle>
        }
      />
      <PopoverPopup className="w-80">
        <div className="flex flex-col">
          <Group className="w-full">
            <Input
              autoFocus
              type="text"
              value={link}
              placeholder="Enter URL"
              onChange={(e) => setLink(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSubmit()
                }
              }}
            />
            <GroupSeparator />
            <Button disabled={!link} size="icon" variant="outline">
              <a href={link} target="_blank" rel="noopener noreferrer">
                <ArrowUpRightFromSquareIcon />
              </a>
            </Button>
          </Group>
          <div className="flex items-center justify-end gap-2 mt-2">
            <Button
              onClick={handleRemove}
              variant="secondary"
              size="sm"
              disabled={!isLinkActive}
            >
              Remove
            </Button>
            <Button size="sm" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </PopoverPopup>
    </Popover>
  )
}
