import { useState, useEffect } from 'react';

import Icon from './Icon';

const Heart = ({ roomId, className }) => {
  const [isChecked, setIsChecked] = useState(false);

  // 처음에 로컬 스토리지에서 값 가져오기
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setIsChecked(storedWishlist.includes(roomId));
  }, [roomId]);

  //핸들러
  const heartHandler = event => {
    // 버블링 방지
    event.stopPropagation();

    //기본값 배열로
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    let updatedliked;

    // room아이디가 로컬에 있는지 확인
    if (storedWishlist.includes(roomId)) {
      // 있으면 삭제
      updatedliked = storedWishlist.filter(id => id !== roomId);
    } else {
      // 아니면 추가
      updatedliked = [...storedWishlist, roomId];
    }

    // 로컬 스토리지 업데이트
    if (updatedliked.length > 0) {
      localStorage.setItem('wishlist', JSON.stringify(updatedliked));
    } else {
      localStorage.removeItem('wishlist');
    }

    // 체크상태
    setIsChecked(updatedliked.includes(roomId));
  };

  return (
    <button
      onClick={heartHandler}
      className={`rounded-4xl border-1 border-neutral-300 bg-white p-1.5 ${className}`}
    >
      <Icon
        name={isChecked ? 'heart_fill' : 'heart'}
        color='#FF41BC'
        size={20}
      />
    </button>
  );
};

export default Heart;

// 사용법
// <heart roomId={product.id} className={테일윈드css}/>
// roomId로 숙소 id 넘겨주시면 됩니다.
