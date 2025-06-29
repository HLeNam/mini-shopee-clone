const SortProductList = () => {
  return (
    <div className='bg-gray-300/40 px-3 py-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div>Sắp xếp theo</div>
          <button className='bg-orange hover:bg-orange/90 h-8 cursor-pointer px-4 text-center text-sm text-white capitalize'>
            Phổ biến
          </button>
          <button className='h-8 cursor-pointer bg-white px-4 text-center text-sm text-black capitalize hover:bg-slate-100'>
            Mới nhất
          </button>
          <button className='h-8 cursor-pointer bg-white px-4 text-center text-sm text-black capitalize hover:bg-slate-100'>
            Bán chạy
          </button>
          <select className='h-8 cursor-pointer bg-white px-4 text-left text-sm text-black capitalize outline-neutral-50 hover:bg-slate-100'>
            <option value='' disabled hidden>
              Giá
            </option>
            <option value='price:asc'>Giá: Thấp đến cao</option>
            <option value='price:desc'>Giá: Cao đến thấp</option>
          </select>
        </div>
        <div className='flex items-center'>
          <div>
            <span className='text-orange'>1</span>
            <span>/2</span>
          </div>
          <div className='ml-5'>
            <button className='h-8 cursor-not-allowed rounded-tl-sm rounded-bl-sm bg-white/60 px-3 shadow hover:bg-slate-100'>
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
            </button>
            <button className='h-8 cursor-pointer rounded-tr-sm rounded-br-sm bg-white px-3 shadow hover:bg-slate-100'>
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
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SortProductList;
