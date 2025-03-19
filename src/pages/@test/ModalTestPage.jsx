import { useState, useCallback, useMemo } from 'react';
import Button from '../../components/Button';
import { DateModal, GuestModal, SearchModal } from '../../components/modal';

const ModalTestPage = () => {
  // 모달 상태
  const [modals, setModals] = useState({
    searchModal: { isOpen: false },
    dateModal: { isOpen: false },
    guestModal: { isOpen: false },
  });

  // 모달 관련 함수 (useCallback으로 메모이제이션)
  const openModal = useCallback(modalName => {
    setModals(prev => ({
      ...prev,
      [modalName]: { isOpen: true },
    }));
  }, []);

  const closeModal = useCallback(modalName => {
    setModals(prev => ({
      ...prev,
      [modalName]: { isOpen: false },
    }));
  }, []);

  // 날짜 상태
  const defaultDuration = 1;

  // useMemo로 초기 날짜 계산
  const initialDates = useMemo(() => {
    const start = new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + defaultDuration);

    const formatDate = date => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      startDate: formatDate(start),
      endDate: formatDate(end),
    };
  }, []);

  const [date, setDate] = useState({
    startDate: initialDates.startDate,
    endDate: initialDates.endDate,
    duration: defaultDuration,
  });

  // 날짜 업데이트 함수 (useCallback으로 메모이제이션)
  const updateDates = useCallback(
    ({ startDate, endDate }) => {
      setDate(prev => {
        // 새 시작일과 종료일로 기간 계산
        const start = new Date(startDate);
        const end = new Date(endDate);
        const durationInDays = Math.floor(
          (end - start) / (1000 * 60 * 60 * 24),
        );

        return {
          ...prev,
          startDate,
          endDate,
          duration: durationInDays > 0 ? durationInDays : defaultDuration,
        };
      });
    },
    [defaultDuration],
  );

  // 투숙객 정보
  const [guests, setGuests] = useState({
    rooms: 1,
    adults: 1,
    children: 0,
    infants: 0,
  });

  // 투숙객 업데이트 함수 (useCallback으로 메모이제이션)
  const updateGuests = useCallback(newGuests => {
    setGuests(prev => ({
      ...prev,
      ...newGuests,
    }));
  }, []);

  // SearchModal 확인 버튼 처리 (useCallback으로 메모이제이션)
  const handleSearchConfirm = useCallback(() => {
    console.log('검색 확인:', { date, guests });
    closeModal('searchModal');
    // 여기에 검색 로직 추가
  }, [date, guests, closeModal]);

  // 모달 확인 핸들러 (useCallback으로 메모이제이션)
  const handleDateConfirm = useCallback(
    newDates => {
      updateDates(newDates);
      closeModal('dateModal');
    },
    [updateDates, closeModal],
  );

  const handleGuestConfirm = useCallback(
    newGuests => {
      updateGuests(newGuests);
      closeModal('guestModal');
    },
    [updateGuests, closeModal],
  );

  return (
    <>
      <DateModal
        isOpen={modals.dateModal.isOpen}
        onClose={() => closeModal('dateModal')}
        initialDates={{
          startDate: date.startDate,
          endDate: date.endDate,
        }}
        onConfirm={handleDateConfirm}
      />

      <GuestModal
        isOpen={modals.guestModal.isOpen}
        onClose={() => closeModal('guestModal')}
        initialGuests={guests}
        onConfirm={handleGuestConfirm}
      />

      <SearchModal
        isOpen={modals.searchModal.isOpen}
        onClose={() => closeModal('searchModal')}
        initialDates={{
          startDate: date.startDate,
          endDate: date.endDate,
          duration: date.duration,
        }}
        initialGuests={guests}
        onConfirm={handleSearchConfirm}
        openModal={openModal}
      />

      <div className='space-y-4 p-4'>
        <Button onClick={() => openModal('searchModal')}>
          객실 검색 모달 열기
        </Button>
      </div>
    </>
  );
};

export default ModalTestPage;
