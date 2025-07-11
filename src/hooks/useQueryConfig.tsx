import { isUndefined, omitBy } from 'lodash';

import useQueryParams from '~/hooks/useQueryParams';
import type { ProductListConfig } from '~/types/product.type';

export type QueryConfig = {
  [key in keyof ProductListConfig]: string;
};

const INITIAL_PAGINATION = {
  page: 1,
  limit: 20,
  page_size: 20
};

const useQueryConfig = () => {
  const queryParams: QueryConfig = useQueryParams();

  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || INITIAL_PAGINATION.page.toString(),
      limit: queryParams.limit || INITIAL_PAGINATION.limit.toString(),
      order: queryParams.order,
      sort_by: queryParams.sort_by,
      exclude: queryParams.exclude,
      rating_filter: queryParams.rating_filter,
      price_min: queryParams.price_min,
      price_max: queryParams.price_max,
      name: queryParams.name,
      category: queryParams.category
    },
    isUndefined
  );

  return queryConfig;
};

export default useQueryConfig;
