import { lazy } from 'react';
import MainLayout from '~/layouts/MainLayout';
import type { AppRouteObject } from '~/types/route.type';

const ProductList = lazy(() => import('~/pages/ProductList'));

const publicRoutes: AppRouteObject[] = [
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        path: '/',
        index: true,
        Component: ProductList
      }
    ]
  }
];

export default publicRoutes;
