import { useState, useEffect } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import useAppDataStore from '../../store/appDataStore';
import useModalStore from '../../store/modalStore';

import { searchHotelsAdvanced } from '../../firebase/searchQuery';

import Button from '../../components/Button';
import Icon from '../../components/Icon';
import FilterModal from '../../components/modal/FilterModal';
import SearchModal from '../../components/modal/SearchModal';
import Nav from '../../components/Nav';
import Tab from '../../components/Tab';
import VerticalList from '../../components/VerticalList';

const StayListpage = () => {
  const navigate = useNavigate();
  // 키워드 받기
  const [searchParams] = useSearchParams();
  const keywordFromQuery = searchParams.get('keyword') || '서울';
  // 탭 카테고리 정의
  const categories = ['전체', '호텔/리조트', '펜션/풀빌라', '모텔', '해외숙소'];
  const [activeTab, setActiveTab] = useState(0);
  // 파이어스토어에서 허용되지 않는 문자 제거
  const sanitizeKeyword = keyword => keyword.replace(/[~*/\[\]]/g, '');
  // 데이터 관련
  const [hotelList, setHotelList] = useState([]);
  // 필터 관련
  const [selectedFilter, setSelectedFilter] = useState('정렬');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // 더보기 관련
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // 날짜 모달 관련
  const { dates, guests } = useAppDataStore();
  const { openSearchModal } = useModalStore();
  // 날짜 관련 텍스트
  const fromToDate = `${dates.startDate} ~ ${dates.endDate}`;
  const totalNights = `${dates.duration}박`;
  // 헤더 정보
  const headerInfo = {
    name: activeTab === 0 ? keywordFromQuery : categories[activeTab],
    fromToDate,
    totalNights,
    numOfAdults: guests.adults || 1,
  };
  // 숙소 초기 데이터 로드
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        let result = [];
        if (activeTab === 0) {
          // 검색어를 입력 & 카테고리 버튼 클릭 해서 들어오는 경우,
          // 특수문자 있을 때 각각 검색해서 결과 합치기 (호텔/리조트)
          // 예)'호텔'과 '리조트'를 동시에 검색하고, 그 결과를 하나의 배열로 합침
          const keywords = keywordFromQuery
            .split(',')
            .map(k => sanitizeKeyword(k.trim()));
          const allResults = await Promise.all(
            keywords.map(k => searchHotelsAdvanced(k)),
          );
          const merged = allResults.flat();
          const unique = Array.from(
            new Map(merged.map(h => [h.id, h])).values(),
          ); //중복된 호텔 객체 제거
          result = unique;
          setHasMore(false);
        } else {
          //카테고리버튼 클릭 때 마다 데이터 호출
          const categoryKeyword = sanitizeKeyword(categories[activeTab]);
          const res = await searchHotelsAdvanced(
            categoryKeyword, //검색 키워드
            null, //지역 필터
            20, //최대 검색 수
            20, //한 번에 불러올 페이지 갯수
            null, //마지막으로 받은 문서 기준 이후 데이터 받아오기
            true, //pagination 모드인지
          );
          result = res.hotels;
          setLastDoc(res.lastDoc);
          setHasMore(Boolean(res.lastDoc));
        }
        setHotelList(result);
        setVisibleProducts(result.slice(0, 7));
      } catch (err) {
        console.error('데이터 로드 실패: ', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [activeTab, keywordFromQuery]);
  // 필터 기준 변경 시 정렬 적용
  useEffect(() => {
    let sorted = [...hotelList];
    if (selectedFilter === '낮은 요금순') {
      sorted.sort((a, b) => a.rooms?.[0]?.price - b.rooms?.[0]?.price);
    } else if (selectedFilter === '높은 요금순') {
      sorted.sort((a, b) => b.rooms?.[0]?.price - a.rooms?.[0]?.price);
    } else if (selectedFilter === '평점순') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    setVisibleProducts(sorted.slice(0, 7));
  }, [selectedFilter, hotelList]);

  // 더보기 클릭 시 데이터 추가 로드
  const handleViewMore = async () => {
    if (visibleProducts.length < hotelList.length) {
      const more = hotelList.slice(
        visibleProducts.length,
        visibleProducts.length + 7,
      );
      setVisibleProducts(prev => [...prev, ...more]);
    } else if (hasMore && activeTab !== 0) {
      setIsLoading(true);
      try {
        const categoryKeyword = sanitizeKeyword(categories[activeTab]);
        const res = await searchHotelsAdvanced(
          categoryKeyword,
          null,
          20, // limit: 전체 결과 수
          20, // pageSize: 한 번에 가져올 수
          lastDoc, // 시작점 (페이징)
          true, // pagination 사용 여부
        );
        const newHotels = res.hotels;
        setHotelList(prev => [...prev, ...newHotels]);
        setVisibleProducts(prev => [...prev, ...newHotels.slice(0, 7)]);
        setLastDoc(res.lastDoc);
        setHasMore(Boolean(res.lastDoc));
      } catch (err) {
        console.error('더보기 실패:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };
  // 숙소 클릭 시 ID 기반 상세 페이지 이동
  const handleItemClick = hotel => {
    navigate(`/detail/${encodeURIComponent(hotel.id)}`);
  };

  return (
    <div className='dark:bg-neutral-800'>
      <div className='fixed top-0 left-0 z-10 w-full bg-white px-5 py-3 shadow-md dark:bg-neutral-800'>
        <button
          className='flex w-full items-center rounded-full border px-4 py-1 dark:border-neutral-400'
          onClick={openSearchModal}
        >
          <Icon
            className='mr-3 text-violet-600 dark:text-violet-400'
            name='search'
          />
          <div className='flex flex-col items-start text-sm dark:text-neutral-50'>
            <strong>{headerInfo.name}</strong>
            <span className='text-xs'>
              {headerInfo.fromToDate} ({headerInfo.totalNights}) 성인{''}
              {headerInfo.numOfAdults}명
            </span>
          </div>
          <Icon
            className='ml-auto text-neutral-600 dark:text-neutral-400'
            name='close'
          />
        </button>
      </div>
      <div className='h-16'></div>

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
          isLoading={isLoading}
        />

        {(visibleProducts.length < hotelList.length || hasMore) && (
          <Button
            size='full'
            color='invert'
            className='mt-4 rounded-xl border-2 dark:border-neutral-400 dark:bg-neutral-800'
            onClick={handleViewMore}
            disabled={isLoading}
          >
            {isLoading
              ? '불러오는 중...'
              : `더보기 (${Math.max(hotelList.length - visibleProducts.length, 0) + (hasMore ? 20 : 0)}개)`}
          </Button>
        )}
      </Tab>

      <Nav />
      <SearchModal />
      <FilterModal
        isOpen={isFilterOpen}
        title='정렬 기준'
        onClose={() => setIsFilterOpen(false)}
        onConfirm={setSelectedFilter}
        selected={selectedFilter}
      />
    </div>
  );
};

export default StayListpage;
