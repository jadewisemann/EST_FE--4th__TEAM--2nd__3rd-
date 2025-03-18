import Nav from '../../components/Nav';
import VerticalList from '../../components/VerticalList';
import tempHotel1 from '../../assets/temp/temp_hotel1.jpg';
import SubHeader from '../../components/SubHeader';

const WishlistPage = () => {
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
  return (
    <>
      <SubHeader leftButton='arrow' title='관심 숙소' />
      <div className='container'>
        <VerticalList products={products} />
      </div>
      <Nav />
    </>
  );
};

export default WishlistPage;
