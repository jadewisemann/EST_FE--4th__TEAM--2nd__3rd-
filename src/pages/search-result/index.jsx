import { useState, useEffect, useRef, useCallback } from 'react';

import { useSearchParams } from 'react-router-dom';

import useAppDataStore from '../../store/appDataStore';
import useModalStore from '../../store/modalStore';

import { searchHotelsAdvanced } from '../../firebase/searchQuery';

import Icon from '../../components/Icon';
import MetaData from '../../components/MetaData';
import Nav from '../../components/Nav';
import Tab from '../../components/Tab';
import VerticalList from '../../components/VerticalList';

const DEFAULT_KEYWORD = '서울';
const CATEGORIES = ['전체', '호텔/리조트', '펜션/풀빌라', '모텔', '해외 숙소'];
const CATEGORY_MAPPING = {
  1: 'hotel',
  2: 'pension',
  3: 'motel',
  4: 'overseas',
};

const ITEMS_PER_PAGE = 10;
const MAX_SEARCH_LIMIT = 20;

const SCROLL_LOAD_DURATION = 500; // ms

const removeSpecialChars = keyword => keyword.replace(/[~*/[\]]/g, '');

const getCategoryByTabIndex = tabIndex => {
  if (tabIndex === 0) return null;
  return CATEGORY_MAPPING[tabIndex];
};

const useHotelData = (keywordFromQuery, activeTab) => {
  const { dates } = useAppDataStore();

  const [hotelList, setHotelList] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const prepareKeywords = useCallback(() => {
    if (activeTab === 0) {
      return keywordFromQuery.split(',').map(k => removeSpecialChars(k.trim()));
    }

    return [removeSpecialChars(keywordFromQuery)];
  }, [keywordFromQuery, activeTab]);

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const keywords = prepareKeywords();
      const primaryKeyword = keywords[0] || DEFAULT_KEYWORD;
      const category = getCategoryByTabIndex(activeTab);

      const response = await searchHotelsAdvanced({
        searchText: primaryKeyword,
        category,
        limit: MAX_SEARCH_LIMIT,
        pageSize: ITEMS_PER_PAGE,
        pagination: true,
        checkIn: dates.startDate,
        checkOut: dates.endDate,
      });

      let results = response.hotels || [];

      if (activeTab === 0 && keywords.length > 1) {
        const secondaryResults = await Promise.all(
          keywords.slice(1).map(k => searchHotelsAdvanced(k, null, category)),
        );

        const secondaryMerged = secondaryResults.flat();
        const allResults = [...results, ...secondaryMerged];
        results = Array.from(new Map(allResults.map(h => [h.id, h])).values());
      }

      setHotelList(results);
      setVisibleProducts(results.slice(0, ITEMS_PER_PAGE));
      setLastDoc(response.lastDoc);
      setHasMore(Boolean(response.lastDoc));
    } catch (err) {
      console.error('데이터 로드 실패: ', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, prepareKeywords]);

  // 추가 데이터 로드
  const loadMoreData = useCallback(async () => {
    if (isLoading || !hasMore) return;

    // 패칭 없이 보여줄 데이터가 있는 경우
    if (visibleProducts.length < hotelList.length) {
      setIsLoading(true);

      try {
        const nextItems = hotelList.slice(
          visibleProducts.length,
          visibleProducts.length + ITEMS_PER_PAGE,
        );

        setVisibleProducts(prev => [...prev, ...nextItems]);
      } finally {
        setIsLoading(false);
      }

      return;
    }

    setIsLoading(true);
    try {
      const keywords = prepareKeywords();
      const primaryKeyword = keywords[0] || DEFAULT_KEYWORD;
      const category = getCategoryByTabIndex(activeTab);

      const res = await searchHotelsAdvanced({
        searchText: primaryKeyword,
        category,
        limit: MAX_SEARCH_LIMIT,
        pageSize: MAX_SEARCH_LIMIT,
        lastDoc,
        pagination: true,
        checkIn: dates.startDate,
        checkOut: dates.endDate,
      });

      if (res.hotels?.length > 0) {
        // 중복 제거 => 호텔 업데이트
        const existingIds = new Set(hotelList.map(h => h.id));
        const uniqueNewHotels = res.hotels.filter(
          hotel => !existingIds.has(hotel.id),
        );

        const updatedList = [...hotelList, ...uniqueNewHotels];

        setHotelList(updatedList);
        setVisibleProducts(prev => [
          ...prev,
          ...uniqueNewHotels.slice(0, ITEMS_PER_PAGE),
        ]);
        setLastDoc(res.lastDoc);
        setHasMore(Boolean(res.lastDoc));
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('더보기 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, [
    hotelList,
    hasMore,
    isLoading,
    lastDoc,
    visibleProducts.length,
    prepareKeywords,
    activeTab,
  ]);

  const resetData = useCallback(() => {
    setVisibleProducts([]);
    setHotelList([]);
    setLastDoc(null);
    setHasMore(true);
  }, []);

  return {
    hotelList,
    visibleProducts,
    hasMore,
    isLoading,
    fetchInitialData,
    loadMoreData,
    resetData,
  };
};

const useInfiniteScroll = (loadMoreData, hasMore, isLoading) => {
  const loadMoreButtonRef = useRef(null);
  const observer = useRef(null);

  // 옵저버 설정
  useEffect(() => {
    // 기존 옵저버 제거
    if (observer.current) {
      observer.current.disconnect();
    }

    // 새로운 옵저버 부착
    observer.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setTimeout(loadMoreData, SCROLL_LOAD_DURATION);
        }
      },
      { threshold: 1 },
    );

    if (loadMoreButtonRef.current) {
      observer.current.observe(loadMoreButtonRef.current);
    }

    // 언마운트시에 옵저버 지우기
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loadMoreData, hasMore, isLoading]);

  return loadMoreButtonRef;
};

