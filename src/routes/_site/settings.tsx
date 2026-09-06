import { requireSession } from '#/lib/session'
import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { SettingsIcon, KeyRoundIcon, UserRoundIcon } from 'lucide-react'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/_site/settings')({
  beforeLoad: async ({ location }) => {
    const session = await requireSession()

    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }

    return { session }
  },
  component: SettingsLayout,
})

const navItems = [
  {
    to: '/settings/general',
    label: 'General',
    icon: UserRoundIcon,
  },
  {
    to: '/settings/developer',
    label: 'Developer',
    icon: KeyRoundIcon,
  },
]

function SettingsLayout() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl border bg-muted">
          <SettingsIcon className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account and developer tools
          </p>
        </div>
      </div>

      <div className="mb-8 flex items-center gap-1 border-b">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'flex items-center gap-2 border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:border-primary [&.active]:text-foreground',
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </div>

      <Outlet />
    </main>
  )
}
