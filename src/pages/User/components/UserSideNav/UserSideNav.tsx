import { Link, NavLink } from 'react-router-dom';

import PATH from '~/constants/path';
import image from '~/assets/images';
import { useAppContext } from '~/contexts';
import { getAvatarUrl, mergeUrlPaths } from '~/utils/utils';
import classNames from 'classnames';

const UserSideNav = () => {
  const { profile } = useAppContext();

  return (
    <div>
      <div className='flex items-center border-b border-b-gray-200 py-4'>
        <Link
          to={mergeUrlPaths(PATH.user.root, PATH.user.profile)}
          className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-black/10'
        >
          <img
            className='h-full w-full object-cover'
            src={getAvatarUrl(profile?.avatar)}
            onError={(e) => {
              (e.target as HTMLImageElement).src = image.noAvatar;
            }}
          />
        </Link>
        <div className='flex-grow pl-4'>
          <div className='mb-1 truncate font-semibold text-gray-600'>{profile?.name || profile?.email}</div>
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
            className='hover:text-orange flex items-center text-black capitalize transition-colors'
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
            <NavLink
              to={mergeUrlPaths(PATH.user.root, PATH.user.profile)}
              end
              className={({ isActive }) =>
                classNames(`flex items-center capitalize transition-colors`, {
                  'text-orange': isActive,
                  'text-gray-600': !isActive
                })
              }
            >
              Hồ sơ
            </NavLink>
            <NavLink
              to={mergeUrlPaths(PATH.user.root, PATH.user.changePassword)}
              className={({ isActive }) =>
                classNames(`flex items-center capitalize transition-colors`, {
                  'text-orange': isActive,
                  'hover:text-orange text-gray-600': !isActive
                })
              }
            >
              Đổi mật khẩu
            </NavLink>
          </div>
        </div>

        <NavLink
          to={mergeUrlPaths(PATH.user.root, PATH.user.purchaseHistory)}
          className={({ isActive }) =>
            classNames(`flex items-center capitalize transition-colors`, {
              'text-orange': isActive,
              'hover:text-orange text-black': !isActive
            })
          }
        >
          <div className='mr-3 h-[22px] w-[22px]'>
            <img
              className='h-full w-full'
              src='https://down-vn.img.susercontent.com/file/f0049e9df4e536bc3e7f140d071e9078'
              alt='User'
            />
          </div>
          Đơn mua
        </NavLink>
      </div>
    </div>
  );
};

export default UserSideNav;
