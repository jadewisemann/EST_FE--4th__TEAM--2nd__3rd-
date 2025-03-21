import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from 'react';

// component
import SubHeader from '../../components/SubHeader';
import Icon from '../../components/Icon';
import Nav from '../../components/Nav';
import DetailSection from '../../components/DetailSection';
import DetailProduct from '../../components/DetailProduct';
import Button from '../../components/Button';

// data
import { getHotelById, searchHotelsAdvanced } from '../../firebase/search';

import { useParams } from 'react-router-dom';

import ShareBtn from './components/ShareBtn';

const DetailsPage = () => {
  const [data, setData] = useState(null);
  const [visibleRooms, setVisibleRooms] = useState(2);

  // 호텔 ID
  const { hotelId } = useParams();
  const decodedHotelId = decodeURIComponent(hotelId);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const test = await searchHotelsAdvanced('test');
        console.log(test);

        const hotelData = await getHotelById(`${decodedHotelId}`);

        if (hotelData) {
          console.log('호텔 정보:', hotelData);
          setData(hotelData);
        } else {
          console.log('해당 ID의 호텔이 존재하지 않습니다.');
        }
      } catch (error) {
        console.error('에러 발생:', error);
      }
    };

    fetchHotel();

    if (data) {
      setVisibleRooms(Math.min(2, data.rooms.length));
    }
  }, []);

  if (!data) {
    return <div>로딩 중</div>;
  }

  const userData = {
    checkIn: '3/4',
    checkOut: '3/5',
    visitor: {
      adult: 2,
      children: 0,
    },
  };

  // 더보기 버튼 클릭 시 room 더 보여주기
  const moreRoom = () => {
    const remainingRooms = data.rooms.length - visibleRooms;

    if (remainingRooms > 2) {
      // 남아있는 room의 갯수가 2보다 크면 현재 보여주고 있는 room의 갯수에 2를 더해서 보여줌
      setVisibleRooms(visibleRooms + 2);
    } else {
      // 남아있는 room의 갯수가 2이하면 다 보여줌
      setVisibleRooms(visibleRooms + remainingRooms);
    }
  };

  // 남아있는 방 개수
  const remainingRooms = data.rooms.length - visibleRooms;

  const openMap = () => {
    const query = encodeURIComponent(data.location[0]);
    // 카카오 맵
    window.open(`https://map.kakao.com/link/search/${query}`, '_blank');
  };

  return (
    <>
      <SubHeader leftButton='arrow' title={data.title} hasShadow={false} />
      <div className='container'>
        <Swiper
          modules={[Pagination]}
          slidesPerView={1}
          freeMode
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          speed={500}
          style={{ marginInline: '-20px' }}
        >
          {data.image.map((slide, index) => (
            <SwiperSlide key={index}>
              <img className='block w-full' src={slide} alt='' />
            </SwiperSlide>
          ))}
          <div className='absolute top-3 right-3 z-1 cursor-pointer'>
            <ShareBtn product={data} />
          </div>
        </Swiper>

        <div className='mt-5'>
          <h2 className='flex flex-col gap-1 font-medium tracking-tight'>
            <span className='text-xl'>{data.title}</span>
          </h2>
          <div className='mt-2 flex items-center justify-between'>
            {/* <ReviewRating rate={data.hotelStar} /> */}
            {/* <Rating rate={data.rate} /> */}
          </div>
          <button
            type='button'
            className='flex items-center gap-1 text-xs text-neutral-400'
            onClick={openMap}
          >
            <Icon name='location' size={16} className='text-neutral-600' />
            {data.location[0]}
          </button>
        </div>

        <hr className='my-4 border-gray-200' />

        <ul className='grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 [&>li]:flex [&>li]:items-center [&>li]:gap-2 [&>li]:text-xs'>
          {data.facility.map((item, index) => (
            <li key={index}>
              <i
                style={{
                  background: `url(${item.image}) no-repeat center/contain`,
                }}
                className='aspect-square w-4'
              ></i>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
        <hr className='my-4 border-gray-200' />

        <h3 className='text-lg font-bold'>객실선택</h3>
        <div className='my-2 flex justify-between'>
          <div className='flex flex-col gap-1'>
            <span className='text-xs text-neutral-600'>체크인 & 체크아웃</span>
            <span className='text-lg font-bold'>
              {userData.checkIn} ~ {userData.checkOut}(1박)
            </span>
          </div>
          <div className='flex flex-col gap-1'>
            <span className='text-xs text-neutral-600'>객실 & 투숙객</span>
            <ul className='flex gap-1 text-lg font-bold [&>li]:flex [&>li]:items-center [&>li]:gap-1'>
              <li>
                <Icon name='user' size={16} color='black' />
                {userData.visitor.adult}
              </li>
              <li>
                <Icon name='children' size={16} color='black' />
                {userData.visitor.children}
              </li>
            </ul>
          </div>
        </div>

        <DetailProduct detailProducts={data.rooms.slice(0, visibleRooms)} />

        {remainingRooms > 0 && (
          <Button
            color='invert'
            size='full'
            childrenClassName='flex items-center justify-center gap-1'
            onClick={moreRoom}
          >
            더보기 ({remainingRooms}개)
            <Icon name='arrow_down' size={20} />
          </Button>
        )}

        <hr className='my-4 border-gray-200' />

        <DetailSection
          type='list-left-dot-title'
          title='숙소 규정'
          color='text-neutral-600'
          size='text-xs'
          weight='font-normal'
          contents={[
            {
              subTitle: '체크인 & 체크아웃 시간',
              subContents: [
                '체크인은 오후 3시 이후입니다.',
                '체크아웃은 오전 11시 이전입니다.',
              ],
            },
            {
              subTitle: '어린이 정책',
              subContents: [
                '어린이 투숙객은 일부 객실에만 가능합니다.',
                '기존 침대를 사용하면 추가 요금이 부과될 수 있습니다.',
              ],
            },
          ]}
        />
        <hr className='my-4 border-gray-200' />

        <DetailSection
          type='list-left'
          title='판매자 정보'
          color='text-neutral-600'
          size='text-xs'
          weight='font-normal'
          contents={[
            '연락처 : 010-1234-5678',
            `주소 : ${data.location[0]}`,
            '고객센터 : 080 - 2465 - 6585',
          ]}
        />
        <Nav />
      </div>
    </>
  );
};

export default DetailsPage;
