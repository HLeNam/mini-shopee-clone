import { toast } from 'react-toastify';
import axios, { AxiosError, HttpStatusCode, type AxiosInstance } from 'axios';

import type { ErrorResponseApi } from '~/types/utils.type';
import type { AuthSuccessResponse, RefreshTokenResponse } from '~/types/auth.type';
import {
  clearUserInfoFromLocalStorage,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  saveAccessTokenToLocalStorage,
  saveProfileToLocalStorage,
  saveRefreshTokenToLocalStorage
} from '~/utils/auth';
import config from '~/constants/config';
import { URL } from '~/apis/auth.api';
import { isAxiosUnauthorizedError, isExpiredTokenError } from '~/utils/utils';

class Http {
  instance: AxiosInstance;
  private accessToken: string = '';
  private refreshToken: string = '';
  private refreshTokenRequest: Promise<string> | null = null;

  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage() || '';
    this.refreshToken = getRefreshTokenFromLocalStorage() || '';
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000, // 10 seconds timeout
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 10, // 10s
        'expire-refresh-token': 60 * 60 // 1 hour
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
        if ([URL.login, URL.register].includes(url)) {
          const data = response.data as AuthSuccessResponse;
          this.accessToken = data.data.access_token || '';
          this.refreshToken = data.data.refresh_token || '';
          const profile = data.data.user;

          // Save access token to local storage
          saveAccessTokenToLocalStorage(this.accessToken);
          saveRefreshTokenToLocalStorage(this.refreshToken);
          saveProfileToLocalStorage(profile);
        } else if (url === URL.logout) {
          // Clear access token from local storage on logout
          this.accessToken = '';
          this.refreshToken = '';
          clearUserInfoFromLocalStorage();
        }
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          let url = error?.config?.url || '';
          url = url.startsWith('/') ? url : `/${url}`;

          // Xử lý token hết hạn
          if (isAxiosUnauthorizedError(error) && isExpiredTokenError(error) && url !== URL.refreshAccessToken) {
            this.refreshTokenRequest =
              this.refreshTokenRequest ||
              this.handleRefreshToken().finally(() => {
                this.refreshTokenRequest = null;
              });

            return this.refreshTokenRequest
              .then((newToken) => this.retryRequestWithNewToken(error, newToken))
              .catch((refreshError) => {
                console.error('Token refresh failed:', refreshError);
                clearUserInfoFromLocalStorage();
                this.accessToken = '';
                this.refreshToken = '';
                throw refreshError;
              });
          }

          // Xử lý lỗi không phải token hết hạn
          const errorResponse = error.response?.data as ErrorResponseApi<{
            message?: string;
            name?: string;
            [key: string]: unknown;
          }>;

          const message = errorResponse?.message || error?.message || 'An error occurred';

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

          // Clear user info if unauthorized
          clearUserInfoFromLocalStorage();
          this.accessToken = '';
          this.refreshToken = '';
          // Optionally, redirect to login page
          // setTimeout(() => {
          //   window.location.href = `/${PATH.login}`;
          // }, 1000);
        }
        return Promise.reject(error);
      }
    );
  }

  private handleRefreshToken = async () => {
    return this.instance
      .post<RefreshTokenResponse>(URL.refreshAccessToken, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const data = res.data;
        this.accessToken = data.data.access_token || '';
        saveAccessTokenToLocalStorage(this.accessToken);
        return this.accessToken;
      })
      .catch((error) => {
        clearUserInfoFromLocalStorage();
        this.accessToken = '';
        this.refreshToken = '';
        throw error;
      });
  };

  private retryRequestWithNewToken = (error: AxiosError, newAccessToken: string) => {
    if (error.response?.config?.headers) {
      console.log('Retrying request with new access token:', newAccessToken);
      error.response.config.headers['Authorization'] = newAccessToken;
      error.response.config.headers.authorization = newAccessToken;
      this.accessToken = newAccessToken;
      saveAccessTokenToLocalStorage(newAccessToken);
      return this.instance(error.response.config);
    }
    throw error;
  };
}

const http = new Http().instance;

export default http;
