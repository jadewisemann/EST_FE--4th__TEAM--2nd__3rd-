import { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import { useUserStore } from '../../store/userStore';

import { getRoomById } from '../../firebase/searchQuery';

import Button from '../../components/Button';
import Complete from '../../components/Complete';
import DetailSection from '../../components/DetailSection';
import Loading from '../../components/Loading';
import MetaData from '../../components/MetaData';
import SubHeader from '../../components/SubHeader';

const ReservationDetailPage = () => {
  const isReservation = JSON.parse(sessionStorage.getItem('isReservation'));

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
          navigate('/');
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
      <MetaData
        title='예약 상세 | 푹자요'
        description='예약하신 숙소의 상세 정보를 확인하세요.'
        keywords='예약 상세, 예약 정보, 객실 정보'
        ogTitle='예약 상세 | 푹자요'
        ogDescription='예약하신 숙소의 상세 정보를 확인하세요.'
        ogImage='/src/assets/img/bg_logo.svg'
      />
      <header>
        <SubHeader leftButton='arrow' title='예약 확인' />
      </header>
      <div className='container pb-46!'>
        <section>
          {isReservation ? (
            <Complete
              type='done'
              message='예약이 완료되었어요!'
              description={[
                '예약이 확정 되면',
                '입력하신 이메일로 바우처를 보내드립니다.',
                '(평일, 최대 12시간 내)',
              ]}
            ></Complete>
          ) : (
            <div className='mt-5 mb-3'>
              <h2 className='mb-2 flex items-center gap-2 text-xl font-medium'>
                {data.hotel_title}
              </h2>
              <div className='overflow-hidden rounded-xl'>
                <img className='h-full' src={data.img} alt='' />
              </div>
            </div>
          )}

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
                label: '숙소 가격',
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
              { label: '결제방법', value: userData.paymentMethod },
              {
                label: '최종 결제금액',
                value: `${userData.finalAmount.toLocaleString()}원`,
              },
            ]}
          />
        </section>

        <div className='bottom-fixed center-fixed-item'>
          <Button
            color='prime'
            size='full'
            className='rounded-2xl'
            onClick={() => {
              sessionStorage.setItem('isReservation', JSON.stringify(false));
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
