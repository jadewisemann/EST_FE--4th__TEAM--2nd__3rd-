import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Input from '../../components/Input';
import useAuthStore from '../../store/authStore';
import useToastStore from '../../store/useToastStore';

const SearchPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const { resetPassword } = useAuthStore();
  const { showToast } = useToastStore();

  const handleSearchPw = async () => {
    try {
      await resetPassword(email);
      showToast('비밀번호 재설정 메일이 전송되었습니다');
      setEmail('');
    } catch (error) {
      if (!email) {
        showToast('이메일을 입력해주세요');
      } else if (error.message.includes('auth/user-not-found')) {
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
          onClick={() => {
            navigate(-1);
          }}
          className='mb-10 w-6 hover:cursor-pointer hover:opacity-70'
        >
          <Icon name='arrow_left' color='black' />
        </button>

        {/* 페이지 정보 */}
        <div className='mb-7 flex flex-col gap-5'>
          <h2 className='text-4xl font-bold text-violet-600'>비밀번호 찾기</h2>
          비밀번호를 잊어버리셨다면 <br />
          비밀번호를 복구하세요!
        </div>

        {/* 인풋 */}
        <Input
          className='mb-6'
          inputType='email'
          value={email}
          onChange={setEmail}
        />

        {/*  버튼 */}

        <Button
          color='prime'
          size='full'
          onClick={handleSearchPw}
          content='확인'
        />
      </div>
    </div>
  );
};

export default SearchPasswordPage;
