import { useEffect, useState } from 'react';
import { InputNumber, type InputNumberProps } from '~/components/Input';

interface QuantityControllerProps extends InputNumberProps {
  max?: number;
  onIncrease?: (value: number) => void;
  onDecrease?: (value: number) => void;
  onType?: (value: number) => void;
  onFocusOut?: (value: number) => void;
  classNameWrapper?: string;
  disabled?: boolean;
}

const QuantityController = ({
  max,
  value,
  onIncrease = () => {},
  onDecrease = () => {},
  onType = () => {},
  onFocusOut = () => {},
  classNameWrapper = 'ml-10',
  disabled,
  ...rest
}: QuantityControllerProps) => {
  const [localValue, setLocalValue] = useState<number>(value !== undefined ? +value : 1);
  const [inputValue, setInputValue] = useState<string>(value !== undefined ? value.toString() : '1');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = event.target.value;

    if (inputVal === '' || /^\d*$/.test(inputVal)) {
      setInputValue(inputVal);

      if (inputVal !== '' && !isNaN(+inputVal)) {
        let numValue = +inputVal;

        if (max !== undefined && numValue > max) {
          numValue = max;
          setInputValue(max.toString());
        }

        setLocalValue(numValue);
        if (onType && typeof onType === 'function') {
          onType(numValue);
        }
      }
    }
  };

  const handleIncrease = () => {
    let newValue = value !== undefined ? +value + 1 : localValue + 1;
    if (max !== undefined && newValue > max) {
      newValue = max;
    }

    setLocalValue(newValue);
    setInputValue(newValue.toString());

    if (onIncrease && typeof onIncrease === 'function') {
      onIncrease(newValue);
    }
  };

  const handleDecrease = () => {
    let newValue = value !== undefined ? +value - 1 : localValue - 1;
    if (newValue < 1) {
      newValue = 1;
    }

    setLocalValue(newValue);
    setInputValue(newValue.toString());

    if (onDecrease && typeof onDecrease === 'function') {
      onDecrease(newValue);
    }
  };

  const handleBlur = () => {
    let finalValue = inputValue === '' ? 1 : +inputValue;

    if (finalValue < 1) {
      finalValue = 1;
    }
    if (max !== undefined && finalValue > max) {
      finalValue = max;
    }

    setLocalValue(finalValue);
    setInputValue(finalValue.toString());

    if (onFocusOut && typeof onFocusOut === 'function') {
      onFocusOut(finalValue);
    }
  };

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value.toString());
      setLocalValue(+value);
    }
  }, [value]);

  return (
    <div className={`flex items-center ${classNameWrapper}`}>
      <button
        onClick={() => handleDecrease()}
        className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'
        disabled={disabled}
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
        value={inputValue}
        classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
        classNameError='hidden'
        onChange={(e) => handleChange(e)}
        onBlur={() => handleBlur()}
        {...rest}
        disabled={disabled}
      />
      <button
        onClick={() => handleIncrease()}
        className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-r-sm border border-gray-300 text-gray-600'
        disabled={disabled}
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
