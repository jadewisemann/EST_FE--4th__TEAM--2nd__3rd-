
import useAuthStore from "../../store/authStore";

const LogoutButton = () => {
  const {user, logout} = useAuthStore()

  return  user ? <button onClick={logout}> 로그 아웃 </button> : null;
};

export default LogoutButton;