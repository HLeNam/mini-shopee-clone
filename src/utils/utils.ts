import axios, { AxiosError, HttpStatusCode } from 'axios';

// Type predicates to check if an error is an AxiosError
export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error);
}

export function isAxiosUnprocessableEntityError<T>(error: unknown): error is AxiosError<T> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity;
}
