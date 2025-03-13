import { useState } from 'react';
import Icon from './Icon';

const Heart = ({ roomId }) => {
  const [isChecked, setIsChecked] = useState(false);

  const heartHandler = () => {
    setIsChecked(prev => !prev);
  };

  return (
    <button
      onClick={heartHandler}
      className='rounded-4xl border-1 border-neutral-300 bg-white p-1.5'
    >
      <Icon
        name={!isChecked ? 'heart' : 'heart_fill'}
        color='#FF41BC'
        size={20}
      />
    </button>
  );
};

export default Heart;

// 사용법
// <Heart />
