import type { UseFormRegister, Path, FieldValues } from 'react-hook-form';

interface InputProps<T extends FieldValues> {
  type: React.HTMLInputTypeAttribute | undefined;
  errorMessage?: string;
  placeholder?: string;
  className?: string;
  autoComplete?: string;
  name: Path<T>;
  register: UseFormRegister<T>;
}

const Input = <T extends FieldValues>({
  type,
  errorMessage,
  placeholder,
  className,
  autoComplete,
  name,
  register
}: InputProps<T>) => {
  return (
    <div className={`${className}`}>
      <input
        type={type}
        className={`w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm`}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...register(name)}
      />
      <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div>
    </div>
  );
};
export default Input;
