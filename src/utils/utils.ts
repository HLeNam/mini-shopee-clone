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
