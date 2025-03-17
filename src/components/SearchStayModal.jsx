import { useMemo, useCallback } from 'react';
import Modal from './Modal';
import Button from './Button';
import SubHeader from './SubHeader';

const SearchStayModal = ({
  isOpen,
  onClose,
  onConfirm = () => {},
  roomsDetails,
  startDate,
  endDate,
  stayDuration,
  // searchQuery,
}) => {
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
      />
    ),
    [onClose],
  );

  const content = (
    <div>
      {/* input */}
      <Button>{`${startDate} ~ ${endDate}`}</Button>
      <Button>{`객식 ${roomsDetails.room}개 성인${roomsDetails.adults}명 아동${roomsDetails.children}명`}</Button>
      <Button color='prime' size='full' onClick={handleConfirmClick}>
        확인(${stayDuration}박)
      </Button>
    </div>
  );
  return <Modal isOpen={isOpen} header={header} content={content} />;
};

export default SearchStayModal;
