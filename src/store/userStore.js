import { create } from 'zustand';

import {
  fetchUserData,
  fetchUserReservations,
} from '../firebase/userRepository';

import useAuthStore from './authStore';

export const useUserStore = create((set, get) => ({
  userData: null,
  points: 0,
  reservations: [],

  isLoading: false,
  error: null,

  loadUserData: async () => {
    const { user } = useAuthStore.getState() || {};
    if (!user || !user.uid) {
      console.log('유저 정보가 없어 데이터를 불러 올 수 없습니다.');
      return null;
    }

    set({ isLoading: true, error: null });

    try {
      const userData = await fetchUserData(user.uid);
      set({
        userData,
        points: userData?.points || 0,
        isLoading: false,
      });
      return userData;
    } catch (error) {
      console.error('사용자 데이터 로드 오류:', error);
      set({ error, isLoading: false });
      return null;
    }
  },

  loadReservations: async () => {
    const { user } = useAuthStore.getState() || {};
    if (!user || !user.uid) {
      console.log('유저 정보가 없어 데이터를 불러 올 수 없습니다.');
      return null;
    }

    set({ isLoading: true, error: null });
    try {
      const reservations = await fetchUserReservations(user.uid);
      set({ reservations, isLoading: false });
      return reservations;
    } catch (error) {
      console.error('예약 정보 로드 오류:', error);
      set({ error, isLoading: false });
      return [];
    }
  },

  clearReservations: () => {
    set({ reservations: [], error: null });
  },

  resetStore: () => {
    set({
      userData: null,
      points: 0,
      wishlist: [],
      reservations: [],
      isLoading: false,
      error: null,
    });
  },

  syncWithAuth: async () => {
    const { user } = useAuthStore.getState();

    if (!user) {
      get().resetStore();
      return;
    }
    return Promise.all([get().loadUserData(), get().loadWishlist()]);
  },
}));

useAuthStore.subscribe(
  state => state.user,
  user => {
    if (user) {
      useUserStore.getState().syncWithAuth();
    } else {
      useUserStore.getState().resetStore();
    }
  },
);

export default useUserStore;
