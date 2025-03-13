import { useState } from 'react';
import Icon from './Icon';

const Heart = ({ roomId }) => {
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
            <Icon name='heart' color='#FF41BC' size={20} />
          ) : (
            <Icon name='heart_fill' color='#FF41BC' size={20} />
          )}
        </g>
      </svg>
    </button>
  );
};

export default Heart;

// 사용법
// <Heart roomId={RoomId} /> 추후
// roomid를 props로 넘겨주어 해당 room의id가
// user favorite에 있는지 확인하여 좋아요 여부를 확인
// 해당 room의 좋아요 여부를 확인하여 isChecked 상태를 변경
// isChecked 상태에 따라 하트 색상 변경
