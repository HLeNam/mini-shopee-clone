import type { InputHTMLAttributes } from 'react';
import type { UseFormRegister, Path, FieldValues } from 'react-hook-form';

interface InputProps<T extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
  classNameInput?: string;
  classNameError?: string;
  name?: Path<T>;
  register?: UseFormRegister<T>;
}

const Input = <T extends FieldValues>({
  type,
  errorMessage,
  placeholder,
  className,
  classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
  classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
  autoComplete,
  name,
  register
}: InputProps<T>) => {
  return (
    <div className={`${className}`}>
      <input
        type={type}
        className={classNameInput}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...(register && name ? register(name) : {})}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  );
};
export default Input;
