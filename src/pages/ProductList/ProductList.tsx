import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { isUndefined, omitBy } from 'lodash';
import categoryApi from '~/apis/category.api';
import productApi from '~/apis/product.api';
import Pagination from '~/components/Pagination';
import useQueryParams from '~/hooks/useQueryParams';
import AsideFilter from '~/pages/ProductList/AsideFilter';
import Product from '~/pages/ProductList/Product/Product';
import SortProductList from '~/pages/ProductList/SortProductList';
import type { ProductListConfig } from '~/types/product.type';

export type QueryConfig = {
  [key in keyof ProductListConfig]: string;
};

const INITIAL_PAGINATION = {
  page: 1,
  limit: 20,
  page_size: 20
};

const ProductList = () => {
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

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig as ProductListConfig),
    placeholderData: keepPreviousData
  });

  const products = productsData ? productsData.data.data.products : [];
  const pagination = productsData ? productsData.data.data.pagination : INITIAL_PAGINATION;

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories()
  });

  const categories = categoriesData ? categoriesData.data.data : [];

  return (
    <div className='bg-gray-200 py-6'>
      <div className='Container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-3'>
            <AsideFilter queryConfig={queryConfig} categories={categories} />
          </div>
          <div className='col-span-9'>
            <SortProductList queryConfig={queryConfig} pageSize={pagination.page_size} />
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
              {products.length > 0 &&
                products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
            </div>
            <Pagination queryConfig={queryConfig} pageSize={pagination.page_size} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductList;
