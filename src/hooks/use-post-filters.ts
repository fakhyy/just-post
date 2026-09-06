import { parse, isValid } from 'date-fns'
import { useMemo } from 'react'

type PostLike = {
  status: string
  createdAt: string | Date
  title: string
  summary?: string | null
}

export type PostFilters = {
  status?: 'draft' | 'published'
  dateRange?: { from: Date; to: Date }
  query?: string
}

const DATE_FORMATS = ['dd.MM.yyyy', 'dd/MM/yyyy', 'yyyy-MM-dd', 'dd-MM-yyyy']

type DateRangePattern = {
  re: RegExp
  format: string
  sep: string
}

const RANGE_PATTERNS: DateRangePattern[] = [
  {
    re: /^(\d{2})\.(\d{2})\.(\d{4})-(\d{2})\.(\d{2})\.(\d{4})$/,
    format: 'dd.MM.yyyy',
    sep: '.',
  },
  {
    re: /^(\d{2})\/(\d{2})\/(\d{4})-(\d{2})\/(\d{2})\/(\d{4})$/,
    format: 'dd/MM/yyyy',
    sep: '/',
  },
  {
    re: /^(\d{4})-(\d{2})-(\d{2})-(\d{4})-(\d{2})-(\d{2})$/,
    format: 'yyyy-MM-dd',
    sep: '-',
  },
  {
    re: /^(\d{2})-(\d{2})-(\d{4})-(\d{2})-(\d{2})-(\d{4})$/,
    format: 'dd-MM-yyyy',
    sep: '-',
  },
]

function parseDate(value: string, format: string): Date | null {
  const parsed = parse(value, format, new Date())
  return isValid(parsed) ? parsed : null
}

function parseDateRange(input: string): { from: Date; to: Date } | null {
  for (const pattern of RANGE_PATTERNS) {
    const match = pattern.re.exec(input)
    if (!match) continue

    const join = (a: string, b: string, c: string) =>
      `${a}${pattern.sep}${b}${pattern.sep}${c}`
    const from = parseDate(join(match[1], match[2], match[3]), pattern.format)
    const to = parseDate(join(match[4], match[5], match[6]), pattern.format)
    if (from && to) {
      const endOfDay = new Date(to)
      endOfDay.setHours(23, 59, 59, 999)
      return { from, to: endOfDay }
    }
  }
  return null
}

export function parseSearchInput(input: string): PostFilters {
  const trimmed = input.trim()

  if (trimmed.startsWith('/status=')) {
    const status = trimmed.split('/status=')[1]?.trim()
    if (status === 'published' || status === 'draft') {
      return { status }
    }
    return {}
  }

  if (trimmed.startsWith('/date-range=')) {
    const range = trimmed.split('/date-range=')[1]?.trim()
    if (!range) return {}
    const dateRange = parseDateRange(range)
    return dateRange ? { dateRange } : {}
  }

  if (trimmed) {
    return { query: trimmed.toLowerCase() }
  }

  return {}
}

export function usePostFilters<T extends PostLike>(
  posts: T[],
  input: string,
): { posts: T[]; filters: PostFilters } {
  return useMemo(() => {
    const filters = parseSearchInput(input)

    const filtered = posts.filter((post) => {
      if (filters.status && post.status !== filters.status) return false

      if (filters.dateRange) {
        const date = new Date(post.createdAt)
        if (date < filters.dateRange.from || date > filters.dateRange.to) {
          return false
        }
      }

      if (filters.query) {
        const q = filters.query
        if (
          !post.title.toLowerCase().includes(q) &&
          !post.summary?.toLowerCase().includes(q)
        ) {
          return false
        }
      }

      return true
    })

    return { posts: filtered, filters }
  }, [posts, input])
}
