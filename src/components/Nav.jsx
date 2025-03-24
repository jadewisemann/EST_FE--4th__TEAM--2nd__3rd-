import { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import Icon from './Icon';

const Nav = () => {
  const [navMenus] = useState([
    { name: 'home', size: '18', path: '/' },
    { name: 'search', size: '18', path: '/result' },
    { name: 'heart', size: '16', path: '/heart' },
    { name: 'user', size: '16', path: '/user' },
  ]);
  const [activeNavMenu, setActiveNavMenu] = useState(0); //선택된 메뉴
  const [show, setShow] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState('');
  const [nightCount, setNightCount] = useState('');

  //몇박인지 계산
  const getNights = (start, end) => {
    const diff = new Date(end) - new Date(start);
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `${nights}박`;
  };
  //오늘 ~ 내일 날짜 셋팅
  const weekday = ['일', '월', '화', '수', '목', '금', '토'];
  const getFormattedDateRange = () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const formet = date => {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayOfWeek = weekday[date.getDay()];
      return `${month}월 ${day}일 (${dayOfWeek})`;
    };
    setNightCount(getNights(today, tomorrow));
    return `${formet(today)} ~ ${formet(tomorrow)}`;
  };

  useEffect(() => {
    const dateRange = getFormattedDateRange();
    setSelectedDate(dateRange);
  }, []);

  //스크롤이벤트
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    //스크롤이 불가능한 경우 (문서 높이가 뷰포트보다 작으면 항상 보이게)
    if (documentHeight <= viewportHeight) {
      setShow(true);
      return;
    }

    if (scrollTop >= viewportHeight / 2) {
      //스크롤이 중간 이상 내려갔을 때 네비게이션 바 표시
      setShow(true);
    } else if (scrollTop + viewportHeight >= documentHeight - 50) {
      //스크롤이 거의 맨 아래에 도달했을 때 네비게이션 바 표시
      setShow(true);
    } else {
      //그 외에는 네비게이션 바 숨김
      setShow(false);
    }
  };

  useEffect(() => {
    // 경로가 변경될 때 activeNavMenu 업데이트 (네비게이션 유지)
    const currentIdx = navMenus.findIndex(
      menu => menu.path === location.pathname,
    );
    if (currentIdx !== -1) {
      setActiveNavMenu(currentIdx);
    }
  }, [location.pathname]);

  useEffect(() => {
    // handleScroll(); //페이지 로드 시에도 실행하여 스크롤이 없을 때 네비바를 보이게 처리
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll); //clean up
    };
  }, []);

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 z-99 flex w-full items-center justify-between rounded-t-lg bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out ${show ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'} `}
      >
        {navMenus.map((item, idx) => (
          <button
            key={idx}
            className='flex w-full flex-col items-center py-5'
            onClick={() => {
              setActiveNavMenu(idx);
              navigate(item.path);
            }}
          >
            <Icon
              name={item.name}
              size={item.size}
              color={`${activeNavMenu === idx ? '#8E51FF' : '#AEACAC'}`}
            />
          </button>
        ))}
      </div>
    </>
  );
};

export default Nav;
