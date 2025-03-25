import { Link } from 'react-router-dom';

import Heart from '../components/Heart';
import Rating from '../components/Rating';

const VerticalList = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className='py-8 text-center text-sm text-neutral-500'>
        등록된 숙소가 없습니다.
      </div>
    );
  }

  return (
    <div className='flex flex-col'>
      {products.map(product => {
        const image = product.rooms?.[0]?.img || product.image?.[0] || '';
        const location = product.location?.[0] || '작성 된 주소가 없습니다.';
        const title = product.title || '숙소명 없음';
        const price =
          Number(
            typeof product.rooms?.[0]?.price === 'string'
              ? product.rooms?.[0].price.replace(/,/g, '')
              : product.rooms?.[0]?.price,
          ) || 0;
        const rating = product.rating || product._debug?.score || 0;

        return (
          <div
            key={product.id}
            className='relative w-full border-b-1 border-neutral-200 py-4'
          >
            <Link
              to={`/details/${encodeURIComponent(product.id)}`}
              className='flex w-full cursor-pointer gap-3'
              title={title}
            >
              <div className='shrink-0'>
                <img
                  className='block h-20 w-20 rounded-[10px] object-cover'
                  src={image}
                  alt={title}
                />
              </div>
              <div className='flex grow justify-between'>
                <div className='flex flex-col'>
                  <div className='mb-1.5 text-left text-sm font-medium'>
                    {title}
                  </div>
                  <address className='flex text-left text-[11px] text-neutral-500 not-italic'>
                    {location}
                  </address>
                  <div className='mt-auto flex items-center gap-1'>
                    <span className='text-sm font-bold text-violet-600'>
                      {price.toLocaleString()}원
                    </span>
                    <span className='text-xs text-neutral-500'>/ 1박</span>
                  </div>
                </div>
                <div className='flex flex-col justify-between'>
                  <Rating rate={rating} className='ml-auto' />
                </div>
              </div>
            </Link>
            <Heart className='absolute right-0 bottom-4 z-10' />
          </div>
        );
      })}
    </div>
  );
};

export default VerticalList;
