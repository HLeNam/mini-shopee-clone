import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import userApi from '~/apis/user.api';
import image from '~/assets/images';
import Button from '~/components/Button';
import { Input } from '~/components/Input';
import { useAppContext } from '~/contexts';
import DateSelect from '~/pages/User/components/DateSelect';
import { UpdateUserBodySchema, type UpdateUserBody } from '~/types/user.type';
import { saveProfileToLocalStorage } from '~/utils/auth';

const UpdateProfileSchema = UpdateUserBodySchema.omit({
  password: true,
  new_password: true
}).extend({
  date_of_birth: z.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ.').optional()
});

type UpdateProfileSchemaType = z.infer<typeof UpdateProfileSchema>;

const Profile = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      date_of_birth: undefined,
      avatar: ''
    }
  });

  const {
    data: profileData,
    isFetching: isFetchingProfile,
    isError: isErrorProfile,
    refetch: refetchProfile
  } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  });

  const profile = profileData?.data.data;

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  });

  const { setProfile } = useAppContext();

  useEffect(() => {
    if (!isFetchingProfile && !isErrorProfile && profile) {
      setValue('name', profile.name || '');
      setValue('phone', profile.phone || '');
      setValue('address', profile.address || '');
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : undefined);
      setValue('avatar', profile.avatar || '');
    }
  }, [isErrorProfile, isFetchingProfile, profile, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const persistedData: UpdateUserBody = {
        name: data.name,
        phone: data.phone,
        address: data.address,
        date_of_birth: data.date_of_birth ? data.date_of_birth.toISOString() : undefined,
        avatar: data.avatar
      };

      console.log('>>> Persisted Data:', persistedData);

      const res = await updateProfileMutation.mutateAsync(persistedData);

      if (res.status === 200) {
        toast.success(res.data.message || 'Cập nhật hồ sơ thành công', {
          autoClose: 1000,
          position: 'top-center'
        });
        setProfile(res.data.data);
        saveProfileToLocalStorage(res.data.data);
        refetchProfile();
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium text-gray-900 capitalize'>Hồ sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit} noValidate>
        <div className='flex-grow sm:mt-6 md:mt-0 md:pr-12'>
          <div className='flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-1/5 sm:text-right'>Email</div>
            <div className='sm:w-4/5 sm:pl-5'>
              <div className='pt-3 text-gray-700'>{profile?.email}</div>
            </div>
          </div>

          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-1/5 sm:text-right'>Tên</div>
            <div className='sm:w-4/5 sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='name'
                placeholder='Tên'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>

          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-1/5 sm:text-right'>Số điện thoại</div>
            <div className='sm:w-4/5 sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='phone'
                placeholder='Số điện thoại'
                errorMessage={errors.phone?.message}
              />
            </div>
          </div>

          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-1/5 sm:text-right'>Địa chỉ</div>
            <div className='sm:w-4/5 sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='address'
                placeholder='Địa chỉ'
                errorMessage={errors.address?.message}
              />
            </div>
          </div>

          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => (
              <DateSelect
                {...field}
                errorMessage={errors.date_of_birth?.message}
                onChange={(date) => field.onChange(date)}
                value={field.value}
              />
            )}
          />

          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-1/5 sm:text-right'></div>
            <div className='sm:w-4/5 sm:pl-5'>
              <Button
                type='submit'
                className='bg-orange hover:bg-orange/80 flex h-9 items-center rounded-sm px-5 text-center text-sm text-white'
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-24 w-24'>
              <img
                className='h-full w-full rounded-full object-cover'
                src={profile?.avatar || image.noAvatar}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = image.noAvatar;
                }}
              ></img>
            </div>
            <input className='hidden' type='file' accept='.jpg,.jpeg,.png' />
            <button
              type='button'
              className='flex h-10 items-center justify-center rounded-sm border bg-white px-6 text-sm text-gray-600 capitalize shadow-sm'
            >
              Chọn ảnh
            </button>
            <div className='mt-3 text-gray-400'>
              <div>Dụng lượng file tối đa 1 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
