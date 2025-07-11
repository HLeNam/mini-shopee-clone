import DOMPurify from 'dompurify';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import productApi from '~/apis/product.api';
import { InputNumber } from '~/components/Input';
import ProductRating from '~/components/ProductRating';
import { formatCurrency, formatNumberToSocialStyle, rateSale } from '~/utils/utils';
import { useEffect, useMemo, useRef, useState } from 'react';

interface Params extends Record<string, string> {
  id: string;
}

const ProductDetail = () => {
  const { id } = useParams<Params>();

  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  });

  const [currentIndexImage, setCurrentIndexImage] = useState([0, 5]);

  const [activeImage, setActiveImage] = useState('');

  const imageRef = useRef<HTMLImageElement>(null);

  const product = productDetailData?.data.data;

  const currentImages = useMemo(() => {
    return product?.images.slice(...currentIndexImage) || [];
  }, [product, currentIndexImage]);

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  const chooseActive = (image: string) => {
    setActiveImage(image);
  };

  const handleNextImages = () => {
    if (!product?.images.length) return;

    if (currentIndexImage[1] < product?.images.length) {
      setCurrentIndexImage((prev) => [prev[0] + 1, prev[1] + 1]);
    }
  };

  const handlePrevImages = () => {
    if (currentIndexImage[0] > 0) {
      setCurrentIndexImage((prev) => [prev[0] - 1, prev[1] - 1]);
    }
  };

  const handleZoom = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // disable event bubbling to prevent zooming when hovering over the image
    e.stopPropagation();

    const react = e.currentTarget.getBoundingClientRect();

    const image = imageRef.current;

    if (!image) return;

    const { naturalWidth, naturalHeight } = image;

    // Cách 1: Lấy offsetX, offsetY đơn giản khi đã xử lý được bubble event
    // thêm pointer-events-none vào thẻ img để không bị bubble event
    // const { offsetX, offsetY } = e.nativeEvent;

    // Cách 2: Lấy offsetX, offsetY khi không xử lý được bubble event

    /**
     * e.pageX và e.pageY là vị trí của chuột trên toàn bộ trang,
     * react.x và react.y là vị trí của phần tử trong viewport.
     * Khi cuộn trang, cần cộng thêm window.scrollX và window.scrollY
     * để tính toán chính xác vị trí của chuột trong phần tử.
     */

    const offsetX = e.pageX - (react.x + window.scrollX);
    const offsetY = e.pageY - (react.y + window.scrollY);

    const top = offsetY * (1 - naturalHeight / react.height);
    const left = offsetX * (1 - naturalWidth / react.width);

    image.style.width = naturalWidth + 'px';
    image.style.height = naturalHeight + 'px';
    image.style.maxWidth = 'unset';
    image.style.top = top + 'px';
    image.style.left = left + 'px';
  };

  const handleResetZoom = () => {
    const image = imageRef.current;

    if (!image) return;

    image.removeAttribute('style'); // Reset styles to default
  };

  if (!product) return null; // Handle case where product is not found

  return (
    <div className='bg-gray-200 py-6'>
      {/* Product Image And Title*/}
      <div className='Container'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
                onMouseMove={(e) => handleZoom(e)}
                onMouseLeave={() => handleResetZoom()}
              >
                <img
                  className='absolute top-0 left-0 h-full w-full bg-white object-contain'
                  src={activeImage || product.images[0]}
                  alt={product.name}
                  ref={imageRef}
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  onClick={() => handlePrevImages()}
                  className='absolute top-1/2 left-0 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={3}
                    stroke='currentColor'
                    className='size-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {currentImages.map((image, index) => {
                  const isActive = image === activeImage;
                  return (
                    <div
                      key={activeImage + index}
                      className='relative w-full pt-[100%]'
                      onMouseEnter={() => chooseActive(image)}
                      onClick={() => chooseActive(image)}
                    >
                      <img
                        className='absolute top-0 left-0 h-full w-full cursor-pointer bg-white object-contain'
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                      />
                      {isActive && <div className='border-orange absolute inset-0 border-2'></div>}
                    </div>
                  );
                })}
                <button
                  onClick={() => handleNextImages()}
                  className='absolute top-1/2 right-0 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={3}
                    stroke='currentColor'
                    className='size-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-8 flex items-center'>
                <div className='flex items-center'>
                  <span className='border-b-orange text-orange mr-1 border-b'>{product.rating.toFixed(1)}</span>
                  <ProductRating
                    rating={product.rating}
                    activeClassName='fill-orange stroke-orange text-orange h-4 w-4'
                    inactiveClassName='fill-current text-gray-300 h-4 w-4'
                  />
                </div>
                <div className='mx-4 h-4 w-px bg-gray-300 select-none'></div>
                <div>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className='ml-1 text-gray-500'>Đã Bán</span>
                </div>
              </div>
              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>₫{formatCurrency(product.price_before_discount)}</div>
                <div className='text-orange ml-3 text-3xl font-medium'>₫{formatCurrency(product.price)}</div>
                {product.price_before_discount > product.price && (
                  <div className='bg-orange ml-4 rounded-sm px-1 pt-0.5 text-xs font-semibold text-white uppercase'>
                    {rateSale(product.price_before_discount, product.price)}% Giảm
                  </div>
                )}
              </div>
              <div className='mt-8 flex items-center'>
                <div className='text-gray-500 capitalize'>Số lượng</div>
                {/* Input Quantity */}
                <div className='ml-10 flex items-center'>
                  <button className='flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-4'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
                    </svg>
                  </button>
                  <InputNumber
                    value={1}
                    classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
                    classNameError='hidden'
                  />
                  <button className='flex h-8 w-8 items-center justify-center rounded-r-sm border border-gray-300 text-gray-600'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-4'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                    </svg>
                  </button>
                </div>
                <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
              </div>
              <div className='mt-8 flex items-center'>
                <button className='border-orange bg-orange/10 text-orange hover:bg-orange/5 flex h-12 cursor-pointer items-center justify-center gap-x-3 rounded-sm border px-5 capitalize shadow-sm'>
                  <svg
                    className='stroke-orange text-orange h-5 w-5 fill-current align-middle'
                    xmlns='http://www.w3.org/2000/svg'
                    width='15'
                    height='15'
                    fill='#ee4d2d'
                    stroke='#ee4d2d'
                  >
                    <path
                      fill='none'
                      strokeLinecap='round'
                      strokeMiterlimit='10'
                      d='M.5.5h2.2L5.2 11h7.2l2.1-7.5H3.7'
                    ></path>
                    <circle cx='6' cy='13.5' r='1' stroke='none'></circle>
                    <circle cx='11.5' cy='13.5' r='1' stroke='none'></circle>
                    <path fill='none' strokeLinecap='round' strokeMiterlimit='10' d='M7.5 7h3M9 8.5v-3'></path>
                  </svg>
                  Thêm vào giỏ hàng
                </button>
                <button className='bg-orange hover:bg-orange/90 ml-4 flex h-12 min-w-[5rem] cursor-pointer items-center justify-center rounded-sm px-5 text-white capitalize shadow-sm outline-none'>
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Product description */}
      <div className='Container'>
        <div className='mt-8 bg-white p-4 shadow'>
          <div className='rounded bg-gray-50 p-4 text-lg text-slate-700 capitalize'>Mô tả sản phẩm</div>
          <div className='mx-4 mt-12 mb-4 text-sm leading-loose'>
            {/* 
                Nếu cái html của ta có chứa đoạn mã javascript sẽ gây nguy hiểm
                khiến website của ta bị tấn công XSS (Cross-Site Scripting).
                Dùng thư viện DOMPurify để lọc bỏ các đoạn mã nguy hiểm.
            */}
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
