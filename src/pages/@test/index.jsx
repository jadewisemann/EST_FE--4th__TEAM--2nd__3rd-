// react
import Tab from '../../components/Tab';
import Calendar from '../../components/Calendar';
import Icon from '../../components/Icon';
import ReviewRating from '../../components/ReviewRating';
import Rating from '../../components/Rating';
import Nav from '../../components/Nav';
import Complete from '../../components/Complete';
import Heart from '../../components/Heart';
import Badge from '../../components/badge';
import Button from '../../components/Button';
import Radio from '../../components/Radio';
import CheckBox from '../../components/CheckBox';
import Counter from '../../components/Counter';
import HorizontalList from '../../components/HorizontalList';
import DetailSection from '../../components/DetailSection';
import VerticalList from '../../components/VerticalList';
import SubHeader from '../../components/SubHeader';

// 수평 리스트 임시 이미지
import tempHotel1 from './../../assets/temp/temp_hotel1.png';

// components
const TestPage = () => {
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
      <Icon name='swimmingpool' />
      <Icon name='door' />
      <Icon name='person' />
      <Icon name='Children' />
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
        categories={['전체', '모텔', '호텔/리조트', '팬션/풀빌라', '해외숙소']}
        contents={['tab1', 'tab2', 'tab3', 'tab4', 'tab5']}
      />
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
      <h1 className='text-4xl'>Check Box</h1>
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
        contents={[
          '체크인일 기준 1일전 18시 까지 : 100% 환불',
          '체크아웃 오전 11시 이전',
          '흡연 금지',
        ]}
      />
      <br />
      <DetailSection
        type='list-left-dot-title'
        title='숙소 규정'
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
        contents={[
          {
            hotelName: '리츠칼튼 호텔(Ritz-Carlton Hotel)',
            roomName: '디럭스 더블룸',
            schedule: '2024-04-10 ~ 2024-04-12',
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
      <br />
      <h1 className='text-4xl'>Horizontal List</h1>
      <br />
      <VerticalList products={products} />
    </>,
    <>
      <br />
      <h1 className='text-4xl'>SubHeader</h1>
      <br />
      <SubHeader leftButton='arrow' title='예약 세부 정보' />
      <SubHeader leftButton='arrow' title='마이 페이지' />
      <SubHeader leftButton='arrow' title='결제 완료' />
      <SubHeader leftButton='close' title='비밀번호 변경' rightButton={false} />
      <SubHeader leftButton='arrow' rightButton={false} hasShadow={false} />

    </>,
  ];

  return (
    <>
      <Tab categories={categories} contents={contents} />
    </>
  );
};

export default TestPage;
