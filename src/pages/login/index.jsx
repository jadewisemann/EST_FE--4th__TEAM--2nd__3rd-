import React, { useState } from 'react';
import Icon from '../../components/Icon';
import Input from '../../components/Input';
import Anchor from '../../components/Anchor';
import Button from '../../components/Button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className='flex h-screen flex-col justify-between'>
      <div className='flex flex-col px-5 pt-16 pb-10'>
        <button
          className='mb-10 hover:cursor-pointer hover:opacity-70'
          // onClick={Back}
        >
          <Icon name='arrow_left' color='black' />
        </button>
        <div className='mb mb-7 flex flex-col gap-5'>
          <h2 className='text-4xl font-bold text-violet-600'>로그인</h2>
          <p>
            지금 로그인하여 추가 할인 정보를 <br />
            받아 보세요!
          </p>
        </div>
        <div className='mb-6 flex flex-col gap-5'>
          <Input type='email' value={email} onChange={setEmail} />
          <Input type='password' value={password} onChange={setPassword} />
        </div>
        <div className='mb-3'>
          <Anchor type='searchPassword' />
        </div>
        <div className='mb-7'>
          <Button
            color='prime'
            size='full'
            className='cursor-pointer rounded-2xl'
            onClick={() => {}}
          >
            로그인
          </Button>
        </div>
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
        <div className='flex justify-center gap-1'>
          <p>아직 계정이 없으신가요?</p> <Anchor type={'signUp'} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
