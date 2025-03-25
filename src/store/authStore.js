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
  listenAuthState(user => set({ user }));

  return {
    user: null,
    error: null,

    signUp: async (email, password) => {
      try {
        const userCredential = await signUp(email, password);
        set({
          user: userCredential.user,
          error: null,
        });
      } catch (error) {
        set({ error: error.message });
        throw error;
      }
    },

    login: async (email, password) => {
      try {
        const userCredential = await login(email, password);
        set({
          user: userCredential.user,
          error: null,
        });
      } catch (error) {
        set({ error: error });
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
