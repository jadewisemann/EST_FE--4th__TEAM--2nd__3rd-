import { Swiper, SwiperSlide } from 'swiper/react';
import Heart from '../components/Heart';
import Rating from '../components/Rating';
import Icon from '../components/Icon';
import Badge from './badge';

import 'swiper/css';

const HorizontalList = ({ products }) => (
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
      >
        <button type='button' className='w-full'>
          <img className='block w-full' src={product.thumbnail} alt='' />
          <div className='mt-2'>
            <div className='flex'>
              <Badge type='sale'>{product.discount}</Badge>
              <div className='ml-auto'>
                <Rating rate={product.rate} />
              </div>
            </div>
            <h2 className='my-1.5 text-left text-sm'>{product.name}</h2>
            <address className='flex items-center text-[11px] text-neutral-500 not-italic'>
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
        <div className='absolute top-0.5 right-2'>
          <Heart />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
);

export default HorizontalList;
