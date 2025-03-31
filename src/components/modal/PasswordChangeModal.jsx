import { useState } from 'react';

import useModalStore from '../../store/modalStore';

import { changePassword } from '../../firebase/authProvider';

import Button from '../Button';
import Input from '../Input';
import SubHeader from '../SubHeader';

import Modal from './Modal';

const PasswordChangeModal = () => {
  const { modals, closePasswordChangeModal } = useModalStore();
  const { isOpen, onConfirm } = modals.passwordChange;

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async () => {
    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm({ newPassword });
    }

    const result = await changePassword(oldPassword, newPassword);
    if (result) setNewPassword('');
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
      </div>
    </Modal>
  );
};

export default PasswordChangeModal;
