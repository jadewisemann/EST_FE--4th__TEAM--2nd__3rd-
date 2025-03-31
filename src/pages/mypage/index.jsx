import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import useAuthStore from '../../store/authStore';
import useDarkModeStore from '../../store/darkModeStore';
import useModalStore from '../../store/modalStore';
import useReservationWithAuth, { useUserStore } from '../../store/userStore';

import Button from '../../components/Button';
import Complete from '../../components/Complete';
import DetailSection from '../../components/DetailSection';
import Nav from '../../components/Nav';
import SubHeader from '../../components/SubHeader';
import VerticalList from '../../components/VerticalList';

const MyPage = () => {
  const navigate = useNavigate();
  const { openPasswordChangeModal } = useModalStore();
  const { user, logout } = useAuthStore();
  // const { point, reservations, loading, error } = useReservationWithAuth();
  // const { point, reservations, loading, error } = useReservationWithAuth();
  const userName = user
    ? `${user.displayName || user.email?.split('@')[0]}`
    : '로그인';

  const { userData, points, loadUserData, isLoading, reservations } =
    useUserStore();

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  console.log(points);
  console.log(userData);
  console.log('reservations', reservations);

  const { toggleDarkMode } = useDarkModeStore();

  console.log('[MyPage] 예약 리스트:', userData);

  const handleLogout = async () => {
    const confirm = window.confirm('정말 로그아웃하시겠습니까?');
    if (!confirm) return;
    await logout();
    navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
  };

  const handleSearchHotel = () => {
    // navigate('/result', { state: { name: '부산' } }); 검색어 넘길 수 있음
    navigate('/result');
  };

  return (
    <div className='container'>
      <SubHeader leftButton='arrow' title='마이페이지' zIndex={10} />
      {!reservations || reservations.length === 0 ? (
        <Complete type='notYet' message='아직 예약 된 숙소가 없습니다!'>
          <Button color='prime' size='full' onClick={handleSearchHotel}>
            숙소 검색하기
          </Button>
        </Complete>
      ) : (
        <VerticalList products={reservations} />
      )}
      <hr className='mb-6 block border-neutral-300' />
      <DetailSection
        title='내 정보'
        type='table-spacebetween'
        contents={[
          { label: '이름', value: userName },
          { label: '이메일', value: user.email },
          { label: '보유포인트', value: points.toLocaleString() },
        ]}
      />
      <br />
      <DetailSection
        title='설정'
        type='table-spacebetween'
        contents={[
          { label: '비밀번호 변경', showMore: true, showMoreText: '더보기' },
          { label: '다크모드', anchor: true, anchorText: '적용하기' },
        ]}
        onclick={item => {
          if (item.label === '비밀번호 변경') {
            openPasswordChangeModal();
          } else if (item.label === '다크모드') {
            toggleDarkMode();
          }
        }}
      />
      <button
        onClick={handleLogout}
        className='mt-8 block w-full text-center text-xs underline underline-offset-2'
      >
        로그아웃
      </button>
      <Nav />
    </div>
  );
};

export default MyPage;
