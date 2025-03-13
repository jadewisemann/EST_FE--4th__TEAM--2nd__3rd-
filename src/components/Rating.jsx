import Icon from './Icon';

const Rating = ({ rate }) => (
  <div className='flex items-center gap-[2px]'>
    <Icon name='star_fill' className='text-yellow-400' size={14} />
    <span className='text-[12px] font-medium'>{rate}</span>
  </div>
);

export default Rating;

// 사용법
// <Rating rate={3.2}></Rating>;
