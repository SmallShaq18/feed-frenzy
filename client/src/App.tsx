import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import AppRouter from './router';
import { useUIStore } from './store/useUIStore';
import { useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Show stale data immediately while fetching fresh data in background
      staleTime: 2 * 60 * 1000,
      // Don't hammer the server on every window focus
      refetchOnWindowFocus: false,
      // Retry failed requests once before showing error state
      retry: 1,
    },
  },
});

export default function App() {

  const theme = useUIStore(s => s.theme);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border-loud)',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-green)',
              secondary: 'var(--color-bg)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-coral)',
              secondary: 'var(--color-bg)',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}