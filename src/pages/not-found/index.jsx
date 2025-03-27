import React from 'react';

import Logo from '../../assets/img/bg_logo.svg';
import DarkLogo from '../../assets/img/bg_logo_dark.svg';
import Anchor from '../../components/Anchor';

const NotFoundPage = () => (
  <div className='flex h-screen flex-col items-center justify-center gap-10 px-14 dark:bg-neutral-800'>
    <img src={Logo} alt='logo' className='block dark:hidden' />
    <img src={DarkLogo} alt='logo' className='hidden dark:block' />
    <h2 className='text-3xl font-bold dark:text-neutral-50'>
      404 <span className='text-violet-600 dark:text-violet-400'>ERROR</span>
    </h2>
    <p className='text-xl font-bold dark:text-neutral-50'>
      페이지를 찾을 수 없습니다 !
    </p>
    <Anchor type={''} children={'메인페이지로 이동'} className='font-bold' />
  </div>
);

export default NotFoundPage;
