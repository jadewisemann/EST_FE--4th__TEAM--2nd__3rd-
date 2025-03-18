import React from 'react';
import Complete from '../../components/Complete';
import DetailSection from '../../components/DetailSection';
import SubHeader from '../../components/SubHeader';
import Button from '../../components/Button';

const OrderConfirm = () => (
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
        color='neutral600'
        size='sm'
        weight='normal'
        contents={[
          {
            hotelName: '리츠칼튼 호텔(Ritz-Carlton Hotel)',
            roomName: '디럭스 더블룸',
            schedule: ['2025.03.05 (수) 15:00 ~', '2025.03.06 (목) 11:00'],
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
        color='neutral600'
        size='sm'
        weight='normal'
        contents={[
          {
            hotelName: '홍길동',
            roomName: '성인 2인',
            schedule: '늦은 체크인 예정',
            labels: {
              hotelName: '이름',
              roomName: '인원',
              schedule: '요청사항',
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
export default OrderConfirm;
