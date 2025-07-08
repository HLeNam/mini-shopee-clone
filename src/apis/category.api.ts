import type { Category } from '~/types/category.type';
import type { SuccessResponseApi } from '~/types/utils.type';
import http from '~/utils/http';

const URL = 'categories';

const getCategories = async () => {
  return http.get<SuccessResponseApi<Category[]>>(URL);
};

const categoryApi = {
  getCategories
};

export default categoryApi;
