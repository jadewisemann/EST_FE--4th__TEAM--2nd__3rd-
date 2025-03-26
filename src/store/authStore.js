import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  listenAuthState,
  signUp,
  login,
  logout,
  resetPassword,
  googleLogin,
} from '../firebase/auth';

const useAuthStore = create(
  persist(
    set => {
      listenAuthState(user => {
        set(state =>
          !state.user || (user && state.user.uid !== user.uid)
            ? { user, isLoading: false }
            : !user && state.user
              ? { user: null, isLoading: false }
              : { isLoading: false },
        );
      });

      return {
        user: null,
        isLoading: true,
        error: null,

        signUp: async (email, password) => {
          try {
            const userCredential = await signUp(email, password);
            set({ user: userCredential.user, error: null });
            return userCredential;
          } catch (error) {
            set({ error: error.message });
            throw error;
          }
        },

        login: async (email, password) => {
          try {
            const userCredential = await login(email, password);
            set({ user: userCredential.user, error: null });
            return userCredential;
          } catch (error) {
            set({ error: error.message });
            throw error;
          }
        },

        googleLogin: async () => {
          try {
            const { user } = await googleLogin();
            set({ user, error: null });
            return { user };
          } catch (error) {
            set({ error: error.message });
            throw error;
          }
        },

        logout: async () => {
          await logout();
          set({ user: null });
          localStorage.removeItem('isFirstLogin');
        },

        resetPassword: async email => {
          try {
            await resetPassword(email);
          } catch (error) {
            set({ error: error.message });
            throw error;
          }
        },
      };
    },
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
      partialize: state => ({
        user: state.user,
      }),
      onRehydrateStorage: () => state => {
        if (state) {
          state.isLoading = false;
        }
      },
    },
  ),
);

export default useAuthStore;
