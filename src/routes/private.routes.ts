import { lazy } from 'react';
import withAuthGuard from '~/components/AuthGuard';
import PATH from '~/constants/path';
import CartLayout from '~/layouts/CartLayout';
import MainLayout from '~/layouts/MainLayout';
import UserLayout from '~/pages/User/layouts';
import type { AppRouteObject } from '~/types/route.type';
import { mergeUrlPaths } from '~/utils/utils';

const Profile = lazy(() => import('~/pages/User/pages/Profile'));

const ChangePassword = lazy(() => import('~/pages/User/pages/ChangePassword'));

const PurchaseHistory = lazy(() => import('~/pages/User/pages/HistoryPurchase'));

const Cart = lazy(() => import('~/pages/Cart/Cart'));

const privateRoutes: AppRouteObject[] = [
  {
    path: '/',
    Component: withAuthGuard(MainLayout),
    children: [
      {
        path: PATH.user.root,
        Component: UserLayout,
        children: [
          {
            path: PATH.user.profile,
            Component: Profile
          },
          {
            path: PATH.user.changePassword,
            Component: ChangePassword
          },
          {
            path: PATH.user.purchaseHistory,
            Component: PurchaseHistory
          }
        ]
      }
    ]
  },
  {
    path: mergeUrlPaths(PATH.cart),
    Component: withAuthGuard(CartLayout),
    children: [
      {
        path: '',
        Component: Cart
      }
    ]
  }
];

export default privateRoutes;
