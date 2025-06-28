import type { ComponentType, PropsWithChildren } from 'react';
import type { ActionFunction, LoaderFunction, RouteObject, ShouldRevalidateFunction } from 'react-router-dom';

export type RouteComponentProps = PropsWithChildren<object>;

export type AppRouteObject = RouteObject & {
  Component?: ComponentType<RouteComponentProps>;
  ErrorBoundary?: ComponentType<RouteComponentProps>;
  children?: AppRouteObject[];
  loader?: LoaderFunction;
  action?: ActionFunction;
  shouldRevalidate?: ShouldRevalidateFunction;
};

// Types cho dữ liệu trả về từ các loaders
export interface HomeData {
  message: string;
  featuredItems: Array<FeaturedItem>;
}

export interface FeaturedItem {
  id: number;
  title: string;
  description: string;
}

export interface AboutData {
  title: string;
  content: string;
  team: Array<TeamMember>;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: Array<ActivityItem>;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  revenue: number;
}

export interface ActivityItem {
  id: number;
  type: string;
  description: string;
  timestamp: string;
}

export interface ProfileData {
  userId: string;
  username: string;
  email: string;
  profilePicture?: string;
  role: string;
}

// Types cho action results
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Types cho form data
export interface DashboardFormData {
  title: string;
  content: string;
}
