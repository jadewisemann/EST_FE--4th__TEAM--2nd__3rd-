import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

// swiper
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// store
import useAppDataStore from '../../store/appDataStore';

// pageComponent
import DetailProduct from './components/DetailProduct';
import ShareBtn from './components/ShareBtn';

// data
import { getHotelById } from '../../firebase/searchQuery';

// component
import Button from '../../components/Button';
import DetailSection from '../../components/DetailSection';
import Icon from '../../components/Icon';
import Loading from '../../components/Loading';
import Rating from '../../components/Rating';
import SubHeader from '../../components/SubHeader';

const DetailsPage = () => {
  // params
  const { hotelId } = useParams(); // 호텔 ID

  // state
  const [data, setData] = useState(null); // page 사용 데이터(호텔 데이터)
  const [visibleRooms, setVisibleRooms] = useState(2); // 보여질 방의 갯수(초기 값 2)

  // 사용자 정보
  const { dates, guests } = useAppDataStore();

  // useEffect
  // 페이지 로딩 직후 실행
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        // hotel정보 담기
        const hotelData = await getHotelById(hotelId);

        if (hotelData) {
          // 페이지 사용 data에 hotel 정보 담기
          setData(hotelData);
        }
      } catch (error) {
        console.error('에러 발생:', error);
      }
    };

    fetchHotel();

    // data가 있는경우 room의 길이가 1개인 경우 처리
    if (data) {
      setVisibleRooms(Math.min(2, data.rooms.length));
    }
  }, []);

  // 데이터 로딩 처리
  if (!data) {
    return <Loading />;
  }

  // event
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

  return (
    <>
      <header>
        <SubHeader
          leftButton='arrow'
          title={data.title}
          hasShadow={false}
          zIndex={10}
        />
      </header>
      <div className='container pb-10!'>
        <section>
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
            style={{ marginInline: '-1.25rem' }}
          >
            {data.image.map((slide, index) => (
              <SwiperSlide key={index}>
                <img
                  className='block w-full'
                  src={slide}
                  alt={data.title + (index + 1)}
                />
              </SwiperSlide>
            ))}
            <div className='absolute top-3 right-3 z-1 cursor-pointer'>
              <ShareBtn product={data} />
            </div>
          </Swiper>
        </section>

        <section>
          <div className='mt-5'>
            <div className='mb-2 flex items-center justify-between'>
              <h3 className='flex flex-col gap-1 text-xl font-medium tracking-tight'>
                {data.title}
              </h3>
              <Rating rate={data.rating} />
            </div>
            <a
              href={
                'https://map.kakao.com/link/search/'
                + encodeURIComponent(data.location[0])
              }
              target='_blank'
              className='flex cursor-pointer items-center gap-1 text-xs text-neutral-500 dark:text-neutral-300'
              title={data.title + ' 카카오맵 열기'}
            >
              <Icon
                name='location'
                size={16}
                className='text-neutral-600 dark:text-neutral-300'
              />
              {data.location[0]}
            </a>
          </div>

          <hr className='my-4 border-gray-200' />

          <h4 className='sr-only'>호텔 시설 및 부가 서비스</h4>
          <ul className='grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 [&>li]:flex [&>li]:items-center [&>li]:gap-2 [&>li]:text-xs'>
            {data.facility.map((item, index) => (
              <li key={index}>
                <i
                  style={{
                    background: `url(${item.image}) no-repeat center/contain`,
                  }}
                  className='aspect-square w-4 dark:brightness-114 dark:contrast-94 dark:hue-rotate-210 dark:invert dark:saturate-4096 dark:sepia-1'
                ></i>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          <hr className='my-4 border-gray-200' />

          <h4 className='text-lg font-bold'>객실선택</h4>
          <div className='my-2 flex justify-between'>
            <div className='flex flex-col gap-1'>
              <span className='text-xs text-neutral-600 dark:text-neutral-400'>
                체크인 & 체크아웃
              </span>
              <span className='text-lg font-bold'>
                <span>{dates.startDate} ~ </span>
                <span className='whitespace-nowrap'>
                  {dates.endDate} ({dates.duration}박)
                </span>
              </span>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-xs text-neutral-600 dark:text-neutral-400'>
                투숙객
              </span>
              <ul className='flex gap-1 text-lg font-bold [&>li]:flex [&>li]:items-center [&>li]:gap-1'>
                <li>
                  <Icon
                    name='user'
                    size={16}
                    className='text-black dark:text-neutral-300'
                  />
                  {guests.adults}
                </li>
                <li>
                  <Icon
                    name='children'
                    size={16}
                    className='text-black dark:text-neutral-300'
                  />
                  {guests.children}
                </li>
              </ul>
            </div>
          </div>

          <DetailProduct
            detailProducts={data.rooms.slice(0, visibleRooms)}
            rooms={data.rooms}
          />

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
        </section>
        <hr className='my-4 border-gray-200' />

        <section>
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
              `연락처 : ${data.phoneNumber}`,
              `주소 : ${data.location[0]}`,
              '고객센터 : 080 - 2465 - 6585',
            ]}
          />
        </section>
      </div>
    </>
  );
};

export default DetailsPage;
