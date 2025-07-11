import { omit } from 'lodash';
import classNames from 'classnames';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';

import PATH from '~/constants/path';
import { SORT_BY, SORT_ORDER } from '~/constants/product';
import type { QueryConfig } from '~/hooks/useQueryConfig';
import type { ProductListConfig } from '~/types/product.type';

interface SortProductListProps {
  queryConfig: QueryConfig;
  pageSize: number;
}

const SortProductList = ({ queryConfig, pageSize }: SortProductListProps) => {
  const page = queryConfig.page ? Number(queryConfig.page) : 1;
  const { sort_by = SORT_BY.createdAt, order } = queryConfig ? queryConfig : {};

  const navigate = useNavigate();

  const isActiveSortBy = (sortBy: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortBy;
  };

  const handleSort = (sortBy: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: PATH.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortBy
          },
          ['order']
        )
      ).toString()
    });
  };

  const handlePriceOrder = (order: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: PATH.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: SORT_BY.price,
        order: order
      }).toString()
    });
  };

  return (
    <div className='bg-gray-300/40 px-3 py-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div>Sắp xếp theo</div>
          <button
            className={classNames('h-8 cursor-pointer px-4 text-center text-sm capitalize', {
              'bg-orange hover:bg-orange/90 text-white': isActiveSortBy(SORT_BY.view),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(SORT_BY.view)
            })}
            onClick={() => handleSort(SORT_BY.view)}
          >
            Phổ biến
          </button>
          <button
            className={classNames('h-8 cursor-pointer px-4 text-center text-sm capitalize', {
              'bg-orange hover:bg-orange/90 text-white': isActiveSortBy(SORT_BY.createdAt),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(SORT_BY.createdAt)
            })}
            onClick={() => handleSort(SORT_BY.createdAt)}
          >
            Mới nhất
          </button>
          <button
            className={classNames('h-8 cursor-pointer px-4 text-center text-sm capitalize', {
              'bg-orange hover:bg-orange/90 text-white': isActiveSortBy(SORT_BY.sold),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(SORT_BY.sold)
            })}
            onClick={() => handleSort(SORT_BY.sold)}
          >
            Bán chạy
          </button>
          <select
            className={classNames('h-8 cursor-pointer px-4 text-left text-sm capitalize outline-neutral-50', {
              'bg-orange hover:bg-orange/90 text-white': isActiveSortBy(SORT_BY.price),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(SORT_BY.price)
            })}
            value={order ?? ''}
            onChange={(e) => {
              handlePriceOrder(e.target.value as Exclude<ProductListConfig['order'], undefined>);
            }}
          >
            <option value='' disabled hidden>
              Giá
            </option>
            <option value={SORT_ORDER.asc} className='bg-white text-black'>
              Giá: Thấp đến cao
            </option>
            <option value={SORT_ORDER.desc} className='bg-white text-black'>
              Giá: Cao đến thấp
            </option>
          </select>
        </div>
        <div className='flex items-center'>
          <div>
            <span className='text-orange'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='ml-5 flex items-center gap-1'>
            {page == 1 ? (
              <span className='flex h-8 items-center justify-between rounded-tl-sm rounded-bl-sm bg-white/60 px-3 shadow'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-3 text-gray-400'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: PATH.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: String(page > 1 ? page - 1 : 1)
                  }).toString()
                }}
                className='flex h-8 items-center justify-between rounded-tl-sm rounded-bl-sm bg-white/60 px-3 shadow hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                </svg>
              </Link>
            )}
            {page == pageSize ? (
              <span className='flex h-8 items-center justify-between rounded-tr-sm rounded-br-sm bg-white/60 px-3 text-gray-400 shadow'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: PATH.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: String(page + 1)
                  }).toString()
                }}
                className='flex h-8 cursor-pointer items-center justify-between rounded-tl-sm rounded-bl-sm bg-white/60 px-3 shadow hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SortProductList;
