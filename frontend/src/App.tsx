import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { useAuth } from '@/hooks/useAuth'
import { useAppSelector } from '@/store'
import router from '@/routes'

// ── React Query client ────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime:    1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// ── Toast config ──────────────────────────────────────────────────────────────
const toastOptions = {
  duration: 4000,
  style: {
    background: '#FFF8F0',
    color: '#2B1D13',
    border: '1px solid #D8C3A5',
    borderRadius: '14px',
    fontFamily: 'Outfit, system-ui, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    padding: '12px 18px',
    boxShadow: '0 8px 32px rgba(58,36,21,0.14)',
    maxWidth: '380px',
  },
  success: {
    iconTheme: { primary: '#B89052', secondary: '#FFF8F0' },
    style: { borderLeft: '3px solid #B89052' },
  },
  error: {
    iconTheme: { primary: '#C0392B', secondary: '#FFF8F0' },
    style: { borderLeft: '3px solid #C0392B' },
  },
  loading: {
    iconTheme: { primary: '#B89052', secondary: '#EFE7DA' },
  },
} as const

// ── Inner app ─────────────────────────────────────────────────────────────────
const AppInner = () => {
  const { init, isInitialized } = useAuth()
  const isPageLoading = useAppSelector(s => s.ui.isPageLoading)

  useEffect(() => { init() }, [])

  useEffect(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
  }, [])

  // Hold render until auth state is resolved — prevents redirect flicker
  if (!isInitialized) {
    return <LoadingScreen isLoading message="Brewing your experience…" />
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LoadingScreen isLoading={isPageLoading} message="Just a moment…" />

        {/*
          FIX 1: RouterProvider must NOT be wrapped in AnimatePresence.
          AnimatePresence with RouterProvider (data router) causes the crash:
          "Cannot read properties of undefined (reading 'location')"

          FIX 2: CartDrawer and NotificationCenter that use useNavigate() /
          router hooks MUST live inside the router tree. They are rendered
          inside MainLayout (via Outlet), not here alongside RouterProvider.
        */}
        <RouterProvider router={router} future={{ v7_startTransition: true }} />

        {/*
          Toaster is safe outside the router — it uses no router hooks.
        */}
        <Toaster
          position="top-right"
          gutter={10}
          containerStyle={{ top: 72 }}
          toastOptions={toastOptions}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default function App() {
  return <AppInner />
}
