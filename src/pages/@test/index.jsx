// react
import Tab from '../../components/tab';
import Calendar from '../../components/Calendar';
import Icon from '../../components/Icon';
import ReviewRating from '../../components/ReviewRating';
import Rating from '../../components/Rating';
import Nav from '../../components/Nav';
import Heart from '../../components/Heart';
import Badge from '../../components/badge';

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
      <h1 className='text-4xl'>Badge</h1>
      <br />
      <Badge type={'sale'} children={15} />
      <br />
      <Badge children={'오늘의 최저가'} />
    </>,
  ];

  return (
    <>
      <Tab categories={categories} contents={contents} />
    </>
  );
};

export default TestPage;
