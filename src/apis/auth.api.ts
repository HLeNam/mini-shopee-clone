import type { AuthResponse } from '~/types/auth.type';
import http from '~/utils/http';

export const URL = {
  login: '/login',
  register: '/register',
  logout: '/logout',
  refreshAccessToken: '/refresh-access-token'
};

const registerAccount = async (body: { email: string; password: string }) => {
  return http.post<AuthResponse>(URL.register, body);
};

const loginAccount = async (body: { email: string; password: string }) => {
  return http.post<AuthResponse>(URL.login, body);
};

const logoutAccount = async () => {
  return http.post(URL.logout);
};

const authApi = {
  registerAccount,
  loginAccount,
  logoutAccount
};

export default authApi;
