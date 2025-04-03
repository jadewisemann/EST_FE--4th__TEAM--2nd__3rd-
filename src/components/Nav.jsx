import { useEffect, useState } from 'react';

import { NavLink } from 'react-router-dom';

import Icon from './Icon';

const Nav = () => {
  // const [show, setShow] = useState(true);
  const [navMenus] = useState([
    { name: 'home', size: '18', path: '/', desc: '홈' },
    { name: 'search', size: '18', path: '/search-result', desc: '검색' },
    { name: 'heart', size: '16', path: '/wishlist', desc: '찜 목록' },
    { name: 'user', size: '16', path: '/mypage', desc: '마이' },
  ]);

  // //스크롤이벤트
  // const handleScroll = () => {
  //   const scrollTop = window.scrollY;
  //   const viewportHeight = window.innerHeight;
  //   const documentHeight = document.documentElement.scrollHeight;

  //   //스크롤이 불가능한 경우 (문서 높이가 뷰포트보다 작으면 항상 보이게)
  //   if (documentHeight <= viewportHeight) {
  //     setShow(true);
  //     return;
  //   }

  //   if (scrollTop >= viewportHeight / 2) {
  //     //스크롤이 중간 이상 내려갔을 때 네비게이션 바 표시
  //     setShow(true);
  //   } else if (scrollTop + viewportHeight >= documentHeight - 50) {
  //     //스크롤이 거의 맨 아래에 도달했을 때 네비게이션 바 표시
  //     setShow(true);
  //   } else {
  //     //그 외에는 네비게이션 바 숨김
  //     setShow(false);
  //   }
  // };

  // useEffect(() => {
  //   // handleScroll(); //페이지 로드 시에도 실행하여 스크롤이 없을 때 네비바를 보이게 처리
  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll); //clean up
  //   };
  // }, []);

  return (
    <nav className='center-fixed-item fixed bottom-0 z-99 flex w-full items-center justify-between rounded-t-lg bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out dark:bg-neutral-800 dark:shadow-[0_-2px_10px_rgba(255,255,255,0.25)]'>
      {navMenus.map(item => (
        <NavLink
          key={item.name}
          to={item.path}
          className='flex w-full flex-col items-center py-5'
          title={`${item.desc} 페이지로 이동`}
        >
          {({ isActive }) => (
            <Icon
              name={item.name}
              size={item.size}
              className={
                isActive
                  ? 'text-violet-600 dark:text-violet-400'
                  : 'text-neutral-400 dark:text-neutral-300'
              }
            />
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default Nav;
