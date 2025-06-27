import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import Input from '~/components/Input';

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
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginSchemaType) => {
    // Handle login logic here
    console.log('Login data:', data);
    // Simulate an API call
    return new Promise((resolve) => setTimeout(resolve, 1000));
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
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='bg-orange hover:bg-orange/90 w-full cursor-pointer px-2 py-4 text-center text-sm text-white uppercase'
                >
                  Đăng nhập
                </button>
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
