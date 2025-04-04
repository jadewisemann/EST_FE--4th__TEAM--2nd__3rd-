import { useEffect, useState } from 'react';

import useWishlistStore from '../../store/wishlistStore';

import { getHotelById } from '../../firebase/searchQuery';

import Anchor from '../../components/Anchor';
import MetaData from '../../components/MetaData';
import Nav from '../../components/Nav';
import SubHeader from '../../components/SubHeader';
import VerticalList from '../../components/VerticalList';

const WishlistPage = () => {
  const [data, setData] = useState(null);

  const { wishlist } = useWishlistStore();

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const hotelDataArray = await Promise.all(
          wishlist.map(id => getHotelById(id)),
        );

        // wishlist에 있는 id를 통해 호출한 hotel 배열
        setData(hotelDataArray);
      } catch (error) {
        console.error('에러 발생:', error);
      }
    };

    fetchHotel();
  }, [wishlist]);

  if (wishlist.length > 0 && data === null) {
    return <div>로딩 중</div>;
  }

  return (
    <>
      <MetaData
        title='관심 숙소 | 푹자요'
        description='관심있게 보신 숙소 목록을 확인하세요. 나만의 위시리스트를 만들어 보세요.'
        keywords='위시리스트, 찜한 숙소, 저장 목록'
        ogTitle='관심 숙소 | 푹자요'
        ogDescription='관심있게 보신 숙소 목록을 확인하세요. 나만의 위시리스트를 만들어 보세요.'
        ogImage='/src/assets/img/bg_logo.svg'
      />
      <header>
        <SubHeader leftButton='arrow' title='관심 숙소' zIndex={10} />
        <Nav />
      </header>
      <div className='container'>
        <section>
          {wishlist.length === 0 ? (
            <div className='flex flex-col items-center gap-4'>
              <p className='mt-6 text-center text-2xl'>찜 목록이 없습니다</p>
              <Anchor
                type={'search-result'}
                className={'flex items-center gap-2'}
              >
                찜하러 가기
              </Anchor>
            </div>
          ) : (
            <VerticalList products={data} />
          )}
        </section>
      </div>
    </>
  );
};

export default WishlistPage;
