import { Link } from 'react-router-dom';
import PATH from '~/constants/path';
import { mergeUrlPaths } from '~/utils/utils';

const UserSideNav = () => {
  return (
    <div>
      <div className='flex items-center border-b border-b-gray-200 py-4'>
        <Link
          to={mergeUrlPaths(PATH.user.root, PATH.user.profile)}
          className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-black/10'
        >
          <img
            className='h-full w-full object-cover'
            src='https://images.unsplash.com/photo-1548637724-cbc39e0c8d3b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmVhdXRpZnVsJTIwd29tYW58ZW58MHx8MHx8fDA%3D'
          />
        </Link>
        <div className='flex-grow pl-4'>
          <div className='mb-1 truncate font-semibold text-gray-600'>hlnam</div>
          <Link
            to={mergeUrlPaths(PATH.user.root, PATH.user.profile)}
            className='flex items-center text-gray-500 capitalize'
          >
            <svg
              width={12}
              height={12}
              viewBox='0 0 12 12'
              xmlns='http://www.w3.org/2000/svg'
              style={{ marginRight: 4 }}
            >
              <path
                d='M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48'
                fill='#9B9B9B'
                fillRule='evenodd'
              />
            </svg>
            Sửa hồ sơ
          </Link>
        </div>
      </div>
      <div className='mt-7'>
        <div>
          <Link
            to={mergeUrlPaths(PATH.user.root, PATH.user.profile)}
            className='flex items-center text-black capitalize transition-colors'
          >
            <div className='mr-3 h-[22px] w-[22px]'>
              <img
                className='h-full w-full'
                src='https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4'
                alt='User'
              />
            </div>
            Tài khoản của tôi
          </Link>
          <div className='ml-5 flex flex-col gap-2 py-2 pl-4 text-sm text-gray-600'>
            <Link
              to={mergeUrlPaths(PATH.user.root, PATH.user.profile)}
              className='text-orange flex items-center capitalize transition-colors'
            >
              Hồ sơ
            </Link>
            <Link
              to={mergeUrlPaths(PATH.user.root, PATH.user.changePassword)}
              className='flex items-center text-gray-600 capitalize transition-colors'
            >
              Đổi mật khẩu
            </Link>
          </div>
        </div>

        <Link
          to={mergeUrlPaths(PATH.user.root, PATH.user.purchaseHistory)}
          className='flex items-center text-black capitalize transition-colors'
        >
          <div className='mr-3 h-[22px] w-[22px]'>
            <img
              className='h-full w-full'
              src='https://down-vn.img.susercontent.com/file/f0049e9df4e536bc3e7f140d071e9078'
              alt='User'
            />
          </div>
          Đơn mua
        </Link>
      </div>
    </div>
  );
};

export default UserSideNav;
