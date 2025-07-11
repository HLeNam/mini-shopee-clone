import { keepPreviousData, useQuery } from '@tanstack/react-query';

import productApi from '~/apis/product.api';
import categoryApi from '~/apis/category.api';
import Pagination from '~/components/Pagination';
import useQueryConfig from '~/hooks/useQueryConfig';
import Product from '~/pages/ProductList/components/Product';
import type { ProductListConfig } from '~/types/product.type';
import AsideFilter from '~/pages/ProductList/components/AsideFilter';
import SortProductList from '~/pages/ProductList/components/SortProductList';

const INITIAL_PAGINATION = {
  page: 1,
  limit: 20,
  page_size: 20
};

const ProductList = () => {
  const queryConfig = useQueryConfig();

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
