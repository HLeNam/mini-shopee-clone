export const SORT_BY = {
  createdAt: 'createdAt',
  view: 'view',
  sold: 'sold',
  price: 'price',
  rating: 'rating'
} as const;

export const SORT_ORDER = {
  asc: 'asc',
  desc: 'desc'
} as const;

export const INITIAL_PAGINATION = {
  page: 1,
  limit: 20,
  page_size: 20
};
