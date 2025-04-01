import { useEffect } from 'react';

import { Navigate, Outlet, useLocation } from 'react-router-dom';

import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';

const PrivateRoute = () => {
  const { user, isLogout } = useAuthStore();
  const { showToast } = useToastStore();
  const location = useLocation();

  useEffect(() => {
    if (!user && !isLogout) {
      showToast('로그인이 필요합니다');
    }
  }, [user, isLogout, showToast]);

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
