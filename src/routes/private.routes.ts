import { lazy } from 'react';
import withAuthGuard from '~/components/AuthGuard';
import PATH from '~/constants/path';
import MainLayout from '~/layouts/MainLayout';
import type { AppRouteObject } from '~/types/route.type';

const Profile = lazy(() => import('~/pages/Profile'));

const privateRoutes: AppRouteObject[] = [
  {
    path: '/',
    Component: withAuthGuard(MainLayout),
    children: [
      {
        path: PATH.profile,
        Component: Profile
      }
    ]
  }
];

export default privateRoutes;
