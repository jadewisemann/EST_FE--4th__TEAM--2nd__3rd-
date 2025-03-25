import { useEffect, useState } from 'react';

import { NavLink } from 'react-router-dom';

import useAuthStore from '../store/authStore';

import Icon from './Icon';

const Nav = () => {
  const navMenus = [
    { name: 'home', size: '18', path: '/' },
    { name: 'search', size: '18', path: '/result' },
    { name: 'heart', size: '16', path: '/wishlist' },
    { name: 'user', size: '16', path: '/userinfo' },
  ];
  const [show, setShow] = useState(true);
  const { user } = useAuthStore();
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
    // handleScroll(); //페이지 로드 시에도 실행하여 스크롤이 없을 때 네비바를 보이게 처리
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll); //clean up
    };
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 z-99 flex w-full items-center justify-between rounded-t-lg bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out ${show ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'} `}
    >
      {navMenus.map(item => (
        <NavLink
          key={item.path}
          to={
            item.path === '/userinfo'
              ? user
                ? '/profile'
                : '/login'
              : item.path
          }
          className='flex w-full flex-col items-center py-5'
        >
          {({ isActive }) => (
            <Icon
              name={item.name}
              size={item.size}
              color={isActive ? '#8E51FF' : '#AEACAC'}
            />
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default Nav;
