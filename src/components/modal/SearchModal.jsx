import { useMemo, useCallback } from 'react';
import Modal from './Modal';
import Button from '../Button';
import SubHeader from '../SubHeader';

const SearchModal = ({
  isOpen,
  onClose,
  onConfirm = () => {},
  initialDates = {},
  initialGuests = {},
  openModal,
}) => {
  const { startDate = '', endDate = '', duration = 1 } = initialDates || {};
  const { rooms = 1, adults = 1, children = 0 } = initialGuests || {};

  const handleConfirmClick = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  const header = useMemo(
    () => (
      <SubHeader
        title='모든 객실'
        leftButton='close'
        callback={onClose}
        rightButton={false}
        fixed={false}
      />
    ),
    [onClose],
  );

  const content = (
    <div className='flex flex-col gap-4'>
      <Button
        onClick={() => openModal('dateModal')}
      >{`${startDate} ~ ${endDate}`}</Button>
      <Button
        onClick={() => openModal('guestModal')}
      >{`객실 ${rooms}개 성인 ${adults}명 아동 ${children}명`}</Button>
      <Button color='prime' size='full' onClick={handleConfirmClick}>
        확인({duration}박)
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} isFull={false}>
      {header}
      <div className='p-4'>{content}</div>
    </Modal>
  );
};

export default SearchModal;
