// react
import React from 'react'

// components
import Login from '../../components/@Login';
import SignUp from '../../components/@SignUp'
import LogoutButton from '../../components/@LogoutButton'

// global state
import useAuthStore from '../../store/authStore'

const TestPage = () =>  {

  const{ user } = useAuthStore();

  return  (
    <>
      <h1>Test page</h1>    
      {user ? <LogoutButton /> : <Login />}    
      <SignUp />
    </>
  );
};

export default TestPage
