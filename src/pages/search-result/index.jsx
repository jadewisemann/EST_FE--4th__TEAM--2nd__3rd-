import { useState, useEffect } from 'react';
import Tab from '../../components/Tab';
import Nav from '../../components/Nav';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import VerticalList from '../../components/VerticalList';
import tempHotel1 from '../../assets/temp/temp_hotel1.jpg';

const StayListpage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const categories = ['전체', '모텔', '호텔/리조트', '팬션/풀빌라', '해외숙소'];
  const headerInfoText = {
    name: '리츠칼튼 호텔',
    fromToDate: '3월 05일 ~ 3월 06일',
    totalNights: '1박',
    numOfPeople: '성인 1명',
  };
  const [headerInfo, setHeaderInfo] = useState(headerInfoText);
  const products = [
    {
      thumbnail: tempHotel1,
      rate: 4.8,
      name: '갤럭시 호텔',
      location: '서울특별시, 성동구',
      price: 120000,
      discount: 10,
      category: '호텔/리조트',
    },
    {
      thumbnail: tempHotel1,
      rate: 3,
      name: '원하는 호텔',
      location: '서울특별시, 중구',
      price: 80000,
      discount: 15,
      category: '모텔',
    },
    {
      thumbnail: tempHotel1,
      rate: 3,
      name: '원하는 호텔',
      location: '서울특별시, 중구',
      price: 80000,
      discount: 15,
      category: '해외숙소',
    },
    {
      thumbnail: tempHotel1,
      rate: 3,
      name: '원하는 호텔',
      location: '서울특별시, 중구',
      price: 80000,
      discount: 15,
      category: '모텔',
    },
    {
      thumbnail: tempHotel1,
      rate: 3,
      name: '원하는 호텔',
      location: '서울특별시, 중구',
      price: 80000,
      discount: 15,
      category: '모텔',
    },
    {
      thumbnail: tempHotel1,
      rate: 3,
      name: '원하는 호텔',
      location: '서울특별시, 중구',
      price: 80000,
      discount: 15,
      category: '모텔',
    },
    {
      thumbnail: tempHotel1,
      rate: 3,
      name: '원하는 호텔',
      location: '서울특별시, 중구',
      price: 80000,
      discount: 15,
      category: '모텔',
    },
    {
      thumbnail: tempHotel1,
      rate: 3,
      name: '원하는 호텔',
      location: '서울특별시, 중구',
      price: 80000,
      discount: 15,
      category: '모텔',
    },
    {
      thumbnail: tempHotel1,
      rate: 3,
      name: '원하는 호텔',
      location: '서울특별시, 중구',
      price: 80000,
      discount: 15,
      category: '모텔',
    },
    {
      thumbnail: tempHotel1,
      rate: 3,
      name: '원하는 호텔',
      location: '서울특별시, 중구',
      price: 80000,
      discount: 15,
      category: '모텔',
    },
    {
      thumbnail: tempHotel1,
      rate: 3,
      name: '원하는 호텔',
      location: '서울특별시, 중구',
      price: 80000,
      discount: 15,
      category: '모텔',
    },
    {
      thumbnail: tempHotel1,
      rate: 3,
      name: '원하는 호텔',
      location: '서울특별시, 중구',
      price: 80000,
      discount: 15,
      category: '호텔/리조트',
    },
    {
      thumbnail: tempHotel1,
      rate: 3,
      name: '원하는 호텔',
      location: '서울특별시, 중구',
      price: 80000,
      discount: 15,
      category: '해외숙소',
    },
    {
      thumbnail: tempHotel1,
      rate: 3,
      name: '원하는 호텔',
      location: '서울특별시, 중구',
      price: 80000,
      discount: 15,
      category: '팬션/풀빌라',
    },
    {
      thumbnail: tempHotel1,
      rate: 3,
      name: '원하는 호텔',
      location: '서울특별시, 중구',
      price: 80000,
      discount: 15,
      category: '해외숙소',
    },
    {
      thumbnail: tempHotel1,
      rate: 3,
      name: '원하는 호텔',
      location: '서울특별시, 중구',
      price: 80000,
      discount: 15,
      category: '모텔',
    },
    {
      thumbnail: tempHotel1,
      rate: 3,
      name: '원하는 호텔',
      location: '서울특별시, 중구',
      price: 80000,
      discount: 15,
      category: '팬션/풀빌라',
    },
    {
      thumbnail: tempHotel1,
      rate: 3,
      name: '원하는 호텔',
      location: '서울특별시, 중구',
      price: 80000,
      discount: 15,
      category: '모텔',
    },
    {
      thumbnail: tempHotel1,
      rate: 3,
      name: '원하는 호텔',
      location: '서울특별시, 중구',
      price: 80000,
      discount: 15,
      category: '팬션/풀빌라',
    },
  ];
  const initialView = 7; //처음 보여줄 갯수
  const incrementView = 7; //더보기 클릭시 추가 될 갯수
  const [viewMore, setViewMore] = useState(initialView);

  // 탭 변경 시, viewMore 초기화
  useEffect(() => {
    setViewMore(initialView);
  }, [activeTab]);

  //현재 선택된 탭에 맞는 데이터 필터링
  const filteredProducts = products.filter(
    product => activeTab === 0 || product.category === categories[activeTab],
  );

  // 현재 탭에서 보여줄 데이터 (viewMore 개수만큼만)
  const visibleProducts = filteredProducts.slice(0, viewMore);

  //더보기 버튼 클릭 시 실행될 함수
  const handleViewMore = () => {
    setViewMore(prev =>
      Math.min(prev + incrementView, filteredProducts.length),
    );
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
              {headerInfo.numOfPeople}
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
        {visibleProducts.length < filteredProducts.length && (
          <Button
            size='full'
            color='invert'
            className='boder-violet-600 mt-4 rounded-xl border-2'
            onClick={handleViewMore}
          >
            더보기 ({Math.min(incrementView, products.length - viewMore)}개)
          </Button>
        )}
      </Tab>
      <Nav />
    </>
  );
};
export default StayListpage;
