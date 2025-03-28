import { useEffect } from 'react';

import useUserStore from '../../store/userStore';
const UserTestPage = () => {
  const { userData, points, loadUserData, isLoading } = useUserStore();

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // const userData = loadUserData();
  console.log('user', userData);
  console.log('point', points);
  return (
    <>
      <div>user test page</div>
      <div>{isLoading ? '로딩중' : points}</div>
    </>
  );
};
export default UserTestPage;
