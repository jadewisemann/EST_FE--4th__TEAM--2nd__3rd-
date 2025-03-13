// react
import Tab from '../../components/tab';
import Calendar from '../../components/Calendar';
import Icon from '../../components/Icon';
import ReviewRating from '../../components/ReviewRating';
import Rating from '../../components/Rating';
import Nav from '../../components/Nav';
import Complete from '../../components/Complete';
import Heart from '../../components/Heart';
import Button from '../../components/Button';
import Radio from '../../components/Radio';

// components
const TestPage = () => {
  const categories = [
    'Calendar',
    'Icon',
    'Rating',
    'Nav',
    'tab',
    'Complete',
    'Button',
    'Radio',
  ];

  // 라디오 버튼 예시
  const radio1 = [
    { value: '신용카드', disabled: true },
    { value: '포인트 결제', disabled: false },
    { value: '현장에서 결제하기', disabled: false },
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
        <button>숙소 검색하기</button>
      </Complete>
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
      </div>
    </>,
    <>
      <h1 className='text-4xl'>Radio</h1>
      <br />
      <Radio name='payment' options={radio1} />
    </>,
  ];

  return (
    <>
      <Tab categories={categories} contents={contents} />
    </>
  );
};

export default TestPage;
