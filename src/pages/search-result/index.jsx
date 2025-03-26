import { useState, useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import useAppDataStore from '../../store/appDataStore';
import useModalStore from '../../store/modalStore';
import useSearchStore from '../../store/searchStore';

import { getHotelById, searchHotelsAdvanced } from '../../firebase/search';

import Button from '../../components/Button';
import Icon from '../../components/Icon';
import FilterModal from '../../components/modal/FilterModal';
import SearchModal from '../../components/modal/SearchModal';
import Nav from '../../components/Nav';
import Tab from '../../components/Tab';
import VerticalList from '../../components/VerticalList';

const StayListpage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotelIds, name, selectedCategory, numOfPeople, setSearchState } =
    useSearchStore();
  const [isLoading, setIsLoading] = useState(false);
  //모달 관련
  const { dates, guests } = useAppDataStore(); //  전역 날짜 & 스크롤 위치
  const { openSearchModal } = useModalStore();
  //탭 관련
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
  // 숙소 fetch 데이터관련
  const [hotelList, setHotelList] = useState([]); // 컨텐츠뷰관련
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [initialView] = useState(7);
  const [incrementView] = useState(7);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  //필터관련
  const [selectedFilter, setSelectedFilter] = useState('정렬');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([
    '정렬',
    '정렬',
    '정렬',
    '정렬',
    '정렬',
  ]);

  // 필터 모달에서 확인 버튼을 눌렀을 때 실행되는 함수
  const handleFilterConfirm = value => {
    setSelectedFilters(prev => {
      const newFilters = [...prev];
      newFilters[activeTab] = value;
      return newFilters;
    });
    setSelectedFilter(value); // 현재 화면에 표시할 정렬 기준도 업데이트
    setIsFilterOpen(false);
  };

  //navigate에서 받아온 state가 있으면 전역상태로 저장main, nav 등에서 넘김
  useEffect(() => {
    setSelectedFilter(selectedFilters[activeTab]);
  }, [activeTab, selectedFilters]);

  // 페이지 진입 시(location.state가 있을 경우) 메인에서 넘겨준 검색 조건을 전역 상태에 저장
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
  useEffect(() => {
    if (!hotelList || hotelList.length === 0) return;

    let sorted = [...hotelList];
    if (selectedFilter === '낮은 요금순') {
      sorted.sort((a, b) => a.rooms?.[0]?.price - b.rooms?.[0]?.price);
    } else if (selectedFilter === '높은 요금순') {
      sorted.sort((a, b) => b.rooms?.[0]?.price - a.rooms?.[0]?.price);
    } else if (selectedFilter === '평점순') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    setVisibleProducts(sorted.slice(0, initialView));
  }, [selectedFilter, hotelList, initialView]);

  // 숙소 리스트 초기 데이터 로딩 함수
  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      let result = [];
      let last = null;
      // 전체 탭일 경우
      if (activeTab === 0) {
        // 메인에서 전달된 호텔 ID들이 있다면 해당 ID들로 숙소 조회
        if (hotelIds.length > 0) {
          result = await Promise.all(hotelIds.map(id => getHotelById(id)));
          result = result.filter(Boolean);
        } else {
          // ID가 없으면 기본 검색 키워드로 숙소 조회
          const searchResult = await searchHotelsAdvanced(searchKeyword);
          result = searchResult || [];
        }
        setHasMore(false);
      } else {
        // 카테고리 탭일 경우
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
      setHotelList(result); // 전체 결과 저장
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
              {headerInfo.fromToDate}&nbsp;({headerInfo.totalNights}) 성인{' '}
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
        setIsFilterOpen={setIsFilterOpen}
        selectedFilter={selectedFilter}
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
      <FilterModal
        isOpen={isFilterOpen}
        title='정렬 기준'
        onClose={() => setIsFilterOpen(false)}
        onConfirm={handleFilterConfirm}
        selected={selectedFilter}
      />
    </>
  );
};

export default StayListpage;
