import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
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
import type { ResponseApi } from '~/types/utils.type';
import { saveProfileToLocalStorage } from '~/utils/auth';
import { getAvatarUrl, isAxiosUnprocessableEntityError, parseFileSize } from '~/utils/utils';

/**
 * Flow upload ảnh:
 * Flow 1:
 * Nhấn upload: upload lên server ngay lập tức ==> server trả về URL ảnh
 * Nhấn submit thì gửi ảnh + data lên server
 * ==> Nhanh, nhưng dễ bị spam
 *
 * Flow 2:
 * Nhấn upload: không upload lên server
 * Nhấn submit thì tiến hành upload ảnh lên server, nếu upload thành công thì tiến hành gọi API update profile
 * ==> Chậm hơn vì phải chờ gọi xong API upload ảnh mới gọi API update profile
 */

const UpdateProfileSchema = UpdateUserBodySchema.omit({
  password: true,
  new_password: true
}).extend({
  date_of_birth: z.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ.').optional()
});

type UpdateProfileSchemaType = z.infer<typeof UpdateProfileSchema>;

const MAX_FILE_SIZE_MB = 1;

const Profile = () => {
  const [file, setFile] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewImageUrl = useMemo(() => {
    return file ? URL.createObjectURL(file) : '';
  }, [file]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError
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

  const avatar = watch('avatar');

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

  const uploadAvatarMutation = useMutation({
    mutationFn: userApi.uploadAvatar
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
      let avatarName = data.avatar;

      if (file) {
        const form = new FormData();
        form.append('image', file);
        const uploadRes = await uploadAvatarMutation.mutateAsync(form);

        avatarName = uploadRes.data.data;

        setValue('avatar', avatarName);
      }

      const persistedData: UpdateUserBody = {
        name: data.name,
        phone: data.phone,
        address: data.address,
        date_of_birth: data.date_of_birth ? data.date_of_birth.toISOString() : undefined,
        avatar: avatarName
      };

      // console.log('>>> Persisted Data:', persistedData);

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
      if (isAxiosUnprocessableEntityError<ResponseApi<UpdateUserBody>>(error)) {
        const errorsResponse = error.response?.data.data;
        Object.entries(errorsResponse || {}).forEach(([key, value]) => {
          setError(key as keyof UpdateProfileSchemaType, {
            message: value as string,
            type: 'Server'
          });
        });
        return;
      }
      console.error(error);
    }
  });

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0];

    const fileSize = parseFileSize(fileFromLocal?.size || 0);

    // console.log('>>> File Size:', fileSize);

    if (!fileFromLocal || fileSize.value > MAX_FILE_SIZE_MB || !fileFromLocal.type.match(/image\/(jpeg|png|jpg)/)) {
      toast.error(`Vui lòng chọn ảnh có định dạng .JPEG, .PNG và kích thước tối đa ${MAX_FILE_SIZE_MB} MB`, {
        position: 'top-center',
        autoClose: 1000
      });
      return;
    }

    setFile(fileFromLocal);
  };

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
                src={previewImageUrl || getAvatarUrl(avatar || profile?.avatar)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = image.noAvatar;
                }}
              ></img>
            </div>
            <input
              onClick={(e) => {
                (e.target as HTMLInputElement).value = ''; // Reset file input value to allow re-uploading the same file
              }}
              onChange={onFileChange}
              ref={fileInputRef}
              className='hidden'
              type='file'
              accept='.jpg,.jpeg,.png'
            />
            <button
              onClick={handleUpload}
              type='button'
              className='flex h-10 cursor-pointer items-center justify-center rounded-sm border bg-white px-6 text-sm text-gray-600 capitalize shadow-sm'
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
