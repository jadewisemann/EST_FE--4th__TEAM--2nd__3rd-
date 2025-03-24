import { useEffect, useState } from 'react';

import Button from '../../components/Button';
import Input from '../../components/Input';
import {
  getHotelById,
  getRoomById,
  searchHotelsAdvanced,
} from '../../firebase/search';

const DEBOUNCE_TIMEOUT = 300; //ms

const SearchTestPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [expandedHotel, setExpandedHotel] = useState(null);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const searchResults = await searchHotelsAdvanced(query);
        console.log(searchResults);
        setResults(searchResults);
      } catch (error) {
        console.error('검색 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_TIMEOUT);
    setDebounceTimer(timer);
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [query]);

  const handleInputChange = value => {
    setQuery(value);
  };

  const handleGetHotelById = async hotelId => {
    try {
      const hotel = await getHotelById(hotelId);
      console.log(hotel);
      setExpandedHotel(hotel);
    } catch (error) {
      console.error('ID로 호텔 검색 중 오류 발생:', error);
    }
  };

  const handleGetRoomById = async roomId => {
    try {
      const room = await getRoomById(roomId);
      console.log('방 정보:', room);
    } catch (error) {
      console.error('ID로 방 검색 중 오류 발생:', error);
    }
  };

  return (
    <>
      <div className='search-container p-5'>
        <div className='search-input mb-5'>
          <Input
            inputType='search'
            onChange={handleInputChange}
            value={query}
            placeholder='호텔 이름을 입력하세요'
            className='mr-5'
          />
          {loading && <span>검색 중...</span>}
        </div>
        <div className='search-results'>
          {loading ? (
            <p>검색 중입니다...</p>
          ) : results.length > 0 ? (
            <div>
              <h3>검색 결과: {results.length}개</h3>
              <ul className='list-none p-0'>
                {results.map(hotel => (
                  <li
                    key={hotel.id}
                    className='mb-2.5 rounded-sm border-1 border-gray-200 p-4 shadow'
                  >
                    <h4>{hotel.title}</h4>
                    <div>ID: {hotel.id}</div>
                    <Button
                      content='호텔 상세 정보'
                      size='small'
                      onClick={() => handleGetHotelById(hotel.id)}
                    />

                    {expandedHotel &&
                      expandedHotel.id === hotel.id &&
                      expandedHotel.rooms && (
                        <div className='mt-2.5'>
                          <h5>방 목록:</h5>
                          <ul className='list-none p-0'>
                            {expandedHotel.rooms.map(room => (
                              <li
                                key={room.room_uid}
                                className='mb-1 rounded-sm border-1 border-black p-2'
                              >
                                <div>{room.title || '이름 없음'}</div>
                                <Button
                                  content='방 정보 보기'
                                  size='small'
                                  onClick={() =>
                                    handleGetRoomById(room.room_uid)
                                  }
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            query && <p>검색 결과가 없습니다.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchTestPage;
