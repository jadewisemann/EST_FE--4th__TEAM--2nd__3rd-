import useAuthStore from "../store/authStore";

const LogoutButton = () => {
  const { user, logout } = useAuthStore();

  return user ? <button onClick={logout}>로그아웃</button> : null;
};

export default LogoutButton;
  