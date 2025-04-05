import { useEffect, useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import useAppDataStore from '../../store/appDataStore';
import useAuthStore from '../../store/authStore';
import useModalStore from '../../store/modalStore';

import { searchHotelsAdvanced } from '../../firebase/searchQuery';

import Button from '../../components/Button';
import HorizontalList from '../../components/HorizontalList';
import Icon from '../../components/Icon';
import Input from '../../components/Input';
import Loading from '../../components/Loading';
import MetaData from '../../components/MetaData';
import Nav from '../../components/Nav';

const RECOMMENDED_HOTEL_QUERY = '서울';

const CATEGORY_ICONS = [
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
];

const MainPage = () => {
  const { user } = useAuthStore();
  const { dates, guests } = useAppDataStore();
  const { openDateModal, openGuestModal } = useModalStore();

  const [searchText, setSearchText] = useState('');
  const [recommendedHotels, setRecommendedHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(
    sessionStorage.getItem('firstVisit') === null,
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (isFirstVisit) {
      setTimeout(() => {
        setIsFirstVisit(false);
        sessionStorage.setItem('firstVisit', 'false');
      }, 3000);
    }
  }, [isFirstVisit]);

  useEffect(() => {
    (async () => {
      try {
        const result = await searchHotelsAdvanced(RECOMMENDED_HOTEL_QUERY);
        setRecommendedHotels(result.slice(0, 5));
      } catch (error) {
        console.error('추천 호텔 가져오기 실패:', error);
      }
      setIsLoading(false);
    })();
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    if (!searchText.trim()) setSearchText('서울');
    const encoded = encodeURIComponent(searchText);
    navigate(`/search-result?keyword=${encoded}`);
  };

  if (isFirstVisit) return <Loading />;

  return (
    <>
      <MetaData
        title='푹자요 | 최고의 숙박 예약 서비스'
        description='푹자요에서 최고의 숙박 경험을 시작하세요. 전국 호텔, 리조트, 펜션을 한 곳에서!'
        keywords='숙박, 호텔, 예약, 펜션, 리조트, 여행'
        ogTitle='푹자요 - 당신의 완벽한 숙박을 위한 곳'
        ogDescription='푹자요에서 최고의 숙박 경험을 시작하세요. 전국 호텔, 리조트, 펜션을 한 곳에서!'
        ogImage='/src/assets/img/bg_logo.svg'
      />

      <header className='flex h-14 items-center'>
        <h1 className='dark:text-dark px-6 text-2xl text-white'>POOKJAYO</h1>
      </header>

      <div className="-mt-14 bg-[url('/src/assets/img/bg-main-05.png')] bg-no-repeat">
        <div className='px-5 pt-20 pb-10'>
          <div className='flex flex-col items-center text-xl font-bold text-white'>
            <Link to={user ? '/mypage' : '/login'}>
              <span className='underline'>
                {user
                  ? `${user.displayName || user.email?.split('@')[0]}`
                  : '로그인'}
                {''}
              </span>
              님
            </Link>
            환영합니다.
          </div>
          <form onSubmit={handleSearch}>
            <div className='mt-5 flex flex-col gap-3'>
              <Input
                inputType='search'
                value={searchText}
                onChange={setSearchText}
                placeholder={'숙박명 검색'}
                inputClass='placeholder:text-neutral-800'
              />
              <Button
                color='line'
                size='full'
                className='flex h-[58px] cursor-pointer items-center gap-2.5 rounded-4xl border-neutral-300 text-neutral-400 dark:border-neutral-400 dark:bg-neutral-800 dark:text-neutral-300'
                childrenClassName='grow-0 gap-3'
                type='button'
                onClick={openDateModal}
              >
                <Icon name='calendar' />
                {`${dates.startDate} ~ ${dates.endDate}`}
              </Button>
              <Button
                color='line'
                size='full'
                className='flex h-[58px] cursor-pointer items-center gap-2.5 rounded-4xl border-neutral-300 text-neutral-400 dark:border-neutral-400 dark:bg-neutral-800 dark:text-neutral-300'
                childrenClassName='grow-0 gap-3'
                type='button'
                onClick={openGuestModal}
              >
                <Icon name='user' />
                {`객실${guests.rooms}개 성인${guests.adults}명 아동${guests.children}명`}
              </Button>
            </div>
            <Button
              color='prime'
              size='full'
              className='mt-5 rounded-2xl'
              type='submit'
            >
              {`확인 ${dates.duration}박`}
            </Button>
          </form>
        </div>

        <div className='rounded-t-md bg-white p-5 pb-20 dark:bg-neutral-800'>
          <div className='flex justify-evenly'>
            {CATEGORY_ICONS.map((item, idx) => (
              <Link
                to={`/search-result?keyword=${item.label}`}
                key={idx}
                className='flex cursor-pointer flex-col items-center'
              >
                <img className='h-18 object-contain' src={item.src} alt='' />
                <span className='text-sm dark:text-neutral-50'>
                  {item.label}
                </span>
              </Link>
              // </button>
            ))}
          </div>

          <div className='mt-7 mb-4 flex items-center justify-between'>
            <h2 className='text-base font-bold dark:text-neutral-50'>
              추천호텔
            </h2>
            <Link
              className='cursor-pointer text-sm text-violet-600 dark:text-violet-400'
              to={`/search-result?keyword=${RECOMMENDED_HOTEL_QUERY}`}
            >
              전체보기
            </Link>
          </div>
          <HorizontalList products={recommendedHotels} isLoading={isLoading} />
        </div>
      </div>
      <Nav />
    </>
  );
};

export default MainPage;
