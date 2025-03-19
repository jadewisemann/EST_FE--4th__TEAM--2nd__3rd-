import { useEffect, useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { getHotelById, searchHotelsAdvanced } from '../../firebase/search';

const DEBOUNCE_TIMEOUT = 300; //ms

const SearchTestPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

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
    } catch (error) {
      console.error('ID로 호텔 검색 중 오류 발생:', error);
    }
  };

  return (
    <>
      <div className='search-container' style={{ padding: '20px' }}>
        <div className='search-input' style={{ marginBottom: '20px' }}>
          <Input
            inputType='search'
            onChange={handleInputChange}
            value={query}
            placeholder='호텔 이름을 입력하세요'
            style={{ marginRight: '10px' }}
          />
          {loading && <span>검색 중...</span>}
        </div>

        <div className='search-results'>
          {loading ? (
            <p>검색 중입니다...</p>
          ) : results.length > 0 ? (
            <div>
              <h3>검색 결과: {results.length}개</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {results.map(hotel => (
                  <li
                    key={hotel.id}
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      padding: '15px',
                      marginBottom: '10px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    <h4>{hotel.title}</h4>
                    <div>ID: {hotel.id}</div>
                    <Button
                      content='ID로 검색'
                      size='small'
                      onClick={() => handleGetHotelById(hotel.id)}
                    />
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
