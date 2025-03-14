import React from 'react';
import Button from '../../components/Button';
import HorizontalList from '../../components/HorizontalList';
import Nav from '../../components/Nav';

const MainPage = () => {
  // 수평 리스트 데이터
  const products = [
    {
      thumbnail:
        'https://content.skyscnr.com/m/6181bf94ffc99b59/original/Lotte-Hotel-Jeju.jpg?resize=1000px:1000px&quality=100)',
      rate: 4.8,
      name: '갤럭시 호텔',
      location: '서울특별시, 성동구',
      price: 120000,
      discount: 10,
    },
    {
      thumbnail:
        'https://content.skyscnr.com/m/6181bf94ffc99b59/original/Lotte-Hotel-Jeju.jpg?resize=1000px:1000px&quality=100)',
      rate: 3,
      name: '원하는 호텔',
      location: '서울특별시, 중구',
      price: 80000,
      discount: 15,
    },
  ];

  const categories = [
    {
      src: 'https://media.discordapp.net/attachments/1308001170350149652/1347158726791921754/ico_____.png?ex=67d4b215&is=67d36095&hm=66d0d23e868171f884d22eadb113faf51dfc0b6a256110dabb4475fc71601966&=&format=webp&quality=lossless',
      label: '호텔/리조트',
    },
    {
      src: 'https://media.discordapp.net/attachments/1308001170350149652/1347158725802197015/ico_____.png?ex=67d4b215&is=67d36095&hm=2a3003bfd01a17c6549ce34a836cba055ae1623668e0e8a2979f2fb4f7288600&=&format=webp&quality=lossless',
      label: '펜션/풀빌라',
    },
    {
      src: 'https://media.discordapp.net/attachments/1308001170350149652/1347158726070763580/ico____.png?ex=67d4b215&is=67d36095&hm=51b2e9f7d480a14e718f1cc4eb96120033cf3e1c77e4199c7887bede602747f2&=&format=webp&quality=lossless',
      label: '모텔',
    },
    {
      src: 'https://media.discordapp.net/attachments/1308001170350149652/1347158726351786086/ico_____.png?ex=67d4b215&is=67d36095&hm=b021e8c6fb88e2251affb4966e1afd14db6a5c445020e63733e95420f5301d57&=&format=webp&quality=lossless',
      label: '해외숙소',
    },
  ];
  return (
    <>
      <div className='flex h-screen flex-col justify-between bg-[url(https://content.skyscnr.com/m/6181bf94ffc99b59/original/Lotte-Hotel-Jeju.jpg?resize=1000px:1000px&quality=100)]'>
        <div className='flex flex-col p-5'>
          <div className='flex flex-col items-center text-xl text-white'>
            <strong>누구누구 님</strong>
            <strong>환영합니다.</strong>
          </div>
          <input type='text' />
          <input type='text' />
          <input type='text' />
          <Button
            color='prime'
            size='full'
            className='rounded-2xl'
            onClick={() => {}}
          >
            확인 (1박)
          </Button>
        </div>
        <div className='rounded-t-md bg-white p-5 pb-[80px]'>
          <div className='flex items-center justify-center gap-5'>
            {categories.map((item, idx) => (
              <button
                key={idx}
                className='flex cursor-pointer flex-col items-center'
              >
                <img className='h-18 object-contain' src={item.src} alt='' />
                <span className='text-sm'>{item.label}</span>
              </button>
            ))}
          </div>
          <div className='mt-10 mb-5 flex items-center justify-between'>
            <h4 className='text-base font-bold'>추천호텔</h4>
            <button className='cursor-pointer text-sm text-violet-600'>
              전체보기
            </button>
          </div>
          <HorizontalList products={products} />
        </div>
      </div>
      <Nav />
    </>
  );
};

export default MainPage;
