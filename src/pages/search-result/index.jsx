import { useState, useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import useAppDataStore from '../../store/appDataStore';
import useModalStore from '../../store/modalStore';
import useSearchStore from '../../store/searchStore';

import { getHotelById, searchHotelsAdvanced } from '../../firebase/search';

import Button from '../../components/Button';
import Icon from '../../components/Icon';
import SearchModal from '../../components/modal/SearchModal';
import Nav from '../../components/Nav';
import Tab from '../../components/Tab';
import VerticalList from '../../components/VerticalList';

const StayListpage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotelIds, name, selectedCategory, numOfPeople, setSearchState } =
    useSearchStore();
  //모달
  const { dates, guests } = useAppDataStore(); //  전역 날짜 & 스크롤 위치
  const { openSearchModal } = useModalStore();
  const [isLoading, setIsLoading] = useState(false);
  //탭
  const [activeTab, setActiveTab] = useState(0);
  const categories = ['전체', '모텔', '호텔/리조트', '팬션/풀빌라', '해외숙소'];
  //날짜가공
  const fromToDate = `${dates.startDate} ~ ${dates.endDate}`;
  const totalNights = `${dates.duration}박`;
  //헤더정보
  const [headerInfo, setHeaderInfo] = useState({
    name: '',
    fromToDate: '',
    totalNights: '1박',
    numOfAdults: 1,
  });
  // 숙소 fetch데이터관련
  const [hotelList, setHotelList] = useState([]);
  // 컨텐츠뷰관련
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [initialView] = useState(7);
  const [incrementView] = useState(7);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  //navigate에서 받아온 state가 있으면 전역상태로 저장main, nav 등에서 넘김
  useEffect(() => {
    if (location.state) {
      setSearchState(location.state);
    }
  }, [location.state, setSearchState]);

  // activeTab, name, selectedCategory, 호텔 갯수 등을 기반으로 헤더 정보(nameText 등) 설정
  const fallbackSearch = '서울'; // 예비값 설정
  const searchKeyword = name || selectedCategory || fallbackSearch;
  useEffect(() => {
    // 현재 탭과 조건에 따라 헤더에 보여 줄 텍스트 생성
    const hotelCount = hotelIds.length;
    let nameText = '';
    if (activeTab === 0) {
      nameText =
        selectedCategory ||
        name ||
        (hotelCount > 0 ? `총 ${hotelCount}개의 숙소` : fallbackSearch);
    } else {
      nameText = categories[activeTab];
    }
    setHeaderInfo({
      name: nameText,
      fromToDate,
      totalNights,
      numOfAdults: guests.adults || 1,
    });
  }, [
    hotelIds,
    name,
    selectedCategory,
    fromToDate,
    totalNights,
    numOfPeople,
    activeTab,
    dates,
    guests,
  ]);

  // activeTab 변경 시 해당 카테고리 숙소 데이터 초기 로드
  useEffect(() => {
    fetchInitialData();
  }, [activeTab]);

  // activeTab에 따라 초기 숙소 데이터를 로드 (카테고리/추천/기본 검색)
  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      let result = [];
      let last = null;
      if (activeTab === 0) {
        if (hotelIds.length > 0) {
          result = await Promise.all(hotelIds.map(id => getHotelById(id)));
          result = result.filter(Boolean);
        } else {
          const searchResult = await searchHotelsAdvanced(searchKeyword);
          result = searchResult || [];
        }
        setHasMore(false);
      } else {
        const categoryKeyword = categories[activeTab].replace(
          /[\/\~*\[\]]/g,
          '',
        );
        const res = await searchHotelsAdvanced(
          categoryKeyword,
          null,
          20,
          20,
          null,
          true,
        );
        result = res.hotels;
        last = res.lastDoc;
        setHasMore(Boolean(last));
      }
      setHotelList(result);
      setVisibleProducts(result.slice(0, initialView));
      setLastDoc(last);
    } catch (err) {
      console.error('데이터 로드 실패: ', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 더보기 데이터 불러오기
  const handleViewMore = async () => {
    // 기존에 받아온 전체 데이터(hotelList)에서 아직 보여주지 않은 숙소가 있다면
    // 그 일부(nextItems)를 잘라서 추가로 보여줌
    if (visibleProducts.length < hotelList.length) {
      const nextItems = hotelList.slice(
        visibleProducts.length,
        visibleProducts.length + incrementView,
      );
      setVisibleProducts(prev => [...prev, ...nextItems]);
    } else if (hasMore && activeTab !== 0) {
      //서버에 더 있는 경우, 새로 불러오기
      setIsLoading(true);
      try {
        const categoryKeyword = categories[activeTab].replace(
          /[\/\~*\[\]]/g,
          '',
        );
        const res = await searchHotelsAdvanced(
          categoryKeyword,
          null,
          20,
          20,
          lastDoc,
          true,
        );
        const newHotels = res.hotels;
        const newLastDoc = res.lastDoc;

        setHotelList(prev => [...prev, ...newHotels]);
        setVisibleProducts(prev => [
          ...prev,
          ...newHotels.slice(0, incrementView),
        ]);
        setLastDoc(newLastDoc);
        setHasMore(Boolean(newLastDoc));
      } catch (error) {
        console.error('더보기 실패: ', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 숙소 클릭 시 해당 ID를 포함해 상세 페이지로 이동
  const handleItemClick = hotel => {
    navigate(`/detail/${encodeURIComponent(hotel.id)}`);
  };

  return (
    <>
      <div className='fixed top-0 left-0 z-10 w-full bg-white px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.1)]'>
        <button
          className='flex w-full cursor-pointer items-center rounded-full border-1 border-neutral-300 px-4 py-1'
          onClick={openSearchModal}
        >
          <Icon className='mr-3 text-violet-600' name='search' />
          <div className='flex flex-1 flex-col items-start'>
            <strong className='text-sm'>{headerInfo.name}</strong>
            <span className='text-xs'>
              {headerInfo.fromToDate}&nbsp;({headerInfo.totalNights}
              )&nbsp;성인&nbsp;
              {headerInfo.numOfAdults}명
              {(guests.children >= 1 || guests.infants >= 1) && '...'}
            </span>
          </div>
          <Icon className='text-neutral-600' name='close' />
        </button>
      </div>

      <div className='h-16.5'></div>

      <Tab
        categories={categories}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        <VerticalList
          products={visibleProducts}
          onItemClick={handleItemClick}
        />

        {(visibleProducts.length < hotelList.length || hasMore) && (
          <Button
            size='full'
            color='invert'
            className='boder-violet-600 mt-4 rounded-xl border-2'
            onClick={handleViewMore}
            disabled={isLoading}
          >
            {isLoading
              ? '불러오는 중...'
              : `더보기 (${Math.max(hotelList.length - visibleProducts.length, 0) + (hasMore ? +20 : '')}) 개`}
          </Button>
        )}
      </Tab>

      <Nav />
      <SearchModal />
    </>
  );
};

export default StayListpage;
