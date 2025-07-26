import z from 'zod';
// import { omit } from 'lodash';
import omit from 'lodash/omit';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import userApi from '~/apis/user.api';
import Button from '~/components/Button';
import { Input } from '~/components/Input';
import type { ResponseApi } from '~/types/utils.type';
import { isAxiosUnprocessableEntityError } from '~/utils/utils';
import { UpdateUserBodySchema, type UpdateUserBody } from '~/types/user.type';

const updatePasswordSchema = UpdateUserBodySchema.pick({
  password: true,
  new_password: true
})
  .extend({
    confirm_password: z
      .string()
      .nonempty('Xác nhận mật khẩu là bắt buộc')
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .max(160, 'Mật khẩu không được quá 160 ký tự')
      .optional()
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Mật khẩu mới và xác nhận mật khẩu không khớp',
    path: ['confirm_password']
  });

type UpdatePasswordSchemaType = z.infer<typeof updatePasswordSchema>;

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<UpdatePasswordSchemaType>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    }
  });

  const updatePasswordMutation = useMutation({
    mutationFn: userApi.updateProfile
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updatePasswordMutation.mutateAsync(omit(data, ['confirm_password']));

      // console.log('>>> Update password response:', res);

      if (res.status === 200) {
        toast.success(res.data.message || 'Cập nhật mật khẩu thành công!', {
          autoClose: 1000,
          position: 'top-center'
        });
        reset();
      }
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ResponseApi<UpdateUserBody>>(error)) {
        const errorsResponse = error.response?.data.data;
        Object.entries(errorsResponse || {}).forEach(([key, value]) => {
          setError(key as keyof UpdatePasswordSchemaType, {
            message: value as string,
            type: 'Server'
          });
        });
        return;
      }
      console.error(error);
    }
  });

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium text-gray-900 capitalize'>Thêm mật khẩu</h1>
        <div className='mt-1 text-sm text-gray-700'>
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </div>
      </div>
      <form className='mx-auto mt-8 max-w-2xl' onSubmit={onSubmit} noValidate>
        <div className='flex-grow sm:mt-6 md:mt-0'>
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-1/5 sm:text-right'>Mật khẩu cũ</div>
            <div className='sm:w-4/5 sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='password'
                type='password'
                placeholder='Mật khẩu cũ'
                errorMessage={errors.password?.message}
              />
            </div>
          </div>

          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-1/5 sm:text-right'>Mật khẩu mới</div>
            <div className='sm:w-4/5 sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='new_password'
                type='password'
                placeholder='Mật khẩu mới'
                errorMessage={errors.new_password?.message}
              />
            </div>
          </div>

          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-1/5 sm:text-right'>Xác nhận mật khẩu</div>
            <div className='sm:w-4/5 sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='confirm_password'
                type='password'
                placeholder='Xác nhận mật khẩu'
                errorMessage={errors.confirm_password?.message}
              />
            </div>
          </div>

          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-1/5 sm:text-right'></div>
            <div className='sm:w-4/5 sm:pl-5'>
              <Button
                type='submit'
                disabled={updatePasswordMutation.isPending}
                isLoading={updatePasswordMutation.isPending}
                className='bg-orange hover:bg-orange/80 flex h-9 items-center rounded-sm px-5 text-center text-sm text-white'
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
