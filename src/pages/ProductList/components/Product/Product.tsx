import { Link } from 'react-router-dom';
import ProductRating from '~/components/ProductRating';
import PATH from '~/constants/path';
import type { Product as ProductType } from '~/types/product.type';
import { formatCurrency, formatNumberToSocialStyle, mergeUrlPaths } from '~/utils/utils';

interface ProductProps {
  product: ProductType;
}

const Product = ({ product }: ProductProps) => {
  return (
    <Link to={mergeUrlPaths(PATH.home, product._id)}>
      <div className='overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.04rem] hover:shadow-md'>
        <div className='relative w-full pt-[100%]'>
          <img
            className='absolute top-0 left-0 h-full w-full bg-white object-contain'
            src={product.image}
            alt={product.name}
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='line-clamp-2 min-h-[2rem] text-xs'>{product.name}</div>
          <div className='mt-3 flex items-center'>
            <div className='flex max-w-[50%] items-baseline truncate text-gray-500 line-through'>
              <span className='text-xs'>₫</span>
              <span className='truncate text-sm'>{formatCurrency(product.price_before_discount)}</span>
            </div>
            <div className='text-orange ml-1 flex items-center truncate'>
              <span className='text-xs'>₫</span>
              <span className='truncate text-sm'>{formatCurrency(product.price)}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-start'>
            <ProductRating rating={product.rating} />
            <div className='ml-2 text-xs'>
              <span className='mr-1'>Đã bán</span>
              <span>{formatNumberToSocialStyle(product.sold)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default Product;
