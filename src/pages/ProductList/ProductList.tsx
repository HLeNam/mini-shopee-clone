import AsideFilter from '~/pages/ProductList/AsideFilter';
import Product from '~/pages/ProductList/Product/Product';
import SortProductList from '~/pages/ProductList/SortProductList';

const ProductList = () => {
  return (
    <div className='bg-gray-200 py-6'>
      <div className='Container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-3'>
            <AsideFilter />
          </div>
          <div className='col-span-9'>
            <SortProductList />
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
              {Array.from({ length: 30 }, (_, index) => (
                <div className='col-span-1' key={index}>
                  <Product />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductList;
