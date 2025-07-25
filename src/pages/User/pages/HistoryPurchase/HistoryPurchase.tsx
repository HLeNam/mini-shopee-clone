import { useMutation, useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import purchaseApi from '~/apis/purchase.api';
import image from '~/assets/images';
import Button from '~/components/Button';
import PATH from '~/constants/path';
import { PURCHASE_STATUS } from '~/constants/purchase';
import useQueryParams from '~/hooks/useQueryParams';
import type { PurchaseListStatus } from '~/types/purchase.type';
import { formatCurrency, generateNameId, mergeUrlPaths } from '~/utils/utils';

const PURCHASE_TABS = [
  {
    status: PURCHASE_STATUS.ALL,
    label: 'Tất cả'
  },
  {
    status: PURCHASE_STATUS.WAITING_FOR_CONFIRMATION,
    label: 'Chờ xác nhận'
  },
  {
    status: PURCHASE_STATUS.WAITING_FOR_GETTING,
    label: 'Chờ lấy hàng'
  },
  {
    status: PURCHASE_STATUS.IN_PROGRESS,
    label: 'Đang giao'
  },
  {
    status: PURCHASE_STATUS.DELIVERED,
    label: 'Đã giao'
  },
  {
    status: PURCHASE_STATUS.CANCELLED,
    label: 'Đã hủy'
  }
];

const HistoryPurchase = () => {
  const navigate = useNavigate();

  const queryParams: {
    status?: string;
  } = useQueryParams();
  const status = Number(queryParams.status) || PURCHASE_STATUS.ALL;

  const { data: purchasesData, isFetching: purchasesLoading } = useQuery({
    queryKey: ['purchases', { status: status }],
    queryFn: () => purchaseApi.getPurchases({ status: status as PurchaseListStatus })
  });

  const purchases = purchasesData?.data.data || [];

  const addToCartMutation = useMutation({
    mutationFn: ({ product_id, buy_count }: { product_id: string; buy_count: number }) => {
      return purchaseApi.addToCart({ product_id, buy_count });
    }
  });

  const handleBuyNow = async ({ product_id, buy_count }: { product_id: string; buy_count: number }) => {
    try {
      const res = await addToCartMutation.mutateAsync({
        product_id,
        buy_count
      });

      const purchase = res.data.data;

      navigate(mergeUrlPaths(PATH.cart), {
        state: {
          purchaseId: purchase._id
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const purchaseTabsLink = PURCHASE_TABS.map((tab) => {
    return (
      <Link
        key={tab.status}
        to={{
          pathname: mergeUrlPaths(PATH.user.root, PATH.user.purchaseHistory),
          search: createSearchParams({
            status: tab.status.toString()
          }).toString()
        }}
        className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
          'border-b-orange text-orange': status === tab.status,
          'border-b-black/10 text-gray-900': status !== tab.status
        })}
      >
        {tab.label}
      </Link>
    );
  });

  return (
    <div>
      <div className='sticky top-0'>
        <div className='custom-scrollbar overflow-x-auto'>
          <div className='flex min-w-[700px] rounded-t-sm shadow-sm'> {purchaseTabsLink}</div>
        </div>
      </div>

      <div>
        {purchases && purchases.length > 0 ? (
          <>
            {purchases.map((purchase) => {
              return (
                <div
                  key={purchase._id}
                  className='mt-4 rounded-sm border border-black/10 bg-white text-gray-800 shadow-sm'
                >
                  <Link
                    to={mergeUrlPaths(
                      PATH.home,
                      generateNameId({ name: purchase.product.name, id: purchase.product._id })
                    )}
                    className='flex flex-col p-6 sm:flex-row'
                  >
                    <div className='flex flex-shrink-0'>
                      <img
                        src={purchase.product.image}
                        alt={purchase.product.name}
                        className='h-20 w-20 object-contain'
                      />
                    </div>
                    <div className='mt-3 flex-grow overflow-hidden sm:ml-3'>
                      <div className='truncate'>{purchase.product.name}</div>
                      <div className='md:mt-3'>x{purchase.buy_count}</div>
                    </div>
                    <div className='flex flex-shrink-0 items-center sm:ml-3'>
                      <span className='truncate text-gray-500 line-through'>
                        ₫{formatCurrency(purchase.price_before_discount)}
                      </span>
                      <span className='text-orange ml-2 truncate'>₫{formatCurrency(purchase.price)}</span>
                    </div>
                  </Link>
                  <div className='border-t border-t-gray-200'>
                    <div className='flex flex-col items-end p-6'>
                      <div className='flex items-center text-gray-600'>
                        <span>Thành tiền:</span>
                        <span className='text-orange ml-3 text-xl'>
                          ₫{formatCurrency(purchase.price * purchase.buy_count)}
                        </span>
                      </div>
                      <div className='mt-3'>
                        <Button
                          className='bg-orange hover:bg-orange/80 flex h-9 items-center rounded-sm px-9 text-center text-sm text-white'
                          onClick={() =>
                            handleBuyNow({ product_id: purchase.product._id, buy_count: purchase.buy_count })
                          }
                        >
                          Mua lại
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : purchasesLoading ? (
          <div className='flex h-[400px] items-center justify-center'>
            <div role='status'>
              <svg
                aria-hidden='true'
                className='fill-orange h-8 w-8 animate-spin text-gray-200'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
              <span className='sr-only'>Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className='flex h-[400px] flex-col items-center justify-center'>
              <img src={image.noOrder} alt='no order' className='mt-10 h-30 w-30 object-contain' />
              <span className='mt-5 text-lg text-gray-500'>Chưa có đơn hàng</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryPurchase;
