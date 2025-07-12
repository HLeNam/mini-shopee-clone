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

interface ByProductsBody {
  product_id: string;
  buy_count: number;
}
const byProducts = async (body: ByProductsBody[]) => {
  return http.post<SuccessResponseApi<Purchase[]>>(`${URL}/by-products`, body);
};

interface UpdatePurchaseBody {
  product_id: string;
  buy_count: number;
}
const updatePurchase = async ({ product_id, buy_count }: UpdatePurchaseBody) => {
  return http.put<SuccessResponseApi<Purchase>>(`${URL}/update-purchase`, {
    product_id,
    buy_count
  });
};

const deletePurchases = async (product_ids: string[]) => {
  return http.delete<
    SuccessResponseApi<{
      deleted_count: number;
    }>
  >(`${URL}`, {
    data: product_ids
  });
};

const purchaseApi = {
  addToCart,
  getPurchases,
  byProducts,
  updatePurchase,
  deletePurchases
};

export default purchaseApi;
