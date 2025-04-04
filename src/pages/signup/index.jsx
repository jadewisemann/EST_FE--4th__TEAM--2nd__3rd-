// React
import { useState } from 'react';

// Library
import { useNavigate } from 'react-router-dom';

// Store
import useAuthStore from '../../store/authStore';
import useToastStore from '../../store/toastStore';

// Component
import Button from '../../components/Button';
import Input from '../../components/Input';
import MetaData from '../../components/MetaData';
import SubHeader from '../../components/SubHeader';

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);
  const [isConfirmValid, setisConfirmValid] = useState(false);
  const { showToast } = useToastStore();
  const { signUp } = useAuthStore();

  // 회원가입 처리 함수
  const handleSignup = async () => {
    try {
      await signUp(email, password);
      navigate('/login'); // 회원가입 성공 시 로그인 페이지 이동
    } catch (error) {
      if (error.message.includes('auth/email-already-in-use')) {
        setEmail('');
        setIsEmailValid(false);
        showToast('중복된 이메일이 있습니다.');
      } else {
        showToast('회원가입에 실패했습니다.');
      }
    }
  };

  return (
    <>
      <MetaData
        title='회원가입 | 푹자요'
        description='푹자요의 회원이 되어 다양한 혜택을 누려보세요. 간편한 회원가입 절차로 빠르게 가입할 수 있습니다.'
        keywords='회원가입, 신규 회원, 가입'
        ogTitle='회원가입 | 푹자요'
        ogDescription='푹자요의 회원이 되어 다양한 혜택을 누려보세요. 간편한 회원가입 절차로 빠르게 가입할 수 있습니다.'
        ogImage='/src/assets/img/bg_logo.svg'
      />{' '}
      {/* 서브 헤더 */}
      <SubHeader hasShadow={false} zIndex={10} />
      <div className='flex h-screen flex-col px-6 pt-18 dark:bg-neutral-800'>
        {/* 페이지 정보 */}
        <div className='mb-10 flex flex-col gap-5'>
          <h2 className='text-4xl font-bold text-violet-600'>회원가입</h2>
          숙박 예약 기능을 사용하려면 <br />
          계정을 만드세요!
        </div>

        {/* 인풋 */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <div className='mb-6 flex flex-col gap-5'>
            <Input
              inputType='email'
              value={email}
              onChange={setEmail}
              onValidChange={setIsEmailValid}
            />
            <Input
              inputType='name'
              value={name}
              onChange={setName}
              onValidChange={setIsNameValid}
            />
            <Input
              inputType='password'
              value={password}
              onChange={setPassword}
              autoComplete='new-password'
              onValidChange={setIsPasswordValid}
            />
            <Input
              inputType='confirmPassword'
              value={confirmpassword}
              compareValue={password}
              onChange={setConfirmpassword}
              onValidChange={setisConfirmValid}
            />
          </div>

          {/*버튼*/}
          <Button
            color='prime'
            size='full'
            type='submit'
            content='회원가입'
            childrenClassName='font-bold'
            disabled={
              !isEmailValid
              || !isPasswordValid
              || !isNameValid
              || !isConfirmValid
            }
          />
        </form>
      </div>
    </>
  );
};

export default SignupPage;
