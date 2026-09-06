import { ThemeProvider } from './theme-provider'
import { ToastProvider } from '#/components/ui/toast'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider position="top-right">{children}</ToastProvider>
    </ThemeProvider>
  )
}
