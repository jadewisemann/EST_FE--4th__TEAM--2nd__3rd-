import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../firebase/auth';
import Icon from '../../components/Icon';
import Input from '../../components/Input';
import Button from '../../components/Button';

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // 토스트 메시지 표시 함수
  const showToast = message => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2000); // 2초
  };

  // 회원가입 처리 함수
  const handleSignup = async () => {
    try {
      await signUp(email, password);
      navigate('/login'); // 회원가입 성공 시 로그인 페이지 이동
    } catch (error) {
      console.error('회원가입 에러:', error.message);

      // 토스트 메세지
      if (error.code === 'auth/email-already-in-use') {
        setEmail('');
        showToast('중복된 이메일이 있습니다.');
      } else {
        showToast('회원가입에 실패했습니다.');
      }
    }
  };

  return (
    <div className='flex h-screen flex-col justify-between'>
      <div className='flex flex-col px-5 pt-16 pb-10'>
        <button
          type='button'
          className='mb-10 hover:cursor-pointer hover:opacity-70'
          onClick={() => {
            navigate(-1);
          }}
        >
          <Icon name='arrow_left' color='black' />
        </button>
        <div className='mb-7 flex flex-col gap-5'>
          <h2 className='text-4xl font-bold text-violet-600'>회원가입</h2>
          <p>숙박 예약 기능을 사용하려면 계정을 만드세요!</p>
        </div>
        <div className='mb-6 flex flex-col gap-5'>
          <Input inputType='email' value={email} onChange={setEmail} />
          <Input inputType='name' value={name} onChange={setName} />
          <Input inputType='password' value={password} onChange={setPassword} />
          <Input
            inputType='confirmPassword'
            value={confirmpassword}
            compareValue={password}
            onChange={setConfirmpassword}
          />
        </div>

        <Button
          color='prime'
          size='full'
          className='cursor-pointer rounded-2xl'
          onClick={handleSignup}
        >
          회원가입
        </Button>
        {/* 토스트 메시지 표시 영역 */}
        {toastMessage && (
          <div className='absolute top-10 left-1/2 -translate-x-1/2 transform rounded-lg bg-gray-800 px-4 py-2 text-white shadow-md'>
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
