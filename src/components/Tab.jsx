import { useState } from 'react';
import Icon from './Icon';

const Tab = () => {
  const categories = ['전체', '모텔', '호텔/리조트', '팬션/풀빌라', '해외숙소'];
  const contents = ['tab1', 'tab2', 'tab3', 'tab4', 'tab5'];
  const [activeTab, setActiveTab] = useState(0); //선택된 카테고리
  const [sort, setSort] = useState('asc'); //asc: 오름차순, desc: 내림차순

  return (
    <>
      <div className='relative mx-5 mt-5 flex items-center'>
        <div className='flex items-center gap-x-2 overflow-x-auto pr-2'>
          {categories.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveTab(idx);
              }}
              className={`shrink-0 rounded-2xl border-1 p-2 py-1.5 text-xs ${activeTab === idx ? 'border-violet-600 font-bold text-violet-600' : 'border-neutral-300 text-black'}`}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          className='ml-auto flex h-9 flex-none items-center gap-x-1 border-l-1 border-neutral-300 bg-white py-2 pl-3 text-xs'
          onClick={() => {
            setSort(prev => (prev === 'asc' ? 'desc' : 'asc'));
          }}
        >
          <Icon name='sort' color='black' size={16} />
          <span className='sr-only'> 위아래 화살표 아이콘</span>정렬
        </button>
      </div>
      <div className='mx-5 mt-5'>{contents[activeTab]}</div>
    </>
  );
};

export default Tab;
