import { useState } from 'react';
import Icon from '../../components/Icon';
import Input from '../../components/Input';
import Anchor from '../../components/Anchor';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import googleico from './../../assets/ico/ico_24_google.svg';
import useToastStore from '../../store/useToastStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    } else if (error.message.includes('auth/popup-closed-by-user')) {
      showToast('');
    } else if (password === '') {
      showToast('비밀번호를 입력해주세요');
    } else if (error.message.includes('auth/invalid-credential')) {
      showToast('존재하지 않는 회원 정보입니다.');
      setPassword('');
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
        <div className='mb mb-7 flex flex-col gap-5'>
          <h2 className='text-4xl font-bold text-violet-600'>로그인</h2>
          <p>
            지금 로그인하여 추가 할인 정보를 <br />
            받아 보세요!
          </p>
        </div>
        <form className='mb-6 flex flex-col gap-5'>
          {/* 인풋 */}
          <Input inputType='email' value={email} onChange={setEmail} />
          <Input inputType='password' value={password} onChange={setPassword} />
        </form>

        {/* 앵커 */}
        <div className='mb-3'>
          <Anchor type='searchpassword' />
        </div>

        {/* 로그인 버튼 */}

        <Button
          color='prime'
          size='full'
          className='mb-7'
          onClick={handleLogin}
          content='로그인'
          childrenClassName='font-bold'
        />
        {/* 구글 로그인 */}
        <div className='border-t-1 border-neutral-300 pt-7'>
          <Button
            color='line'
            size='full'
            className='mb-7'
            onClick={handleGoogleLogin}
          >
            <img src={googleico} className='mr-2 inline' alt='' />
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
