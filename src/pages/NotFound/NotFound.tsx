import { Link } from 'react-router-dom';
import PATH from '~/constants/path';
import { mergeUrlPaths } from '~/utils/utils';

const NotFound = () => {
  return (
    <section className='bg-white'>
      <div className='mx-auto flex min-h-screen max-w-screen-xl flex-col items-center justify-center px-4 py-8 lg:px-6 lg:py-16'>
        <div className='mx-auto flex h-full max-w-screen-sm flex-col items-center justify-center text-center'>
          <h1 className='text-orange mb-4 text-7xl font-extrabold tracking-tight lg:text-9xl'>404</h1>
          <p className='mb-4 text-3xl font-bold tracking-tight md:text-4xl'>
            {/* Something's missing. */}
            Không tìm thấy trang này.
          </p>
          <p className='mb-4 text-lg font-light text-gray-500'>
            {/* Sorry, we can't find that page. You'll find lots to explore on the home page. */}
            Rất tiếc, chúng tôi không thể tìm thấy trang đó. Bạn có thể tìm thấy nhiều điều thú vị để khám phá trên
            trang chủ.
          </p>
          <Link
            to={mergeUrlPaths(PATH.home)}
            className='bg-orange hover:bg-orange/80 focus:ring-orange/80 my-4 inline-flex rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:ring-4 focus:outline-none'
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
