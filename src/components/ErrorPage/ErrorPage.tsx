import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error('Route error:', error);

  let errorMessage: string;
  let errorStatus: number | string = 'Unknown';
  let errorType = 'Lỗi không xác định';

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || error.statusText;
    errorStatus = error.status;
    errorType = error.status === 404 ? 'Không tìm thấy trang' : 'Lỗi server';
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorType = 'Lỗi JavaScript';
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Đã xảy ra lỗi không mong muốn';
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const is404 = errorStatus === 404;

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4'>
      <div className='w-full max-w-2xl'>
        {/* Main Error Card */}
        <div className='overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl'>
          {/* Animated Header */}
          <div
            className={`${is404 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-red-500 to-orange-500'} relative overflow-hidden px-8 py-8`}
          >
            {/* Background Animation */}
            <div className='absolute inset-0 opacity-20'>
              <div className='absolute -top-4 -right-4 h-24 w-24 animate-pulse rounded-full bg-white'></div>
              <div className='absolute -bottom-4 -left-4 h-32 w-32 animate-pulse rounded-full bg-white delay-1000'></div>
            </div>

            <div className='relative flex items-center space-x-6'>
              {/* Error Icon */}
              <div className='rounded-2xl bg-white/20 p-4 backdrop-blur-sm'>
                {is404 ? (
                  <svg className='h-12 w-12 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.9.785-5.291 2.09M6.343 6.343A8.014 8.014 0 0112 4c1.573 0 3.02.452 4.243 1.232M4 4l16 16'
                    />
                  </svg>
                ) : (
                  <svg className='h-12 w-12 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z'
                    />
                  </svg>
                )}
              </div>

              <div>
                <div className='mb-2 flex items-center space-x-3'>
                  <span className='text-6xl font-bold text-white'>{errorStatus}</span>
                  {errorStatus !== 'Unknown' && (
                    <div className='rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm'>
                      <span className='text-sm font-medium text-white'>{errorType}</span>
                    </div>
                  )}
                </div>
                <h1 className='mb-1 text-2xl font-bold text-white'>
                  {is404 ? 'Trang không tồn tại' : 'Có lỗi xảy ra'}
                </h1>
                <p className='text-white/90'>
                  {is404
                    ? 'Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển'
                    : 'Đã xảy ra lỗi không mong muốn'}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className='px-8 py-8'>
            {/* Error Message */}
            <div className='mb-8'>
              <h2 className='mb-3 flex items-center text-lg font-semibold text-gray-800'>
                <svg className='mr-2 h-5 w-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                Chi tiết lỗi:
              </h2>
              <div className='rounded-xl border-l-4 border-gray-400 bg-gradient-to-r from-gray-50 to-gray-100 p-4'>
                <p className='font-mono text-sm leading-relaxed text-gray-700'>{errorMessage}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <button
                onClick={handleGoBack}
                className='group flex transform items-center justify-center space-x-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl'
              >
                <svg
                  className='h-5 w-5 transform transition-transform group-hover:-translate-x-1'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
                </svg>
                <span>Quay lại</span>
              </button>

              <button
                onClick={handleGoHome}
                className='group flex transform items-center justify-center space-x-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-green-700 hover:shadow-xl'
              >
                <svg
                  className='h-5 w-5 transform transition-transform group-hover:scale-110'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                  />
                </svg>
                <span>Về trang chủ</span>
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => window.location.reload()}
              className='mb-6 flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-gray-600 hover:to-gray-700'
            >
              <svg className='h-4 w-4 animate-spin' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                />
              </svg>
              <span>Tải lại trang</span>
            </button>

            {/* Help Section */}
            <div className='rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6'>
              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0 rounded-full bg-blue-100 p-2'>
                  <svg className='h-5 w-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='mb-2 text-lg font-semibold text-blue-800'>Cần trợ giúp?</h3>
                  <ul className='space-y-2 text-sm text-blue-700'>
                    <li className='flex items-center space-x-2'>
                      <div className='h-1.5 w-1.5 rounded-full bg-blue-400'></div>
                      <span>Kiểm tra lại URL bạn đã nhập</span>
                    </li>
                    <li className='flex items-center space-x-2'>
                      <div className='h-1.5 w-1.5 rounded-full bg-blue-400'></div>
                      <span>Thử tải lại trang sau vài giây</span>
                    </li>
                    <li className='flex items-center space-x-2'>
                      <div className='h-1.5 w-1.5 rounded-full bg-blue-400'></div>
                      <span>Liên hệ bộ phận hỗ trợ nếu lỗi vẫn tiếp tục</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-500'>
            Mã lỗi:{' '}
            <span className='rounded bg-gray-100 px-2 py-1 font-mono'>{Date.now().toString(36).toUpperCase()}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
