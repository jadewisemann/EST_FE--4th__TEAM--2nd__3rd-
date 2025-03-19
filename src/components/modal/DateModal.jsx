import { useState, useEffect, useCallback, memo } from 'react';
import Modal from './Modal';
import SubHeader from '../SubHeader';
import Calendar from '../Calendar';
import FooterButton from '../FooterButton';

const DateModal = ({ isOpen, onClose, onConfirm = () => {}, initialDates }) => {
  const [selectedDates, setSelectedDates] = useState({
    startDate: initialDates?.startDate || null,
    endDate: initialDates?.endDate || null,
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedDates({
        startDate: initialDates?.startDate || null,
        endDate: initialDates?.endDate || null,
      });
    }
  }, [isOpen, initialDates]);

  const handleCalendarDateChange = useCallback(
    newDates => {
      setSelectedDates(newDates);
      console.log(selectedDates);
    },
    [selectedDates],
  );

  const handleConfirm = useCallback(() => {
    onConfirm(selectedDates);
  }, [selectedDates, onConfirm]);

  return (
    <Modal isOpen={isOpen} isFull={true}>
      <div className='flex h-screen flex-col'>
        <SubHeader title='날짜 선택' callback={onClose} fixed={false} />

        <div
          className='flex-1 overflow-y-auto'
          style={{ scrollbarWidth: 'none' }}
        >
          <MemoizedCalendar
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

const MemoizedCalendar = memo(Calendar);

export default DateModal;
