import { lazy } from 'react';
import withAuthGuard from '~/components/AuthGuard';
import MainLayout from '~/layouts/MainLayout';
import type { AppRouteObject } from '~/types/route.type';

const Profile = lazy(() => import('~/pages/Profile'));

const privateRoutes: AppRouteObject[] = [
  {
    path: '/',
    Component: withAuthGuard(MainLayout),
    children: [
      {
        path: '/profile',
        Component: Profile
      }
    ]
  }
];

export default privateRoutes;
