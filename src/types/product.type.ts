export interface Product {
  _id: string;
  images: string[];
  price: number;
  rating: number;
  price_before_discount: number;
  quantity: number;
  sold: number;
  view: number;
  name: string;
  description: string;
  category: {
    _id: string;
    name: string;
  };
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductList {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    page_size: number;
  };
}

export interface ProductListConfig {
  page?: number | string; // page number, can be a string for query params
  limit?: number | string; // number of products per page, can be a string for query params
  order?: 'asc' | 'desc';
  sort_by?: 'createdAt' | 'price' | 'sold' | 'view' | 'rating';
  exclude?: string; // product id to exclude
  rating_filter?: number | string; // filter by rating
  price_min?: number | string; // minimum price
  price_max?: number | string; // maximum price
  name?: string; // search term
}
