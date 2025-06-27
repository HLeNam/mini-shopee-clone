import type { AppRouteObject } from '~/types/route-types';

import publicRoutes from './public.routes';
import { createBrowserRouter } from 'react-router-dom';

const routes: AppRouteObject[] = [
  ...publicRoutes,
  {
    path: '*',
    Component: () => <div>404 Not Found</div>,
    ErrorBoundary: () => <div>Something went wrong</div>
  }
];

const router = createBrowserRouter(routes);

export default router;
