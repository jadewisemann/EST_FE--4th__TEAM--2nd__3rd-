import { useState } from 'react';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuthStore();

  const handleSubmit = e => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          placeholder='이메일'
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
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
        <button type='submit'>로그인</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
