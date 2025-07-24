import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import PATH from '~/constants/path';
import authApi from '~/apis/auth.api';
import Popover from '~/components/Popover';
import { useAppContext } from '~/contexts';
import { queryClient } from '~/constants/queryClient';
import { PURCHASE_STATUS } from '~/constants/purchase';
import { getAvatarUrl, mergeUrlPaths } from '~/utils/utils';
import image from '~/assets/images';

const NavHeader = () => {
  const { setIsAuthenticated, isAuthenticated, setProfile, profile } = useAppContext();

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logoutAccount(),
    onSuccess: () => {
      setIsAuthenticated(false);
      setProfile(null);
      queryClient.removeQueries({ queryKey: ['purchases', { status: PURCHASE_STATUS.IN_CART }] });
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className='flex justify-end'>
      <Popover
        renderPopover={
          <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
            <div className='flex flex-col justify-start px-3 py-2 md:min-w-[150px] lg:min-w-[200px]'>
              <button className='hover:text-orange w-full cursor-pointer py-2 text-left'>Tiếng Việt</button>
              <button className='hover:text-orange mt-2 w-full cursor-pointer py-2 text-left'>English</button>
            </div>
          </div>
        }
        className='flex cursor-pointer items-center py-1 hover:text-gray-300'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418'
          />
        </svg>
        <span className='mx-1'>Tiếng Việt</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-5'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
        </svg>
      </Popover>
      {!isAuthenticated ? (
        <div className='flex items-center'>
          <Link to={`/${PATH.register}`} className='border-r border-gray-300 px-3 hover:text-gray-300'>
            Đăng ký
          </Link>
          <Link to={`/${PATH.login}`} className='-mr-3 px-3 hover:text-gray-300'>
            Đăng nhập
          </Link>
        </div>
      ) : (
        <Popover
          renderPopover={
            <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
              <div className='flex flex-col justify-start px-4 py-2'>
                <Link
                  to={mergeUrlPaths(PATH.user.root, PATH.user.profile)}
                  className='w-full cursor-pointer py-2 text-left hover:text-[#00bfa5]'
                >
                  Tài khoản của tôi
                </Link>
                <Link to='/cart' className='mt-2 w-full cursor-pointer py-2 text-left hover:text-[#00bfa5]'>
                  Đơn mua
                </Link>
                <button
                  className='mt-2 w-full cursor-pointer py-2 text-left hover:text-[#00bfa5]'
                  onClick={() => handleLogout()}
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          }
          className='ml-6 flex cursor-pointer items-center py-1 hover:text-gray-300'
        >
          <div className='mr-2 h-6 w-6 flex-shrink-0'>
            <img
              src={getAvatarUrl(profile?.avatar)}
              alt='avatar'
              className='h-full w-full rounded-full object-cover'
              onError={(e) => {
                (e.target as HTMLImageElement).src = image.noAvatar;
              }}
            />
          </div>
          <div>{profile?.email}</div>
        </Popover>
      )}
    </div>
  );
};

export default NavHeader;
