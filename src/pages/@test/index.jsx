// react
import Tab from '../../components/tab';
import Calendar from '../../components/Calendar';
import Icon from '../../components/Icon';
import ReviewRating from '../../components/ReviewRating';
import Rating from '../../components/Rating';
import Nav from '../../components/Nav';
import Heart from '../../components/Heart';
import Badge from '../../components/badge';

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
    'heart',
    'badge',
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
