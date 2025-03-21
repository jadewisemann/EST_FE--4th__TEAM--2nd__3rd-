// Store
import useModalStore from '../../store/modalStore';
import useAppDataStore from '../../store/appDataStore';

// Components
import Modal from './Modal';
import Button from '../Button';
import SubHeader from '../SubHeader';

const SearchModal = () => {
  // 모달 상태
  const { modals, closeSearchModal, openDateModal, openGuestModal } =
    useModalStore();
  const { isOpen, onConfirm } = modals.search;

  // 전역 상태
  const { dates, guests } = useAppDataStore();

  // 핸들러
  const handleConfirmClick = () => {
    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm();
    }
    closeSearchModal();
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
      <div className='flex flex-col gap-4 p-4'>
        <Button onClick={() => openDateModal()}>
          {`${dates.startDate} ~ ${dates.endDate}`}
        </Button>
        <Button onClick={() => openGuestModal()}>
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
