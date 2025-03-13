import { useState } from 'react';
import Button from './Button';
import Icon from './Icon';

const Counter = ({ children, setter = () => {}, startAt = 0 }) => {
  const [count, setCount] = useState(startAt);

  const updateCount = newCount => {
    setCount(newCount);
    setter(newCount);
  };

  return (
    <div className='flex h-20 w-full items-center justify-between px-10'>
      <div className='info flex items-center gap-10'>
        <span className='text-5xl'>{count}</span>
        <span className='text-base'>{children}</span>
      </div>
      <div className='controller flex items-center gap-6'>
        <Button
          onClick={() => count > 0 && updateCount(count - 1)}
          size='square'
          color='alt'
        >
          <Icon name='minus_thin' color='black' strokeWidth={0} />
        </Button>
        <Button
          onClick={() => updateCount(count + 1)}
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
