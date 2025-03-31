// Store
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import useAppDataStore from '../../store/appDataStore';
import useModalStore from '../../store/modalStore';

// Components
import Button from '../Button';
import Input from '../Input';
import SubHeader from '../SubHeader';

import Modal from './Modal';
const SearchModal = () => {
  const navigate = useNavigate();

  const { modals, closeSearchModal, openDateModal, openGuestModal } =
    useModalStore();
  const { isOpen, onConfirm } = modals.search;

  const { dates, guests } = useAppDataStore();

  const [searchValue, setSearchValue] = useState('');

  const handleConfirmClick = () => {
    closeSearchModal();

    navigate(`/result/?keyword=${encodeURIComponent(searchValue)}`);

    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm();
    }
  };

  return (
    <Modal isOpen={isOpen} isFull={false}>
      <SubHeader
        title='모든 객실'
        leftButton='close'
        callback={closeSearchModal}
        rightButton={false}
        fixed={false}
      />
      <div className='flex flex-col gap-4 bg-white p-4 dark:bg-black'>
        <Input
          inputType='search'
          value={searchValue}
          onChange={setSearchValue}
        />
        <Button
          color='line'
          icon='calendar'
          iconSize='20'
          onClick={() => openDateModal()}
        >
          {`${dates.startDate} ~ ${dates.endDate}`}
        </Button>
        <Button
          color='line'
          icon='user'
          iconSize='20'
          onClick={() => openGuestModal()}
        >
          {`객실 ${guests.rooms}개 성인 ${guests.adults}명 아동 ${guests.children}명`}
        </Button>
        <Button color='prime' size='full' onClick={handleConfirmClick}>
          확인({dates.duration}박)
        </Button>
      </div>
    </Modal>
  );
};

export default SearchModal;
