import type { Product, ProductList, ProductListConfig } from '~/types/product.type';
import type { SuccessResponseApi } from '~/types/utils.type';
import http from '~/utils/http';

const URL = '/products';

const getProducts = async (params: ProductListConfig) => {
  return http.get<SuccessResponseApi<ProductList>>(`${URL}`, {
    params: {
      ...params
    }
  });
};

const getProductDetail = async (id: string) => {
  return http.get<SuccessResponseApi<Product>>(`${URL}/${id}`);
};

const productApi = {
  getProducts,
  getProductDetail
};

export default productApi;
