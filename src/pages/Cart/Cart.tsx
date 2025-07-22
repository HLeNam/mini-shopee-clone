import purchaseApi from '~/apis/purchase.api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PURCHASE_STATUS } from '~/constants/purchase';
import { Link } from 'react-router-dom';
import { formatCurrency, generateNameId, mergeUrlPaths } from '~/utils/utils';
import PATH from '~/constants/path';
import QuantityController from '~/components/QuantityController';
import Button from '~/components/Button';
import type { Purchase } from '~/types/purchase.type';
import { useEffect, useMemo, useState } from 'react';
import produce from 'immer';
import { keyBy } from 'lodash';
import { toast } from 'react-toastify';

interface ExtendedPurchase extends Purchase {
  disabled: boolean;
  checked: boolean;
}

const Cart = () => {
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchase[]>([]);

  const { data: purchasesData, refetch } = useQuery({
    queryKey: ['purchases', { status: PURCHASE_STATUS.IN_CART }],
    queryFn: () => purchaseApi.getPurchases({ status: PURCHASE_STATUS.IN_CART })
  });

  const purchases = useMemo(() => {
    return purchasesData?.data.data || [];
  }, [purchasesData]);

  const isAllChecked = extendedPurchases.every((purchase) => purchase.checked);

  const cartCount = purchases.reduce((total, purchase) => total + purchase.buy_count, 0);

  const checkedPurchases = extendedPurchases.filter((purchase) => purchase.checked);

  const checkedCount = checkedPurchases.length;

  const checkedTotalPrice = checkedPurchases.reduce((total, purchase) => {
    return total + purchase.product.price * purchase.buy_count;
  }, 0);

  const checkedTotalPriceSaved = checkedPurchases.reduce((total, purchase) => {
    return total + (purchase.product.price_before_discount - purchase.product.price) * purchase.buy_count;
  }, 0);

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch();
    }
  });

  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch();
      toast.success(data.data.message || 'Mua hàng thành công!', {
        position: 'top-center',
        autoClose: 1000
      });
    }
  });

  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchases,
    onSuccess: () => {
      refetch();
    }
  });

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id');

      return purchases.map((purchase) => {
        return {
          ...purchase,
          disabled: false,
          checked: Boolean(extendedPurchasesObject[purchase._id]?.checked)
        };
      });
    });
  }, [purchases]);

  const handleCheck = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases((prev) => {
      return produce(prev, (draft) => {
        draft[purchaseIndex].checked = event.target.checked;
      });
    });
  };

  const handleCheckAll = () => {
    setExtendedPurchases((prev) => {
      return prev.map((purchase) => {
        return {
          ...purchase,
          checked: !isAllChecked
        };
      });
    });
  };

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (!enable) {
      return;
    }

    const purchase = extendedPurchases[purchaseIndex];

    setExtendedPurchases((prev) => {
      return produce(prev, (draft) => {
        draft[purchaseIndex].disabled = true;
      });
    });

    updatePurchaseMutation.mutate({
      product_id: purchase.product._id,
      buy_count: value
    });
  };

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases((prev) => {
      return produce(prev, (draft) => {
        draft[purchaseIndex].buy_count = value;
      });
    });
  };

  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id;
    deletePurchasesMutation.mutate([purchaseId]);
  };

  const handleDeleteMultiple = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id);
    deletePurchasesMutation.mutate(purchaseIds);
  };

  const handleBuyProducts = () => {
    if (checkedPurchases.length <= 0) {
      return;
    }

    const buyProducts = checkedPurchases.map((purchase) => ({
      product_id: purchase.product._id,
      buy_count: purchase.buy_count
    }));

    buyProductsMutation.mutate(buyProducts);
  };

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='Container'>
        <div className='overflow-auto'>
          <div className='min-w-5xl'>
            <div className='grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm text-gray-500 capitalize shadow'>
              <div className='col-span-6'>
                <div className='flex items-center'>
                  <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                    <input
                      type='checkbox'
                      className='accent-orange h-5 w-5'
                      checked={isAllChecked}
                      onChange={handleCheckAll}
                    />
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
            {purchases.length > 0 && (
              <div className='my-3 rounded-sm bg-white p-5 shadow'>
                {extendedPurchases && extendedPurchases.length > 0 ? (
                  extendedPurchases.map((purchase, index) => {
                    const linkToProduct = mergeUrlPaths(
                      PATH.home,
                      generateNameId({ name: purchase.product.name, id: purchase.product._id })
                    );
                    return (
                      <div
                        key={purchase._id}
                        className='mt-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white px-4 py-5 text-center text-sm text-gray-500 first:mt-0'
                      >
                        <div className='col-span-6'>
                          <div className='flex'>
                            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                              <input
                                type='checkbox'
                                className='accent-orange h-5 w-5'
                                checked={purchase.checked}
                                onChange={handleCheck(index)}
                              />
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
                                onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                                onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                                onType={handleTypeQuantity(index)}
                                onFocusOut={(value) => {
                                  handleQuantity(
                                    index,
                                    value,
                                    value >= 1 &&
                                      value <= purchase.product.quantity &&
                                      +value !== purchases[index].buy_count
                                  );
                                }}
                                disabled={purchase.disabled}
                              />
                            </div>
                            <div className='col-span-1'>
                              <span className='text-orange'>
                                ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                              </span>
                            </div>
                            <div className='col-span-1'>
                              <button
                                onClick={handleDelete(index)}
                                className='hover:text-orange cursor-pointer bg-none text-black transition-colors'
                              >
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
            )}
          </div>
        </div>
        <div className='sticky bottom-0 z-10 mt-3 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow lg:flex-row lg:items-center'>
          <div className='flex items-center'>
            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
              <input
                type='checkbox'
                className='accent-orange h-5 w-5'
                checked={isAllChecked}
                onChange={handleCheckAll}
              />
            </div>
            <button className='mx-3 cursor-pointer border-none bg-none' onClick={handleCheckAll}>
              Chọn tất cả ({cartCount})
            </button>
            <button onClick={handleDeleteMultiple} className='mx-3 cursor-pointer border-none bg-none'>
              Xóa
            </button>
          </div>
          <div className='mt-5 flex flex-col md:flex-row md:items-center lg:mt-0 lg:ml-auto'>
            <div>
              <div className='flex items-center md:justify-end'>
                <div>Tổng cộng ({checkedCount} Sản phẩm):</div>
                <div className='text-orange ml-2 text-2xl'>₫{formatCurrency(checkedTotalPrice)}</div>
              </div>
              <div className='flex items-center text-sm md:justify-end'>
                <div className='text-gray-500'>Tiết kiệm</div>
                <div className='text-orange ml-6'>₫{formatCurrency(checkedTotalPriceSaved)}</div>
              </div>
            </div>
            <Button
              onClick={handleBuyProducts}
              disabled={checkedPurchases.length <= 0 || buyProductsMutation.isPending}
              className='bg-orange hover:bg-orange/90 mt-5 ml-auto flex h-10 w-full items-center justify-center px-2 py-4 text-center text-sm text-white uppercase md:mt-0 md:w-52 lg:ml-4'
            >
              Mua hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
