import { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

// store
import { useUserStore } from '../../store/userStore';

// data
import { getRoomById } from '../../firebase/searchQuery';

// component
import Button from '../../components/Button';
import DetailSection from '../../components/DetailSection';
import Loading from '../../components/Loading';
import SubHeader from '../../components/SubHeader';

const ReservationDetailPage = () => {
  const navigate = useNavigate();

  // params
  const { roomId, reservationId } = useParams();

  // store
  const { reservations, loadReservations } = useUserStore();

  // state
  const [data, setData] = useState(null);
  const [userData, setUserData] = useState(null);

  // useEffect
  useEffect(() => {
    loadReservations();
  }, []);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const RoomData = await getRoomById(roomId);

        if (RoomData) {
          setData(RoomData);
        } else {
          console.log('해당 ID의 호텔이 존재하지 않습니다.');
        }
      } catch (error) {
        console.error('에러 발생:', error);
      }
    };

    fetchRoom();
  }, []);

  useEffect(() => {
    setUserData(
      reservations.find(item => item.id.slice(-13) === reservationId),
    );
  }, [reservations]);

  // Room 데이터 로딩 중
  if (!data) {
    return <Loading />;
  }

  return (
    <>
      <SubHeader leftButton='arrow' title='예약 확인' />
      <div className='container mt-5'>
        <div className='mb-3'>
          <h2 className='mb-2 flex items-center gap-2 font-medium'>
            <span className='text-xl'>{data.hotel_title}</span>
          </h2>
          <div className='overflow-hidden rounded-xl'>
            <img className='h-full' src={data.img} alt='' />
          </div>
        </div>

        <DetailSection
          type='table-left'
          title='객실 정보'
          contents={[
            {
              hotelName: data.hotel_title,
              roomName: data.title,
              schedule: `${userData.checkIn} ~ ${userData.checkOut}`,
              labels: {
                hotelName: '숙소명',
                roomName: '객실',
                schedule: '일정',
              },
            },
          ]}
        />

        <hr className='my-4 border-gray-200' />

        <DetailSection
          type='table-left'
          title='투숙객 정보'
          contents={[
            {
              userName: userData.name,
              visitor: `성인 ${userData.guestCount}인`,
              schedule: userData.request,
              labels: {
                userName: '이름',
                visitor: '인원',
                schedule: '요청사항',
              },
            },
          ]}
        />

        <hr className='my-4 border-gray-200' />

        <DetailSection
          title='결제 정보'
          type='table-spacebetween'
          contents={[
            {
              label: '숙소 가격 (객실 1개 x 1박)',
              value: `${data.price.toLocaleString()}원`,
            },
            {
              label: '할인가격',
              value: `${data.price_final ? (data.price - data.price_final).toLocaleString() : 0}원`,
            },
            {
              label: '포인트 사용',
              value: `${userData.pointsUsed.toLocaleString()}원`,
            },
            {
              label: '최종 결제금액',
              value: `${userData.finalAmount.toLocaleString()}원`,
            },
            { label: '결제방법', value: userData.paymentMethod },
            {
              label: '적립 포인트',
              value: '포인트 결제는 적립 대상이 아닙니다.',
            },
          ]}
        />

        <div className='bottom-fixed'>
          <Button
            color='prime'
            size='full'
            className='rounded-2xl'
            onClick={() => {
              navigate('/');
            }}
          >
            확인
          </Button>
        </div>
      </div>
    </>
  );
};

export default ReservationDetailPage;
