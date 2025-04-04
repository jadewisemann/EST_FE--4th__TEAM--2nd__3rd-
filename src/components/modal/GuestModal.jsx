// React
import { useState, useEffect } from 'react';

// Store
import useAppDataStore from '../../store/appDataStore';
import useModalStore from '../../store/modalStore';

// Component
import Counter from '../Counter';
import FooterButton from '../FooterButton';
import SubHeader from '../SubHeader';

import Modal from './Modal';

const GuestModal = () => {
  // 모달 상태
  const { modals, closeGuestModal } = useModalStore();
  const { isOpen, onConfirm } = modals.guest;

  // 전역 게스트 상태
  const { guests, updateGuests } = useAppDataStore();

  // 로컬 게스트 정보 관리
  const [localSelection, setLocalSelection] = useState({ ...guests });

  // 모달이 열릴 때 동기화
  useEffect(() => {
    if (isOpen) {
      setLocalSelection({ ...guests });
    }
  }, [isOpen, guests]);

  const handleCounterChange = (key, newValue) => {
    setLocalSelection(prev => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const handleConfirmClick = () => {
    // 중앙 스토어에 업데이트
    updateGuests(localSelection);

    // prop으로 받은 콜백 실행
    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm(localSelection);
    }

    closeGuestModal();
  };

  return (
    <Modal isOpen={isOpen} isFull={true}>
      <div className='flex h-full flex-col bg-white dark:bg-black'>
        <SubHeader
          title='객실 수 및 투숙 인원 선택'
          callback={closeGuestModal}
          rightButton={false}
          fixed={false}
          leftButton='close'
        />
        <div className='flex grow flex-col'>
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
        </div>
        <FooterButton name='확인' onClick={handleConfirmClick} />
      </div>
    </Modal>
  );
};

export default GuestModal;
