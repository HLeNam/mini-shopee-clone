import purchaseApi from '~/apis/purchase.api';
import { useQuery } from '@tanstack/react-query';
import { PURCHASE_STATUS } from '~/constants/purchase';
import { Link } from 'react-router-dom';
import { formatCurrency, generateNameId, mergeUrlPaths } from '~/utils/utils';
import PATH from '~/constants/path';
import QuantityController from '~/components/QuantityController';
import Button from '~/components/Button';

const Cart = () => {
  const { data: purchasesData } = useQuery({
    queryKey: ['purchases', { status: PURCHASE_STATUS.IN_CART }],
    queryFn: () => purchaseApi.getPurchases({ status: PURCHASE_STATUS.IN_CART })
  });

  const purchases = purchasesData?.data.data || [];

  const cartCount = purchases.reduce((total, purchase) => total + purchase.buy_count, 0);

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='Container'>
        <div className='overflow-auto'>
          <div className='min-w-5xl'>
            <div className='grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm text-gray-500 capitalize shadow'>
              <div className='col-span-6'>
                <div className='flex items-center'>
                  <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                    <input type='checkbox' className='accent-orange h-5 w-5' />
                  </div>
                  <div className='flex-grow text-black'>Sản phẩm</div>
                </div>
              </div>
              <div className='col-span-6'>
                <div className='grid grid-cols-5 text-center'>
                  <div className='col-span-2'>Đơn giá</div>
                  <div className='col-span-1'>Số lượng</div>
                  <div className='col-span-1'>Số tiền</div>
                  <div className='col-span-1'>Thao tác</div>
                </div>
              </div>
            </div>
            <div className='my-3 rounded-sm bg-white p-5 shadow'>
              {purchases && purchases.length > 0 ? (
                purchases.map((purchase) => {
                  const linkToProduct = mergeUrlPaths(
                    PATH.home,
                    generateNameId({ name: purchase.product.name, id: purchase.product._id })
                  );
                  return (
                    <div
                      key={purchase._id}
                      className='mt-5 grid grid-cols-12 rounded-sm border border-gray-200 bg-white px-4 py-5 text-center text-sm text-gray-500 first:mt-0'
                    >
                      <div className='col-span-6'>
                        <div className='flex'>
                          <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                            <input type='checkbox' className='accent-orange h-5 w-5' />
                          </div>
                          <div className='flex-grow'>
                            <div className='flex'>
                              <Link to={linkToProduct} className='h-20 w-20 flex-shrink-0'>
                                <img
                                  className='h-full w-full object-contain'
                                  src={purchase.product.image}
                                  alt={purchase.product.name}
                                />
                              </Link>
                              <div className='flex-grow px-2 pt-1 pb-2'>
                                <Link className='line-clamp-2 text-left' to={linkToProduct}>
                                  {purchase.product.name}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-span-6'>
                        <div className='grid grid-cols-5 items-center'>
                          <div className='col-span-2'>
                            <div className='flex items-center justify-center'>
                              <span className='text-gray-400 line-through'>
                                ₫{formatCurrency(purchase.product.price_before_discount)}
                              </span>
                              <span className='ml-3 text-black'>₫{formatCurrency(purchase.product.price)}</span>
                            </div>
                          </div>
                          <div className='col-span-1'>
                            <QuantityController
                              classNameWrapper=''
                              max={purchase.product.quantity}
                              value={purchase.buy_count}
                            />
                          </div>
                          <div className='col-span-1'>
                            <span className='text-orange'>
                              ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                            </span>
                          </div>
                          <div className='col-span-1'>
                            <button className='hover:text-orange cursor-pointer bg-none text-black transition-colors'>
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div className='sticky bottom-0 z-10 mt-10 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow lg:flex-row lg:items-center'>
          <div className='flex items-center'>
            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
              <input type='checkbox' className='accent-orange h-5 w-5' />
            </div>
            <button className='mx-3 border-none bg-none'>Chọn tất cả</button>
            <button className='mx-3 border-none bg-none'>Xóa</button>
          </div>
          <div className='mt-5 flex flex-col md:flex-row md:items-center lg:mt-0 lg:ml-auto'>
            <div>
              <div className='flex items-center md:justify-end'>
                <div>Tổng cộng (0 Sản phẩm):</div>
                <div className='text-orange ml-2 text-2xl'>₫{formatCurrency(1280000)}</div>
              </div>
              <div className='flex items-center text-sm md:justify-end'>
                <div className='text-gray-500'>Tiết kiệm</div>
                <div className='text-orange ml-6'>₫{formatCurrency(128000)}</div>
              </div>
            </div>
            <Button className='bg-orange hover:bg-orange/90 mt-5 ml-auto flex h-10 w-full items-center justify-center px-2 py-4 text-center text-sm text-white uppercase md:mt-0 md:w-52 lg:ml-4'>
              Mua hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
