import axios, { AxiosError, HttpStatusCode, type AxiosInstance } from 'axios';
import { toast } from 'react-toastify';
import PATH from '~/constants/path';
import type { AuthSuccessResponse } from '~/types/auth.type';
import type { ErrorResponseApi } from '~/types/utils.type';
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
      (error: AxiosError) => {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const errorResponse = error.response?.data as ErrorResponseApi<{
            message?: string;
            name?: string;
            [key: string]: unknown;
          }>;
          const message =
            (errorResponse?.data as { message?: string })?.message || error.message || 'An error occurred';
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

          if (error.response?.status === HttpStatusCode.Unauthorized) {
            // Clear user info if unauthorized
            clearUserInfoFromLocalStorage();
            this.accessToken = '';
            // Optionally, redirect to login page
            setTimeout(() => {
              window.location.href = `/${PATH.login}`;
            }, 1000);
          }
        }
        return Promise.reject(error);
      }
    );
  }
}

const http = new Http().instance;

export default http;
