import { useNavigate } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';

import Heart from './Heart';
import Icon from './Icon';
import Rating from './Rating';
import SkeletonItem from './SkeletonItem';

const HorizontalList = ({ products, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Swiper
        spaceBetween={20}
        slidesPerView={1.8}
        slidesOffsetBefore={20}
        slidesOffsetAfter={20}
        freeMode
        style={{ margin: '-20px', paddingBlock: '20px' }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <SwiperSlide
            key={index}
            className='rounded-[10px] p-3 shadow-[0px_2px_4px_2px_rgba(0,0,0,0.1)] dark:bg-neutral-600'
          >
            <SkeletonItem type='horizon' />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={1.8}
      slidesOffsetBefore={20}
      slidesOffsetAfter={20}
      freeMode
      style={{ margin: '-20px', paddingBlock: '20px' }}
    >
      {products?.map((product, index) => (
        <SwiperSlide
          key={index}
          className='relative rounded-[10px] p-3 shadow-[0px_2px_4px_2px_rgba(0,0,0,0.1)] dark:bg-neutral-600'
          onClick={() => navigate(`/details/${encodeURIComponent(product.id)}`)}
        >
          <button type='button' className='w-full'>
            <img
              className='block aspect-video w-full rounded-lg'
              src={product.image[0]}
              alt=''
            />
            <div className='mt-2'>
              <div className='flex items-center'>
                <h2 className='my-1.5 overflow-hidden text-left text-sm text-ellipsis whitespace-nowrap dark:text-neutral-200'>
                  {product.title}
                </h2>
                <div className='ml-auto'>
                  <Rating rate={product.rating} />
                </div>
              </div>
              <address className='flex items-center overflow-hidden text-[11px] text-ellipsis whitespace-nowrap text-neutral-500 not-italic dark:text-neutral-300'>
                <Icon
                  name='location'
                  className='text-neutral-500 dark:text-neutral-300'
                  size={20}
                />
                {product.location[0]}
              </address>
              <div className='mt-1 flex items-end gap-1'>
                <span className='text-sm font-bold text-violet-600 dark:text-violet-500'>
                  {product.rooms[0].price_final
                    ? product.rooms[0].price_final.toLocaleString()
                    : product.rooms[0].price.toLocaleString()}
                  원
                </span>
                <span className='text-xs text-neutral-500 dark:text-neutral-300'>
                  /1박
                </span>
              </div>
            </div>
          </button>
          <Heart className={'absolute top-4 right-4'} hotelId={product.id} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HorizontalList;
