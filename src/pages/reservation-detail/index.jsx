// component
import SubHeader from '../../components/SubHeader';
import DetailSection from '../../components/DetailSection';
import Button from '../../components/Button';

// temp
import tempHotel1 from './../../assets/temp/temp_hotel1.jpg';

const ReservationDetailPage = () => {
  const data = {
    slides: [tempHotel1, tempHotel1, tempHotel1, tempHotel1, tempHotel1],
    title: '리츠칼튼 호텔',
    engTitle: 'Ritz-Carlton Hotel',
    hotelStar: 5,
    rate: 4.5,
    location: '서울시 송파구',
    reviewAmount: 2888,
    price: 120000,
    options: { wifi: true, fitness: true, dining: true, swimmingPool: true },
    room: [
      {
        thumbnail: tempHotel1,
        name: '스탠다드 트윈룸 (조식 포함)',
        bed: '싱글 침대 2개',
        price: 120000,
        info: {
          max: 2,
          checkInHour: '15:00',
          checkOutHour: '11:00',
          noRefund: true,
          addPerson: false,
          smoke: false,
          wifi: true,
        },
        specialOffer: true,
      },
      {
        thumbnail: tempHotel1,
        name: '스탠다드 트윈룸 (조식 포함)',
        bed: '킹사이즈 침대',
        price: 100000,
        info: {
          max: 2,
          checkInHour: '15:00',
          checkOutHour: '11:00',
          noRefund: false,
          addPerson: false,
          smoke: true,
          wifi: true,
        },
        specialOffer: false,
      },
      {
        thumbnail: tempHotel1,
        name: '스탠다드 트윈룸 (조식 포함)',
        bed: '킹사이즈 침대',
        price: 100000,
        info: {
          max: 2,
          checkInHour: '15:00',
          checkOutHour: '11:00',
          noRefund: false,
          addPerson: false,
          smoke: true,
          wifi: true,
        },
        specialOffer: false,
      },
    ],
  };

  const selectedData = data.room[0];

  const userData = {
    name: '홍길동',
    checkIn: '3/4',
    checkOut: '3/5',
    visitor: {
      adult: 2,
      children: 0,
    },
    point: 500000,
    request: '늦은 체크인 예정',
  };

  return (
    <>
      <SubHeader leftButton='arrow' title='예약 확인 및 결제' />
      <div className='container mt-5'>
        <div className='mb-3'>
          <h2 className='mb-2 flex items-center gap-2 font-medium'>
            <span className='text-xl'>{data.title}</span>
            <span className='text-sm'>({data.engTitle})</span>
          </h2>
          <div className='overflow-hidden rounded-xl'>
            <img className='h-full' src={data.slides[0]} alt='' />
          </div>
        </div>

        <DetailSection
          type='table-left'
          title='객실 정보'
          contents={[
            {
              hotelName: data.title,
              roomName: selectedData.name,
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
              visitor: `성인 ${userData.visitor.adult}인`,
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
            { label: '숙소 가격 (객실 1개 x 1박)', value: '120,000원' },
            { label: '할인가격', value: '0원' },
            { label: '세금 및 수수료 (10%)', value: '12,000원' },
            { label: '최종 결제금액', value: '132,000원' },
            { label: '결제방법', value: '포인트 결제' },
            {
              label: '적립 포인트',
              value: '포인트 결제는 적립 대상이 아닙니다.',
            },
          ]}
        />

        <div className='shadow-top fixed bottom-0 left-0 w-full items-center justify-center bg-white p-6'>
          <Button
            color='prime'
            size='full'
            className='rounded-2xl'
            onClick={() => {}}
          >
            확인
          </Button>
        </div>
      </div>
    </>
  );
};

export default ReservationDetailPage;
