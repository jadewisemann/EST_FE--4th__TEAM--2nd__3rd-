import { useState, useMemo } from 'react';
import Tab from '../../components/Tab';
import Nav from '../../components/Nav';
import VerticalList from '../../components/VerticalList';
import tempHotel1 from '../../assets/temp/temp_hotel1.jpg';

const StayListpage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const categories = ['전체', '모텔', '호텔/리조트', '팬션/풀빌라', '해외숙소'];
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
  ];

  // 현재 선택된 탭에 맞는 데이터 필터링
  const filteredProducts = useMemo(
    () =>
      activeTab === 0
        ? products // '전체' 선택 시 모든 데이터 표시
        : products.filter(
            product => product.category === categories[activeTab],
          ),
    [activeTab, products, categories],
  );

  return (
    <>
      <div>
        <div>header</div>
        <div></div>
      </div>
      <Tab
        categories={categories}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        <VerticalList products={filteredProducts} />
      </Tab>
      <Nav />
    </>
  );
};
export default StayListpage;
