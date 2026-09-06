import type { Editor } from '@tiptap/core'
import { Button } from '#/components/ui/button'
import { Popover, PopoverPopup, PopoverTrigger } from '../ui/popover'
import { ImageIcon } from 'lucide-react'
import { Input } from '../ui/input'
import { Field, FieldLabel } from '../ui/field'

export default function ImagePopover({ editor }: { editor: Editor }) {
  return (
    <Popover>
      <PopoverTrigger render={<Button size="icon" variant="ghost" />}>
        <ImageIcon />
      </PopoverTrigger>
      <PopoverPopup className="w-72">
        <div className="flex flex-col gap-2">
          <Field>
            <FieldLabel>Image url</FieldLabel>
            <Input size="sm" />
          </Field>
          <Field>
            <FieldLabel>Caption</FieldLabel>
            <Input size="sm" />
          </Field>
          <div>
            <Button>Add</Button>
          </div>
        </div>
      </PopoverPopup>
    </Popover>
  )
}
