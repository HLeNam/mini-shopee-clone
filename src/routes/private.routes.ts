import { lazy } from 'react';
import withAuthGuard from '~/components/AuthGuard';
import PATH from '~/constants/path';
import MainLayout from '~/layouts/MainLayout';
import type { AppRouteObject } from '~/types/route.type';

const Profile = lazy(() => import('~/pages/Profile'));

const Cart = lazy(() => import('~/pages/Cart/Cart'));

const privateRoutes: AppRouteObject[] = [
  {
    path: '/',
    Component: withAuthGuard(MainLayout),
    children: [
      {
        path: PATH.profile,
        Component: Profile
      },
      {
        path: PATH.cart,
        Component: Cart
      }
    ]
  }
];

export default privateRoutes;
