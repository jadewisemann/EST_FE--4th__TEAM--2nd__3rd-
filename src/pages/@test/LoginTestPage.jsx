import { useEffect } from 'react';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import useAuthStore from '../../store/authStore';

const LoginTestPage = () => {
  const { googleLogin, error, user, logout } = useAuthStore();

  useEffect(() => {
    console.log(user);
    console.log('uid:', user?.uid);
  }, [user]);

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
    } catch (error) {
      console.error(error);
    }
  };

  // const handleLogout = () => {};

  return (
    <>
      <div className='flex h-screen w-screen flex-col items-center justify-center gap-4'>
        <h1 className='text-4xl font-bold'>Google 로그인</h1>
        <div className='flex w-full flex-col gap-8 p-4'>
          <Button
            color='line'
            onClick={handleGoogleLogin}
            disabled={user ? true : false}
          >
            <Icon name='google_colored' />
            Google로 로그인
          </Button>
          <Button
            content='log out'
            onClick={logout}
            disabled={user ? false : true}
          />
        </div>
        {error && <p>{error}</p>}
        {user && <p>success</p>}
      </div>
    </>
  );
};

export default LoginTestPage;
