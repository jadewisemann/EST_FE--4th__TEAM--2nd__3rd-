import { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

// store
import useAppDataStore from '../../store/appDataStore';
import useReservationStore from '../../store/reservationStore';
import useUserStore from '../../store/userStore';

// component
import Button from '../../components/Button';
import CheckBox from '../../components/CheckBox';
import DetailSection from '../../components/DetailSection';
import Input from '../../components/Input';
import Loading from '../../components/Loading';
import MetaData from '../../components/MetaData';
import Radio from '../../components/Radio';
import SubHeader from '../../components/SubHeader';

const payment = [
  { value: '신용카드', disabled: true },
  { value: '현장에서 결제하기', disabled: false, checked: true },
];

const CheckoutPage = () => {
  const navigate = useNavigate();

  // params
  const { roomId } = useParams();

  // store
  const { resetSession, submitPayment, loadRoomData, currentState } =
    useReservationStore();
  const { points, loadUserData } = useUserStore();
  const { dates, guests } = useAppDataStore();

  // state
  const [data, setData] = useState(null); // 호텔 데이터
  const [price, setPrice] = useState(0); // 가격
  const [usePoint, setUsePoint] = useState(false); // 포인트 사용 여부
  // Input 유효성 검사
  const [isValid, setIsValid] = useState({
    name: false,
    phone: false,
    email: false,
  });
  const [active, setActive] = useState(false); // 결제하기 활성화
  // 라디오 (결제 수단) 선택 인덱스 확인
  const [selectedIndex, setSelectedIndex] = useState(
    payment.findIndex(option => option.checked),
  );
  // 결제 시 예약 정보
  const [reservationInfo, setReservationInfo] = useState({
    name: '',
    phone: '',
    email: '',
    request: '1632156asd',
    agreement: false,
    paymentMethod: payment.find(item => item.checked).value,
    paymentAmount: price,
    point: 0,
    guestCount: guests.adults,
    checkIn: dates.startDate,
    checkOut: dates.endDate,
  });

  // useEffect
  useEffect(() => {
    resetSession();

    return () => {
      if (currentState !== 'completed') {
        resetSession();
      }
    };
  }, [resetSession]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        // Room 아이디로 데이터 가져오기
        const roomData = await loadRoomData(roomId);

        if (roomData) {
          // 사용할 data에 가져온 roomData로 세팅
          setData(roomData.data);
          const finalPrice =
            roomData.data.price_final !== ''
              ? roomData.data.price_final
              : roomData.data.price;
          setPrice(finalPrice);
          setReservationInfo(prev => ({
            ...prev,
            paymentAmount: finalPrice,
          }));
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
    loadUserData();
  }, []);

  useEffect(() => {
    if (
      isValid.name
      && isValid.phone
      && isValid.email
      && reservationInfo.agreement
    ) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [isValid, reservationInfo.agreement]);

  // Room 데이터 로딩 중, 결제 처리 진행중 로딩 화면
  if (!data || currentState === 'PROCESSING') {
    return <Loading />;
  }

  // event
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

    // 결제 요청
    const result = await submitPayment(reservationInfo);
    if (result && result.success) {
      sessionStorage.setItem('isReservation', JSON.stringify(true));
      navigate(
        `/reservation-detail/${roomId}/${result.reservationId.slice(-13)}`,
      );
    }
  };

  // 포인트 전체 사용
  const handlePoint = () => {
    if (usePoint === false) {
      setUsePoint(true);
      if (points < price) {
        setReservationInfo({
          ...reservationInfo,
          point: points,
        });
      } else {
        setReservationInfo({
          ...reservationInfo,
          point: price,
        });
      }
    } else {
      setUsePoint(false);
      setReservationInfo({
        ...reservationInfo,
        point: 0,
      });
    }
  };

  return (
    <>
      <MetaData
        title='예약 및 결제 | 푹자요'
        description='선택하신 객실을 예약하고 결제를 진행합니다. 안전하고 빠른 결제 시스템을 이용해보세요.'
        keywords='예약, 결제, 객실 예약, 호텔 예약'
        ogTitle='예약 및 결제 | 푹자요'
        ogDescription='선택하신 객실을 예약하고 결제를 진행합니다. 안전하고 빠른 결제 시스템을 이용해보세요.'
        ogImage='/src/assets/img/bg_logo.svg'
      />
      <header>
        <SubHeader leftButton='arrow' title='예약 확인 및 결제' zIndex={10} />
      </header>
      <div className='container pb-56!'>
        <section>
          <h2 className='mt-5 mb-2 flex items-center gap-2 text-lg font-medium'>
            {data.title}
          </h2>
          <div className='overflow-hidden rounded-xl'>
            <img className='h-full' src={data.img} alt='' />
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
        </section>

        <hr className='my-4 border-gray-200' />

        <form onSubmit={handleReservation}>
          <fieldset className='[&>div]:mt-2'>
            <legend className='mb-2 text-lg font-bold'>예약자 정보</legend>
            <Input
              inputType='name'
              label='예약자 이름 (해외 숙소의 경우, 여권 영문명)'
              value={reservationInfo.name}
              onChange={value =>
                handleReservationChange({
                  target: { name: 'name', value },
                })
              }
              onValidChange={valid =>
                setIsValid(prev => ({ ...prev, name: valid }))
              }
            />
            <Input
              inputType='tel'
              value={reservationInfo.phone}
              onChange={value =>
                handleReservationChange({
                  target: { name: 'phone', value },
                })
              }
              onValidChange={valid =>
                setIsValid(prev => ({ ...prev, phone: valid }))
              }
            />
            <Input
              inputType='email'
              value={reservationInfo.email}
              onChange={value =>
                handleReservationChange({
                  target: { name: 'email', value },
                })
              }
              onValidChange={valid =>
                setIsValid(prev => ({ ...prev, email: valid }))
              }
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
            checked={reservationInfo.agreement}
            onChange={e =>
              handleReservationChange({
                target: {
                  name: 'agreement',
                  checked: e.target.checked,
                  type: 'checkbox',
                },
              })
            }
            className={'mt-2'}
          />

          <hr className='my-4 border-gray-200' />

          {data.price_final ? (
            <DetailSection
              title='최종 결제 금액'
              type='table-spacebetween'
              contents={[
                {
                  label: '숙소 가격',
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
                  label: '숙소 가격',
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
                  <span>{points.toLocaleString()} P</span>
                </div>
                <Input
                  inputType='number'
                  value={reservationInfo.point || ''}
                  placeholder='포인트를 입력하세요'
                  onChange={value => {
                    if (usePoint) {
                      setUsePoint(false);
                    }
                    if (Number(value) < 0) {
                      handleReservationChange({
                        target: { name: 'point', value: 0 },
                      });
                    } else if (Number(value) <= reservationInfo.paymentAmount) {
                      handleReservationChange({
                        target: { name: 'point', value: Number(value) },
                      });
                    } else {
                      setUsePoint(true);
                      handleReservationChange({
                        target: {
                          name: 'point',
                          value: reservationInfo.paymentAmount,
                        },
                      });
                    }
                  }}
                  onBlur={() => {
                    // 입력하지 않고 넘어갔을 때 reservationInfo.point가 0으로 설정
                    if (reservationInfo.point === '') {
                      handleReservationChange({
                        target: { name: 'point', value: 0 },
                      });
                    }
                  }}
                />
                <div className='mt-3 flex justify-between'>
                  <span className='text-sm text-neutral-600 dark:text-neutral-300'>
                    1P = 1KRW
                  </span>
                  <CheckBox
                    name='point'
                    txt='전체사용'
                    checked={usePoint}
                    onChange={handlePoint}
                  />
                </div>
              </div>
            )}
          </fieldset>

          <div className='bottom-fixed center-fixed-item'>
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
              disabled={!active}
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
