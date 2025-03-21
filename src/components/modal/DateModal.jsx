// React
import { useState, useEffect, useCallback, useRef } from 'react';

// Store
import useModalStore from '../../store/modalStore';
import useAppDataStore from '../../store/appDataStore';

// Component
import Modal from './Modal';
import SubHeader from '../SubHeader';
import Calendar from '../Calendar';
import FooterButton from '../FooterButton';

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

  // 핸들러
  const handleCalendarDateChange = useCallback(newDates => {
    setSelectedDates(newDates);
  }, []);

  const handleConfirm = () => {
    // 중앙 스토어에 업데이트
    updateDates(selectedDates);

    // prop으로 받은 콜백 실행
    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm(selectedDates);
    }

    closeDateModal();
  };

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
          disabled={!selectedDates.startDate || !selectedDates.endDate}
          className='w-full'
          name='확인'
        />
      </div>
    </Modal>
  );
};

export default DateModal;
