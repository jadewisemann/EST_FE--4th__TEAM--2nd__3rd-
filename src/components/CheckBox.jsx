import { useId } from 'react';

const CheckBox = ({
  txt,
  disabled = false,
  checked = false,
  className = '',
  onChange,
}) => {
  const inputId = useId();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <input
        id={inputId}
        type='checkbox'
        disabled={disabled}
        className='peer aspect-square w-[0.875rem] accent-violet-600'
        checked={checked}
        onChange={onChange}
      />
      <label
        htmlFor={inputId}
        className={`text-sm font-medium dark:text-white ${disabled ? 'text-neutral-400' : ''}`}
      >
        {txt}
      </label>
    </div>
  );
};

export default CheckBox;
