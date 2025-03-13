import { useState } from 'react';
import useAuthStore from '../store/authStore';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp, error } = useAuthStore();

  const handleSubmit = e => {
    e.preventDefault();
    signUp(email, password);
  };
  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          placeholder='이메일'
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='비밀번호'
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type='submit'>가입하기</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SignUp;
