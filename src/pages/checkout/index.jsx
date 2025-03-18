// component
import SubHeader from '../../components/SubHeader';
import Input from '../../components/Input';
import DetailSection from '../../components/DetailSection';
import Button from '../../components/Button';
import CheckBox from '../../components/CheckBox';
import Radio from '../../components/Radio';

// temp
import tempHotel1 from './../../assets/temp/temp_hotel1.jpg';

const CheckoutPage = () => {
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
    checkIn: '3/4',
    checkOut: '3/5',
    visitor: {
      adult: 2,
      children: 0,
    },
    point: 500000,
  };

  const payment = [
    { value: '신용카드', disabled: true },
    { value: '포인트 결제', disabled: false },
    { value: '현장에서 결제하기', disabled: false },
  ];

  return (
    <>
      <SubHeader leftButton='arrow' title='예약 확인 및 결제' />
      <div className='container mt-5 mb-[40px]'>
        <div>
          <h2 className='mb-2 flex items-center gap-2 font-medium'>
            <span className='text-xl'>{data.title}</span>
            <span className='text-sm'>({data.engTitle})</span>
          </h2>
          <div className='overflow-hidden rounded-xl'>
            <img className='h-full' src={data.slides[0]} alt='' />
          </div>
        </div>

        <ul className='mt-3 flex flex-col gap-2 [&>li]:text-sm [&>li]:text-neutral-600'>
          <li>
            객실<span className='ml-3 text-black'>{selectedData.name}</span>
          </li>
          <li>
            일정
            <span className='ml-3 text-black'>
              {userData.checkIn} {selectedData.info.checkInHour}
              <span> ~ </span>
              {userData.checkOut} {selectedData.info.checkOutHour}
            </span>
          </li>
        </ul>
        <hr className='my-4 border-gray-200' />

        <h3 className='mb-4 text-lg font-bold'>예약자 정보</h3>
        <Input
          type={'name'}
          label='예약자 이름 (해외 숙소의 경우, 여권 영문명)'
        />
        <Input type={'text'} label='휴대폰 번호' placeholder='휴대폰 번호' />
        <Input type={'email'} />
        <Input type={'password'} />

        <hr className='my-4 border-gray-200' />

        <DetailSection
          type='list-left-dot'
          title='취소 / 환불 규정에 대한 동의'
          contents={[
            '체크인일 기준 1일전 18시 까지 : 100% 환불',
            '체크인일 기준 1일전 18시 이후 ~ 당일 및 No-show : 환불 불가',
            '취소, 환불시 수수료가 발생할 수 있습니다',
            '아래 객실은 별도의 취소규정이 적용되오니 참고 부탁드립니다',
            '예약 후 10분 내 취소될 경우 최수 수수료가 발생하지 않습니다',
            '예약 후 10분 경과 시엔 해당 숙소의 취소 및 환불 규정이 적용됩니다.',
          ]}
        />
        <CheckBox name='payment' txt='동의합니다.' className={'mt-2'} />

        <hr className='my-4 border-gray-200' />

        <DetailSection
          title='최종 결제 금액'
          type='table-spacebetween'
          contents={[
            {
              label: '숙소 가격 (객실 1개 x 1박)',
              value: `${(selectedData.price * 0.9).toLocaleString()}원`,
            },
            { label: '할인가격', value: '0원' },
            {
              label: '세금 및 수수료 (10%)',
              value: `${(selectedData.price * 0.1).toLocaleString()}원`,
            },
            {
              label: '최종 결제금액',
              value: `${selectedData.price.toLocaleString()}원`,
            },
          ]}
        />

        <hr className='my-4 border-gray-200' />

        <h3 className='mb-4 text-lg font-bold'>결제 수단</h3>
        <Radio name='payment' options={payment} />
        <div className='mt-6'>
          <div className='mb-1.5 flex justify-between'>
            <span className='text-neutral-600'>보유 포인트</span>
            <span>{userData.point.toLocaleString()} P</span>
          </div>
          <Input placeholder='사용할 포인트를 입력해 주세요' />
          <div className='mt-3 flex justify-between'>
            <span className='text-sm text-neutral-600'>1P = 1KRW</span>
            <CheckBox name='point' txt='전체사용' />
          </div>
        </div>

        <div className='shadow-top fixed bottom-0 left-0 w-full items-center justify-center bg-white p-6'>
          <div className='mb-3 flex items-center justify-between'>
            <span className='text-sm'>총 결제금액</span>
            <span>
              <span className='mr-1 text-xl font-bold text-violet-600'>
                {selectedData.price.toLocaleString()}원
              </span>
              / 1박
            </span>
          </div>
          <Button
            color='prime'
            size='full'
            className='rounded-2xl'
            onClick={() => {}}
          >
            결제하기
          </Button>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
