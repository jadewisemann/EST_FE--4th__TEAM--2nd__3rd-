import { useState } from 'react';
import Modal from './Modal';
import SubHeader from '../SubHeader';
import Input from '../Input';
import Button from '../Button';

const PasswordChangeModal = ({ isOpen = false, onClose, onConfirm }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    onConfirm();
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <Modal isOpen={isOpen} isFull={false}>
      <SubHeader
        leftButton='close'
        title='비밀번호 변경'
        rightButton={false}
        callback={onClose}
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
        />
      </div>
    </Modal>
  );
};

export default PasswordChangeModal;
