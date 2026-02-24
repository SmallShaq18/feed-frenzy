import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from '../components/layouts/AppShell';
import AuthGuard from '../components/auth/AuthGuard';
import Spinner from '../components/ui/Spinner';

/**
 * All pages are lazy-loaded.
 * Only the AppShell and Spinner load on first paint.
 * Each page bundle loads only when the user navigates to it.
 */
const HomePage        = lazy(() => import('../pages/HomePage'));
const TrendsPage      = lazy(() => import('../pages/TrendsPage'));
const InsightsPage    = lazy(() => import('../pages/InsightsPage'));
const BookmarksPage   = lazy(() => import('../pages/BookmarksPage'));
const NewsletterPage  = lazy(() => import('../pages/NewsletterPage'));
const LoginPage       = lazy(() => import('../pages/LoginPage'));
const AdminPage       = lazy(() => import('../pages/AdminPage'));
const NotFoundPage    = lazy(() => import('../pages/NotFoundPage'));
const UnsubscribePage = lazy(() => import('../pages/UnsubscribePage'));
const WeeklyRecapPage = lazy(() => import('../pages/WeeklyRecap'));


// Consistent loading fallback used by every lazy page
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spinner size="lg" />
  </div>
);

export default function AppRouter() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes inside the AppShell */}
          <Route element={<AppShell />}>
            <Route path="/"           element={<HomePage />} />
            <Route path="/trends"     element={<TrendsPage />} />
            <Route path="/insights"   element={<InsightsPage />} />
            <Route path="/bookmarks"  element={<BookmarksPage />} />
            <Route path="/newsletter" element={<NewsletterPage />} />
            <Route path="/recap" element={<WeeklyRecapPage />} />
            <Route path="newsletter/unsubscribe/:token" element={<UnsubscribePage />} />
            <Route path="/login"      element={<LoginPage />} />

            {/* Protected admin routes */}
            <Route element={<AuthGuard requiredRole="admin" />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>

          {/* 404 — outside AppShell so it has its own full-screen layout */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}