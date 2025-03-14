// firebase와의 의존성 분리

import { create } from 'zustand';
import { listenAuthState, signUp, login, logout } from '../firebase/auth';

const useAuthStore = create(set => {
  listenAuthState(user => set({ user }));

  return {
    user: null,
    error: null,

    signUp: async (email, password) => {
      try {
        const userCredential = await signUp(email, password);
        set({ user: userCredential.user, error: null });
      } catch (error) {
        set({ error: error.message });
      }
    },

    login: async (email, password) => {
      try {
        const userCredential = await login(email, password);
        set({ user: userCredential.user, error: null });
      } catch (error) {
        set({ error: error.message });
      }
    },

    logout: async () => {
      await logout();
      set({ user: null });
    },
  };
});

export default useAuthStore;
