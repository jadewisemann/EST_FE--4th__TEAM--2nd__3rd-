import Icon from './Icon';

const Rating = ({ rate }) => (
  <div className='flex items-center gap-0.5'>
    <Icon name='star_fill' className='text-yellow-400' size={14} />
    <span className='text-sm font-bold text-violet-600 dark:text-violet-500'>
      <span className='sr-only'>평점</span>
      {rate}
    </span>
  </div>
);

export default Rating;

// 사용법
// <Rating rate={3.2}></Rating>;
