// component
import SubHeader from '../../components/SubHeader';
import Input from '../../components/Input';
import DetailSection from '../../components/DetailSection';
import Button from '../../components/Button';
import CheckBox from '../../components/CheckBox';
import Radio from '../../components/Radio';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// data
import { getHotelById } from '../../firebase/search';
import useAppDataStore from '../../store/appDataStore';

const payment = [
  { value: '신용카드', disabled: true },
  { value: '포인트 결제', disabled: false, checked: true },
  { value: '현장에서 결제하기', disabled: false },
];

const CheckoutPage = () => {
  // 이름
  const [name, setName] = useState('');
  // 이메일
  const [email, setEmail] = useState('');
  // 전화번호
  const [tel, setTel] = useState('');
  // 전체 동의
  const [agree, setAgree] = useState(false);
  // 포인트 사용
  const [point, setPoint] = useState(0);
  const [usePoint, setUsePoint] = useState(false);

  // 호텔 데이터
  const [data, setData] = useState(null);

  // 라디오 (결제 수단) 선택 인덱스 확인
  const [selectedIndex, setSelectedIndex] = useState(
    payment.findIndex(option => option.checked),
  );

  // 사용자 정보
  const { dates, guests } = useAppDataStore();

  // 호텔 ID
  const { hotelId, index } = useParams();
  // 디코딩
  const decodedHotelId = decodeURIComponent(hotelId);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        // 호텔 아이디로 호텔 데이터 호출
        const hotelData = await getHotelById(`${decodedHotelId}`);

        if (hotelData) {
          // 사용할 data에 가져온 hotelData로 세팅
          setData(hotelData);
        } else {
          // hotelID에 해당하는 호텔이 없는 경우
          console.log('해당 ID의 호텔이 존재하지 않습니다.');
        }
      } catch (error) {
        console.error('에러 발생:', error);
      }
    };

    fetchHotel();
  }, []);

  // 호텔 데이터 로딩 중
  if (!data) {
    return <div>로딩 중</div>;
  }

  // 선택된 호텔 중 사용자가 선택한 상품 가져오기
  const selectedData = data.rooms[index];

  const userData = {
    checkIn: '3/4',
    checkOut: '3/5',
    visitor: {
      adult: 2,
      children: 0,
    },
    point: 500000,
  };

  // 취소 환불 규정 동의
  const handleAgree = () => {
    setAgree(true);
  };

  // 포인트 전체 사용
  const handlePoint = () => {
    if (usePoint === false) {
      setUsePoint(true);
      selectedData.price_final
        ? setPoint(selectedData.price_final)
        : setPoint(selectedData.price);
    } else {
      setUsePoint(false);
      setPoint(0);
    }
  };

  return (
    <>
      <SubHeader leftButton='arrow' title='예약 확인 및 결제' zIndex={10} />
      <div className='container mt-5 mb-[40px]'>
        <div>
          <h2 className='mb-2 flex items-center gap-2 font-medium'>
            <span className='text-lg'>{data.title}</span>
          </h2>
          <div className='overflow-hidden rounded-xl'>
            <img className='h-full' src={selectedData.img} alt='' />
          </div>
        </div>

        <ul className='mt-3 flex flex-col gap-2 [&>li]:flex [&>li]:text-sm [&>li]:text-neutral-600'>
          <li>
            <span className='whitespace-nowrap'>객실</span>
            <span className='ml-3 text-black'>{selectedData.title}</span>
          </li>
          <li>
            <span>일정</span>
            <div className='ml-3 flex gap-1 text-black'>
              <span>{dates.startDate}</span>
              <span>~</span>
              <span>{dates.endDate}</span>
              <span>({dates.duration}박)</span>
            </div>
          </li>
          <li>
            <span>인원</span>
            <div className='ml-3 flex gap-1 text-black'>
              <span>성인 {guests.adults}명</span>
              {guests.children !== 0 && <span>성인 {guests.children}명</span>}
            </div>
          </li>
        </ul>

        <hr className='my-4 border-gray-200' />

        <h3 className='mb-4 text-lg font-bold'>예약자 정보</h3>

        <div className='[&>div]:mt-2'>
          <Input
            inputType='name'
            label='예약자 이름 (해외 숙소의 경우, 여권 영문명)'
            value={name}
            onChange={setName}
          />
          <Input inputType='tel' value={tel} onChange={setTel} />
          <Input inputType='email' value={email} onChange={setEmail} />
        </div>

        <hr className='my-4 border-gray-200' />

        <DetailSection
          type='list-left-dot'
          title='취소 / 환불 규정에 대한 동의'
          color='text-neutral-600'
          size='text-xs'
          weight='font-normal'
          contents={[
            { text: '체크인일 기준 1일전 18시 까지 : 100% 환불' },
            { text: '체크아웃 오전 11시 이전' },
            {
              text: '아래 객실은 별도의 취소규정이 적용되오니 참고 부탁드립니다.',
              isHighlighted: true, //빨간색 적용
            },
            { text: '[환불불가] [단독] 12시 체크인 & 13시 체크아웃' },
            {
              text: '예약 후 10분 내 취소를 포함한 일부 취소 수수료가 발생하지 않습니다.',
            },
          ]}
        />
        <CheckBox
          name='payment'
          txt='동의합니다.'
          checked={agree}
          className={'mt-2'}
          onChange={handleAgree}
        />

        <hr className='my-4 border-gray-200' />

        {selectedData.price_final ? (
          <DetailSection
            title='최종 결제 금액'
            type='table-spacebetween'
            contents={[
              {
                label: '숙소 가격 (객실 1개 x 1박)',
                value: `${selectedData.price.toLocaleString()}원`,
              },
              {
                label: '할인가격',
                value: `-${(selectedData.price - selectedData.price_final).toLocaleString()}원`,
              },
              {
                label: '최종 결제금액',
                value: `${selectedData.price_final.toLocaleString()}원`,
              },
            ]}
          />
        ) : (
          <DetailSection
            title='최종 결제 금액'
            type='table-spacebetween'
            contents={[
              {
                label: '숙소 가격 (객실 1개 x 1박)',
                value: `${selectedData.price.toLocaleString()}원`,
              },
              {
                label: '최종 결제금액',
                value: `${selectedData.price.toLocaleString()}원`,
              },
            ]}
          />
        )}

        <hr className='my-4 border-gray-200' />

        <h3 className='mb-4 text-lg font-bold'>결제 수단</h3>

        <Radio
          name='payment'
          options={payment}
          selectedIndex={selectedIndex}
          onChange={setSelectedIndex}
        />
        {selectedIndex === 1 && (
          <div className='mt-6'>
            <div className='mb-1.5 flex justify-between'>
              <span className='text-neutral-600'>보유 포인트</span>
              <span>{userData.point.toLocaleString()} P</span>
            </div>
            <Input inputType='number' value={point} onChange={setPoint} />
            <div className='mt-3 flex justify-between'>
              <span className='text-sm text-neutral-600'>1P = 1KRW</span>
              <CheckBox name='point' txt='전체사용' onChange={handlePoint} />
            </div>
          </div>
        )}

        <div className='shadow-top fixed bottom-0 left-0 w-full items-center justify-center bg-white p-6'>
          <div className='mb-3 flex items-center justify-between'>
            <span className='text-sm'>총 결제금액</span>
            <span>
              <span className='mr-1 text-xl font-bold text-violet-600'>
                {selectedData.price_final
                  ? selectedData.price_final.toLocaleString()
                  : selectedData.price.toLocaleString()}
                원
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
