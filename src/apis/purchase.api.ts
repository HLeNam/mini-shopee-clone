import type { Purchase, PurchaseListStatus } from '~/types/purchase.type';
import type { SuccessResponseApi } from '~/types/utils.type';
import http from '~/utils/http';

const URL = '/purchases';

const addToCart = async ({ product_id, buy_count }: { product_id: string; buy_count: number }) => {
  return http.post<SuccessResponseApi<Purchase>>(`${URL}/add-to-cart`, {
    product_id,
    buy_count
  });
};

const getPurchases = async (params: { status: PurchaseListStatus }) => {
  return http.get<SuccessResponseApi<Purchase[]>>(`${URL}`, {
    params
  });
};

const purchaseApi = {
  addToCart,
  getPurchases
};

export default purchaseApi;
