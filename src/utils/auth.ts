import type { UserProfile } from '~/types/user.type';

export const saveAccessTokenToLocalStorage = (accessToken: string) => {
  localStorage.setItem('access_token', accessToken);
};

export const clearAccessTokenFromLocalStorage = () => {
  localStorage.removeItem('access_token');
};

export const getAccessTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem('access_token');
};

export const getProfileFromLocalStorage = (): UserProfile | null => {
  return JSON.parse(localStorage.getItem('profile') || 'null');
};

export const saveProfileToLocalStorage = (profile: UserProfile) => {
  localStorage.setItem('profile', JSON.stringify(profile));
};

export const clearProfileFromLocalStorage = () => {
  localStorage.removeItem('profile');
};

export const clearUserInfoFromLocalStorage = () => {
  clearAccessTokenFromLocalStorage();
  clearProfileFromLocalStorage();
};

export const clearLocalStorage = () => {
  localStorage.clear();
};
