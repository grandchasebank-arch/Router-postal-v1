import { Outlet } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { PageLayout } from '@/components/shared/PageLayout'
import { useQueryClient } from '@/context/QueryClientContext'

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error)
  useEffect(() => {
    console.error('[Root Error Boundary]', error)
  }, [error])
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Something went wrong on our end.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              window.location.href = '/'
              reset()
            }}
            className="rounded-xl bg-[var(--text)] px-4 py-2 text-sm font-bold text-[var(--bg)]"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  )
}

export default function RootLayout() {
  const queryClient = useQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <PageLayout>
        <Outlet />
      </PageLayout>
    </QueryClientProvider>
  )
}

export { ErrorComponent }
