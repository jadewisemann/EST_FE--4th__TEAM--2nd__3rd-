import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import Input from '../../components/Input';
import Button from '../../components/Button';

const SearchPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = message => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2000); // 2초
  };

  const handleSearchPw = () => {
    setEmail('');
    showToast('메일이 전송 되었습니다');
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
          <p>
            비밀번호를 잊어버리셨다면 <br />
            비밀번호를 복구하세요!
          </p>
        </div>
        <div className='mb-6 flex flex-col gap-5'>
          {/* 인풋 */}
          <Input inputType='email' value={email} onChange={setEmail} />
        </div>
        {/*  버튼 */}
        <div className='mb-7'>
          <Button
            color='prime'
            size='full'
            className='cursor-pointer rounded-2xl'
            onClick={handleSearchPw}
          >
            확인
          </Button>
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

export default SearchPassword;
