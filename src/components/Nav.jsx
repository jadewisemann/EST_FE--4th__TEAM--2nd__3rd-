import { useEffect, useState } from 'react';
import Icon from './Icon';
import { Link, useLocation } from 'react-router-dom';

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
        className={`fixed bottom-0 left-0 z-99 flex w-full items-center justify-between rounded-t-lg bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out ${show ? 'opacity-100" translate-y-0' : 'translate-y-full opacity-0'} `}
      >
        {navMenus.map((item, idx) => (
          <Link to={item.path} key={idx} className='flex-1'>
            <button
              key={idx}
              onClick={() => {
                setActiveNavMenu(idx);
              }}
              className='flex w-full flex-col items-center py-5'
            >
              <Icon
                name={item.name}
                size={item.size}
                color={`${activeNavMenu === idx ? '#8E51FF' : '#AEACAC'}`}
              />
            </button>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Nav;
