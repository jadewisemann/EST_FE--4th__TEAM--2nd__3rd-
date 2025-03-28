import { useEffect } from 'react';

import { create } from 'zustand';

import { getUserReservations } from '../firebase/userRepository';

import useAuthStore from './authStore';

export const useUserStore = create(set => ({
  user: null,
  point: null,
  reservations: [],
  loading: null,
  error: null,

  fetchUserReservations: async userId => {
    if (!userId) {
      set({ reservations: [], error: null });
      return;
    }

    set({ loading: true });

    try {
      const reservationsData = await getUserReservations(userId);

      set({
        reservations: reservationsData,
        loading: false,
        error: null,
      });

      return reservationsData;
    } catch (error) {
      set({
        loading: false,
        error: error.message,
      });
      throw error;
    }
  },

  clearReservations: () => {
    set({ reservations: [], error: null });
  },
}));

export const useReservationWithAuth = () => {
  const {
    reservations,
    loading,
    error,
    fetchUserReservations,
    clearReservations,
  } = useUserStore();

  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchUserReservations(user.uid);
    } else {
      clearReservations();
    }
  }, [user]);

  return { reservations, loading, error };
};

export default useUserStore;
