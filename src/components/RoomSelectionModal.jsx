// react
import React, { useState, useCallback, useMemo } from 'react';

// components
import Modal from './Modal';
import Counter from './Counter';
import SubHeader from './SubHeader';
import Button from './Button';

const MemoizedCounter = React.memo(Counter);

const RoomSelectionModal = ({ isOpen, onClose, onConfirm = () => {} }) => {
  // date state
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const handleConfirmClick = useCallback(() => {
    onConfirm({ rooms, adults, children, infants });
    onClose();
  }, [rooms, adults, children, infants, onConfirm, onClose]);

  const header = useMemo(
    () => (
      <SubHeader
        title='객실 수 및 투숙 인원 선택'
        leftButton='close'
        callback={onClose}
        rightButton={false}
      />
    ),
    [onClose],
  );

  const content = useMemo(
    () => (
      <div className='counters'>
        <MemoizedCounter setter={setRooms} startAt={1}>
          객실
        </MemoizedCounter>
        <MemoizedCounter setter={setAdults} startAt={1}>
          성인
        </MemoizedCounter>
        <MemoizedCounter setter={setChildren} startAt={0}>
          아동
        </MemoizedCounter>
        <MemoizedCounter setter={setInfants} startAt={0}>
          유아
        </MemoizedCounter>
      </div>
    ),
    [rooms, adults, children, infants],
  );

  const bottomButton = useMemo(
    () => (
      <Button color='prime' size='full' onClick={handleConfirmClick}>
        확인
      </Button>
    ),
    [handleConfirmClick],
  );

  return (
    <Modal
      isOpen={isOpen}
      header={header}
      content={content}
      bottom={bottomButton}
    />
  );
};

export default RoomSelectionModal;
