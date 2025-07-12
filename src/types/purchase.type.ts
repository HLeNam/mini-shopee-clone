import type { Product } from '~/types/product.type';

/**
 * -1: Sản phẩm đang trong giỏ hàng
 * 1: Sản phẩm đang đợi xác nhận từ chủ shop
 * 2: Sản phẩm đang được lấy hàng
 * 3: Sản phẩm đang được vận chuyển
 * 4: Sản phẩm đã được giao hàng
 * 5: Sản phẩm đã bị hủy
 */
export type PurchaseStatus = -1 | 1 | 2 | 3 | 4 | 5;

/**
 * 0: Tất cả sản phẩm
 */
export type PurchaseListStatus = 0 | PurchaseStatus;

export interface Purchase {
  _id: string;
  buy_count: number;
  price: number;
  price_before_discount: number;
  status: PurchaseStatus;
  user: string;
  product: Product;
  createdAt: string;
  updatedAt: string;
}
