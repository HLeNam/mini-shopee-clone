import axios, { AxiosError, HttpStatusCode } from 'axios';

// Type predicates to check if an error is an AxiosError
export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error);
}

export function isAxiosUnprocessableEntityError<T>(error: unknown): error is AxiosError<T> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity;
}

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency);
}

export function formatNumberToSocialStyle(number: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(number)
    .replace('.', ',')
    .toLowerCase();
}
