import { useState } from 'react';
import Icon from './Icon';

const Heart = () => {
  const [isChecked, setIsChecked] = useState(false);

  const heartHandler = () => {
    setIsChecked(prev => !prev);
  };

  return (
    <button onClick={heartHandler} className='h-5 w-5'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='30'
        height='30'
        viewBox='0 0 30 30'
        fill='none'
      >
        <circle
          cx='15'
          cy='15'
          r='12.5'
          fill='none'
          stroke='#F1EAFF'
          strokeWidth='1'
        />

        <g transform='translate(5, 5)'>
          {!isChecked ? (
            <Icon name='heart' color='#8E51FF' size={20} />
          ) : (
            <Icon name='heart_fill' color='#FF41BC' size={20} />
          )}
        </g>
      </svg>
    </button>
  );
};

export default Heart;
