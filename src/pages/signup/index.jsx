import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import Icon from '../../components/Icon';
import Input from '../../components/Input';
import Button from '../../components/Button';
import useToastStore from '../../store/useToastStore';

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const { showToast } = useToastStore();
  const { signUp } = useAuthStore();

  // 회원가입 처리 함수
  const handleSignup = async () => {
    try {
      await signUp(email, password);
      navigate('/login'); // 회원가입 성공 시 로그인 페이지 이동
    } catch (error) {
      if (error.message.includes('auth/invalid-email')) {
        showToast('올바른 이메일을 입력해주세요.');
      } else if (name.length < 2) {
        showToast('올바른 이름을 입력해주세요.');
      } else if (error.message.includes('auth/missing-password')) {
        showToast('비밀번호를 입력해주세요.');
      } else if (password !== confirmpassword) {
        showToast('비밀번호가 일치하지 않습니다.');
      } else if (error.message.includes('auth/email-already-in-use')) {
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
          <h2 className='text-4xl font-bold text-violet-600'>회원가입</h2>
          숙박 예약 기능을 사용하려면 <br />
          계정을 만드세요!
        </div>

        {/* 인풋 */}
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

        {/*버튼*/}
        <Button
          color='prime'
          size='full'
          onClick={handleSignup}
          content='회원가입'
          childrenClassName='font-bold'
        />
      </div>
    </div>
  );
};

export default SignupPage;
