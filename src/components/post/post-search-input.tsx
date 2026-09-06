import {
  InputGroup,
  InputGroupInput,
  InputGroupText,
} from '#/components/ui/input-group'
import { SearchIcon } from 'lucide-react'

export function PostSearchInput({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <InputGroup className="max-w-xs border-border">
      <InputGroupText className="pl-2">
        <SearchIcon />
      </InputGroupText>
      <InputGroupInput
        size="sm"
        placeholder="/status=published, /date-range=..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputGroup>
  )
}
