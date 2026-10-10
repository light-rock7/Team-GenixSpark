import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { AuthCallback } from './pages/AuthCallback';
import { DashboardCreator } from './pages/DashboardCreator';
import { DashboardBrand } from './pages/DashboardBrand';
import { NotFound } from './pages/NotFound';
import { ProtectedRoute, DashboardEntry } from './components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardEntry />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard/creator',
        element: (
          <ProtectedRoute allowedRole="creator">
            <DashboardCreator />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard/brand',
        element: (
          <ProtectedRoute allowedRole="brand">
            <DashboardBrand />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
]);
