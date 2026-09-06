import { Button } from '#/components/ui/button'
import { Field, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { toastManager } from '#/components/ui/toast'
import { authClient } from '#/lib/auth/client'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'

export const Route = createFileRoute('/_auth/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { redirect } = Route.useSearch()
  const [isLoading, setIsLoading] = useState(false)

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const email = formData.get('email')?.toString() ?? ''
    const password = formData.get('password')?.toString() ?? ''

    try {
      setIsLoading(true)

      const { data, error } = await authClient.signIn.email({
        email,
        password,
      })

      console.log('LOGIN RESPONSE:', { data, error })

      if (error) {
        toastManager.add({
          title: error.message || 'Failed to login',
          type: 'error',
        })

        return
      }

      if (redirect) {
        await navigate({ to: redirect, replace: true })
        return
      }

      await navigate({
        to: '/',
        replace: true,
      })
    } catch (error) {
      console.error('LOGIN EXCEPTION:', error)

      toastManager.add({
        title: error instanceof Error ? error.message : 'Something went wrong',
        type: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex h-screen w-full select-none items-center justify-center">
      <section className="grid h-112 w-full max-w-2xl grid-cols-2 overflow-hidden rounded-3xl border">
        <div className="h-full w-full border-r bg-secondary/50">
          <img
            src="https://images.unsplash.com/photo-1612534859320-79465795d8dc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Profile"
            className="h-full w-full object-cover object-bottom"
          />
        </div>

        <div className="px-6 py-20">
          <div className="mb-10 text-center">
            <h3 className="mb-1 text-2xl font-medium">Welcome Back</h3>

            <p className="text-sm text-muted-foreground">
              Enter email and password to continue
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <div className="space-y-4">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@domain.com"
                  autoComplete="email"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  minLength={8}
                  maxLength={20}
                  autoComplete="current-password"
                  required
                />
              </Field>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              Login
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            No account?{' '}
            <Link to="/register" className="font-medium text-foreground">
              Register
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
