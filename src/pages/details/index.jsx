import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState } from 'react';

// component
import SubHeader from '../../components/SubHeader';

// temp
import tempHotel1 from './../../assets/temp/temp_hotel1.jpg';
import Rating from '../../components/Rating';
import Icon from '../../components/Icon';
import Nav from '../../components/Nav';
import ReviewRating from '../../components/ReviewRating';
import DetailSection from '../../components/DetailSection';
import DetailProduct from '../../components/DetailProduct';
import Button from '../../components/Button';

const DetailsPage = () => {
  const data = {
    slides: [tempHotel1, tempHotel1, tempHotel1, tempHotel1, tempHotel1],
    title: '리츠칼튼 호텔',
    engTitle: 'Ritz-Carlton Hotel',
    hotelStar: 5,
    rate: 4.5,
    location: '서울시 송파구',
    reviewAmount: 2888,
    price: 120000,
    options: { wifi: true, fitness: true, dining: true, swimmingPool: true },
    room: [
      {
        thumbnail: tempHotel1,
        name: '스탠다드 트윈룸 (조식 포함)',
        bed: '싱글 침대 2개',
        price: 120000,
        info: {
          max: 2,
          checkInHour: '15:00',
          checkOutHour: '11:00',
          noRefund: true,
          addPerson: false,
          smoke: false,
          wifi: true,
        },
        specialOffer: true,
      },
      {
        thumbnail: tempHotel1,
        name: '스탠다드 트윈룸 (조식 포함)',
        bed: '킹사이즈 침대',
        price: 100000,
        info: {
          max: 2,
          checkInHour: '15:00',
          checkOutHour: '11:00',
          noRefund: false,
          addPerson: false,
          smoke: true,
          wifi: true,
        },
        specialOffer: false,
      },
      {
        thumbnail: tempHotel1,
        name: '스탠다드 트윈룸 (조식 포함)',
        bed: '킹사이즈 침대',
        price: 100000,
        info: {
          max: 2,
          checkInHour: '15:00',
          checkOutHour: '11:00',
          noRefund: false,
          addPerson: false,
          smoke: true,
          wifi: true,
        },
        specialOffer: false,
      },
    ],
  };

  const userData = {
    checkIn: '3/4',
    checkOut: '3/5',
    visitor: {
      adult: 2,
      children: 0,
    },
  };

  const share = () => {};

  const [visibleRooms, setVisibleRooms] = useState(
    // room의 갯수가 3개 이상인 경우도 초기에 2개만을 보여주기 위한 초기값 설정
    Math.min(2, data.room.length),
  );

  // 더보기 버튼 클릭 시 room 더 보여주기
  const moreRoom = () => {
    const remainingRooms = data.room.length - visibleRooms;

    if (remainingRooms > 2) {
      // 남아있는 room의 갯수가 2보다 크면 현재 보여주고 있는 room의 갯수에 2를 더해서 보여줌
      setVisibleRooms(visibleRooms + 2);
    } else {
      // 남아있는 room의 갯수가 2이하면 다 보여줌
      setVisibleRooms(visibleRooms + remainingRooms);
    }
  };

  // 남아있는 방 개수
  const remainingRooms = data.room.length - visibleRooms;

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
          style={{ marginInline: '-20px', marginTop: '-20px' }}
        >
          {data.slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <img className='block w-full' src={slide} alt='' />
            </SwiperSlide>
          ))}
          <button
            type='button'
            className='absolute top-3 right-3 z-1 cursor-pointer'
            onClick={share}
          >
            <Icon name='share' color='white' size={30} />
          </button>
        </Swiper>

        <div className='mt-5'>
          <h2 className='flex flex-col gap-1 font-medium'>
            <span className='text-xl'>{data.title}</span>
            <span className='text-sm'>({data.engTitle})</span>
          </h2>
          <div className='mt-2 flex items-center justify-between'>
            <ReviewRating rate={data.hotelStar} />
            <Rating rate={data.rate} />
          </div>
          <div className='mt-2 flex items-center justify-between [&>span]:text-sm [&>span]:text-neutral-400'>
            <span>{data.location}</span>
            <span>이용후기 {data.reviewAmount.toLocaleString()}건</span>
          </div>
        </div>

        <hr className='my-4 border-gray-200' />

        <ul className='grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 [&>li]:flex [&>li]:items-center [&>li]:gap-2 [&>li]:text-xs'>
          {data.options.wifi && (
            <li>
              <Icon name='wifi' className='text-neutral-600' size={16} />
              <span>객실 내 WiFi</span>
            </li>
          )}
          {data.options.fitness && (
            <li>
              <Icon name='fitness' className='text-neutral-600' size={16} />
              <span>피트니스센터</span>
            </li>
          )}
          {data.options.dining && (
            <li>
              <Icon name='dining' className='text-neutral-600' size={16} />
              <span>조식, 석식</span>
            </li>
          )}
          {data.options.swimmingPool && (
            <li>
              <Icon
                name='swimmingPool'
                className='text-neutral-600'
                size={16}
              />
              <span>수영장</span>
            </li>
          )}
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

        <DetailProduct detailProducts={data.room.slice(0, visibleRooms)} />

        {remainingRooms > 0 && (
          <Button
            color='invert'
            size='full'
            className='flex items-center justify-center gap-1'
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
          contents={[
            '연락처 : 010-1234-5678',
            '주소 : 서울시 강남구 어쩌구 저쩌구',
            '고객센터 : 080 - 1234- 5678',
          ]}
        />
        <Nav />
      </div>
    </>
  );
};

export default DetailsPage;
