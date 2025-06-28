import type { AuthResponse } from '~/types/auth.type';
import http from '~/utils/http';

export const registerAccount = async (body: { email: string; password: string }) => {
  return http.post<AuthResponse>('/register', body);
};

export const loginAccount = async (body: { email: string; password: string }) => {
  return http.post<AuthResponse>('/login', body);
};
