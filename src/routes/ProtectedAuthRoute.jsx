import { useEffect } from 'react';

import { Outlet, Navigate } from 'react-router-dom';

import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';

const ProtectedAuthRoute = () => {
  const { user, isLoading } = useAuthStore();
  const { showToast } = useToastStore();

  // 로그인 후 첫 메시지 출력 방지
  useEffect(() => {
    if (!isLoading && user) {
      const isFirstLogin = localStorage.getItem('isFirstLogin');
      localStorage.setItem('isFirstLogin', 'false');

      if (user && isFirstLogin === 'false') {
        showToast('이미 로그인이 되어있습니다.');
      }
    }
  }, [user, isLoading, showToast]);

  if (user) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};

export default ProtectedAuthRoute;
