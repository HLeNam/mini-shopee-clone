import { useState, type InputHTMLAttributes } from 'react';

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
  classNameInput?: string;
  classNameError?: string;
}

/**
 * Làm việc với các component Input như của Ant Design, MUI, Chakra UI, v.v.
 * thì nó sẽ không nhận props `register` và `name` như của react-hook-form.
 * thì bạn có thể sử dụng `Controller` của react-hook-form để quản lý giá trị của input.
 */

const InputNumber = ({
  errorMessage,
  className,
  value,
  classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
  classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
  ...rest
}: InputNumberProps) => {
  const [localValue, setLocalValue] = useState<string>(value !== undefined ? String(value) : '');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Chỉ cho phép nhập số và dấu chấm
    if ((/^[0-9]*\.?[0-9]*$/.test(value) || value === '') && rest.onChange) {
      event.target.value = value;
      rest.onChange(event); // Gọi hàm onChange nếu có
      setLocalValue(value); // Cập nhật giá trị cục bộ
    } else {
      // Nếu nhập không hợp lệ, giữ nguyên giá trị cũ
      setLocalValue(event.target.value);
      event.target.value = event.target.value.slice(0, -1);
    }
  };

  return (
    <div className={`${className}`}>
      <input
        type={rest.type || 'text'}
        className={classNameInput}
        {...rest}
        value={value !== undefined ? value : localValue}
        onChange={(e) => {
          handleChange(e);
        }}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  );
};
export default InputNumber;
