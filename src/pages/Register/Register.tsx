import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { registerAccount } from '~/apis/auth.api';
import Button from '~/components/Button';
import Input from '~/components/Input';
import { useAppContext } from '~/contexts';
import type { ResponseApi } from '~/types/utils.type';
import { isAxiosUnprocessableEntityError } from '~/utils/utils';

const RegisterSchema = z
  .object({
    email: z
      .string()
      .nonempty('Email là bắt buộc')
      .min(5, 'Email phải có ít nhất 5 ký tự')
      .max(160, 'Email không được quá 160 ký tự')
      .email('Email không đúng định dạng'),
    password: z
      .string()
      .nonempty('Mật khẩu là bắt buộc')
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .max(160, 'Mật khẩu không được quá 160 ký tự'),
    confirm_password: z
      .string()
      .nonempty('Xác nhận mật khẩu là bắt buộc')
      .min(6, 'Mật khẩu xác nhận phải có ít nhất 6 ký tự')
      .max(160, 'Mật khẩu xác nhận không được quá 160 ký tự')
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirm_password']
  });

type RegisterSchemaType = z.infer<typeof RegisterSchema>;

const Register = () => {
  const { setIsAuthenticated, setProfile } = useAppContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors }
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      confirm_password: ''
    }
  });

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<RegisterSchemaType, 'confirm_password'>) => {
      return registerAccount(body);
    }
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    // Handle registration logic here
    console.log('Register data:', data);
    try {
      const body = _.omit(data, 'confirm_password');
      const response = await registerAccountMutation.mutateAsync(body);

      const dataResponse = response.data;

      if (+response.status === 200 && dataResponse) {
        console.log('>>> Registration successful:', dataResponse);
        const accessToken = dataResponse.data?.access_token;
        const profile = dataResponse.data?.user;
        if (accessToken && profile) {
          setIsAuthenticated(true); // Update authentication state
          setProfile(profile); // Set user profile

          navigate('/'); // Redirect to home page after successful login
        }
        return;
      }
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ResponseApi<Omit<RegisterSchemaType, 'confirm_password'>>>(error)) {
        const errorsResponse = error.response?.data.data;
        Object.entries(errorsResponse || {}).forEach(([key, value]) => {
          setError(key as keyof RegisterSchemaType, {
            message: value as string,
            type: 'Server'
          });
        });
        return;
      }
      // Handle other errors (e.g., network errors, server errors)
      console.error('>>> Registration error:', error);
    }
  };

  return (
    <div className='bg-orange'>
      <div className='Container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className='text-2xl'>Đăng ký</div>
              <Input<RegisterSchemaType>
                type='email'
                errorMessage={errors.email?.message}
                placeholder='Email'
                className='mt-8'
                name='email'
                register={register}
              />
              <Input<RegisterSchemaType>
                type='password'
                errorMessage={errors.password?.message}
                placeholder='Password'
                autoComplete='new-password'
                className='mt-2'
                name='password'
                register={register}
              />
              <Input<RegisterSchemaType>
                type='password'
                errorMessage={errors.confirm_password?.message}
                placeholder='Confirm Password'
                autoComplete='new-password'
                className='mt-2'
                name='confirm_password'
                register={register}
              />
              <div className='mt-3'>
                <Button
                  type='submit'
                  disabled={isSubmitting || registerAccountMutation.isPending}
                  isLoading={registerAccountMutation.isPending}
                  className='bg-orange hover:bg-orange/90 flex w-full items-center justify-center px-2 py-4 text-center text-sm text-white uppercase'
                >
                  Đăng ký
                </Button>
              </div>
              <div className='mt-8 text-center'>
                <div className='flex items-center justify-center'>
                  <span className='text-black/[0.26]'>Bạn mới biết đến Shopee?</span>
                  <Link to={'/login'} className='text-orange hover:text-orange/90 ml-1'>
                    Đăng nhập
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
