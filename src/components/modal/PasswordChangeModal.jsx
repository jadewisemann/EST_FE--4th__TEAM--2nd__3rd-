// React
import { useState } from 'react';
// Component
import Modal from './Modal';
import SubHeader from '../SubHeader';
import Input from '../Input';
import Button from '../Button';
import useModalStore from '../../store/modalStore';

const PasswordChangeModal = () => {
  // 전역 상태
  const { modals, closePasswordChangeModal } = useModalStore();
  const { isOpen, onConfirm } = modals.passwordChange;

  // 로컬 상태
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 제출 핸들러
  const handleSubmit = () => {
    // 상위 콜백 실행
    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm({ password });
    }

    setPassword('');
    setConfirmPassword('');

    closePasswordChangeModal();
  };

  return (
    <Modal isOpen={isOpen} isFull={false}>
      <SubHeader
        leftButton='close'
        title='비밀번호 변경'
        rightButton={false}
        callback={closePasswordChangeModal}
        fixed={false}
      />
      <div className='flex flex-col gap-4 p-4'>
        <Input inputType='password' value={password} onChange={setPassword} />
        <Input
          inputType='confirmPassword'
          value={confirmPassword}
          onChange={setConfirmPassword}
          compareValue={password}
        />
        <Button
          content='확인'
          color='prime'
          size='full'
          onClick={handleSubmit}
          disabled={!password || password !== confirmPassword}
        />
      </div>
    </Modal>
  );
};

export default PasswordChangeModal;
