'use client'

import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx'

const items = [
  { color: 'bg-transparent', label: 'All Posts', value: 'all' },
  { color: 'bg-blue-500', label: 'Published', value: 'published' },
  { color: 'bg-gray-500', label: 'Draft', value: 'draft' },
]

export default function StatusSelector() {
  return (
    <Select
      aria-label="Select status"
      defaultValue={items[0]}
      itemToStringValue={(item) => item.value}
    >
      <SelectTrigger>
        <SelectValue>
          {(item) => (
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`size-2 rounded-full ${item.color}`}
              />
              <span className="truncate">{item.label}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectPopup>
        {items.map((item) => (
          <SelectItem key={item.value} value={item}>
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`size-2 rounded-full ${item.color}`}
              />
              <span className="truncate">{item.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  )
}
