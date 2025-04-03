import useModalStore from '../../store/modalStore';

import Button from '../../components/Button';

const ModalTestPage = () => {
  // 모달 상태
  const {
    openSearchModal,
    openGuestModal,
    openDateModal,
    openPasswordChangeModal,
  } = useModalStore();

  return (
    <>
      <div className='space-y-4 p-4'>
        <Button onClick={openSearchModal}>객실 검색 모달 열기</Button>
        <Button onClick={openGuestModal}>인원 선택 모달 열기</Button>
        <Button onClick={openDateModal}>날짜 선택 모달 열기</Button>
        <Button
          onClick={() =>
            openPasswordChangeModal(() => {
              console.log('패스워드 변경 모달 버튼 열림');
            })
          }
        >
          비밀번호 변경 모달 열기
        </Button>
      </div>
    </>
  );
};

export default ModalTestPage;
