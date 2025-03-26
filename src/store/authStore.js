import { create } from 'zustand';

import {
  listenAuthState,
  signUp,
  login,
  logout,
  resetPassword,
  googleLogin,
} from '../firebase/auth';

const useAuthStore = create(set => {
  const updateUser = user => {
    set(state => {
      if (state.user?.uid === user?.uid) return state;
      return { user };
    });
  };

  listenAuthState(updateUser);

  return {
    user: null,
    // loading: true,
    error: null,

    signUp: async (email, password) => {
      try {
        const userCredential = await signUp(email, password);
        set({ user: userCredential.user, error: null });
      } catch (error) {
        set({ error: error.message });
        throw error;
      }
    },

    login: async (email, password) => {
      try {
        const userCredential = await login(email, password);
        set({ user: userCredential.user, error: null });
      } catch (error) {
        set({ error: error.message });
        throw error;
      }
    },

    googleLogin: async () => {
      try {
        const { user } = await googleLogin();
        set({ user, error: null });
      } catch (error) {
        set({ error: error.message });
        throw error;
      }
    },

    logout: async () => {
      await logout();
      set({ user: null });
      localStorage.removeItem('isFirstLogin'); // 로그아웃 시 제거
    },

    resetPassword: async email => {
      try {
        await resetPassword(email);
      } catch (error) {
        set({ error: error.message });
      }
    },
  };
});

export default useAuthStore;
