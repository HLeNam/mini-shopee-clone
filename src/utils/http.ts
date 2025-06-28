import axios, { AxiosError, HttpStatusCode, type AxiosInstance } from 'axios';
import { toast } from 'react-toastify';

class Http {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com',
      timeout: 10000, // 10 seconds timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.instance.interceptors.response.use(
      function (response) {
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
