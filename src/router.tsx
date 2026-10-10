import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { AuthCallback } from './pages/AuthCallback';
import { DashboardCreator } from './pages/DashboardCreator';
import { DashboardBrand } from './pages/DashboardBrand';
import { NotFound } from './pages/NotFound';
import { ProtectedRoute, DashboardEntry } from './components/auth/ProtectedRoute';
import { Marketplace } from './pages/marketplace/Marketplace';
import { BriefDetails } from './pages/marketplace/BriefDetails';
import { Applications } from './pages/marketplace/Applications';
import { Collaboration } from './pages/marketplace/Collaboration';
import { Recommendations } from './pages/marketplace/Recommendations';

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
        path: 'marketplace',
        element: <Marketplace />,
      },
      {
        path: 'marketplace/brief',
        element: <BriefDetails />,
      },
      {
        path: 'marketplace/applications',
        element: <Applications />,
      },
      {
        path: 'marketplace/collaboration',
        element: <Collaboration />,
      },
      {
        path: 'marketplace/recommendations',
        element: <Recommendations />,
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

export default router;
