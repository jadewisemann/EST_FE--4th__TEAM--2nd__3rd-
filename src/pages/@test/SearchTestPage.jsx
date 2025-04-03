import { useEffect, useState } from 'react';

import useReservationStore from '../../store/reservationStore';

import { getHotelById, searchHotelsAdvanced } from '../../firebase/searchQuery';

import Button from '../../components/Button';
import Input from '../../components/Input';

const DEBOUNCE_TIMEOUT = 300; //ms

const SearchTestPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [expandedHotel, setExpandedHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // 예약 정보 상태
  const [reservationInfo, setReservationInfo] = useState({
    name: 'test',
    phone: '010-1234-5678',
    email: 'test@test.org',
    request: 'test request',
    agreement: false,
    paymentMethod: 'site',
    paymentAmount: 0,
    point: 1000,
    guestCount: 1,
    checkIn: '2025-04-08',
    checkOut: '2025-04-09',
  });

  const { resetSession, submitPayment, loadRoomData, currentState } =
    useReservationStore();

  // 자동 검색 debounce 처리
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    if (debounceTimer) clearTimeout(debounceTimer);

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
      if (timer) clearTimeout(timer);
    };
  }, [query]);

  // 언마운트 타이밍에 종료
  useEffect(() => {
    resetSession();

    return () => {
      if (currentState !== 'completed') {
        resetSession();
      }
    };
  }, [resetSession]);

  useEffect(() => {
    console.log('reservationInfo', reservationInfo);
  }, [reservationInfo]);

  // 핸들러
  const handleInputChange = value => {
    setQuery(value);
  };

  // 호텔 검색
  const handleGetHotelById = async hotelId => {
    try {
      const hotel = await getHotelById(hotelId);
      console.log(hotel);
      setExpandedHotel(hotel);
      setSelectedRoom(null);
    } catch (error) {
      console.error('ID로 호텔 검색 중 오류 발생:', error);
    }
  };

  // 방 정보 로드
  const handleGetRoomById = async roomId => {
    try {
      const result = await loadRoomData(roomId);
      console.log('방 정보:', result);
      const room = result.data;
      console.log('room', room);

      setReservationInfo({
        ...reservationInfo,
        paymentAmount: room.price_final || room.price,
      });
      setSelectedRoom(room);
    } catch (error) {
      console.error('ID로 방 검색 중 오류 발생:', error);
    }
  };

  // 예약 정보 입력 핸들러
  const handleReservationChange = e => {
    const { name, value, type, checked } = e.target;
    setReservationInfo({
      ...reservationInfo,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // 결제 처리 핸들러
  const handleReservation = async e => {
    e.preventDefault();

    if (!expandedHotel || !selectedRoom) {
      alert('호텔과 객실을 먼저 선택해주세요.');
      return;
    }

    // 결제 요청
    const result = await submitPayment(reservationInfo);
    console.log('result', result);
    alert(
      result && result.success
        ? '예약이 완료되었습니다!'
        : `예약 실패: ${result?.message || '알 수 없는 오류가 발생했습니다.'}`,
    );
  };

  const expandedHotelList = expandedHotel => (
    <div className='mt-2.5'>
      <h5>방 목록:</h5>
      <ul className='list-none p-0'>
        {expandedHotel.rooms.map(room => (
          <li
            key={room.room_uid}
            className={`mb-1 rounded-sm border-1 p-2 ${selectedRoom?.room_uid === room.room_uid ? 'border-blue-500 bg-blue-50' : 'border-black'}`}
          >
            <div>{room.title || '이름 없음'}</div>
            <div>가격: {room.price || '가격 정보 없음'}</div>
            <Button
              content={
                selectedRoom?.room_uid === room.room_uid
                  ? '선택됨'
                  : '방 선택하기'
              }
              size='small'
              onClick={() => handleGetRoomById(room.room_uid)}
            />
          </li>
        ))}
      </ul>
    </div>
  );

  const searchResult = (
    <>
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
            {expandedHotel
              && expandedHotel.id === hotel.id
              && expandedHotel.rooms
              && expandedHotelList(expandedHotel)}
          </li>
        ))}
      </ul>
    </>
  );

  const UserInput = () => (
    <>
      <h3 className='mb-4 text-xl font-bold'>예약 정보 입력</h3>
      <form onSubmit={handleReservation} className='flex flex-col gap-4'>
        <div className='flex gap-4'>
          <Input
            label='체크인 날짜'
            inputType='date'
            name='checkIn'
            value={reservationInfo.checkIn}
            onChange={value =>
              handleReservationChange({
                target: { name: 'checkIn', value },
              })
            }
            required
          />
          <Input
            label='체크아웃 날짜'
            inputType='date'
            name='checkOut'
            value={reservationInfo.checkOut}
            onChange={value =>
              handleReservationChange({
                target: { name: 'checkOut', value },
              })
            }
            required
          />
        </div>

        <Input
          label='인원수'
          inputType='number'
          name='guestCount'
          value={reservationInfo.guestCount}
          onChange={value =>
            handleReservationChange({
              target: {
                name: 'guestCount',
                value: parseInt(value) || 1,
              },
            })
          }
          min='1'
          required
        />

        <Input
          label='이름'
          inputType='text'
          name='name'
          value={reservationInfo.name}
          onChange={value =>
            handleReservationChange({
              target: { name: 'name', value },
            })
          }
          required
        />

        <Input
          label='연락처'
          inputType='text'
          name='phone'
          value={reservationInfo.phone}
          onChange={value =>
            handleReservationChange({
              target: { name: 'phone', value },
            })
          }
          placeholder='000-0000-0000'
          required
        />

        <Input
          label='이메일'
          inputType='email'
          name='email'
          value={reservationInfo.email}
          onChange={value =>
            handleReservationChange({
              target: { name: 'email', value },
            })
          }
          required
        />

        <Input
          label='point'
          inputType='point'
          name='point'
          value={reservationInfo.point}
          onChange={value =>
            handleReservationChange({
              target: { name: 'point', value },
            })
          }
          required
        />
        <textarea
          name='request'
          value={reservationInfo.request}
          onChange={e => handleReservationChange(e)}
          className='w-full rounded border p-2'
          rows='3'
        />

        <select
          name='paymentMethod'
          value={reservationInfo.paymentMethod}
          onChange={e => handleReservationChange(e)}
          className='w-full rounded border p-2'
          required
        >
          <option value='card'>신용카드</option>
          <option value='site'>현장 결제</option>
        </select>

        <div className='flex items-center'>
          <input
            type='checkbox'
            id='agreement'
            name='agreement'
            checked={reservationInfo.agreement}
            onChange={e => handleReservationChange(e)}
            className='mr-2'
            required
          />
          <label htmlFor='agreement' className='text-sm'>
            예약 정보 수집 및 이용, 취소 및 환불 규정에 동의합니다.
          </label>
        </div>

        <Button
          content={`예약 및 결제 (${reservationInfo.paymentAmount - reservationInfo.po}원)`}
          type='submit'
          className='w-full'
          disabled={currentState === 'processing'}
        />

        {currentState === 'error' && (
          <div className='mt-2 rounded border border-red-300 bg-red-50 p-2 text-red-500'></div>
        )}

        {currentState === 'completed' && (
          <div className='mt-2 rounded border border-green-300 bg-green-50 p-2 text-green-500'>
            예약이 성공적으로 처리되었습니다!
          </div>
        )}
      </form>
    </>
  );

  return (
    <>
      <div className='p-5'>
        <Input
          inputType='search'
          onChange={handleInputChange}
          value={query}
          placeholder='호텔 이름을 입력하세요'
          className='mr-5'
        />

        {loading ? (
          <p>검색 중입니다...</p>
        ) : results.length > 0 ? (
          searchResult
        ) : (
          query && <p>검색 결과가 없습니다.</p>
        )}

        {selectedRoom && UserInput()}
      </div>
    </>
  );
};

export default SearchTestPage;
