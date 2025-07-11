import { lazy } from 'react';
import PATH from '~/constants/path';
import MainLayout from '~/layouts/MainLayout';
import type { AppRouteObject } from '~/types/route.type';

const ProductList = lazy(() => import('~/pages/ProductList'));

const ProductDetail = lazy(() => import('~/pages/ProductDetail'));

const publicRoutes: AppRouteObject[] = [
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        path: PATH.home,
        index: true,
        Component: ProductList
      },
      {
        path: PATH.product.detail,
        Component: ProductDetail
      }
    ]
  }
];

export default publicRoutes;
