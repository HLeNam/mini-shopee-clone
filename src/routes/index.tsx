import { createBrowserRouter } from 'react-router-dom';

import type { AppRouteObject } from '~/types/route.type';
import guestRoutes from '~/routes/guest.routes';
import privateRoutes from '~/routes/private.routes';
import publicRoutes from '~/routes/public.routes';

const routes: AppRouteObject[] = [
  ...publicRoutes,
  ...guestRoutes,
  ...privateRoutes,
  {
    path: '*',
    Component: () => <div>404 Not Found</div>,
    ErrorBoundary: () => <div>Something went wrong</div>
  }
];

const router = createBrowserRouter(routes);

export default router;
