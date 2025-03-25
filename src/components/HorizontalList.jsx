import { useNavigate } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';

import Badge from './Badge';
import Heart from './Heart';
import Icon from './Icon';
import Rating from './Rating';

const HorizontalList = ({ products }) => {
  const navigate = useNavigate();
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
          className='relative rounded-[10px] p-3 shadow-[0px_2px_4px_2px_rgba(0,0,0,0.1)]'
          onClick={() => navigate(`/details/${encodeURIComponent(product.id)}`)}
        >
          <button type='button' className='w-full'>
            <img
              className='block aspect-video w-full rounded-lg'
              src={product.thumbnail}
              alt=''
            />
            <div className='mt-2'>
              <div className='flex items-center'>
                {/* <Badge type='sale'>{product.discount}</Badge> */}
                <h2 className='my-1.5 overflow-hidden text-left text-sm text-ellipsis whitespace-nowrap'>
                  {product.name}
                </h2>
                <div className='ml-auto'>
                  <Rating rate={product.rate} />
                </div>
              </div>
              <address className='flex items-center overflow-hidden text-[11px] text-ellipsis whitespace-nowrap text-neutral-500 not-italic'>
                <Icon name='location' className='text-neutral-500' size={20} />
                {product.location}
              </address>
              <div className='mt-1 flex items-end gap-1'>
                <span className='text-sm font-bold text-violet-600'>
                  {product.price.toLocaleString()}원
                </span>
                <span className='text-xs text-neutral-500'>/1박</span>
              </div>
            </div>
          </button>
          <div className='absolute top-4 right-4'>
            <Heart hotelId={product.id} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HorizontalList;
