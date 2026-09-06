import { Button } from '#/components/ui/button'
import { Field, FieldLabel, FieldDescription } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { toastManager } from '#/components/ui/toast'
import { Separator } from '#/components/ui/separator'
import { authClient } from '#/lib/auth/client'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { KeyRoundIcon, CopyIcon, Trash2Icon, PlusIcon } from 'lucide-react'
import { format } from 'date-fns'

export const Route = createFileRoute('/_site/settings/developer')({
  component: DeveloperSettings,
})

type ApiKey = {
  id: string
  name?: string
  start?: string
  expiresAt?: string
  createdAt: string
  lastUsedAt?: string
}

function DeveloperSettings() {
  return (
    <section className="space-y-10">
      <CreateApiKeyForm />
      <Separator />
      <ApiKeyList />
    </section>
  )
}

function CreateApiKeyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdKey, setCreatedKey] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name')?.toString() ?? ''
    const expiresIn = Number(formData.get('expiresIn') ?? '30')

    setIsSubmitting(true)

    try {
      const { data, error } = await authClient.apiKey.create({
        name,
        expiresIn: expiresIn * 60 * 60 * 24,
        metadata: { access: 'topics,posts' },
      })

      if (error) {
        toastManager.add({
          title: error.message || 'Failed to create API key',
          type: 'error',
        })
        return
      }

      if (data.key) {
        setCreatedKey(data.key)
        e.currentTarget.reset()
      }
    } catch (err) {
      toastManager.add({
        title: err instanceof Error ? err.message : 'Something went wrong',
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyKey = async () => {
    if (!createdKey) return
    await navigator.clipboard.writeText(createdKey)
    toastManager.add({ title: 'API key copied', type: 'success' })
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-base font-semibold">Create API key</h2>
        <p className="text-sm text-muted-foreground">
          Generate a key to access topics and posts externally
        </p>
      </div>

      <form className="max-w-sm space-y-4" onSubmit={handleSubmit}>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            name="name"
            placeholder="e.g. my-blog-aggregator"
            required
          />
          <FieldDescription>A label to identify this key</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="expiresIn">Expires in (days)</FieldLabel>
          <Input
            id="expiresIn"
            name="expiresIn"
            type="number"
            min={1}
            max={365}
            defaultValue={30}
            required
          />
        </Field>

        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          <PlusIcon />
          Create API key
        </Button>
      </form>

      {createdKey ? (
        <div className="mt-4 max-w-sm rounded-lg border bg-muted p-3">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Copy your key now — it won't be shown again
          </p>
          <div className="flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate text-sm">
              {createdKey}
            </code>
            <Button size="icon-sm" variant="outline" onClick={copyKey}>
              <CopyIcon />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function ApiKeyList() {
  const {
    data: keys,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const { data, error } = await authClient.apiKey.list({})
      if (error) throw new Error(error.message)
      return data.apiKeys as ApiKey[]
    },
  })

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const remove = async (keyId: string) => {
    setDeletingId(keyId)
    try {
      const { error } = await authClient.apiKey.delete({ keyId })
      if (error) {
        toastManager.add({
          title: error.message || 'Failed to delete API key',
          type: 'error',
        })
        return
      }
      await refetch()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-base font-semibold">API keys</h2>
        <p className="text-sm text-muted-foreground">
          Active keys that can read topics and posts
        </p>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading API keys…</p>
        ) : keys?.length ? (
          keys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <KeyRoundIcon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {key.name ?? 'Untitled key'}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {key.start ? `${key.start}…` : key.id}
                    {key.expiresAt
                      ? ` • expires ${format(new Date(key.expiresAt), 'MMM d, yyyy')}`
                      : ' • never expires'}
                  </p>
                </div>
              </div>

              <Button
                size="icon-sm"
                variant="ghost"
                aria-label="Delete API key"
                disabled={deletingId === key.id}
                loading={deletingId === key.id}
                onClick={() => remove(key.id)}
              >
                <Trash2Icon />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No API keys yet. Create one above.
          </p>
        )}
      </div>
    </div>
  )
}
