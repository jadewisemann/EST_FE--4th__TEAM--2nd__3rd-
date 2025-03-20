import { useEffect, useState } from 'react';
import Icon from '../../components/Icon';
import Input from '../../components/Input';
import Anchor from '../../components/Anchor';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import googleico from './../../assets/ico/ico_24_google.svg';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { googleLogin, login, error } = useAuthStore();
  const [toastMessage, setToastMessage] = useState('');

  // 일반 로그인
  const handleLogin = () => {
    login(email, password)
      .then(() => navigate('/'))
      .catch(() => {});
  };
  // 구글 로그인
  const handleGoogleLogin = () => {
    googleLogin()
      .then(() => navigate('/'))
      .catch(() => {});
  };

  // //에러시  토스트 메시지 표시 함수
  useEffect(() => {
    if (error) {
      let message = '로그인에 실패했습니다 ';

      if (error.code === 'auth/invalid-email') {
        message = '올바른 이메일을 입력해주세요';
        setEmail('');
      } else if (error.code === 'auth/too-many-requests') {
        message =
          '너무 많은 로그인 시도로 인해 차단되었습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.code === 'auth/invalid-credential') {
        message = '존재하지 않는 회원 정보입니다.';
        setPassword('');
      } else if (error.code === 'auth/cancelled-popup-request') {
        message = '';
      }

      setToastMessage(message);
      setTimeout(() => setToastMessage(''), 2000);
    }
  }, [error]);

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
          <Anchor type='searchpassword' />
        </div>

        {/* 로그인 버튼 */}

        <Button
          color='prime'
          size='full'
          className='mb-7 flex cursor-pointer justify-center rounded-2xl'
          onClick={handleLogin}
        >
          <p className='font-bold'>로그인</p>
        </Button>

        {/* 구글 로그인 */}
        <div className='border-t-1 border-neutral-300 pt-7'>
          <Button
            color='line'
            size='full'
            className='mb-7 flex cursor-pointer justify-center gap-2 border-neutral-300'
            onClick={handleGoogleLogin}
          >
            <img src={googleico} className='mr-2 inline' />
            <span className='font-bold'>Google로 로그인</span>
          </Button>
        </div>
        {/* 회원가입 앵커 */}
        <div className='flex justify-center gap-1'>
          <p>아직 계정이 없으신가요?</p> <Anchor type='signup' />
        </div>

        {/* 토스트 메시지 표시 영역 */}
        {toastMessage && (
          <div className='fixed top-10 left-1/2 z-50 -translate-x-1/2 transform rounded-lg bg-gray-800 px-4 py-2 text-white shadow-md'>
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
