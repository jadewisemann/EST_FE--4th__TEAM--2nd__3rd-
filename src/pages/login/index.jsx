import React, { useState } from 'react';
import Icon from '../../components/Icon';
import Input from '../../components/Input';
import Anchor from '../../components/Anchor';
import Button from '../../components/Button';
import { login } from '../../firebase/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  // 토스트 메시지 표시 함수
  const showToast = message => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2000); // 2초
  };

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigate('/'); // 로그인 성공시 메인 페이지로 이동
    } catch (error) {
      console.error('로그인:', error.message);

      if (error.code === 'auth/invalid-email') {
        showToast('잘못된 로그인 정보 입니다');
      }
    }
  };

  return (
    <div className='flex h-screen flex-col justify-between'>
      <div className='flex flex-col px-5 pt-16 pb-10'>
        {/* 뒤로가기 */}
        <button
          className='mb-10 hover:cursor-pointer hover:opacity-70'
          onClick={() => {
            navigate(-1);
          }}
        >
          <Icon name='arrow_left' color='black' />
        </button>

        {/* 페이지 정보 */}
        <div className='mb mb-7 flex flex-col gap-5'>
          <h2 className='text-4xl font-bold text-violet-600'>로그인</h2>
          <p>
            지금 로그인하여 추가 할인 정보를 <br />
            받아 보세요!
          </p>
        </div>
        <div className='mb-6 flex flex-col gap-5'>
          {/* 인풋 */}
          <Input inputType='email' value={email} onChange={setEmail} />
          <Input inputType='password' value={password} onChange={setPassword} />
        </div>

        {/* 앵커 */}
        <div className='mb-3'>
          <Anchor type='searchPassword' />
        </div>

        {/* 로그인 버튼 */}
        <div className='mb-7'>
          <Button
            color='prime'
            size='full'
            className='cursor-pointer rounded-2xl'
            onClick={handleLogin}
          >
            로그인
          </Button>
        </div>

        {/* 구글 로그인 */}
        <div className='mb-7 border-t-1 border-neutral-300 pt-7'>
          <Button
            color='line'
            size='full'
            className='cursor-pointer'
            onClick={() => {}}
          >
            <p className='text-base font-bold'>Google 로 로그인</p>
          </Button>
        </div>

        {/* 회원가입 앵커 */}
        <div className='flex justify-center gap-1'>
          <p>아직 계정이 없으신가요?</p> <Anchor type={'signUp'} />
        </div>

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

export default LoginPage;
