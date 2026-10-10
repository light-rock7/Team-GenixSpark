import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { AuthCallback } from './pages/AuthCallback';
import { DashboardCreator } from './pages/DashboardCreator';
import { DashboardBrand } from './pages/DashboardBrand';
import { CreatorProfileEdit } from './pages/CreatorProfileEdit';
import { CreatorPortfolio } from './pages/CreatorPortfolio';
import { CreatorPortfolioNew } from './pages/CreatorPortfolioNew';
import { CreatorPublicProfile } from './pages/CreatorPublicProfile';
import { CreatorCopilot } from './pages/CreatorCopilot';
import { CreatorOpportunities } from './pages/CreatorOpportunities';
import { CreatorApplications } from './pages/CreatorApplications';
import { Marketplace } from './pages/Marketplace';
import { BrandBriefNew } from './pages/BrandBriefNew';
import { BriefDetail } from './pages/BriefDetail';
import { BriefApplications } from './pages/BriefApplications';
import { NotFound } from './pages/NotFound';
import { RouteError } from './pages/RouteError';
import { ProtectedRoute, DashboardEntry } from './components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'marketplace',
        element: <Marketplace />,
      },
      {
        path: 'briefs/:id',
        element: <BriefDetail />,
      },
      {
        path: 'briefs/:id/applications',
        element: (
          <ProtectedRoute>
            <BriefApplications />
          </ProtectedRoute>
        ),
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
        path: 'creator/profile',
        element: (
          <ProtectedRoute allowedRole="creator">
            <CreatorProfileEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: 'creator/copilot',
        element: (
          <ProtectedRoute allowedRole="creator">
            <CreatorCopilot />
          </ProtectedRoute>
        ),
      },
      {
        path: 'creator/portfolio',
        element: (
          <ProtectedRoute allowedRole="creator">
            <CreatorPortfolio />
          </ProtectedRoute>
        ),
      },
      {
        path: 'creator/portfolio/new',
        element: (
          <ProtectedRoute allowedRole="creator">
            <CreatorPortfolioNew />
          </ProtectedRoute>
        ),
      },
      {
        path: 'opportunities',
        element: (
          <ProtectedRoute allowedRole="creator">
            <CreatorOpportunities />
          </ProtectedRoute>
        ),
      },
      {
        path: 'creator/applications',
        element: (
          <ProtectedRoute allowedRole="creator">
            <CreatorApplications />
          </ProtectedRoute>
        ),
      },
      {
        path: 'creators/:id',
        element: <CreatorPublicProfile />,
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
        path: 'brand/briefs/new',
        element: (
          <ProtectedRoute allowedRole="brand">
            <BrandBriefNew />
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
    errorElement: <RouteError />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
    errorElement: <RouteError />,
  },
]);
