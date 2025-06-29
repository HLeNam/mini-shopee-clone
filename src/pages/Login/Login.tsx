import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { loginAccount } from '~/apis/auth.api';
import Button from '~/components/Button';
import Input from '~/components/Input';
import { useAppContext } from '~/contexts';
import type { ResponseApi } from '~/types/utils.type';
import { isAxiosUnprocessableEntityError } from '~/utils/utils';

const LoginSchema = z.object({
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
    .max(160, 'Mật khẩu không được quá 160 ký tự')
});

type LoginSchemaType = z.infer<typeof LoginSchema>;

const Login = () => {
  const { setIsAuthenticated, setProfile } = useAppContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors }
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const loginAccountMutation = useMutation({
    mutationFn: (body: LoginSchemaType) => {
      return loginAccount(body);
    }
  });

  const onSubmit = async (data: LoginSchemaType) => {
    // Handle login logic here
    console.log('Login data:', data);
    loginAccountMutation.mutate(data, {
      onSuccess: (data) => {
        console.log('Login successful:', data);
        // Handle successful login, e.g., redirect or show a success message
        const responseData = data.data;
        const accessToken = responseData.data?.access_token;
        const profile = responseData.data?.user;
        if (accessToken && profile) {
          setIsAuthenticated(true); // Update authentication state
          setProfile(profile); // Set user profile
          navigate('/'); // Redirect to home page after successful login
        }
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ResponseApi<LoginSchemaType>>(error)) {
          const errorsResponse = error.response?.data.data;
          Object.entries(errorsResponse || {}).forEach(([key, value]) => {
            setError(key as keyof LoginSchemaType, {
              message: value as string,
              type: 'Server'
            });
          });
          return;
        }
        // Handle other errors (e.g., network errors, server errors)
        console.error('>>> Registration error:', error);
      }
    });
  };

  return (
    <div className='bg-orange'>
      <div className='Container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className='text-2xl'>Đăng nhập</div>
              <Input<LoginSchemaType>
                type='email'
                errorMessage={errors.email?.message}
                placeholder='Email'
                className='mt-8'
                name='email'
                register={register}
              />
              <Input<LoginSchemaType>
                type='password'
                errorMessage={errors.password?.message}
                placeholder='Password'
                autoComplete='current-password'
                className='mt-2'
                name='password'
                register={register}
              />

              <div className='mt-3'>
                <Button
                  type='submit'
                  disabled={isSubmitting || loginAccountMutation.isPending}
                  isLoading={loginAccountMutation.isPending}
                  className='bg-orange hover:bg-orange/90 flex w-full items-center justify-center px-2 py-4 text-center text-sm text-white uppercase'
                >
                  Đăng nhập
                </Button>
              </div>
              <div className='mt-8 text-center'>
                <div className='flex items-center justify-center'>
                  <span className='text-black/[0.26]'>Bạn mới biết đến Shopee?</span>
                  <Link to={'/register'} className='text-orange hover:text-orange/90 ml-1'>
                    Đăng ký
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
export default Login;
