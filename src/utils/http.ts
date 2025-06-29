import axios, { AxiosError, HttpStatusCode, type AxiosInstance } from 'axios';
import { toast } from 'react-toastify';
import PATH from '~/constants/path';
import type { AuthSuccessResponse } from '~/types/auth.type';
import {
  clearUserInfoFromLocalStorage,
  getAccessTokenFromLocalStorage,
  saveAccessTokenToLocalStorage,
  saveProfileToLocalStorage
} from '~/utils/auth';

class Http {
  instance: AxiosInstance;
  private accessToken: string = '';

  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage() || '';
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com',
      timeout: 10000, // 10 seconds timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.instance.interceptors.request.use(
      (config) => {
        // Attach access token to request headers if available
        if (this.accessToken && config.headers) {
          config.headers['Authorization'] = `${this.accessToken}`;
          config.headers.authorization = `${this.accessToken}`;
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        // Check if the response has an access token in response body
        const url = response.config.url || '';
        if ([`/${PATH.login}`, `/${PATH.register}`].includes(url)) {
          this.accessToken = (response.data as AuthSuccessResponse).data.access_token || '';
          const profile = (response.data as AuthSuccessResponse).data.user;
          // Save access token to local storage
          saveAccessTokenToLocalStorage(this.accessToken);
          saveProfileToLocalStorage(profile);
        } else if (url === `/${PATH.logout}`) {
          // Clear access token from local storage on logout
          this.accessToken = '';
          clearUserInfoFromLocalStorage();
        }
        return response;
      },
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const message =
            (error.response?.data as { message?: string })?.message || error.message || 'An error occurred';
          toast.error(message, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored'
          });
        }
        return Promise.reject(error);
      }
    );
  }
}

const http = new Http().instance;

export default http;
