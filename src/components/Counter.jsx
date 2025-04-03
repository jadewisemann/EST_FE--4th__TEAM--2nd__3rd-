import { useState } from 'react';

import Button from './Button';
import Icon from './Icon';

const Counter = ({
  children,
  onChange = () => {},
  initialValue = 0,
  minValue = 0,
  maxValue = 9,
  subTitle,
}) => {
  const [count, setCount] = useState(initialValue);
  if (initialValue < minValue) {
    setCount(minValue);
  } else if (initialValue > maxValue) {
    setCount(maxValue);
  }

  const updateCount = newCount => {
    setCount(newCount);
    onChange(newCount);
  };

  return (
    <div className='flex h-20 w-full items-center justify-between px-10'>
      {/* view */}
      <div className='info flex items-center gap-10'>
        <span className='text-5xl'>{count}</span>
        <div className='flex flex-col gap-1'>
          <span className='text-base'>{children}</span>
          <span className='text-xs text-neutral-600 dark:text-neutral-400'>
            {subTitle}
          </span>
        </div>
      </div>
      {/* controller */}
      <div className='controller flex items-center gap-6'>
        <Button
          onClick={() => count > minValue && updateCount(count - 1)}
          size='square'
          color='alt'
        >
          <Icon name='minus_thin' color='black' strokeWidth={0} />
        </Button>
        <Button
          onClick={() => count < maxValue && updateCount(count + 1)}
          size='square'
          color='prime'
        >
          <Icon name='plus_thin' color='white' strokeWidth={0} />
        </Button>
      </div>
    </div>
  );
};

export default Counter;
