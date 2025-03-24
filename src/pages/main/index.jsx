import { useEffect, useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import Button from '../../components/Button';
import HorizontalList from '../../components/HorizontalList';
import Icon from '../../components/Icon';
import Input from '../../components/Input';
import Nav from '../../components/Nav';
import { searchHotelsAdvanced } from '../../firebase/search';
import useAuthStore from '../../store/authStore';
import useDateStore from '../../store/dateStore';
import useSearchStore from '../../store/searchStore';

const MainPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();
  const { date, updateDates } = useDateStore();
  const { setSearchState } = useSearchStore();
  const [recommendedHotels, setRecommendedHotels] = useState([]);
  const [allRecommendedHotels, setAllRecommendedHotels] = useState([]);
  // const [selectedDate, setSelectedDate] = useState('');
  // const [nightCount, setNightCount] = useState('');
  const fromToDate = `${date.startDate} ~ ${date.endDate}`;
  const totalNights = `${date.duration}박`;

  const weekday = ['일', '월', '화', '수', '목', '금', '토'];
  const [selectedTotalGuests, setSelectedTotalGuests] =
    useState('객실 1개 성인1명 아동 0명');

  const navigate = useNavigate();

  //몇박인지 계산
  // const getNights = (start, end) => {
  //   const diff = new Date(end) - new Date(start);
  //   const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
  //   return `${nights}박`;
  // };
  // const getFormattedDateRange = () => {
  //   const today = new Date();
  //   const tomorrow = new Date();
  //   tomorrow.setDate(today.getDate() + 1);
  //   const formet = date => {
  //     const month = date.getMonth() + 1;
  //     const day = date.getDate();
  //     const dayOfWeek = weekday[date.getDay()];
  //     return `${month}월 ${day}일 (${dayOfWeek})`;
  //   };
  //   // setNightCount(getNights(today, tomorrow));
  //   return `${formet(today)} ~ ${formet(tomorrow)}`;
  // };

  // useEffect(() => {
  //   const dateRange = getFormattedDateRange();
  //   // setSelectedDate(dateRange);
  // });

  //추천호텔 데이터 가져오기
  useEffect(() => {
    const fetchRecommentedHotels = async () => {
      setIsLoading(true);
      try {
        const result = await searchHotelsAdvanced('서울');
        setAllRecommendedHotels(result); //추천호텔 데이터 전체저장
        const formattedResult = result.slice(0, 5).map(hotel => ({
          id: hotel.id,
          thumbnail: hotel.rooms?.[0]?.img || hotel.image?.[0] || '',
          discount: hotel.discount || 0, // 할인 정보가 있으면 반영 필요
          rate: hotel._debug?.score || 0,
          name: hotel.title || '이름 없음',
          location: hotel.location?.[0] || '위치 정보 없음',
          price:
            Number(
              typeof hotel.rooms?.[0].price === 'string'
                ? hotel.rooms?.[0]?.price?.replace(/,/g, '')
                : hotel.rooms?.[0]?.price,
            ) || 0,
        }));
        setRecommendedHotels(formattedResult);
      } catch (error) {
        console.error('추천 호텔 가져오기 실패:', error);
      }
      setIsLoading(false);
    };
    fetchRecommentedHotels();
  }, []);

  //추천호텔 전체보기 버튼
  const recommendedHotelviewMore = () => {
    const hotelIds = allRecommendedHotels.map(hotel => hotel.id);
    setSearchState({
      hotelIds,
      name: '추천호텔',
      fromToDate: fromToDate,
      totalNights: totalNights,
      numOfPeople: selectedTotalGuests,
    });
    navigate('/result');
  };

  //검색 데이터 가져오기
  const handleSearch = async e => {
    e.preventDefault();
    if (!searchText.trim()) return; // 빈 검색어 방지
    setIsLoading(true);
    try {
      const result = await searchHotelsAdvanced(searchText);
      // console.log('검색 결과:', result);
      const hotelIds = result.map(hotel => hotel.id);
      setSearchState({
        hotelIds,
        name: searchText,
        // selectedCategory: categoryLabel,
        fromToDate: fromToDate,
        totalNights: totalNights,
        numOfPeople: selectedTotalGuests,
      });
      navigate('/result');
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
    }
    setIsLoading(false);
  };

  // 카테고리별 검색 실행 함수
  const navigateToCategory = async categoryLabel => {
    if (!categoryLabel) return;
    setIsLoading(true);

    try {
      // Firebase에서 사용할 검색 키워드 리스트
      let searchKeywords = [];

      if (categoryLabel === '호텔/리조트') {
        searchKeywords = ['호텔', '리조트'];
      } else if (categoryLabel === '펜션/풀빌라') {
        searchKeywords = ['펜션', '풀빌라'];
      } else if (categoryLabel === '모텔') {
        searchKeywords = ['모텔'];
      } else if (categoryLabel === '해외숙소') {
        searchKeywords = ['해외'];
      }

      let combinedResults = [];

      // 각 키워드별 개별 검색 후 결과 합침
      for (let keyword of searchKeywords) {
        const result = await searchHotelsAdvanced(keyword);
        combinedResults = [...combinedResults, ...result];
      }

      // 중복 제거 (id 기준)
      const uniqueResults = Array.from(
        new Map(combinedResults.map(hotel => [hotel.id, hotel])).values(),
      );

      console.log(`${categoryLabel} 검색 결과:`, uniqueResults);

      //  결과 페이지 이동
      setSearchState({
        hotelIds: uniqueResults.map(hotel => hotel.id),
        name: searchText,
        // selectedCategory: categoryLabel,
        fromToDate: fromToDate,
        totalNights: totalNights,
        numOfPeople: selectedTotalGuests,
      });
      navigate('/result');
    } catch (error) {
      console.error('🔥 카테고리 이동 중 오류 발생:', error);
    }

    setIsLoading(false);
  };

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

  return (
    <>
      <div className='flex h-screen flex-col justify-between bg-[url(https://content.skyscnr.com/m/6181bf94ffc99b59/original/Lotte-Hotel-Jeju.jpg?resize=1000px:1000px&quality=100)]'>
        <div className='flex flex-col px-5 pt-16 pb-10'>
          <div className='flex flex-col items-center text-xl text-white'>
            <Link to={user ? '/profile' : '/login'}>
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
          <form action='' method='get'>
            <div className='flex flex-col gap-3'>
              <Input
                inputType='search'
                label='search'
                value={searchText}
                onChange={setSearchText}
                placeholder={'숙박명 검색'}
              />
              <Button
                color='line'
                size='full'
                className='flex h-[58px] cursor-pointer items-center gap-2.5 rounded-4xl border-2 border-neutral-300 px-5 text-neutral-400'
                childrenClassName='grow-0 gap-3'
                onClick={() => {}}
              >
                <Icon name='calendar' />
                {fromToDate}
              </Button>
              <Button
                color='line'
                size='full'
                className='flex h-[58px] cursor-pointer items-center gap-2.5 rounded-4xl border-2 border-neutral-300 px-5 text-neutral-400'
                childrenClassName='grow-0 gap-3'
                onClick={() => {}}
              >
                <Icon name='user' />
                {selectedTotalGuests}
              </Button>
            </div>
            <Button
              color='prime'
              size='full'
              className='mt-5 rounded-2xl'
              onClick={handleSearch}
              type='submit'
            >
              {isLoading ? '검색 중' : `확인 (${totalNights})`}
            </Button>
          </form>
        </div>

        <div className='rounded-t-md bg-white p-5 pb-[80px]'>
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
                <span className='text-sm'>{item.label}</span>
              </button>
            ))}
          </div>
          <div className='mt-7 mb-4 flex items-center justify-between'>
            <h4 className='text-base font-bold'>추천호텔</h4>
            <button
              className='cursor-pointer text-sm text-violet-600'
              onClick={recommendedHotelviewMore}
            >
              전체보기
            </button>
          </div>
          {/* <HorizontalList products={recommendedHotels.map(hotel => hotel.id)} /> */}
          <HorizontalList products={recommendedHotels} />
        </div>
      </div>
      <Nav />
    </>
  );
};

export default MainPage;
