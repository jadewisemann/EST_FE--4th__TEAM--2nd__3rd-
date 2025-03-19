import { useState, useEffect } from 'react';
import Modal from './Modal';
import Counter from '../Counter';
import SubHeader from '../SubHeader';
import FooterButton from '../FooterButton';

const GuestModal = ({
  isOpen,
  onClose,
  onConfirm = () => {},
  initialGuests = {
    rooms: 1,
    adults: 1,
    children: 0,
    infants: 0,
  },
}) => {
  const [localSelection, setLocalSelection] = useState({ ...initialGuests });

  useEffect(() => {
    if (isOpen) {
      setLocalSelection({
        rooms: initialGuests.rooms || 1,
        adults: initialGuests.adults || 1,
        children: initialGuests.children || 0,
        infants: initialGuests.infants || 0,
      });
    }
  }, [
    isOpen,
    initialGuests.rooms,
    initialGuests.adults,
    initialGuests.children,
    initialGuests.infants,
  ]);

  const handleCounterChange = (key, newValue) => {
    setLocalSelection(prev => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const handleConfirmClick = () => {
    onConfirm({ ...localSelection });
    onClose();
  };

  const content = (
    <>
      <Counter
        minValue={1}
        initialValue={localSelection.rooms}
        onChange={newValue => handleCounterChange('rooms', newValue)}
      >
        객실
      </Counter>
      <Counter
        initialValue={localSelection.adults}
        onChange={newValue => handleCounterChange('adults', newValue)}
      >
        성인
      </Counter>
      <Counter
        initialValue={localSelection.children}
        onChange={newValue => handleCounterChange('children', newValue)}
      >
        아동
      </Counter>
      <Counter
        initialValue={localSelection.infants}
        onChange={newValue => handleCounterChange('infants', newValue)}
      >
        유아
      </Counter>
    </>
  );

  return (
    <Modal isOpen={isOpen} isFull={true}>
      <div className='flex h-full flex-col'>
        <SubHeader
          title='객실 수 및 투숙 인원 선택'
          callback={onClose}
          rightButton={false}
          fixed={false}
        />
        <div className='flex grow flex-col'>{content}</div>
        <FooterButton name='확인' onClick={handleConfirmClick} />
      </div>
    </Modal>
  );
};

export default GuestModal;