const SearchResultPage = () => {
  const { openSearchModal } = useModalStore();
  const { dates, guests } = useAppDataStore();

  const [searchParams] = useSearchParams();
  const keywordFromQuery = searchParams.get('keyword') || DEFAULT_KEYWORD;

  const keywordIndex = CATEGORIES.indexOf(keywordFromQuery);
  const [activeTab, setActiveTab] = useState(
    keywordIndex !== -1 ? keywordIndex : 0,
  );

  const {
    visibleProducts,
    hasMore,
    isLoading,
    fetchInitialData,
    loadMoreData,
    resetData,
  } = useHotelData(keywordFromQuery, activeTab);

  const loadMoreButtonRef = useInfiniteScroll(loadMoreData, hasMore, isLoading);

  const headerInfo = {
    name: activeTab === 0 ? keywordFromQuery : CATEGORIES[activeTab],
    fromToDate: `${dates.startDate} ~ ${dates.endDate}`,
    totalNights: `${dates.duration}박`,
    numOfAdults: guests.adults || 1,
  };

  // 탭 변경 => 데이터 초기화 & 로드
  useEffect(() => {
    resetData();
    fetchInitialData();
  }, [activeTab, keywordFromQuery, resetData, fetchInitialData]);

  return (
    <>
      <MetaData
        title={
          keywordFromQuery
            ? `"${keywordFromQuery}" 검색 결과 | 푹자요`
            : '검색 결과 | 푹자요'
        }
        description={
          keywordFromQuery
            ? `"${keywordFromQuery}"에 대한 검색 결과입니다. 최적의 숙소를 찾아보세요.`
            : '검색하신 조건에 맞는 숙소 목록입니다.'
        }
        keywords={`검색 결과, 숙소 검색, 호텔 검색, ${keywordFromQuery}`}
        ogTitle={
          keywordFromQuery
            ? `"${keywordFromQuery}" 검색 결과 | 푹자요`
            : '검색 결과 | 푹자요'
        }
        ogDescription={
          keywordFromQuery
            ? `"${keywordFromQuery}"에 대한 검색 결과입니다. 최적의 숙소를 찾아보세요.`
            : '검색하신 조건에 맞는 숙소 목록입니다.'
        }
        ogImage='/src/assets/img/bg_logo.svg'
      />
      <div className='dark:bg-neutral-800'>
        {/* 헤더 */}
        <div className='center-fixed-item fixed top-0 z-10 w-full bg-white px-5 py-3 shadow-md dark:bg-neutral-800 dark:shadow-[0_2px_10px_rgba(255,255,255,0.25)]'>
          <button
            className='flex w-full items-center rounded-full border border-neutral-300 px-4 py-1 hover:cursor-pointer dark:border-neutral-400'
            onClick={openSearchModal}
          >
            <Icon
              className='mr-3 text-violet-600 dark:text-violet-400'
              name='search'
            />
            <div className='flex flex-col items-start text-sm dark:text-neutral-50'>
              <strong>{headerInfo.name}</strong>
              <span className='text-xs'>
                {headerInfo.fromToDate} ({headerInfo.totalNights}) 성인{' '}
                {headerInfo.numOfAdults}명
              </span>
            </div>
          </button>
        </div>
        <div className='h-16'></div>

        <Tab
          categories={CATEGORIES}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        >
          <VerticalList
            products={visibleProducts}
            isLoading={isLoading}
            activeTab={activeTab}
            query={keywordFromQuery}
          />

          {/* 트리거 */}
          {hasMore && !isLoading && (
            <div
              ref={loadMoreButtonRef}
              className='flex h-20 w-full items-center justify-center'
            >
              <div className='h-12 w-12'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
                  <circle
                    fill='#7f22fe'
                    stroke='#7f22fe'
                    strokeWidth='4'
                    r='15'
                    cx='40'
                    cy='100'
                  >
                    <animate
                      attributeName='opacity'
                      calcMode='spline'
                      dur='1'
                      values='1;0;1;'
                      keySplines='.5 0 .5 1;.5 0 .5 1'
                      repeatCount='indefinite'
                      begin='-.4'
                    ></animate>
                  </circle>
                  <circle
                    fill='#7f22fe'
                    stroke='#7f22fe'
                    strokeWidth='4'
                    r='15'
                    cx='100'
                    cy='100'
                  >
                    <animate
                      attributeName='opacity'
                      calcMode='spline'
                      dur='1'
                      values='1;0;1;'
                      keySplines='.5 0 .5 1;.5 0 .5 1'
                      repeatCount='indefinite'
                      begin='-.2'
                    ></animate>
                  </circle>
                  <circle
                    fill='#7f22fe'
                    stroke='#7f22fe'
                    strokeWidth='4'
                    r='15'
                    cx='160'
                    cy='100'
                  >
                    <animate
                      attributeName='opacity'
                      calcMode='spline'
                      dur='1'
                      values='1;0;1;'
                      keySplines='.5 0 .5 1;.5 0 .5 1'
                      repeatCount='indefinite'
                      begin='0'
                    ></animate>
                  </circle>
                </svg>
              </div>
            </div>
          )}
        </Tab>

        <Nav />
      </div>
    </>
  );
};

export default SearchResultPage;
