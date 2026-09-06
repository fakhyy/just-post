import { Button } from '#/components/ui/button'
import { Field, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { toastManager } from '#/components/ui/toast'
import { authClient } from '#/lib/auth/client'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'

export const Route = createFileRoute('/_auth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const name = formData.get('name')?.toString() ?? ''
    const email = formData.get('email')?.toString() ?? ''
    const password = formData.get('password')?.toString() ?? ''

    try {
      setIsLoading(true)

      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
      })

      if (error) {
        toastManager.add({
          title: error.message || 'Failed to register',
          type: 'error',
        })

        return
      }

      await navigate({
        to: '/',
        replace: true,
      })
    } catch (error) {
      console.error('REGISTER EXCEPTION:', error)

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
      <section className="grid h-120 w-full max-w-2xl grid-cols-2 overflow-hidden rounded-3xl border">
        <div className="h-full w-full border-r bg-secondary/50">
          <img
            src="https://images.unsplash.com/photo-1612534859320-79465795d8dc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fGVufHx8fA%3D%3D"
            alt="Profile"
            className="h-full w-full object-cover object-bottom"
          />
        </div>

        <div className="px-6 py-12">
          <div className="mb-8 text-center">
            <h3 className="mb-1 text-2xl font-medium">Create Account</h3>

            <p className="text-sm text-muted-foreground">
              Only a single account is allowed
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <div className="space-y-4">
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>

                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  autoComplete="name"
                  required
                />
              </Field>

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
                  autoComplete="new-password"
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
              Register
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-foreground">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
