import Button from '../../components/Button';
import useModalStore from '../../store/modalStore';

const ModalTestPage = () => {
  // 모달 상태
  const { openSearchModal, openGuestModal, openDateModal } = useModalStore();

  return (
    <>
      <div className='space-y-4 p-4'>
        <Button onClick={openSearchModal}>객실 검색 모달 열기</Button>
        <Button onClick={openGuestModal}>인원 선택 모달 열기</Button>
        <Button onClick={openDateModal}>날짜 선택 모달 열기</Button>
      </div>
    </>
  );
};

export default ModalTestPage;
