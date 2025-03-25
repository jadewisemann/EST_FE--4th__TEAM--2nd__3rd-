// React import
import { useState } from 'react';

// Library import
import { useNavigate } from 'react-router-dom';

// Store import
import useAuthStore from '../../store/authStore';
import useToastStore from '../../store/toastStore';

import Anchor from '../../components/Anchor';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Input from '../../components/Input';

// Component import

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const { googleLogin, login } = useAuthStore();
  const { showToast } = useToastStore();

  // 일반 로그인
  const handleLogin = async () => {
    try {
      await login(email, password);
      navigate('/'); // 로그인 성공 시 메인 페이지 이동
    } catch (error) {
      handleAuthError(error);
    }
  };

  // 구글 로그인
  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      navigate('/'); // 로그인 성공 시 메인 페이지 이동
    } catch (error) {
      handleAuthError(error);
    }
  };

  // 토스트 에러 메시지
  const handleAuthError = error => {
    if (error.message.includes('auth/invalid-email')) {
      showToast('올바른 이메일을 입력해주세요');
      setEmail('');
      setPassword('');
      setIsEmailValid(false);
      setIsPasswordValid(false);
    } else if (error.message.includes('auth/popup-closed-by-user')) {
      showToast('');
    } else if (error.message.includes('auth/invalid-credential')) {
      showToast('존재하지 않는 회원 정보입니다.');
      setPassword('');
      setIsPasswordValid(false);
    } else if (error.message.includes('auth/too-many-requests')) {
      showToast('로그인 시도가 너무 많습니다. 나중에 다시 시도해주세요.');
    } else {
      showToast('로그인에 실패했습니다.');
    }
  };

  return (
    <div className='flex h-screen flex-col justify-between'>
      <div className='flex flex-col px-5 pt-16 pb-10'>
        {/* 뒤로가기 */}
        <button
          onClick={() => {
            navigate(-1);
          }}
          className='mb-10 w-6 hover:cursor-pointer hover:opacity-70'
        >
          <Icon name='arrow_left' color='black' />
        </button>

        {/* 페이지 정보 */}
        <div className='mb-7 flex flex-col gap-5'>
          <h2 className='text-4xl font-bold text-violet-600'>로그인</h2>
          <p>
            지금 로그인하여 추가 할인 정보를 <br />
            받아 보세요!
          </p>
        </div>
        <form
          className='flex flex-col gap-5'
          onSubmit={e => {
            e.preventDefault();
            handleLogin();
          }}
        >
          {/* 인풋 */}
          <Input
            inputType='email'
            value={email}
            onChange={setEmail}
            onValidChange={setIsEmailValid}
          />
          <Input
            inputType='password'
            value={password}
            onChange={setPassword}
            onValidChange={setIsPasswordValid}
          />

          {/* 앵커 */}
          <Anchor type='searchpassword' />

          {/* 로그인 버튼 */}
          <Button
            color='prime'
            size='full'
            className='mb-7'
            type='submit'
            onClick={handleLogin}
            content='로그인'
            childrenClassName='font-bold'
            disabled={!isEmailValid || !isPasswordValid}
          />
        </form>
        {/* 구글 로그인 */}
        <div className='border-t-1 border-neutral-300 pt-7'>
          <Button
            color='line'
            size='full'
            className='mb-7 inline-flex items-center justify-center gap-2'
            onClick={handleGoogleLogin}
          >
            <Icon name='google_colored' />
            <span className='font-bold'>Google로 로그인</span>
          </Button>
        </div>

        {/* 회원가입 앵커 */}
        <div className='flex justify-center gap-1'>
          <p>아직 계정이 없으신가요?</p> <Anchor type='signup' />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
