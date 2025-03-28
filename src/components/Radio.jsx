import { useId } from 'react';

const Radio = ({ name, options, selectedIndex, onChange }) => {
  // 랜덤 아이디 부여
  const inputId = useId();

  return (
    <ul>
      {options?.map((option, index) => (
        <li key={index} className='mt-3 flex items-center gap-2 first:mt-0'>
          <input
            id={`${name}-${index}`}
            name={inputId}
            type='radio'
            disabled={option.disabled}
            checked={selectedIndex === index}
            onChange={() => onChange(index)}
            className='peer aspect-square w-[1.125rem] accent-violet-600 dark:accent-violet-500'
          />
          <label
            htmlFor={`${name}-${index}`}
            className='text-sm font-medium text-neutral-400 peer-checked:text-black dark:peer-checked:text-white'
          >
            {option.value}
          </label>
        </li>
      ))}
    </ul>
  );
};

export default Radio;
