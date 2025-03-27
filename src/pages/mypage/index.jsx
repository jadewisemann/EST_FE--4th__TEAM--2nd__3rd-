import React from 'react';

import { useNavigate } from 'react-router-dom';

import useAuthStore from '../../store/authStore';
import useDarkModeStore from '../../store/darkModeStore';
import useReservationStore from '../../store/reservationStore';

import Anchor from '../../components/Anchor';
import Button from '../../components/Button';
import Complete from '../../components/Complete';
import DetailSection from '../../components/DetailSection';
import Nav from '../../components/Nav';
import SubHeader from '../../components/SubHeader';
import VerticalList from '../../components/VerticalList';

const MyPage = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useAuthStore();

  const { reservations, loading } = useReservationStore();
  const { toggleDarkMode } = useDarkModeStore();

  console.log('[MyPage] 예약 리스트:', reservations);

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
      <SubHeader
        leftButton='arrow'
        title='마이페이지'
        hasShadow={false}
        zIndex={10}
      />
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
          { label: '이름', value: '홍길동' },
          { label: '이메일', value: 'honh_honh_good@gmail.com' },
          { label: '보유포인트', value: '500,000 P' },
        ]}
        onclick={() => {}} //더보기 클릭 시 열리는 팝업 넣기
      />
      <br />
      <DetailSection
        title='설정'
        type='table-spacebetween'
        contents={[
          { label: '비밀번호 변경', showMore: true, showMoreText: '더보기' },
          { label: '다크모드', anchor: true, anchorText: '적용하기' },
        ]}
        onclick={toggleDarkMode}
      />
      <button
        onClick={handleLogout}
        className='mt-10 block w-full text-center text-xs underline underline-offset-2'
      >
        로그아웃
      </button>
      <Nav />
    </div>
  );
};

export default MyPage;
