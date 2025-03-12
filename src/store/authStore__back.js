// firebase를 직접 의존
  // src/firebase/auth.js 없이 직접 인증을 관리

import { create } from "zustand";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import app from "../firebase/config";

const auth = getAuth(app);

const useAuthStore = create((set) => {

  onAuthStateChanged(auth, (user) => {
    set({ user });
  });

  return {
    user: null,
    error: null,

    signUp: async (email, password) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        set({ user: userCredential.user, error: null });
      } catch (error) {
        set({ error: error.message });
      }
    }, 

    login: async (email, password) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        set({ user: userCredential.user, error: null });
      } catch (error) {
        set({ error: error.message });
      }
    },

    logout: async () => {
      await signOut(auth);
      set({ user: null });
    },
  };
});

export default useAuthStore;
