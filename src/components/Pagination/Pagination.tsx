import classNames from 'classnames';
import { Link, createSearchParams } from 'react-router-dom';
import PATH from '~/constants/path';
import type { QueryConfig } from '~/pages/ProductList/ProductList';

interface PaginationProps {
  queryConfig: QueryConfig;
  pageSize: number;
}

const RANGE = 2;

const Pagination = ({ queryConfig, pageSize }: PaginationProps) => {
  const page = Number(queryConfig.page);

  const renderPagination = () => {
    let dotAfter = false;
    let dotBefore = false;

    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true;
        return (
          <div
            key={index}
            className='mx-2 flex items-center justify-center gap-0.5 rounded bg-white px-3 py-2 shadow-sm'
          >
            <div className='h-[4px] w-[4px] shrink-0 rounded-full bg-black'></div>
            <div className='h-[4px] w-[4px] shrink-0 rounded-full bg-black'></div>
            <div className='h-[4px] w-[4px] shrink-0 rounded-full bg-black'></div>
          </div>
        );
      }

      return null;
    };

    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true;
        return (
          <div
            key={index}
            className='mx-2 flex items-center justify-center gap-0.5 rounded bg-white px-3 py-2 shadow-sm'
          >
            <div className='h-[4px] w-[4px] shrink-0 rounded-full bg-black'></div>
            <div className='h-[4px] w-[4px] shrink-0 rounded-full bg-black'></div>
            <div className='h-[4px] w-[4px] shrink-0 rounded-full bg-black'></div>
          </div>
        );
      }

      return null;
    };

    return Array.from({ length: pageSize }, (_, index) => {
      const pageNumber = index + 1;

      if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
        return renderDotAfter(index);
      } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
        if (pageNumber < page - RANGE && pageNumber > RANGE) {
          return renderDotBefore(index);
        } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index);
        }
      } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
        return renderDotBefore(index);
      }

      return (
        <Link
          to={{
            pathname: `/${PATH.home}`,
            search: createSearchParams({
              ...queryConfig,
              page: pageNumber.toString()
            }).toString()
          }}
          key={index}
          className={classNames('mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm', {
            'border-orange/60': page === pageNumber,
            'border-transparent': page !== pageNumber
          })}
        >
          {pageNumber}
        </Link>
      );
    });
  };

  return (
    <div className='mt-6 flex flex-wrap justify-center'>
      <Link
        to={{
          pathname: `/${PATH.home}`,
          search: createSearchParams({
            ...queryConfig,
            page: (page - 1).toString()
          }).toString()
        }}
        className={classNames('mx-2 rounded border border-transparent bg-white px-3 py-2 shadow-sm select-none', {
          'pointer-events-none !cursor-not-allowed bg-white/60': page === 1,
          'cursor-pointer': page !== 1
        })}
      >
        Prev
      </Link>
      {renderPagination()}
      <Link
        to={{
          pathname: `/${PATH.home}`,
          search: createSearchParams({
            ...queryConfig,
            page: (page + 1).toString()
          }).toString()
        }}
        className={classNames(
          'mx-2 cursor-pointer rounded border border-transparent bg-white px-3 py-2 shadow-sm select-none',
          {
            'pointer-events-none !cursor-not-allowed bg-white/60': page === pageSize,
            'cursor-pointer': page !== pageSize
          }
        )}
      >
        Next
      </Link>
    </div>
  );
};
export default Pagination;
