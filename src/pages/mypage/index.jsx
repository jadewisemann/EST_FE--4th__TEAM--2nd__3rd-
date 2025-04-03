import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import useAuthStore from '../../store/authStore';
import useDarkModeStore from '../../store/darkModeStore';
import useModalStore from '../../store/modalStore';
import { useReservationWithAuth } from '../../store/reservationStore';
import { useUserStore } from '../../store/userStore';

import { getRoomById } from '../../firebase/searchQuery';

import Button from '../../components/Button';
import Complete from '../../components/Complete';
import DetailSection from '../../components/DetailSection';
import Nav from '../../components/Nav';
import SubHeader from '../../components/SubHeader';
import VerticalList from '../../components/VerticalList';

const MyPage = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useDarkModeStore();
  const { openPasswordChangeModal } = useModalStore();
  const { points, loadUserData, isLoading } = useUserStore();

  const { reservations } = useReservationWithAuth();

  // const [showAll, setShowAll] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3); // 몇 개 보여줄지
  const [mergedReservations, setMergedReservations] = useState([]);
  const displayedReservations = mergedReservations.slice(0, visibleCount);

  const userName = user
    ? `${user.displayName || user.email?.split('@')[0]}`
    : '로그인';

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!reservations || reservations.length === 0) {
        setMergedReservations([]);
        return;
      }

      const merged = await Promise.all(
        reservations.map(async res => {
          try {
            const room = await getRoomById(res.roomId);
            return {
              ...res,
              title:
                room?.hotel_title
                || room?.title
                || res?.roomName
                || '객실 정보 없음',
              image: room?.img || '이미지 없음',
              price: room?.price || room?.price_final || '금액 정보 없음',
            };
          } catch (error) {
            console.error('❌ room fetch 실패:', res.roomId, error);
            return {
              ...res,
              title: res.hotelName || '숙소명 없음',
              image: [],
              price: '금액 정보 없음',
            };
          }
        }),
      );

      setMergedReservations(merged);
    };
    fetchRooms();
  }, [reservations]);

  const handleLogout = async () => {
    const confirm = window.confirm('정말 로그아웃하시겠습니까?');
    if (!confirm) return;
    await logout();
    navigate('/');
  };

  const handleSearchHotel = () => {
    navigate('/search-result');
  };

  useEffect(() => {
    console.log('isLoading', isLoading);
  }, isLoading);

  return (
    <>
      <header>
        <Nav />
      </header>
      <div className='container'>
        <SubHeader leftButton='arrow' title='마이페이지' zIndex={10} />

        {isLoading ? (
          <>
            <div>로딩 중</div>
          </>
        ) : !reservations || reservations.length === 0 ? (
          <>
            <Complete type='notYet' message='아직 예약 된 숙소가 없습니다!'>
              <Button color='prime' size='full' onClick={handleSearchHotel}>
                숙소 검색하기
              </Button>
            </Complete>
            <hr className='mb-6 block border-neutral-300' />
          </>
        ) : (
          <>
            <h3 className='mt-6 font-bold dark:text-neutral-50'>
              예약 세부정보
            </h3>
            <VerticalList
              products={displayedReservations}
              isLoading={isLoading}
            />

            {mergedReservations.length > visibleCount ? (
              <Button
                size='full'
                color='invert'
                className='mx-auto mt-4 mb-10'
                onClick={() => setVisibleCount(prev => prev + 5)}
              >
                더보기 ({mergedReservations.length - visibleCount}개)
              </Button>
            ) : (
              <hr className='mb-6 block border-0' />
            )}
          </>
        )}
        <DetailSection
          title='내 정보'
          type='table-spacebetween'
          contents={[
            { label: '이름', value: userName },
            { label: '이메일', value: user.email },
            { label: '보유포인트', value: `${points.toLocaleString()} P` },
          ]}
        />
        <br />
        <DetailSection
          title='설정'
          type='table-spacebetween'
          contents={[
            {
              label: '비밀번호 변경',
              showMore: true,
              showMoreText: '더보기',
            },
            {
              label: `${darkMode === 'dark' ? '라이트모드' : '다크모드'}`,
              anchor: true,
              anchorText: '적용하기',
            },
          ]}
          onclick={item => {
            if (item.label === '비밀번호 변경') {
              openPasswordChangeModal();
            } else if (item.label.includes('모드')) {
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
      </div>
    </>
  );
};

export default MyPage;
