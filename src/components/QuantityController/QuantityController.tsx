import { useState } from 'react';
import { InputNumber, type InputNumberProps } from '~/components/Input';

interface QuantityControllerProps extends InputNumberProps {
  max?: number;
  onIncrease?: (value: number) => void;
  onDecrease?: (value: number) => void;
  onType?: (value: number) => void;
  classNameWrapper?: string;
}

const QuantityController = ({
  max,
  value,
  onIncrease = () => {},
  onDecrease = () => {},
  onType = () => {},
  classNameWrapper = 'ml-10',
  ...rest
}: QuantityControllerProps) => {
  const [localValue, setLocalValue] = useState<number>(value !== undefined ? +value : 1);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const _value = +event.target.value;

    if (max !== undefined && _value > max) {
      event.target.value = max.toString();
    } else if (_value < 1) {
      event.target.value = '1';
    }

    if (onType && typeof onType === 'function') {
      onType(+event.target.value);
    }
    setLocalValue(+event.target.value);
  };

  const handleIncrease = () => {
    let newValue = value ? +value + 1 : localValue + 1;
    if (max !== undefined && newValue > max) {
      newValue = max;
    }

    if (onIncrease && typeof onIncrease === 'function') {
      onIncrease(newValue);
    }
    setLocalValue(newValue);
  };

  const handleDecrease = () => {
    let newValue = value ? +value - 1 : localValue - 1;
    if (newValue < 1) {
      newValue = 1;
    }

    if (onDecrease && typeof onDecrease === 'function') {
      onDecrease(newValue);
    }
    setLocalValue(newValue);
  };

  return (
    <div className={`flex items-center ${classNameWrapper}`}>
      <button
        onClick={() => handleDecrease()}
        className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
        </svg>
      </button>
      <InputNumber
        value={value !== undefined ? value : localValue}
        classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
        classNameError='hidden'
        onChange={(e) => handleChange(e)}
        {...rest}
      />
      <button
        onClick={() => handleIncrease()}
        className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-r-sm border border-gray-300 text-gray-600'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
      </button>
    </div>
  );
};

export default QuantityController;
