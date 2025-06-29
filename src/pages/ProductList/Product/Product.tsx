import { Link } from 'react-router-dom';

const Product = () => {
  return (
    <Link to='/'>
      <div className='overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.04rem] hover:shadow-md'>
        <div className='relative w-full pt-[100%]'>
          <img
            className='absolute top-0 left-0 h-full w-full bg-white object-contain'
            src='https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lrol6kavr6hl42_tn.webp'
            alt=''
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='line-clamp-2 min-h-[2rem] text-xs'>
            Áo Thun Polo Nam Thêu Chữ U,Chất Liệu Thấm Hút Mồ Hôi,Cổ Phối Màu
          </div>
          <div className='mt-3 flex items-center'>
            <div className='flex max-w-[50%] items-baseline truncate text-gray-500 line-through'>
              <span className='mr-px text-xs font-medium'>₫</span>
              <span className='truncate text-sm'>49.000</span>
            </div>
            <div className='text-orange ml-2 flex items-center truncate'>
              <span className='mr-px text-xs font-medium'>₫</span>
              <span className='truncate'>39.000</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-start'>
            <div className='flex items-center'>
              <div className='relative'>
                <div
                  className='absolute top-0 left-0 h-full overflow-hidden'
                  style={{
                    width: '50%'
                  }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-3 w-3 fill-yellow-300 stroke-yellow-300 text-yellow-300'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z'
                    />
                  </svg>
                </div>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3 fill-current text-gray-300'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z'
                  />
                </svg>
              </div>
            </div>
            <div className='ml-2 text-xs'>
              <span className='mr-1'>Đã bán</span>
              <span>5.66k</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default Product;
