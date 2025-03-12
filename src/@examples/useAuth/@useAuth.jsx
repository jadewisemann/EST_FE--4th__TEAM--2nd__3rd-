// fire base + zustand , 전역 로그인 상태 확인

import useAuthStore from "../../store/authStore";

const useAuthExample = () => {
  const user = useAuthStore(state => state.user);
  
  return (
    <>
    <div>
      {user ? "log in" : "not log in"}
      </div>
      </>
    );
  };


export default useAuthExample;