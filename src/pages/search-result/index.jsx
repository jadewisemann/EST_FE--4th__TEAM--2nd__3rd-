import { useState, useEffect } from 'react';
import Tab from '../../components/Tab';
import Nav from '../../components/Nav';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import VerticalList from '../../components/VerticalList';
import { useLocation } from 'react-router-dom';
import { getHotelById, searchHotelsAdvanced } from '../../firebase/search';

const StayListpage = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const categories = ['전체', '모텔', '호텔/리조트', '팬션/풀빌라', '해외숙소'];
  const [headerInfo, setHeaderInfo] = useState({
    name: '',
    fromToDate: '',
    totalNights: '1박',
    numOfPeople: '성인 1명',
  });

  const state = location.state || {};
  const {
    hotelIds = [],
    name = '',
    selectedCategory = '',
    fromToDate = '',
    totalNights = '',
    numOfPeople = '',
  } = state;

  const [hotelList, setHotelList] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [initialView] = useState(7);
  const [incrementView] = useState(7);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // 헤더 정보 초기 세팅
  useEffect(() => {
    // 이미 세팅된 상태거나 빈값이면 처리하지 않음
    if (!hotelIds.length && !name && !selectedCategory) {
      console.warn('전달된 state가 없음');
      return;
    }

    const hotelCount = hotelIds.length;
    const nameText = name?.trim()
      ? name
      : selectedCategory ||
        (hotelCount > 0 ? `총 ${hotelCount}개의 숙소` : '검색 결과 없음');

    // setState 단 한 번만 실행되게!
    setHeaderInfo(prev => {
      // 이미 동일한 값이면 갱신 안 함
      if (
        prev.name === nameText &&
        prev.fromToDate === fromToDate &&
        prev.totalNights === totalNights &&
        prev.numOfPeople === numOfPeople
      ) {
        return prev;
      }

      return {
        name: nameText,
        fromToDate,
        totalNights,
        numOfPeople,
      };
    });
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [activeTab]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      let result = [];
      let last = null;

      if (activeTab === 0) {
        result = await Promise.all(hotelIds.map(id => getHotelById(id)));
        result = result.filter(Boolean);
        setHasMore(false); // 전체 탭은 페이징 안 함
      } else {
        const categoryKeyword = categories[activeTab].replace(/[\/~*[\]]/g, '');
        const res = await searchHotelsAdvanced(
          categoryKeyword,
          null, // region
          20, // limit
          20, // pageSize
          null, // lastDoc
          true, // pagination
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

  const handleViewMore = async () => {
    if (visibleProducts.length < hotelList.length) {
      const nextItems = hotelList.slice(
        visibleProducts.length,
        visibleProducts.length + incrementView,
      );
      setVisibleProducts(prev => [...prev, ...nextItems]);
    } else if (hasMore && activeTab !== 0) {
      setIsLoading(true);
      try {
        const categoryKeyword = categories[activeTab].replace(/[\/~*[\]]/g, '');
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

  return (
    <>
      <div className='fixed top-0 left-0 z-10 w-full bg-white px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.1)]'>
        <button
          className='flex w-full cursor-pointer items-center rounded-full border-1 border-neutral-300 px-4 py-1'
          onClick={() => {}}
        >
          <Icon className='mr-3 text-violet-600' name='search' />
          <div className='flex flex-1 flex-col items-start'>
            <strong className='text-sm'>{headerInfo.name}</strong>
            <span className='text-xs'>
              {headerInfo.fromToDate}&nbsp;({headerInfo.totalNights})&nbsp;
              {/* {headerInfo.numOfPeople} */}
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
        <VerticalList products={visibleProducts} />

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
    </>
  );
};

export default StayListpage;
