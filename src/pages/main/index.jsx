import { useEffect, useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import useAppDataStore from '../../store/appDataStore';
import useAuthStore from '../../store/authStore';
import useDarkModeStore from '../../store/darkModeStore';
import useModalStore from '../../store/modalStore';

import { searchHotelsAdvanced } from '../../firebase/searchQuery';

import Button from '../../components/Button';
import HorizontalList from '../../components/HorizontalList';
import Icon from '../../components/Icon';
import Input from '../../components/Input';
import DateModal from '../../components/modal/DateModal';
import GuestModal from '../../components/modal/GuestModal';
import Nav from '../../components/Nav';

const MainPage = () => {
  const { user } = useAuthStore();
  const { dates, guests } = useAppDataStore();
  const { modals, openDateModal, openGuestModal } = useModalStore();
  const { toggleDarkMode } = useDarkModeStore();

  const [searchText, setSearchText] = useState('');
  const [recommendedHotels, setRecommendedHotels] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState('');

  const navigate = useNavigate();

  const fromToDate = `${dates.startDate} ~ ${dates.endDate}`;
  const totalNights = `${dates.duration}박`;
  const isAnyModalOpen = modals.date.isOpen || modals.guest.isOpen;

  // 백그라운드 이미지
  useEffect(() => {
    const hotelImages = [
      '/src/assets/img/bg-main-01.png',
      '/src/assets/img/bg-main-02.png',
      '/src/assets/img/bg-main-03.png',
      '/src/assets/img/bg-main-04.png',
      '/src/assets/img/bg-main-05.png',
      '/src/assets/img/bg-main-06.png',
      '/src/assets/img/bg-main-07.png',
    ];
    const randomImage =
      hotelImages[Math.floor(Math.random() * hotelImages.length)];
    setBackgroundImage(randomImage);
  }, []);
  //카테고리 필터 아이콘 데이터
  const categories = [
    {
      src: '/src/assets/ico/icon-hotel.png',
      label: '호텔/리조트',
    },
    {
      src: '/src/assets/ico/ico-pension.png',
      label: '펜션/풀빌라',
    },
    {
      src: '/src/assets/ico/icon-motel.png',
      label: '모텔',
    },
    {
      src: '/src/assets/ico/icon-overseas.png',
      label: '해외숙소',
    },
  ];
  // 검색 실행 함수
  const handleSearch = e => {
    e.preventDefault();
    if (!searchText.trim()) return;
    const encoded = encodeURIComponent(searchText);
    navigate(`/result?keyword=${encoded}`);
  };

  // 카테고리 클릭 함수
  const navigateToCategory = categoryLabel => {
    const encoded = encodeURI(categoryLabel);
    navigate(`/result?keyword=${encoded}`);
  };

  //추천호텔 데이터 가져오기
  useEffect(() => {
    const fetchRecommentedHotels = async () => {
      try {
        const result = await searchHotelsAdvanced('서울');
        setRecommendedHotels(result.slice(0, 5));
        // console.log('추천 호텔 5개:', result.slice(0, 5));
      } catch (error) {
        console.error('추천 호텔 가져오기 실패:', error);
      }
    };
    fetchRecommentedHotels();
  }, []);

  //추천호텔 전체보기 버튼
  const recommendedHotelviewMore = () => {
    const keyword = '추천호텔';
    const encoded = encodeURI(keyword);
    navigate(`/result?keyword=${encoded}`);
  };

  return (
    <>
      <button
        type='button'
        className='absolute top-4 right-4 cursor-pointer bg-violet-600 dark:bg-violet-400'
        onClick={() => toggleDarkMode()}
      >
        <strong className='text-white'>다크모드</strong>
      </button>
      <div
        className='bg-no-repeat'
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className='px-5 pt-16 pb-10'>
          <div className='flex flex-col items-center text-xl text-white'>
            <Link to={user ? '/mypage' : '/login'}>
              <strong className='underline'>
                {user
                  ? `${user.displayName || user.email?.split('@')[0]}`
                  : '로그인'}
                {''}
              </strong>
              님
            </Link>
            <strong>환영합니다.</strong>
          </div>
          <form onSubmit={handleSearch}>
            <div className='mt-5 flex flex-col gap-3'>
              <Input
                inputType='search'
                value={searchText}
                onChange={setSearchText}
                placeholder={'숙박명 검색'}
              />
              <Button
                color='line'
                size='full'
                className='flex h-[58px] cursor-pointer items-center gap-2.5 rounded-4xl border-2 border-neutral-300 text-neutral-400 dark:border-neutral-400 dark:bg-neutral-800 dark:text-neutral-300'
                childrenClassName='grow-0 gap-3'
                type='button'
                onClick={openDateModal}
              >
                <Icon name='calendar' />
                {fromToDate}
              </Button>
              <Button
                color='line'
                size='full'
                className='flex h-[58px] cursor-pointer items-center gap-2.5 rounded-4xl border-2 border-neutral-300 text-neutral-400 dark:border-neutral-400 dark:bg-neutral-800 dark:text-neutral-300'
                childrenClassName='grow-0 gap-3'
                type='button'
                onClick={openGuestModal}
              >
                <Icon name='user' />
                {`객실${guests.rooms}개 성인${guests.adults}명 아동${guests.children}명 유아${guests.infants}명`}
              </Button>
            </div>
            <Button
              color='prime'
              size='full'
              className='mt-5 rounded-2xl'
              type='submit'
            >
              {`확인 (${totalNights})`}
            </Button>
          </form>
        </div>

        <div className='rounded-t-md bg-white p-5 pb-[80px] dark:bg-neutral-800'>
          <div className='mt-1 flex items-start justify-between gap-5'>
            {categories.map((item, idx) => (
              <button
                key={idx}
                className='flex flex-1 cursor-pointer flex-col items-center'
                onClick={() => {
                  navigateToCategory(item.label);
                }}
              >
                <img className='h-18 object-contain' src={item.src} alt='' />
                <span className='text-sm dark:text-neutral-50'>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
          <div className='mt-7 mb-4 flex items-center justify-between'>
            <h4 className='text-base font-bold dark:text-neutral-50'></h4>
            추천호텔
            <button
              className='cursor-pointer text-sm text-violet-600 dark:text-violet-400'
              onClick={recommendedHotelviewMore}
            >
              전체보기
            </button>
          </div>
          <HorizontalList products={recommendedHotels} />
        </div>
      </div>
      {!isAnyModalOpen && <Nav />}
      <DateModal />
      <GuestModal />
    </>
  );
};

export default MainPage;
