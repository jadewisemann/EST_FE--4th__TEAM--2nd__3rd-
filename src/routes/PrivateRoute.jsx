import { useEffect } from 'react';

import { Navigate, Outlet, useLocation } from 'react-router-dom';

import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';

const PrivateRoute = () => {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();
  const location = useLocation();

  //유저 정보 x 및 로딩 끝나면 토스트 메시지
  useEffect(() => {
    if (!user) {
      showToast('로그인이 필요합니다');
    }
  }, [user, showToast]);

  // 유저 정보 없으면 로그인 페이지로
  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
