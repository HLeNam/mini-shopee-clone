import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private promiseRejectionHandler = (event: PromiseRejectionEvent) => {
    this.setState({
      hasError: true,
      error: new Error(event.reason)
    });
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  componentDidMount() {
    window.addEventListener('unhandledrejection', this.promiseRejectionHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.promiseRejectionHandler);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4'>
          <div className='w-full max-w-2xl'>
            {/* Main Error Card */}
            <div className='overflow-hidden rounded-2xl border border-red-100 bg-white shadow-2xl'>
              {/* Header */}
              <div className='bg-gradient-to-r from-red-500 to-orange-500 px-8 py-6'>
                <div className='flex items-center space-x-4'>
                  <div className='rounded-full bg-white/20 p-3'>
                    <svg className='h-8 w-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z'
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className='mb-1 text-2xl font-bold text-white'>Oops! Có lỗi xảy ra</h1>
                    <p className='text-red-100'>Đã có lỗi không mong muốn xảy ra trong ứng dụng</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className='px-8 py-6'>
                <div className='mb-6'>
                  <h2 className='mb-2 text-lg font-semibold text-gray-800'>Thông tin lỗi:</h2>
                  <div className='rounded-lg border-l-4 border-red-400 bg-gray-50 p-4'>
                    <p className='font-mono text-sm text-gray-700'>
                      {this.state.error?.message || 'Unknown error occurred'}
                    </p>
                  </div>
                </div>

                {/* Error Stack (Collapsible) */}
                {(this.state.error?.stack || this.state.errorInfo) && (
                  <details className='group mb-6'>
                    <summary className='mb-2 flex cursor-pointer items-center font-medium text-gray-600 hover:text-gray-800'>
                      <svg
                        className='mr-2 h-4 w-4 transform transition-transform group-open:rotate-90'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                      </svg>
                      Chi tiết kỹ thuật
                    </summary>
                    <div className='max-h-64 overflow-auto rounded-lg bg-gray-900 p-4'>
                      <pre className='font-mono text-xs whitespace-pre-wrap text-green-400'>
                        {this.state.error?.stack || JSON.stringify(this.state.errorInfo, null, 2)}
                      </pre>
                    </div>
                  </details>
                )}

                {/* Action Buttons */}
                <div className='flex flex-col gap-3 sm:flex-row'>
                  <button
                    onClick={this.handleReset}
                    className='flex flex-1 transform items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg'
                  >
                    <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                      />
                    </svg>
                    <span>Thử lại</span>
                  </button>

                  <button
                    onClick={this.handleRefresh}
                    className='flex flex-1 transform items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-gray-600 hover:to-gray-700 hover:shadow-lg'
                  >
                    <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                      />
                    </svg>
                    <span>Tải lại trang</span>
                  </button>
                </div>

                {/* Help Text */}
                <div className='mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4'>
                  <div className='flex items-start space-x-3'>
                    <svg
                      className='mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    <div>
                      <h3 className='mb-1 text-sm font-semibold text-blue-800'>Gợi ý khắc phục:</h3>
                      <ul className='space-y-1 text-sm text-blue-700'>
                        <li>• Thử tải lại trang hoặc thử lại thao tác</li>
                        <li>• Kiểm tra kết nối internet của bạn</li>
                        <li>• Nếu lỗi vẫn tiếp tục, vui lòng liên hệ bộ phận hỗ trợ</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className='mt-4 text-center text-sm text-gray-500'>
              Mã lỗi: {Date.now().toString(36).toUpperCase()}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
