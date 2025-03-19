import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import Input from '../../components/Input';
import Button from '../../components/Button';
import useAuthStore from '../../store/authStore';

const SearchPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const { resetPassword } = useAuthStore(); // 비밀번호 재설정 함수와 로딩 상태 가져오기

  const showToast = message => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2000); // 2초
  };

  const handleSearchPw = async () => {
    if (!email || !email.includes('@')) {
      showToast('올바른 이메일을 입력해주세요');
      return;
    }

    try {
      await resetPassword(email);
      showToast('비밀번호 재설정 메일이 전송되었습니다');
      setEmail('');
    } catch (error) {
      console.error('비밀번호 찾기 오류:', error);

      if (error.message.includes('auth/user-not-found')) {
        showToast('등록되지 않은 이메일입니다');
      } else if (error.message.includes('auth/invalid-email')) {
        showToast('올바른 이메일 형식이 아닙니다');
      } else {
        showToast('비밀번호 재설정 요청에 실패했습니다');
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
          <h2 className='text-4xl font-bold text-violet-600'>비밀번호 찾기</h2>
          비밀번호를 잊어버리셨다면 <br />
          비밀번호를 복구하세요!
        </div>

        {/* 인풋 */}
        <Input
          className='mb-6 flex flex-col gap-5'
          inputType='email'
          value={email}
          onChange={setEmail}
        />

        {/*  버튼 */}

        <Button
          color='prime'
          size='full'
          className='mb-7 flex cursor-pointer items-center justify-center rounded-2xl'
          onClick={handleSearchPw}
        >
          확인
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

export default SearchPassword;
