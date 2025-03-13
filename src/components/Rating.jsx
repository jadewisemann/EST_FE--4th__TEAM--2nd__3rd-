import Icon from './Icon';

export default function Rating({ rate }) {
  return (
    <div className='flex items-center gap-[2px]'>
      <Icon name='star_fill' className='text-yellow-400' size={14} />
      <span className='text-[12px] font-medium'>{rate}</span>
    </div>
  );
}

// 사용법
// <Rating rate={3.2}></Rating>;
