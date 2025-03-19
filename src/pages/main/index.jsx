import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import HorizontalList from '../../components/HorizontalList';
import Nav from '../../components/Nav';
import Icon from '../../components/Icon';
import searchHotelsAdvanced from '../../firebase/search';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recommendedHotels, setRecommendedHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  //추천호텔 데이터 가져오기
  useEffect(() => {
    const fetchRecommentedHotels = async () => {
      setIsLoading(true);
      try {
        const result = await searchHotelsAdvanced('서울 호텔');
        const filteredresult = result.filter(hotel => hotel._debug.score >= 4);
        const formattedResult = filteredresult.slice(0, 5).map(hotel => ({
          thumbnail: hotel.rooms?.[0]?.img || hotel.image?.[0] || '',
          discount: hotel.discount || 0, // 할인 정보가 있으면 반영 필요
          rate: hotel._debug?.score || 0,
          name: hotel.title || '이름 없음',
          location: hotel.location?.[0] || '위치 정보 없음',
          price: Number(hotel.rooms?.[0]?.price?.replace(/,/g, '')) || 0,
        }));
        setRecommendedHotels(formattedResult);
      } catch (error) {
        console.error('추천 호텔 가져오기 실패:', error);
      }
      setIsLoading(false);
    };
    fetchRecommentedHotels();
  }, []);

  //전체보기
  const recommendedHotelviewMore = () => {
    navigate('/result', { state: { recommendedHotels: recommendedHotels } });
  };

  //검색 데이터 가져오기
  const handleSearch = async e => {
    e.preventDefault();
    if (!searchText.trim()) return; // 빈 검색어 방지
    setIsLoading(true);
    try {
      const result = await searchHotelsAdvanced(searchText);
      setSearchResults(result);
      // console.log('검색 결과:', result);
      navigate('/result', { state: { searchResults: result } });
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
    }
    setIsLoading(false);
  };

  //카테고리 필터 아이콘 데이터
  const categories = [
    {
      src: 'https://media.discordapp.net/attachments/1308001170350149652/1347158726791921754/ico_____.png?ex=67d4b215&is=67d36095&hm=66d0d23e868171f884d22eadb113faf51dfc0b6a256110dabb4475fc71601966&=&format=webp&quality=lossless',
      label: '호텔/리조트',
    },
    {
      src: 'https://media.discordapp.net/attachments/1308001170350149652/1347158725802197015/ico_____.png?ex=67d4b215&is=67d36095&hm=2a3003bfd01a17c6549ce34a836cba055ae1623668e0e8a2979f2fb4f7288600&=&format=webp&quality=lossless',
      label: '펜션/풀빌라',
    },
    {
      src: 'https://media.discordapp.net/attachments/1308001170350149652/1347158726070763580/ico____.png?ex=67d4b215&is=67d36095&hm=51b2e9f7d480a14e718f1cc4eb96120033cf3e1c77e4199c7887bede602747f2&=&format=webp&quality=lossless',
      label: '모텔',
    },
    {
      src: 'https://media.discordapp.net/attachments/1308001170350149652/1347158726351786086/ico_____.png?ex=67d4b215&is=67d36095&hm=b021e8c6fb88e2251affb4966e1afd14db6a5c445020e63733e95420f5301d57&=&format=webp&quality=lossless',
      label: '해외숙소',
    },
  ];

  return (
    <>
      <div className='flex h-screen flex-col justify-between bg-[url(https://content.skyscnr.com/m/6181bf94ffc99b59/original/Lotte-Hotel-Jeju.jpg?resize=1000px:1000px&quality=100)]'>
        <div className='flex flex-col px-5 pt-16 pb-10'>
          <div className='flex flex-col items-center text-xl text-white'>
            <strong>누구누구 님</strong>
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
                className='flex h-[58px] cursor-pointer items-center gap-2.5 rounded-4xl border-neutral-300 px-5 text-neutral-400'
                onClick={() => {}}
              >
                <Icon name='calendar' />
                3월 05일 (수) ~ 3월 06일 (목)
              </Button>
              <Button
                color='line'
                size='full'
                className='flex h-[58px] cursor-pointer items-center gap-2.5 rounded-4xl border-neutral-300 px-5 text-neutral-400'
                onClick={() => {}}
              >
                <Icon name='user' />
                객실 1개 성인1명 아동 0명
              </Button>
            </div>
            <Button
              color='prime'
              size='full'
              className='mt-5 rounded-2xl'
              onClick={handleSearch}
              type='submit'
            >
              {isLoading ? '검색 중' : '확인 (1박)'}
            </Button>
          </form>
        </div>

        <div className='rounded-t-md bg-white p-5 pb-[80px]'>
          <div className='mt-1 flex items-center justify-between gap-5'>
            {categories.map((item, idx) => (
              <button
                key={idx}
                className='flex flex-1 cursor-pointer flex-col items-center'
              >
                <img className='h-18 object-contain' src={item.src} alt='' />
                <span className='text-sm'>{item.label}</span>
              </button>
            ))}
          </div>
          <div className='mt-10 mb-5 flex items-center justify-between'>
            <h4 className='text-base font-bold'>추천호텔</h4>
            <button
              className='cursor-pointer text-sm text-violet-600'
              onClick={recommendedHotelviewMore}
            >
              전체보기
            </button>
          </div>
          <HorizontalList products={recommendedHotels} />
        </div>
      </div>
      <Nav />
    </>
  );
};

export default MainPage;
