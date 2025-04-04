import { useEffect, useRef } from 'react';

import { Link } from 'react-router-dom';

import Heart from './Heart';
import Rating from './Rating';
import SkeletonItem from './SkeletonItem';

const SKELETON_ITEM_LENGTH = 10;

const VerticalList = ({ products, isLoading, activeTab, query }) => {
  const isLoadingRef = useRef(false);

  useEffect(() => {
    isLoadingRef.current = false;
  }, [activeTab, query]);

  if (isLoading && !isLoadingRef.current) {
    return (
      <div className='flex flex-col'>
        {Array.from({ length: SKELETON_ITEM_LENGTH }).map((_, index) => (
          <SkeletonItem key={index} />
        ))}
      </div>
    );
  } else if (!products || products.length === 0) {
    return (
      <div className='py-8 text-center text-sm text-neutral-500'>
        등록된 숙소가 없습니다.
      </div>
    );
  }
  isLoadingRef.current = true;

  return (
    <ul className='flex flex-col'>
      {products.map(product => {
        const image =
          typeof product.image === 'object' && product.image !== null
            ? product.image?.[0] || product.rooms?.[0]?.img
            : product?.image || '';
        const location = product.location?.[0] || '작성 된 주소가 없습니다.';
        const title = product.title || '숙소명 없음';
        const price =
          Number(
            typeof product.rooms?.[0]?.price === 'string'
              ? product.rooms?.[0].price.replace(/,/g, '')
              : product.rooms?.[0]?.price,
          ) || 0;
        const rating = product.rating || 0;

        const isReservation = !!product.checkIn && !!product.checkOut;
        // console.log('product:', product);

        return isReservation ? (
          <li
            key={product.id}
            className='relative w-full border-b-1 border-neutral-200 py-4 dark:border-neutral-400'
          >
            <Link
              to={`/reservation-detail/${product.roomId}/${product.id.slice(-13)}`}
              className='flex w-full cursor-pointer gap-3'
            >
              <div className='shrink-0'>
                <img
                  className='block h-20 w-20 rounded-[10px] object-cover'
                  src={image}
                  alt=''
                />
              </div>
              <div className='flex grow flex-col'>
                <div className='mb-0.5 text-left text-sm font-medium dark:text-neutral-50'>
                  {title}
                </div>
                <div className='mb-0.5 flex text-left text-xs text-neutral-500 not-italic dark:text-neutral-300'>
                  {product.room_title}
                </div>
                <div className='flex text-left text-xs text-neutral-500 not-italic dark:text-neutral-300'>
                  {product.checkIn} ~ {product.checkOut}
                </div>
                <div className='mt-auto flex items-center gap-1'>
                  <span className='text-sm font-bold text-violet-600 dark:text-violet-400'>
                    {product.price.toLocaleString()}원
                  </span>
                  <span className='text-xs text-neutral-500 dark:text-neutral-300'>
                    / 1박
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ) : (
          <li
            key={product.id}
            className='relative w-full border-b-1 border-neutral-200 py-4 dark:border-neutral-400'
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
                  <div className='mb-1.5 text-left text-sm font-medium dark:text-neutral-50'>
                    {title}
                  </div>
                  <address className='flex text-left text-[11px] text-neutral-500 not-italic dark:text-neutral-300'>
                    {location}
                  </address>
                  <div className='mt-auto flex items-center gap-1'>
                    <span className='text-sm font-bold text-violet-600 dark:text-violet-400'>
                      {price.toLocaleString()}원
                    </span>
                    <span className='text-xs text-neutral-500 dark:text-neutral-300'>
                      / 1박
                    </span>
                  </div>
                </div>
                <div className='flex flex-col justify-between'>
                  <Rating rate={rating} className='ml-auto' />
                </div>
              </div>
            </Link>
            <Heart className='absolute right-0 bottom-4' hotelId={product.id} />
          </li>
        );
      })}
    </ul>
  );
};

export default VerticalList;
