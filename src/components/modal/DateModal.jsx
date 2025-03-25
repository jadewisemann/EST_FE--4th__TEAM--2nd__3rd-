import { useState, useEffect, useCallback } from 'react';

import useAppDataStore from '../../store/appDataStore';
import useModalStore from '../../store/modalStore';

import Calendar from '../Calendar';
import FooterButton from '../FooterButton';
import SubHeader from '../SubHeader';

import Modal from './Modal';

const DateModal = () => {
  // 모달 상태
  const { modals, closeDateModal } = useModalStore();
  const { isOpen, onConfirm } = modals.date;
  //  전역 날짜 & 스크롤 위치
  const { dates, updateDates } = useAppDataStore();
  // 로컬 날짜 상태
  const [selectedDates, setSelectedDates] = useState({
    startDate: dates.startDate || null,
    endDate: dates.endDate || null,
  });

  // 모달 열릴때 마다 날짜 동기화
  useEffect(() => {
    if (isOpen) {
      setSelectedDates({
        startDate: dates.startDate || null,
        endDate: dates.endDate || null,
      });
    }
  }, [isOpen, dates]);

  // 핸들러/메모이제이션된 날짜 변경 핸들러
  const handleCalendarDateChange = useCallback(newDates => {
    setSelectedDates(newDates);
  }, []);

  // 핸들러/메모이제이션된 확인 버튼 핸들러
  const handleConfirm = useCallback(() => {
    // 중앙 스토어에 업데이트
    updateDates(selectedDates);
    // prop으로 받은 콜백 실행
    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm(selectedDates);
    }
    closeDateModal();
  }, [selectedDates, updateDates, onConfirm, closeDateModal]);

  // 날짜가 선택되었는지 확인하는 조건
  const isDateSelectionComplete =
    selectedDates.startDate && selectedDates.endDate;

  return (
    <Modal isOpen={isOpen} isFull={true}>
      <div className='flex h-screen flex-col'>
        <SubHeader title='날짜 선택' callback={closeDateModal} fixed={false} />
        <div
          className='flex-1 overflow-y-auto'
          style={{ scrollbarWidth: 'none' }}
        >
          <Calendar
            startDate={selectedDates.startDate}
            endDate={selectedDates.endDate}
            onChange={handleCalendarDateChange}
          />
        </div>
        <FooterButton
          onClick={handleConfirm}
          disabled={!isDateSelectionComplete}
          className='w-full'
          name='확인'
        />
      </div>
    </Modal>
  );
};
export default DateModal;
