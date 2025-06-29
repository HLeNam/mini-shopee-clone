import type { AuthResponse } from '~/types/auth.type';
import http from '~/utils/http';

const registerAccount = async (body: { email: string; password: string }) => {
  return http.post<AuthResponse>('/register', body);
};

const loginAccount = async (body: { email: string; password: string }) => {
  return http.post<AuthResponse>('/login', body);
};

const logoutAccount = async () => {
  return http.post('/logout');
};

const authApi = {
  registerAccount,
  loginAccount,
  logoutAccount
};

export default authApi;
