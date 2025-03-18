// react
import { use, useState } from 'react';
import Tab from '../../components/Tab';
import Calendar from '../../components/Calendar';
import Icon from '../../components/Icon';
import ReviewRating from '../../components/ReviewRating';
import Rating from '../../components/Rating';
import Nav from '../../components/Nav';
import Complete from '../../components/Complete';
import Heart from '../../components/Heart';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Radio from '../../components/Radio';
import CheckBox from '../../components/CheckBox';
import Counter from '../../components/Counter';
import HorizontalList from '../../components/HorizontalList';
import DetailSection from '../../components/DetailSection';
import VerticalList from '../../components/VerticalList';
import SubHeader from '../../components/SubHeader';
import DetailProduct from '../../components/DetailProduct';
import Input from '../../components/Input';
import Anchor from '../../components/Anchor';
// 수평 리스트 임시 이미지
import tempHotel1 from './../../assets/temp/temp_hotel1.jpg';

// components
const TestPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [search, setSearch] = useState('');
  const [tel, setTel] = useState('');

  const categories = [
    'Calendar',
    'Icon',
    'Rating',
    'Nav',
    'tab',
    'Complete',
    'Heart',
    'Button',
    `Counter`,
    'Radio',
    'Badge',
    'Check Box',
    'Horizontal List',
    'DetailSection',
    'VerticalList',
    `SubHeader`,
    'Detail Product',
    'Input',
    'Anchor',
  ];

  // 라디오 버튼 예시
  const radio1 = [
    { value: '신용카드', disabled: true },
    { value: '포인트 결제', disabled: false },
    { value: '현장에서 결제하기', disabled: false },
  ];

  // 수평 리스트 데이터
  const products = [
    {
      thumbnail: tempHotel1,
      rate: 4.8,
      name: '갤럭시 호텔',
      location: '서울특별시, 성동구',
      price: 120000,
      discount: 10,
    },
    {
      thumbnail: tempHotel1,
      rate: 3,
      name: '원하는 호텔',
      location: '서울특별시, 중구',
      price: 80000,
      discount: 15,
    },
  ];

  const detailProducts = [
    {
      thumbnail: tempHotel1,
      name: '스탠다드 트윈룸 (조식 포함)',
      bed: '싱글 침대 2개',
      price: 120000,
      info: {
        max: 2,
        checkIn: '15:00',
        checkOut: '11:00',
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
        noRefund: true,
        addPerson: false,
        smoke: true,
        wifi: true,
      },
      specialOffer: false,
    },
  ];

  // // 디테일섹션 타입:list-left-dot 데이터
  // const contents2 = [
  //   {
  //     keyName: 'refund-full',
  //     text: '체크인일 기준 1일전 18시 까지 : 100% 환불',
  //   },
  //   {
  //     keyName: 'refund-no-show',
  //     text: '체크인일 기준 1일전 18시 이후 ~ 당일 및 No-show : 환불 불가',
  //   },
  //   {
  //     keyName: 'additional-fee',
  //     text: '취소, 환불시 수수료가 발생할 수 있습니다.',
  //   },
  //   {
  //     keyName: 'special-refund',
  //     text: '아래 객실은 별도의 취소규정이 적용되오니 참고 부탁드립니다.',
  //     isHighlighted: true, //빨간색 적용
  //   },
  //   {
  //     keyName: 'special-room',
  //     text: '[한불불가] [단독] 12시 체크인 & 13시 체크아웃',
  //   },
  //   {
  //     keyName: 'special-cancel',
  //     text: '예약 후 10분 내 취소를 포함한 일부 취소 수수료가 발생하지 않습니다.',
  //   },
  // ];

  const contents = [
    <>
      <h1 className='text-4xl'>Calendar</h1>
      <br />
      <Calendar />
    </>,
    <>
      <h1 className='text-4xl'>Icon</h1>
      <br />
      <Icon name='user' />
      <Icon name='profile' />
      <Icon name='star_fill' className='text-yellow-400' size={18} />
      <Icon name='heart_fill' color='red' />
      <Icon name='home' />
      <Icon name='search' />
      <Icon name='email' />
      <Icon name='lock' />
      <Icon name='close' />
      <Icon name='sort' />
      <Icon name='calendar' />
      <Icon name='arrow_right' />
      <Icon name='heart' />
      <Icon name='heart_fill' />
      <Icon name='star' />
      <Icon name='star_half' />
      <Icon name='star_fill' />
      <Icon name='minus' />
      <Icon name='plus' />
      <Icon name='share' />
      <Icon name='wifi' />
      <Icon name='fitness' />
      <Icon name='dining' />
      <Icon name='swimmingPool' />
      <Icon name='door' />
      <Icon name='person' />
      <Icon name='children' />
      <Icon name='bed' />
      <Icon name='smoke' />
      <Icon name='smoke_non' />
      <Icon name='location' />
      <Icon name='check' />
      <Icon name='check_circle' />
    </>,
    <>
      <h1 className='text-4xl'>rating</h1>
      <br />
      <Rating rate={3.2} />
      <ReviewRating rate={3.2} />
    </>,
    <>
      <h1 className='text-4xl'>Nav</h1>
      <br />
      <Nav />
    </>,
    <>
      <h1 className='text-4xl'>Tab</h1>
      <br />
      <Tab
        categories={categories}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        내용임돠
      </Tab>
    </>,
    <>
      <h1 className='text-4xl'>Complete</h1>
      <br />
      <Complete
        type='done'
        message='예약이 완료되었어요!'
        description={[
          '예약이 확정 되면',
          '입력하신 이메일로 바우처를 보내드립니다.',
          '(평일, 최대 12시간 내)',
        ]}
      ></Complete>
      <br />
      <Complete type='notYet' message='아직 예약 된 숙소가 없습니다!'>
        <Button color='prime' size='full' onClick={() => {}}>
          숙소 검색하기
        </Button>
      </Complete>
    </>,
    <>
      <h1 className='text-4xl'>Heart</h1>
      <br />
      <Heart />
    </>,
    <>
      <h1 className='text-4xl'>Button</h1>
      <br />
      <div className='flex flex-col gap-2'>
        <h2>size = 'full'</h2>
        <Button
          color='prime'
          size='full'
          className='rounded-2xl'
          onClick={() => {}}
        >
          prime, full
        </Button>
        <Button color='invert' size='full' onClick={() => {}}>
          invert, full
        </Button>
        <Button color='line' size='full' onClick={() => {}}>
          line, full
        </Button>
        <Button color='alt' size='full' onClick={() => {}}>
          alt, full
        </Button>

        <h2>size = 'square'</h2>
        <Button color='prime' size='square' onClick={() => {}}>
          prime, full
        </Button>
        <Button color='invert' size='square' onClick={() => {}}>
          invert, full
        </Button>
        <Button color='line' size='square' onClick={() => {}}>
          line, full
        </Button>
        <Button color='alt' size='square' onClick={() => {}}>
          alt, full
        </Button>

        <h2>size = 'small'</h2>
        <Button color='prime' size='small' onClick={() => {}}>
          prime, full
        </Button>
        <Button color='prime' size='xsmall' onClick={() => {}}>
          prime, full
        </Button>
        <Button color='invert' size='small' onClick={() => {}}>
          invert, full
        </Button>
        <Button color='line' size='small' onClick={() => {}}>
          line, full
        </Button>
        <Button color='alt' size='small' onClick={() => {}}>
          alt, full
        </Button>

        <h2>size = 'xSmall'</h2>
        <Button color='prime' size='xSmall' onClick={() => {}}>
          prime, full
        </Button>
        <Button color='invert' size='xSmall' onClick={() => {}}>
          invert, full
        </Button>
        <Button color='line' size='xSmall' onClick={() => {}}>
          line, full
        </Button>
        <Button color='alt' size='xSmall' onClick={() => {}}>
          alt, full
        </Button>
      </div>
    </>,
    <>
      <h2>Counter</h2>
      <div className='w-sm bg-red-50'>
        <Counter startAt={0} setter={state => alert(state)}>
          객실
        </Counter>
      </div>
    </>,
    <>
      <h1 className='text-4xl'>Radio</h1>
      <br />
      <Radio name='payment' options={radio1} />
    </>,
    <>
      <h1 className='text-4xl'>Badge</h1>
      <br />
      <Badge type={'sale'} children={15} />
      <br />
      <Badge children={'오늘의최저가'} />
    </>,
    <>
      <h1 className='text-4xl'>Check BoxButton</h1>
      <br />
      <CheckBox name='payment' txt='전체사용' />
      <CheckBox name='agreement' txt='전체동의' disabled />
    </>,
    <>
      <h1 className='text-4xl'>Horizontal List</h1>
      <br />
      <HorizontalList products={products} />
    </>,
    <>
      <h1 className='text-4xl'>DetailSection</h1>
      <br />
      <DetailSection
        type='list-left'
        title='판매자 정보'
        color='text-neutral-600'
        size='text-xs'
        weight='font-normal'
        contents={[
          '연락처 : 010-1234-5678',
          '주소 : 서울시 강남구 어쩌구 저쩌구',
          '고객센터 : 080 - 1234- 5678',
        ]}
      />
      <br />
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
      <br />
      <DetailSection
        type='list-left-dot-title'
        title='숙소 규정'
        color='text-neutral-600'
        size='text-xs'
        weight='font-normal'
        contents={[
          {
            subTitle: '체크인 & 체크아웃 시간',
            subContents: [
              '체크인은 오후 3시 이후입니다.',
              '체크아웃은 오전 11시 이전입니다.',
            ],
          },
          {
            subTitle: '어린이 정책',
            subContents: [
              '어린이 투숙객은 일부 객실에만 가능합니다.',
              '기존 침대를 사용하면 추가 요금이 부과될 수 있습니다.',
            ],
          },
        ]}
      />
      <br />
      <DetailSection
        type='table-left'
        title='객실 정보'
        color='text-neutral-600'
        size='text-sm'
        weight='font-normal'
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
      <br />
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
      <br />
      <DetailSection
        title='내 정보'
        type='table-spacebetween'
        contents={[
          { label: '이름', value: '홍길동' },
          { label: '이메일', value: 'honh_honh_good@gmail.com' },
          { label: '비밀번호 변경', showMore: true },
          { label: '관심숙소', showMore: true },
          { label: '보유포인트', value: '500,000 P' },
        ]}
        // onMoreClick={handleMoreClick} 더보기 클릭 시 열리는 팝업 넣기
      />
    </>,
    <>
      <h1 className='text-4xl'>Horizontal List</h1>
      <br />
      <VerticalList products={products} />
    </>,
    <>
      <h1 className='text-4xl'>SubHeader</h1>
      <br />
      <SubHeader leftButton='arrow' title='예약 세부 정보' fixed={false} />
      <SubHeader leftButton='arrow' title='마이 페이지' fixed={false} />
      <SubHeader leftButton='arrow' title='결제 완료' fixed={false} />
      <SubHeader
        leftButton='close'
        title='비밀번호 변경'
        rightButton={false}
        fixed={false}
      />
      <SubHeader
        leftButton='arrow'
        rightButton={false}
        hasShadow={false}
        fixed={false}
      />
    </>,
    <>
      <h1 className='text-4xl'>Detail Product</h1>
      <br />
      <DetailProduct detailProducts={detailProducts} />
    </>,
    <>
      <Input inputType='email' value={email} onChange={setEmail} />
      <Input inputType='password' value={password} onChange={setPassword} />
      <Input
        inputType='confirmPassword'
        value={confirmpassword}
        onChange={setConfirmpassword}
        compareValue={password}
      />
      <Input
        inputType='name'
        label='이름 넣어요'
        value={name}
        onChange={setName}
      />
      <Input inputType='tel' value={tel} onChange={setTel} />
      <Input
        inputType='search'
        label='search'
        value={search}
        onChange={setSearch}
        placeholder='hi'
      />
    </>,
    <>
      <Anchor type='searchPassword' />
      <br />
      <Anchor type='signUp' />
      <br />
      <Anchor type='login' children={'login'} />
    </>,
  ];

  return (
    <>
      <Tab
        categories={categories}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        {contents[activeTab]}
      </Tab>
    </>
  );
};

export default TestPage;

//사용법
// 어떤 프롭스 값을 넣어야할지는 DetailSection.jsx 열고 보는게 빠름
