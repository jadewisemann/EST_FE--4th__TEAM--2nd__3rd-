import useReservationStore from '../../store/reservationStore';

import Button from '../../components/Button';
import Complete from '../../components/Complete';
import DetailSection from '../../components/DetailSection';
import SubHeader from '../../components/SubHeader';

const OrderConfirm = () => {
  const { reservations } = useReservationStore();

  return (
    <>
      <SubHeader leftButton='arrow' title='결제 완료' fixed={true} />
      <div className='container mb-[60px]'>
        <Complete
          type='done'
          message='예약이 완료되었어요!'
          description={[
            '예약이 확정 되면',
            '입력하신 이메일로 바우처를 보내드립니다.',
            '(평일, 최대 12시간 내)',
          ]}
        ></Complete>
        <hr className='mb-4 border-neutral-300' />
        <DetailSection
          type='table-left'
          title='객실 정보'
          color='text-neutral-600'
          size='text-sm'
          weight='font-normal'
          contents={[
            {
              hotelName: `${reservations.title}`,
              roomName: `${reservations.title}`,
              schedule: [`${reservations.startDate} ~ ${reservations.endDate}`],
              labels: {
                hotelName: '숙소명',
                roomName: '객실',
                schedule: '일정',
              },
            },
          ]}
        />
        <hr className='my-4 border-neutral-300' />
        <DetailSection
          type='table-left'
          title='투숙객 정보'
          color='text-neutral-600'
          size='text-sm'
          weight='font-normal'
          contents={[
            {
              userName: `${reservations.name}`,
              headCount: `${reservations.adults}`,
              labels: {
                userName: '이름',
                headCount: '인원',
              },
            },
          ]}
        />
        <hr className='my-4 border-neutral-300' />
        <DetailSection
          title='결제 정보'
          type='table-spacebetween'
          className=''
          contents={[
            {
              label: '숙소 가격',
              value: `${reservations.price.toLocaleString()}원`,
            },
            {
              label: '할인가격',
              value: `${reservations.price_final ? `${(reservations.price - reservations.price_final).toLocaleString()}원` : '0원'}`,
            },
            {
              label: '최종 결제금액',
              value: `${reservations.price_final ? reservations.price_final.toLocaleString() : reservations.price.toLocaleString()}원`,
            },
            { label: '결제방법', value: '포인트 결제' },
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
            onClick={() => {}}
          >
            확인
          </Button>
        </div>
      </div>
    </>
  );
};
export default OrderConfirm;
