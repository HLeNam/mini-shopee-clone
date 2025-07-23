import { range } from 'lodash';
import { useEffect, useState } from 'react';

interface DateSelectProps {
  onChange?: (value: Date) => void;
  value?: Date;
  errorMessage?: string;
}

const DateSelect = ({ onChange, value, errorMessage }: DateSelectProps) => {
  const [date, setDate] = useState({
    date: value ? value.getDate() : '',
    month: value ? value.getMonth() : '',
    year: value ? value.getFullYear() : ''
  });

  useEffect(() => {
    if (value) {
      setDate({
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear()
      });
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value: newValue } = e.target;

    const newDate = {
      date: value ? date.date : date.date || '',
      month: value ? date.month : date.month || '',
      year: value ? date.year : date.year || '',
      [name]: +newValue
    };

    setDate(newDate);

    if (onChange && typeof onChange === 'function') {
      if (newDate.date && newDate.month && newDate.year) {
        onChange(new Date(Number(newDate.year), Number(newDate.month), Number(newDate.date)));
      }
    }
  };

  return (
    <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
      <div className='truncate pt-3 capitalize sm:w-1/5 sm:text-right'>Ngày sinh</div>
      <div className='sm:w-4/5 sm:pl-5'>
        <div className='flex justify-between'>
          <select
            name='date'
            onChange={handleChange}
            value={date.date}
            className='hover:border-orange h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3'
          >
            <option value='' hidden disabled>
              Ngày
            </option>
            {range(1, 32).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <select
            name='month'
            onChange={handleChange}
            value={date.month}
            className='hover:border-orange h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3'
          >
            <option value='' hidden disabled>
              Tháng
            </option>
            {range(0, 12).map((month) => (
              <option key={month} value={month}>
                {month + 1}
              </option>
            ))}
          </select>
          <select
            name='year'
            onChange={handleChange}
            value={date.year}
            className='hover:border-orange h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3'
          >
            <option value='' hidden disabled>
              Năm
            </option>
            {range(1900, new Date().getFullYear() + 1)
              .reverse()
              .map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>
        </div>
        <div className='mt-1 min-h-[1.25rem] text-sm text-red-600 select-none'>{errorMessage}</div>
      </div>
    </div>
  );
};

export default DateSelect;
