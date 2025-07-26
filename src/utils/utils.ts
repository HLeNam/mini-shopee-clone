import axios, { AxiosError, HttpStatusCode } from 'axios';
import image from '~/assets/images';
import config from '~/constants/config';
import type { ResponseApi } from '~/types/utils.type';

// Type predicates to check if an error is an AxiosError
export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error);
}

export function isAxiosUnprocessableEntityError<T>(error: unknown): error is AxiosError<T> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity;
}

export function isAxiosUnauthorizedError<T>(error: unknown): error is AxiosError<T> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized;
}

export function isExpiredTokenError<T>(error: unknown): error is AxiosError<T> {
  return (
    isAxiosUnauthorizedError<
      ResponseApi<{
        message?: string;
        name?: string;
      }>
    >(error) && error.response?.data.data?.name === 'EXPIRED_TOKEN'
  );
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

export function rateSale(original: number, sale: number) {
  if (original <= 0 || sale < 0) return 0;
  return Math.round(((original - sale) / original) * 100);
}

export function mergeUrlPaths(...paths: string[]) {
  return (
    '/' +
    paths
      .map((path) => path.replace(/(^\/+|\/+$)/g, '')) // Remove leading and trailing slashes
      .filter(Boolean) // Filter out empty strings
      .join('/')
  ); // Join with a single slash
}

// Xóa các ký tự đặc biệt trên bàn phím
export function removeSpecialCharacter(str: string) {
  // str.replace(/!|@|#|\$|%|\^|&|\*|\(|\)|\+|=|\[|\]|\{|\}|;|:|,|\.|\/|<|>|\?|\\|`|'|"|~|-|_| |/g, ' ');

  return str
    .replace(/!|@|#|\$|%|\^|&|\*|\(|\)|\+|=|\[|\]|\{|\}|;|:|,|\.|\/|<|>|\?|\\|`|'|"|~|-|_/g, '')
    .replace(/\s+/g, '-') // Replace multiple spaces with a single space
    .trim(); // Trim leading and trailing spaces
}

export function generateNameId({ name, id }: { name: string; id: string }) {
  return `${removeSpecialCharacter(name)}-i::${id}`.toLowerCase();
}

export function getIdFromNameId(nameId: string) {
  const parts = nameId.split('-i::');
  return parts.length > 1 ? parts[1] : '';
}

export function parseFileSize(
  size: number,
  {
    unit = 'B',
    toUnit = 'MB',
    decimalPlaces = 2
  }: {
    unit?: 'B' | 'KB' | 'MB' | 'GB';
    toUnit?: 'B' | 'KB' | 'MB' | 'GB';
    decimalPlaces?: number;
  } = {}
): {
  value: number;
  unit: 'B' | 'KB' | 'MB' | 'GB';
  formatted: string;
} {
  const units: ('B' | 'KB' | 'MB' | 'GB')[] = ['B', 'KB', 'MB', 'GB'];
  const fromIndex = units.indexOf(unit);
  const toIndex = units.indexOf(toUnit);

  if (fromIndex === -1 || toIndex === -1) {
    throw new Error(`Invalid unit or toUnit`);
  }

  const step = toIndex - fromIndex;
  const convertedValue = size / Math.pow(1024, step);
  const formatted = `${convertedValue.toFixed(decimalPlaces)} ${toUnit}`;

  return {
    value: convertedValue,
    unit: toUnit,
    formatted
  };
}

export function getAvatarUrl(avatarName?: string) {
  const url = avatarName?.startsWith('http') ? avatarName : `${config.baseUrl}/images/${avatarName}`;

  return avatarName ? url : image.noAvatar;
}
