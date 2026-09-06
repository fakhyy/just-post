import { Button } from '#/components/ui/button'
import { Field, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { toastManager } from '#/components/ui/toast'
import { Separator } from '#/components/ui/separator'
import { authClient } from '#/lib/auth/client'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { LaptopIcon, SmartphoneIcon } from 'lucide-react'
import { format } from 'date-fns'

export const Route = createFileRoute('/_site/settings/general')({
  component: GeneralSettings,
})

function GeneralSettings() {
  return (
    <section className="space-y-10">
      <ChangePasswordCard />
      <Separator />
      <SessionsCard />
    </section>
  )
}

function ChangePasswordCard() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const currentPassword = formData.get('currentPassword')?.toString() ?? ''
    const newPassword = formData.get('newPassword')?.toString() ?? ''

    if (newPassword.length < 8) {
      toastManager.add({
        title: 'Password must be at least 8 characters',
        type: 'error',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
      })

      if (error) {
        toastManager.add({
          title: error.message || 'Failed to change password',
          type: 'error',
        })
        return
      }

      toastManager.add({
        title: 'Password changed successfully',
        type: 'success',
      })

      e.currentTarget.reset()
    } catch (err) {
      toastManager.add({
        title: err instanceof Error ? err.message : 'Something went wrong',
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-base font-semibold">Password</h2>
        <p className="text-sm text-muted-foreground">
          Change your account password
        </p>
      </div>

      <form className="max-w-sm space-y-4" onSubmit={handleSubmit}>
        <Field>
          <FieldLabel htmlFor="currentPassword">Current password</FieldLabel>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            placeholder="Current password"
            minLength={8}
            maxLength={20}
            autoComplete="current-password"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="newPassword">New password</FieldLabel>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="New password"
            minLength={8}
            maxLength={20}
            autoComplete="new-password"
            required
          />
        </Field>

        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          Update password
        </Button>
      </form>
    </div>
  )
}

type Session = {
  id: string
  token: string
  createdAt: string
  userAgent?: string
  ipAddress?: string
}

function SessionsCard() {
  const {
    data: sessions,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['session-list'],
    queryFn: async () => {
      const { data, error } = await authClient.listSessions()
      if (error) throw new Error(error.message)
      return data as Session[]
    },
  })

  const [revokingId, setRevokingId] = useState<string | null>(null)

  const revoke = async (sessionId: string) => {
    setRevokingId(sessionId)
    try {
      const { error } = await authClient.revokeSession({ token: session.token })
      if (error) {
        toastManager.add({
          title: error.message || 'Failed to revoke session',
          type: 'error',
        })
        return
      }
      await refetch()
    } finally {
      setRevokingId(null)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-base font-semibold">Sessions</h2>
        <p className="text-sm text-muted-foreground">
          Devices where you are currently signed in
        </p>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading sessions…</p>
        ) : sessions?.length ? (
          sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                  {isMobileUserAgent(session.userAgent) ? (
                    <SmartphoneIcon className="size-4" />
                  ) : (
                    <LaptopIcon className="size-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {session.userAgent
                      ? parseDeviceName(session.userAgent)
                      : 'Unknown device'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session.ipAddress ?? 'Unknown IP'} •{' '}
                    {format(new Date(session.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                disabled={revokingId === session.token}
                loading={revokingId === session.token}
                onClick={() => revoke(session.token)}
              >
                Revoke
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No active sessions</p>
        )}
      </div>
    </div>
  )
}

function isMobileUserAgent(ua?: string) {
  if (!ua) return false
  return /Mobile|Android|iPhone|iPad/i.test(ua)
}

function parseDeviceName(ua: string) {
  if (/iPhone/i.test(ua)) return 'iPhone'
  if (/iPad/i.test(ua)) return 'iPad'
  if (/Android/i.test(ua)) return 'Android device'
  if (/Macintosh|Mac OS/i.test(ua)) return 'Mac'
  if (/Windows/i.test(ua)) return 'Windows PC'
  if (/Linux/i.test(ua)) return 'Linux computer'
  return 'Web browser'
}
