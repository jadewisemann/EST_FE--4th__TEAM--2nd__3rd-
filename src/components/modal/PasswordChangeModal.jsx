import { useState } from 'react';

import useModalStore from '../../store/modalStore';
import useToastStore from '../../store/toastStore';

import { changePassword, resetPassword } from '../../firebase/authProvider';

import Button from '../Button';
import Input from '../Input';
import SubHeader from '../SubHeader';

import Modal from './Modal';

const PasswordChangeModal = () => {
  const { modals, closePasswordChangeModal } = useModalStore();
  const { isOpen } = modals.passwordChange;

  const { showToast } = useToastStore();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async () => {
    const result = await changePassword(oldPassword, newPassword);
    console.log('result', result);
    alert(result.message);

    if (result.success) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      closePasswordChangeModal();
    }
  };

  const onClick = async () => {
    const result = await resetPassword();
    showToast(result.message);
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
      <div className='flex flex-col gap-4 bg-white p-4 dark:bg-black'>
        <Input
          inputType='password'
          value={oldPassword}
          onChange={setOldPassword}
          label='이전 비밀번호'
        />

        <Input
          inputType='password'
          value={newPassword}
          onChange={setNewPassword}
          label='새로운 비밀번호'
        />

        <Input
          inputType='confirmPassword'
          value={confirmPassword}
          onChange={setConfirmPassword}
          compareValue={newPassword}
        />

        <Button
          content='확인'
          color='prime'
          size='full'
          onClick={handleSubmit}
          disabled={
            !oldPassword || !newPassword || newPassword !== confirmPassword
          }
        />
        <button
          className='cursor-pointer hover:text-violet-400'
          onClick={onClick}
        >
          대신 이메일로 인증
        </button>
      </div>
    </Modal>
  );
};

export default PasswordChangeModal;
