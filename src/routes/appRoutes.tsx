import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { Loading } from '../components/Loading';
import { PageTransition } from '../components/PageTransition';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AppLayout } from '../layouts';

// Lazy load pages for code splitting
const AuthPage = lazy(() =>
  import('../modules/auth/pages').then((module) => ({
    default: module.AuthPage,
  }))
);
const SettingsPage = lazy(() =>
  import('../modules/settings/pages').then((module) => ({
    default: module.SettingsPage,
  }))
);
const TasksPage = lazy(() =>
  import('../modules/tasks/pages').then((module) => ({
    default: module.TasksPage,
  }))
);
const TodayTasksPage = lazy(() =>
  import('../modules/tasks/pages').then((module) => ({
    default: module.TodayTasksPage,
  }))
);
const TaskDetailPage = lazy(() =>
  import('../modules/tasks/pages').then((module) => ({
    default: module.TaskDetailPage,
  }))
);
const AssignedTasksPage = lazy(() =>
  import('../modules/tasks/pages').then((module) => ({
    default: module.AssignedTasksPage,
  }))
);
const SearchPage = lazy(() =>
  import('../modules/tasks/pages').then((module) => ({
    default: module.SearchPage,
  }))
);
const PrivacyPage = lazy(() =>
  import('../modules/legal/pages').then((module) => ({
    default: module.PrivacyPage,
  }))
);
const TermsPage = lazy(() =>
  import('../modules/legal/pages').then((module) => ({
    default: module.TermsPage,
  }))
);
const GroupsPage = lazy(() =>
  import('../modules/groups/pages').then((module) => ({
    default: module.GroupsPage,
  }))
);
const GroupDetailPage = lazy(() =>
  import('../modules/groups/pages').then((module) => ({
    default: module.GroupDetailPage,
  }))
);
const FinanceHomePage = lazy(() =>
  import('../modules/finance/pages/FinanceHomePage').then((module) => ({
    default: module.FinanceHomePage,
  }))
);

export function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/privacidade"
          element={
            <Suspense fallback={<Loading />}>
              <PageTransition>
                <PrivacyPage />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/termos"
          element={
            <Suspense fallback={<Loading />}>
              <PageTransition>
                <TermsPage />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<Loading />}>
              <PageTransition>
                <AuthPage />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Suspense fallback={<Loading />}>
                  <PageTransition>
                    <TasksPage />
                  </PageTransition>
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/today"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Suspense fallback={<Loading />}>
                  <PageTransition>
                    <TodayTasksPage />
                  </PageTransition>
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/assigned"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Suspense fallback={<Loading />}>
                  <PageTransition>
                    <AssignedTasksPage />
                  </PageTransition>
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Suspense fallback={<Loading />}>
                  <PageTransition>
                    <TaskDetailPage />
                  </PageTransition>
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Suspense fallback={<Loading />}>
                  <PageTransition>
                    <SearchPage />
                  </PageTransition>
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Suspense fallback={<Loading />}>
                  <PageTransition>
                    <GroupsPage />
                  </PageTransition>
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Suspense fallback={<Loading />}>
                  <PageTransition>
                    <GroupDetailPage />
                  </PageTransition>
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Suspense fallback={<Loading />}>
                  <PageTransition>
                    <SettingsPage />
                  </PageTransition>
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Suspense fallback={<Loading />}>
                  <PageTransition>
                    <FinanceHomePage />
                  </PageTransition>
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/tasks" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
