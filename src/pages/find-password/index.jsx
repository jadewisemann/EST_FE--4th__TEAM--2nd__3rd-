import { useState } from 'react';

import useAuthStore from '../../store/authStore';
import useToastStore from '../../store/toastStore';

import Button from '../../components/Button';
import Input from '../../components/Input';
import SubHeader from '../../components/SubHeader';

const FindPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const { resetPassword } = useAuthStore();
  const { showToast } = useToastStore();

  const handleSearchPw = async () => {
    try {
      await resetPassword(email);
      showToast('비밀번호 재설정 메일이 전송되었습니다');
      setEmail('');
      setIsEmailValid(false);
    } catch (error) {
      if (error.message.includes('auth/user-not-found')) {
        showToast('등록되지 않은 이메일입니다');
      } else {
        showToast('비밀번호 재설정 요청에 실패했습니다');
      }
    }
  };

  return (
    <>
      {/* 서브 헤더 */}
      <SubHeader hasShadow={false} zIndex={10} />

      <div className='flex h-screen flex-col px-6 pt-18 dark:bg-neutral-800'>
        {/* 페이지 정보 */}
        <div className='mb-10 flex flex-col gap-5'>
          <h2 className='text-4xl font-bold text-violet-600'>비밀번호 찾기</h2>
          비밀번호를 잊어버리셨다면 <br />
          비밀번호를 복구하세요!
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSearchPw();
          }}
        >
          {/* 인풋 */}
          <Input
            className='mb-6'
            inputType='email'
            value={email}
            onChange={setEmail}
            onValidChange={setIsEmailValid}
          />

          {/*  버튼 */}
          <Button
            color='prime'
            size='full'
            type='submit'
            content='확인'
            childrenClassName='font-bold'
            disabled={!isEmailValid}
          />
        </form>
      </div>
    </>
  );
};

export default FindPasswordPage;
