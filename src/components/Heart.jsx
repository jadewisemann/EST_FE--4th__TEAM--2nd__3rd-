import { useState, useEffect } from 'react';

import useWishlistStore from '../store/wishlistStore';

import Icon from './Icon';

const Heart = ({ hotelId, className }) => {
  const { addToWishlist, isInWishlist, removeFromWishlist } =
    useWishlistStore();

  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(isInWishlist(hotelId));
  }, [hotelId, isInWishlist]);

  const heartHandler = event => {
    event.stopPropagation();
    isChecked ? removeFromWishlist(hotelId) : addToWishlist(hotelId);
    setIsChecked(!isChecked);
  };

  return (
    <button
      type='button'
      onClick={heartHandler}
      className={`cursor-pointer rounded-4xl border-1 border-neutral-300 bg-white p-1.5 dark:border-neutral-400 dark:bg-neutral-800 ${className}`}
    >
      <Icon
        name={isChecked ? 'heart_fill' : 'heart'}
        color='#FF41BC'
        size={20}
      />
      <span className='sr-only'>찜하기</span>
    </button>
  );
};

export default Heart;

// 사용법
// <heart hotelId={product.id} className={테일윈드css}/>
// roomId로 숙소 id 넘겨주시면 됩니다.
