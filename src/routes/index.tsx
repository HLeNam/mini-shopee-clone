import { createBrowserRouter } from 'react-router-dom';

import type { AppRouteObject } from '~/types/route.type';
import guestRoutes from '~/routes/guest.routes';
import privateRoutes from '~/routes/private.routes';
import publicRoutes from '~/routes/public.routes';
import { lazy } from 'react';
import ErrorPage from '~/components/ErrorPage';

const NotFound = lazy(() => import('~/pages/NotFound'));

const routes: AppRouteObject[] = [
  ...publicRoutes,
  ...guestRoutes,
  ...privateRoutes,
  {
    path: '*',
    Component: NotFound,
    errorElement: <ErrorPage />
  }
];

const router = createBrowserRouter(routes);

export default router;
