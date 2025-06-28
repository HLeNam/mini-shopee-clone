import { lazy } from 'react';
import MainLayout from '~/layouts/MainLayout';
import type { AppRouteObject } from '~/types/route-types';

const ProductList = lazy(() => import('~/pages/ProductList'));

const RegisterLayout = lazy(() => import('~/layouts/RegisterLayout'));
const Login = lazy(() => import('~/pages/Login'));
const Register = lazy(() => import('~/pages/Register'));

const publicRoutes: AppRouteObject[] = [
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        path: '/',
        Component: ProductList
      }
    ]
  },
  {
    path: '/',
    Component: RegisterLayout,
    children: [
      {
        path: '/login',
        Component: Login
      },
      {
        path: 'register',
        Component: Register
      }
    ]
  }
];

export default publicRoutes;
