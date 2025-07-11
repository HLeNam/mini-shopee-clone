import { z } from 'zod';
import classNames from 'classnames';
import { isUndefined, omit, omitBy } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';

import PATH from '~/constants/path';
import Button from '~/components/Button';
import { InputNumber } from '~/components/Input';
import type { Category } from '~/types/category.type';
import type { QueryConfig } from '~/hooks/useQueryConfig';
import RatingStarts from '~/pages/ProductList/components/RatingStarts';

interface AsideFilterProps {
  categories: Category[];
  queryConfig?: QueryConfig;
}

const FormDataSchema = z
  .object({
    price_min: z.string().optional(),
    price_max: z.string().optional()
  })
  .superRefine((data, ctx) => {
    const priceMin = data.price_min ?? '';
    const priceMax = data.price_max ?? '';

    if (priceMin !== '' && priceMax !== '' && Number(priceMin) > Number(priceMax)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Giá tối thiểu không được lớn hơn giá tối đa',
        path: ['price_min']
      });
    }

    if (priceMin === '' && priceMax === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vui lòng nhập ít nhất một giá trị',
        path: ['price_min']
      });
    }
  });

type FormData = z.infer<typeof FormDataSchema>;

const AsideFilter = ({ categories = [], queryConfig }: AsideFilterProps) => {
  const { category } = queryConfig || {};

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      price_min: queryConfig?.price_min || '',
      price_max: queryConfig?.price_max || ''
    },
    shouldFocusError: true
  });

  const navigate = useNavigate();

  const onSubmit = handleSubmit(
    (data: FormData) => {
      console.log('>>> data', data);
      const { price_min, price_max } = data;

      const _queryConfig = {
        ...queryConfig,
        price_min: price_min ? String(price_min) : undefined,
        price_max: price_max ? String(price_max) : undefined
      };

      const searchParams = omitBy(_queryConfig, isUndefined) as Record<string, string>;

      navigate({
        pathname: `/${PATH.home}`,
        search: createSearchParams(searchParams).toString()
      });
    },
    () => {
      // console.log('>>> error', error);
      // if (error.price_min && error.price_min.ref && typeof error.price_min.ref.focus === 'function') {
      //   error.price_min.ref.focus();
      // }
    }
  );

  const handleRemoveAll = () => {
    navigate({
      pathname: `/${PATH.home}`,
      search: createSearchParams(
        omit(
          {
            ...queryConfig
          },
          ['category', 'price_min', 'price_max', 'rating_filter']
        )
      ).toString()
    });
  };

  return (
    <div className='py-4'>
      <Link
        to={`/${PATH.home}`}
        className={classNames('flex items-center font-bold', {
          'text-orange': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất cả danh mục
      </Link>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <ul>
        {categories &&
          categories.length > 0 &&
          categories.map((categoryItem) => {
            const isActive = category === categoryItem._id;

            return (
              <li className='py-2 pl-2' key={categoryItem._id}>
                <Link
                  to={{
                    pathname: PATH.home,
                    search: createSearchParams({
                      ...queryConfig,
                      category: categoryItem._id
                    }).toString()
                  }}
                  className={classNames('relative px-2', {
                    'text-orange font-semibold': isActive
                  })}
                >
                  {isActive && (
                    <svg viewBox='0 0 4 7' className='fill-orange absolute top-1 left-[-10px] h-2 w-2'>
                      <polygon points='4 3.5 0 0 0 7' />
                    </svg>
                  )}
                  {categoryItem.name}
                </Link>
              </li>
            );
          })}
      </ul>
      <Link to={`/${PATH.home}`} className='mt-4 flex items-center font-bold uppercase'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='mr-3 h-4 w-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        Bộ lọc tìm kiếm
      </Link>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <div className='my-5'>
        <div>Khoảng giá</div>
        <form className='mt-2' onSubmit={onSubmit} noValidate>
          <div className='flex items-center'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => (
                <InputNumber
                  type='text'
                  className='grow'
                  placeholder='₫ TỪ'
                  classNameInput='w-full bg-white rounded-sm border border-gray-300 p-1 outline-none focus:shadow-sm text-sm'
                  classNameError='hidden'
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                />
              )}
            ></Controller>
            <div className='mx-2 my-2 h-[1px] w-[10px] flex-shrink-0 bg-[#bdbdbd]'></div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => (
                <InputNumber
                  type='text'
                  className='grow'
                  placeholder='₫ ĐẾN'
                  classNameInput='w-full bg-white rounded-sm border border-gray-300 p-1 outline-none focus:shadow-sm text-sm'
                  classNameError='hidden'
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger('price_min');
                  }}
                />
              )}
            ></Controller>
          </div>
          <div className='mt-1 min-h-[1.25rem] text-center text-sm text-red-600'>{errors.price_min?.message}</div>
          <Button className='bg-orange hover:bg-orange/90 flex w-full items-center justify-center p-2 text-sm text-white uppercase'>
            Áp dụng
          </Button>
        </form>
      </div>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <div className='text-sm'>Đánh giá</div>
      <RatingStarts queryConfig={queryConfig} />
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <Button
        className='bg-orange hover:bg-orange/90 mt-5 flex w-full items-center justify-center p-2 text-sm text-white uppercase'
        onClick={() => handleRemoveAll()}
      >
        Xóa tất cả
      </Button>
    </div>
  );
};
export default AsideFilter;
