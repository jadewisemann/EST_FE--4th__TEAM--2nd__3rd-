import { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

// store
import useAppDataStore from '../../store/appDataStore';
import usePaymentStore from '../../store/paymentStore';

// data
import { getRoomById } from '../../firebase/search';

// component
import Button from '../../components/Button';
import CheckBox from '../../components/CheckBox';
import DetailSection from '../../components/DetailSection';
import Input from '../../components/Input';
import Radio from '../../components/Radio';
import SubHeader from '../../components/SubHeader';

const payment = [
  { value: '신용카드', disabled: true },
  { value: '현장에서 결제하기', disabled: false, checked: true },
];

const CheckoutPage = () => {
  const { loading, error, result, makePayment, resetState } = usePaymentStore();

  const navigate = useNavigate();

  // 이름
  const [name, setName] = useState('');
  const [isNameValid, setIsNameValid] = useState(false);

  // 이메일
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  // 전화번호
  const [tel, setTel] = useState('');
  const [isTelValid, setIsTelValid] = useState(false);

  // 전체 동의 체크
  const [agree, setAgree] = useState(false);

  // 포인트 인풋
  const [point, setPoint] = useState();

  // 포인트 사용 체크
  const [usePoint, setUsePoint] = useState(false);

  // 결제하기 활성화
  const [allGood, setAllGood] = useState(false);

  // 호텔 데이터
  const [data, setData] = useState(null);

  // 라디오 (결제 수단) 선택 인덱스 확인
  const [selectedIndex, setSelectedIndex] = useState(
    payment.findIndex(option => option.checked),
  );

  // 사용자 정보
  const { dates, guests } = useAppDataStore();

  // Room ID
  const { roomId } = useParams();
  const decodedRoomId = decodeURIComponent(roomId);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        // Room 아이디로 Room 데이터 호출
        const roomData = await getRoomById(`${decodedRoomId}`);

        if (roomData) {
          // 사용할 data에 가져온 roomData로 세팅
          setData(roomData);
        } else {
          console.log('해당 ID의 Room이 존재하지 않습니다.');
        }
      } catch (error) {
        console.error('에러 발생:', error);
      }
    };

    fetchRoom();
  }, []);

  useEffect(() => {
    if (isNameValid && isTelValid && isEmailValid && agree) {
      setAllGood(true);
    } else {
      setAllGood(false);
    }
  }, [isNameValid, isTelValid, isEmailValid, agree]);

  // Room 데이터 로딩 중
  if (!data) {
    return <div>로딩 중</div>;
  }

  const userData = {
    point: 20000,
  };

  // 취소 환불 규정 동의
  const handleAgree = () => {
    setAgree(!agree);
  };

  // 포인트 전체 사용
  const handlePoint = () => {
    setUsePoint(!usePoint);

    if (usePoint === false) {
      const price = data.price_final ? data.price_final : data.price;
      if (userData.point < price) {
        setPoint(userData.point);
      } else {
        setPoint(price);
      }
    } else {
      setPoint();
    }
  };

  // makePayment 함수 사용 예시
  const handlePayment = async () => {
    try {
      // 매개변수: userId, 금액, 예약 데이터
      await makePayment('test123', data.price_final, {
        hotelId: data.id, // 필수: 호텔 고유 ID
        hotelName: data.title, // 필수: 호텔 이름
        checkIn: data.startDate, // 필수: 체크인 날짜 (YYYY-MM-DD 형식)
        checkOut: data.endDate, // 필수: 체크아웃 날짜 (YYYY-MM-DD 형식)
        guestCount: guests.adults, // 필수: 숙박 인원 수
        reservation_name: name, // 필수: 예약자 이름
        reservation_phone: tel, // 필수: 예약자 연락처
        reservation_email: email, // 필수: 예약자 이메일
        reservation_request: '', // 선택사항: 특별 요청사항
      });

      // 성공 처리
      console.log('결제 결과:', result);
    } catch (error) {
      // 오류 처리 (이미 스토어에서도 error 상태가 설정됨)
      console.error('결제 실패:', error);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!name.trim()) {
      alert('예약자 이름을 입력해 주세요.');
      return;
    }

    if (!tel.trim()) {
      alert('휴대폰 번호를 입력해 주세요.');
      return;
    }

    if (!email.trim()) {
      alert('이메일을 입력해 주세요.');
      return;
    }

    handlePayment();
    navigate(`/order-confirm`);
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
            <img className='h-full' src={data.img} alt='' />
          </div>
        </div>

        <ul className='mt-3 flex flex-col gap-2 [&>li]:flex [&>li]:text-sm [&>li]:text-neutral-600 dark:[&>li]:text-neutral-50'>
          <li>
            <span className='whitespace-nowrap'>객실</span>
            <span className='ml-3 text-black dark:text-neutral-300'>
              {data.title}
            </span>
          </li>
          <li>
            <span>일정</span>
            <div className='ml-3 flex gap-1 text-black dark:text-neutral-300'>
              <span>{dates.startDate}</span>
              <span>~</span>
              <span>{dates.endDate}</span>
              <span>({dates.duration}박)</span>
            </div>
          </li>
          <li>
            <span>인원</span>
            <div className='ml-3 flex gap-1 text-black dark:text-neutral-300'>
              <span>성인 {guests.adults}명</span>
              {guests.children !== 0 && <span>성인 {guests.children}명</span>}
            </div>
          </li>
        </ul>

        <hr className='my-4 border-gray-200' />

        <form onSubmit={handleSubmit}>
          <fieldset className='[&>div]:mt-2'>
            <legend className='mb-2 text-lg font-bold'>예약자 정보</legend>
            <Input
              inputType='name'
              label='예약자 이름 (해외 숙소의 경우, 여권 영문명)'
              value={name}
              onChange={setName}
              onValidChange={setIsNameValid}
            />
            <Input
              inputType='tel'
              value={tel}
              onChange={setTel}
              onValidChange={setIsTelValid}
            />
            <Input
              inputType='email'
              value={email}
              onChange={setEmail}
              onValidChange={setIsEmailValid}
            />
          </fieldset>

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

          {data.price_final ? (
            <DetailSection
              title='최종 결제 금액'
              type='table-spacebetween'
              contents={[
                {
                  label: '숙소 가격 (객실 1개 x 1박)',
                  value: `${data.price.toLocaleString()}원`,
                },
                {
                  label: '할인가격',
                  value: `-${(data.price - data.price_final).toLocaleString()}원`,
                },
                {
                  label: '최종 결제금액',
                  value: `${data.price_final.toLocaleString()}원`,
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
                  value: `${data.price.toLocaleString()}원`,
                },
                {
                  label: '최종 결제금액',
                  value: `${data.price.toLocaleString()}원`,
                },
              ]}
            />
          )}

          <hr className='my-4 border-gray-200' />

          <fieldset>
            <legend className='mb-4 text-lg font-bold'>결제 수단</legend>
            <Radio
              name='payment'
              options={payment}
              selectedIndex={selectedIndex}
              onChange={setSelectedIndex}
            />
            {selectedIndex === 1 && (
              <div className='mt-6'>
                <div className='mb-1.5 flex justify-between'>
                  <span className='text-neutral-600 dark:text-neutral-300'>
                    보유 포인트
                  </span>
                  <span>{userData.point.toLocaleString()} P</span>
                </div>
                <Input inputType='number' value={point} onChange={setPoint} />
                <div className='mt-3 flex justify-between'>
                  <span className='text-sm text-neutral-600 dark:text-neutral-300'>
                    1P = 1KRW
                  </span>
                  <CheckBox
                    name='point'
                    txt='전체사용'
                    onChange={handlePoint}
                  />
                </div>
              </div>
            )}
          </fieldset>

          <div className='bottom-fixed'>
            <div className='mb-3 flex items-center justify-between'>
              <span className='text-sm'>총 결제금액</span>
              <span>
                <span className='mr-1 text-xl font-bold text-violet-600'>
                  {data.price_final
                    ? data.price_final.toLocaleString()
                    : data.price.toLocaleString()}
                  원
                </span>
                / 1박
              </span>
            </div>
            <Button
              type='submit'
              color='prime'
              size='full'
              className='rounded-2xl'
              disabled={!allGood}
            >
              결제하기
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CheckoutPage;
